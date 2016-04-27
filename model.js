var mongoose = require('mongoose');
//var mongoose = require('mongodb');
//var db = mongoose.connect('mongodb://52.196.109.114/appsecond');
//var db = mongoose.connect('mongodb://52.196.109.114:27017/appsecond');
var db = mongoose.connect('mongodb://localhost/get_page');

function validator(v) {
  return v.length > 0;
}

var Post = new mongoose.Schema({
    url   : { type: String, validate: [validator, "Empty Error"] }
  , tag   : { type: String, validate: [validator, "Empty Error"] }
  , text   : { type: String, validate: [validator, "Empty Error"] }
  , created: { type: Date, default: Date.now }
});

exports.Post = db.model('Post', Post);


//process.on('SIGINT', function() { mongoose.disconnect(); });
//exports.PPPP = mongoose.disconnect();
exports.Close = function(){ db.disconnect()};
//exports.Close = "hogehoge";


