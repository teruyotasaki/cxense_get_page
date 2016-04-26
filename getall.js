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

  var list = {};
  var data_dir = 'data/';

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
      var savepath = data_dir + 'org/' + url.split("/").slice(2).join("/");
      checkSaveDir(savepath);
      fs.writeFileSync(savepath, $.html());

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

