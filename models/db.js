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

exports.code = db.model('code', codeScheMa); 
exports.user = db.model('user', userScheMa); 
