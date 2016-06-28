/*
ブラウザ、Node.jsの両方で使えるJavaScriptの書き方
http://qiita.com/armorik83/items/78bd3d785d0a97c82711
*/

(function (exports) {
//  exports.get_contents = function(LINK_LEVEL,KEY,TARGET_URL,INSERT_TAG) {
  exports.get_contents = function(KEY1,INSERT_TAG1,KEY2,INSERT_TAG2) {


    var fs = require("fs")
      , path = require("path")
    var cheerio = require('cheerio');

    var dir = 'data/org/';
    var dir_view = 'views/';
    var dir_routes = 'routes/';

    // app.js 用の記述を作成
    var app_list = 'tmp/app_list.txt';

    fs.stat(app_list, function(e) {
      if (e) {
//        console.log(app_list + " file does't exist.");
      }else{
        fs.unlinkSync(app_list);
//        console.log(app_list + " file does exist.");
      }
     
    });

    var insertHtml1 = INSERT_TAG1 || '<li class="plum">Plumここに任意のHTMLを入れる。</li>'
    var insertHtml2 = INSERT_TAG2 || '<li class="plum">Plumここに任意のHTMLを入れる。</li>'
    var keyname1 = KEY1 || '#corporateprofile';
    var keyname2 = KEY2 || '#corporateprofile';
//    console.log("getcontents -- " + keyname1);
//    console.log("getcontents -- " + insertHtml1);
//    console.log("getcontents -- " + keyname2);
//    console.log("getcontents -- " + insertHtml2);

    var walk = function(p, callback){
      var results = [];

      fs.readdir(p, function (err, files) {
        if (err) throw err;

        var pending = files.length;
        if (!pending) return callback(null, results); //全てのファイル取得が終わったらコールバックを呼び出す

        files.map(function (file) { //リスト取得
          return path.join(p, file);
        }).filter(function (file) {
          if(fs.statSync(file).isDirectory()) walk(file, function(err, res) { //ディレクトリだったら再帰
            results.push({name:path.basename(file), children:res}); //子ディレクトリをchildrenインデックス配下に保存
            if (!--pending) callback(null, results);
          });
          return fs.statSync(file).isFile();
        }).forEach(function (file) { //ファイル名を保存
          var stat = fs.statSync(file);
//          var results_tag = [];
          var h = fs.readFileSync(file,'utf-8');
          $ = cheerio.load(h, {decodeEntities: false});
          var filepath = path.dirname(file) + '/' + path.basename(file);

          make_routes(filepath);
          make_app(filepath);

          filepath = filepath.replace(dir,dir_view);
          filepath = filepath.replace(/\./g,"_");
          filepath = filepath + ".ect"

          if($(keyname1)){
            $(keyname1).each(function (idx) {
              //var oldText1 = $(keyname1).text();
              //$(keyname1).text(insertHtml1 + oldText1);
              var oldText1 = $(keyname1);
              $(keyname1).text(insertHtml1 + oldText1);

              //$(insertHtml1).prependTo(this)
            });
          }
          if($(keyname2)){
            $(keyname2).each(function (idx) {
              var oldText2 = $(keyname2);
              $(keyname2).text(insertHtml2 + oldText2);
              //$(insertHtml2).prependTo(this)
            });
          }
          checkSaveDir(filepath);

//          fs.writeFileSync(filepath, $.html(), encoding='utf8')
          fs.writeFileSync(filepath, $.html())


          if (!--pending) callback(null, results);
        });
      });
    }

    walk(dir, function(err, results) {
      if (err) throw err;
      var data = {name:'root', children:results};
//      console.log(JSON.stringify(data,null,'\t')); //一覧出力
    });
      return 'Treatment has ended.';

    // 保存先のディレクトリが存在するか確認
    function checkSaveDir(fname) {
      // ディレクトリ部分だけ取り出す
      var dir = path.dirname(fname);
      // ディレクトリを再帰的に作成する
      var dirlist = dir.split("/");
      var p = "";
      for (var i in dirlist) {
        p += dirlist[i] + "/";
        if (!fs.existsSync(p)) {
          fs.mkdirSync(p);
        }
      }
    }

    // routes 用のファイルを作成する。
    function make_routes(path){
      path = path.replace(dir,dir_routes);
      path = path.replace(/\./g,"_");
      var fpath = path + ".js";
      path = path.replace(/routes\//g,"");
      var len = path.split(/\//).length;
      var dypath = "";
      for(var n = len;n >= 1; n--){
        dypath += "../";
      }


      checkSaveDir(fpath);
      var data = "var express = require('express');\n";
      data += "var router = express.Router();\n";
      data += "\n";
      /* for moriyama part start */
      data += "var model_user = require( '" + dypath + "src/model_user_dynamo' );\n";
      data += "\n";
      data += "router.use(function timeLog(req, res, next) { \n";
      data += "  console.log('Time: ', Date.now()); \n";
      data += "  next(); \n";
      data += "}); \n";
      data += "\n";
      /* for moriyama part end */
      data += "router.get('/', function(req, res, next) { \n";
//      data += "  var header_obj = model_user.get_user_status(req.session);\n"; /* for moriyama part */
      data += "  res.render('"+ path + "', { title: 'Get Page' })\n";
      data += "});\n"
      data += "\n";
      data += "module.exports = router;\n";

      fs.writeFileSync(fpath, data, encoding='utf8');

    }

    // app.js に追加するリストを作成する。
    function make_app(path){

      path = path.replace(dir,dir_routes);
      path = path.replace(/\./g,"_");
      var vpath = path.replace(/routes/g, "");
      var scal = path.replace(/\./g,"_");
      scal = scal.replace(/-/g,"_");
      scal = scal.replace(/\//g,"_");

      var data = "var " + scal  + " = require('./" + path + "');\n";

      data += "app.use('" + vpath + "', " + scal + ");\n";

      fs.appendFile(app_list, data ,'utf8', function (err) {
        //console.log("error fs.appendFile() if " + err);
      });
    }


  };
})(typeof exports === 'undefined' ? this.getcontents = {} : exports);

