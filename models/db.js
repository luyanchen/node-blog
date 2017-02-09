var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var db = mongoose.connect('mongodb://localhost/blog');//；连接数据库
var Schema = mongoose.Schema;   //  创建模型

var codeScheMa = new Schema({
	phone : String,
	code : String
});
var userScheMa = new Schema({
	phone : String,
	nickname : String,
	password : String,
	headimg : String,
	sex: String,
	token:String
}); 
var blogScheMa = new Schema({
	authorid : String,
	headimg : String,
	nickname : String,
	title : String,
	content : String,
	accessCount : Number,
	commentCount : Number,
	publishTime : Date,
});
var commentScheMa = new Schema({
	blogid : String,
	userid : String,
	nickname : String,
	headimg : String,
	content : String,
	publishTime : Date,
	//increaseid : Number
}); 

var counterScheMa = new Schema({
	sequence_value: Number,
	_id:String
});	
function getNextSequenceValue(sequenceName){
   var sequenceDocument = db.counter.findAndModify(
      {
         query:{_id: sequenceName },
         update: {$inc:{sequence_value:1}},
         new:true
      });
   return sequenceDocument.sequence_value;
}


exports.code = db.model('code', codeScheMa); 
exports.user = db.model('user', userScheMa); 
exports.blog = db.model('blog', blogScheMa); 
exports.comment = db.model('comment', commentScheMa); 
exports.counter = db.model('counter', counterScheMa);
exports.getNextSequenceValue = getNextSequenceValue;


