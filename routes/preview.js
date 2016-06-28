var express = require('express');
var async = require('async');
var router = express.Router();

//var previewcontents = require('../src/previewcontents');
//    var data = previewcontents.preview();

var items = [
    { "text": "1st Post." }
  , { "text": "2nd Post." }
];


/* GET home page. */
router.get('/', function(req, res, next) {

//async.waterfall([
//  function(callback) {
//    console.log('1');
////    var data = previewcontents.preview();
//      callback(null, data);
//
//  },
//  function(arg1, callback) { // arg1 === 1
//    console.log('2');
//    setTimeout(function() {
//      console.log('2 done');
//      callback(null, arg1, 2);
//    }, 50);
//  },
//  function(arg1, arg2, callback) { // arg1 === 1, arg2 === 2
//    console.log('3');
//    setTimeout(function() {
//      console.log('3 done');
//      callback(null, arg1, 2, 3);
//    }, 10);
//  }
//], function(err, arg1, arg2, arg3) { // arg1 === 1, arg2 === 2, arg3 === 3
//  if (err) {
//    throw err;
//  }
//  console.log('all done.');
//  console.log(arg1);
//  console.log(arg1, arg2, arg3);
//});

  res.render('preview', { title: 'Get Page', items: items })

});

module.exports = router;


