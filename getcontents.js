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

  //var dir = process.argv[2] || '../data/org/'; //引数が無いときはカレントディレクトリを対象とする
  var dir = './data/org/';

  var insertHtml1 = INSERT_TAG1 || '<li class="plum">Plumここに任意のHTMLを入れる。</li>'
  var insertHtml2 = INSERT_TAG2 || '<li class="plum">Plumここに任意のHTMLを入れる。</li>'
  var keyname1 = KEY1 || '#corporateprofile';
  var keyname2 = KEY2 || '#corporateprofile';
   console.log("getcontents -- " + keyname1);
  console.log("getcontents -- " + insertHtml1);
  console.log("getcontents -- " + keyname2);
  console.log("getcontents -- " + insertHtml2);




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
        var results_tag = [];
        var h = fs.readFileSync(file,'utf-8');
        $ = cheerio.load(h, {decodeEntities: false});
        var filepath = path.dirname(file) + '/' + path.basename(file),
        filepath = filepath.replace("org","new");

//        if($('#corporateprofile')){
//          $('#corporateprofile').each(function (idx) {
        if($(keyname1)){
          $(keyname1).each(function (idx) {
            $(insertHtml1).appendTo(this)
            results_tag.push($(this).html());
          });
        }
        if($(keyname2)){
          $(keyname2).each(function (idx) {
            $(insertHtml2).appendTo(this)
            results_tag.push($(this).html());
          });
        }
        checkSaveDir(filepath);
        fs.writeFileSync(filepath, $.html(), encoding='utf8')

        results.push({file:path.basename(file),
                      size:stat.size,
                      filepath:filepath,
                      tag:results_tag,
                      content:$.html()
                     });

        if (!--pending) callback(null, results);
      });
    });
  }

  walk(dir, function(err, results) {
    if (err) throw err;
    var data = {name:'root', children:results};
//    console.log(JSON.stringify(data,null,'\t')); //一覧出力
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

};
})(typeof exports === 'undefined' ? this.getcontents = {} : exports);

