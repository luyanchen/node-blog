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

}); 



exports.code = db.model('code', codeScheMa); 
exports.user = db.model('user', userScheMa); 
exports.blog = db.model('blog', blogScheMa); 
exports.comment = db.model('comment', commentScheMa); 



