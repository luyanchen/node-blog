# node-blog
nodejs+express+mongodb架构
简单的mini blog应用api，配合前端代码，RESTful API：https://github.com/luyanchen/nej-app/

mongodb：对应数据库为blog
启动:node app

#开发环境
<ul>
<li>nodejs v6.9.5</li>
<li>express v4.14.1</li>
<li>mongodb v3.3.0</li>
<li>mongoose v4.8.1</li>
</ul>
api路径/router/index.js

#环境搭建：

####1)express -e blog//创建web
####2)cd blog
####3)npm install express//安装express，
####4)npm install express-generator//安装express命令工具，
####5)npm install//读取根目录中的package.json文件然后安装项目所依赖的包
####6)npm install mongoose//安装mongoose
####7)mongod --dbpath ~/data/MongoDB/db //启动mongodb，注意db路径改为本地db路径
####8)app.js，/router/index.js,/module/db.js分别改为本demo下的文件
####9)node app 启动项目

#API：
####获取验证码: GET /login/code
####验证码校验: POST /login/verifycode
####用户注册: POST /login/register
####用户登录: POST /login/login
####修改密码: POST /login/editpwd
####发表博客: POST /blog/add
####博客详情: GET /blog/detail
####博客列表: GET /blog/list
####删除博客: POST /blog/delete
####评论列表: POST /blog/comment/list/
####添加评论: POST /blog/comment/add/
####删除评论: POST /blog/comment/delete/

#Database

models/db.js 定义4个表，分别是验证码、用户、博客、评论表。
<pre><code>
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
</code></pre>

#设置跨域访问
<code><pre>
//设置跨域访问  
router.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",'3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
}); 
</code></pre>
