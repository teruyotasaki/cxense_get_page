/*
ブラウザ、Node.jsの両方で使えるJavaScriptの書き方
http://qiita.com/armorik83/items/78bd3d785d0a97c82711
*/

(function (exports) {
  exports.get_all = function(LINK_LEVEL,TARGET_URL) {

    // リンクを解析してダウンロード for Node.js
    // ---モジュールの取り込み ---
    var client = require('cheerio-httpcli');
    var request = require('request');
    var URL = require('url');
    var fs = require('fs');
    var path = require('path');

    //var model_user = require( './../src/model_user_mongo' );
    var model_page = require( './../src/model_page_dynamo' );

    var list = {};
    var data_dir = './data/';

    console.log("LINK_LEVEL -- ", LINK_LEVEL);
    console.log("TARGET_URL -- ", TARGET_URL);

    // --- 共通の設定 ---
    //階層の指定
    //var LINK_LEVEL = 3;
    //基準となるページURL
    //var TARGET_URL = "http://52.69.187.215/press/2016/";

    // メイン処理
    downloadRec(TARGET_URL, 0);
    return 'Treatment has ended.';

    // 指定のurlを最大レベルlevelまでダウンロード
    function downloadRec(url, level) {
      // 最大レベルチェック
      if (level >= LINK_LEVEL) return;
      // 既出のサイトは無視する
      if (list[url]) return;
      list[url] = true;
      // 基準ページ以外なら無視する
      var us = TARGET_URL.split("/");
      us.pop();
      var base = us.join("/");
      if (url.indexOf(base) < 0) return;
      // HTMLを取得する
      client.fetch(url, {}, function(err, $, res) {
        // リンクされているページを取得
        $("a").each(function(idx) {
          if (idx === 0) return;
          // <a>タグのリンク先を得る
          var href = $(this).attr('href');
          if (!href) return;
          // 絶対パスを相対パスに変更
          href = URL.resolve(url, href);
          // '#' 以降を無視する(a.html#aa と a.html#bb は同じもの)
          href = href.replace(/\#.+$/, ""); // 末尾の#を消す
          downloadRec(href, level + 1);
        });
        // ページを保存(ファイル名を決定する)
        if (url.substr(url.length-1, 1) == '/') {
          url += "index.html"; // インデックスを自動追加
        }

        if (url.substr(url.length-1, 1) != '#') {
        var savepath = data_dir + 'org/' + url.split("/").slice(2).join("/");
console.log("koko -- " + savepath);
        checkSaveDir(savepath);
        fs.writeFileSync(savepath, $.html(), encoding='utf8');


        model_page.check_page_existence(url, function(err, stat){
          if(stat){

            console.log({result:false, message:"the email address is already registered"});
            return;
          }


    var crypto = require('crypto');

    //var username = 'teruyo-tasaki@dac.co.jp',
    //    apiKey = 'api&user&ITUGN9/GFffBq77+XGYeVg==';
    var username = 'cxense-team@dac.co.jp',
        apiKey = 'api&user&Qkc0a6QqYvTPjOsYbhR7Sg==';

    var date = new Date().toISOString(),
        hmac = crypto.createHmac('sha256', apiKey).update(date).digest('hex');


///profile/content/fetch
//      url: 'https://api.cxense.com/traffic/keyword',
//      url: 'https://api.cxense.com/profile/content/fetch',
/*
    request.post({
      url: 'https://api.cxense.com/profile/content/fetch',
      headers: { 'X-cXense-Authentication': 'username=' + username + ' date=' + date + ' hmac-sha256-hex=' + hmac },
      body: { start: -3600, url: url },
      json: true
*/
    request.post({
      url: 'https://api.cxense.com/traffic/keyword',
      headers: { 'X-cXense-Authentication': 'username=' + username + ' date=' + date + ' hmac-sha256-hex=' + hmac },
      body: { start: -3600, siteId: '1128275557251903601' },
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log('The event group count: ' + body.groups.length);
        //for(var len = 0;len <= body.groups.length; len++){
        //  console.log(body.groups[len]);
        //}



          var results = {url:url,
                        html_body:$.html(),
                        tag_select:$.html("section").replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,''),
                        api_profile:body.groups
                       };

          model_page.create_page(results, function(err, obj){
            if(err){
              console.log({result:false, message:"saving data failed"});
            }else{
              console.log({result:true, message:"user data has been registered successfully"});
            }
          })





      }
    });





        })
        }

      });
    }


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
})(typeof exports === 'undefined' ? this.getall = {} : exports);

