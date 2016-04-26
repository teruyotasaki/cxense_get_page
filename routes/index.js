var express = require('express');
var router = express.Router();

var model = require('../model');
var Post = model.Post;

var getall = require('../getall');
var get_all = getall.get_all;
var getcontents = require('../getcontents');
var get_contents = getcontents.get_contents;

/* GET home page. */

router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Get Page', items: items })
  res.render('index', { title: 'Get Page' })
});


/*
router.get('/form', function(req, res) {
  res.render('form', { title: 'New Entry' })
});
*/

router.post('/create', function(req, res) {
  // 階層の指定
  var LINK_LEVEL = req.body.depth;
  // 基準となるページURL
  var TARGET_URL = req.body.url;

  console.log(req.body);
  console.log(req.body.url);
  console.log(req.body.depth);

  // メイン処理
  var mes = get_all(LINK_LEVEL,TARGET_URL);

  var items = [
      { "text": "get_page : " + mes }
  ];

//  res.redirect('/');
  res.render('index', { title: 'Get Page', items: items })
});

router.post('/inserttag', function(req, res) {
  if(req.body.content_1){
    var KEY1 = req.body.content_1;
  }else{
    var KEY1 = "body";
  }
  var INSERT_TAG1 = req.body.insert_tag_1;

  if(req.body.content_2){
    var KEY2 = req.body.content_2;
  }else{
    var KEY2 = "body";
  }
  var INSERT_TAG2 = req.body.insert_tag_2;

  console.log(req.body);
  console.log(req.body.content_1);
  console.log(req.body.insert_tag_1);
  console.log(req.body.content_2);
  console.log(req.body.insert_tag_2);

  // メイン処理
  var mes_con = get_contents(KEY1,INSERT_TAG1,KEY2,INSERT_TAG2) || '';

  var items = [
    { "text": "insert_tag : " + mes_con }
  ];

//  res.redirect('/');
  res.render('index', { title: 'Get Page', items: items })
});



module.exports = router;


