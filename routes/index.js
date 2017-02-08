var express = require('express');
var router = express.Router();
var code =  require('../models/db.js').code;
var user =  require('../models/db.js').user;
var blog =  require('../models/db.js').blog;
var comment =  require('../models/db.js').comment;

//设置跨域访问  
router.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
}); 

//获取验证码
router.get('/login/code', function(req, res) {
    var _phone = req.query.phone||'';
	//产生验证码
	var _random = new Array(0,1,2,3,4,5,6,7,8,9);//随机数 
	var _code = ''; 
	for(var i = 0; i < 6; i++) {//循环操作  
		var index = Math.floor(Math.random()*10);//取得随机数的索引（0~35）  
		_code += _random[index];//根据索引取得随机数加到code上  
	}
	var _data = {"phone":_phone,"code":_code};
	//console.log(code)
	//查询是否已有该号码

	code.findOne({phone:_phone}).then(function(doc){ 
		console.log(doc);
		if(doc){
			//更新数据库
			code.update({_id:doc._id},{$set:{"code":_code}}).then(function(obj){  
				var _errorinfo = '',_errorcode = 200;
				if(!obj.ok) {
				    _errorinfo = "系统繁忙，请稍后重试";
				   	_errorcode = 501;
        			console.log('保存失败')
    			}    				 
				//返回json
				var _result = {
					"data":{
    					"code":_code
  					},
  					"code":_errorcode,
  					"error":_errorinfo
				}
				res.send(_result);
		  	});
		}else{
			//插入数据库
			//console.log(_data)
			var iCode = new code({"phone":_phone,"code":_code});
			iCode.save(function(err){ 
				console.log(err)
				var _errorinfo = '',_errorcode = 200;
				if (err) {
				    _errorinfo = "系统繁忙，请稍后重试";
				    _errorcode = 501;
        			console.log('保存失败');
    			}    				 
				//返回json
				var _result = {
					"data":{
    					"code":_code
  					},
  					"code":_errorcode,
  					"error":_errorinfo
				}
				res.send(_result);
		  	});
		}
   });
  
});

//验证验证码
router.get('/login/verifycode', function(req, res) {
    var _phone = req.query.phone||'';
    var _code = req.query.code||'';

	code.count({phone:_phone,code:_code}).then(function(doc){ 
		//console.log(doc);
		var _errorinfo = '',_errorcode = 200,_Access = true;
		if(doc == 0){
			_errorinfo = "验证码错误";
			_errorcode = 201;
			_Access = false;
    	}
    	//返回json
		var _result = {
			"data":{
    			"Access":_Access
  			},
  			"code":_errorcode,
  			"error":_errorinfo
		}
		res.send(_result);		
   });
  
});
//注册
router.get('/login/register', function(req, res) {
    var _phone = req.query.phone||'';
    var _nickname = req.query.nickname;
    var _sex = req.query.sex;
    var _password = req.query.pwd;

    var _headimg = 'http://'+req.headers.host+'/images/headimg'+Math.floor(Math.random()*10)+'.png'
	console.log({phone:_phone,password:_password})
	
	user.findOne({phone:_phone}).then(function(doc){ 
		var _errorinfo = '',_errorcode = 200,_Access = true;
		console.log(doc);
		if(doc){
			_errorinfo = "该号码已注册";
		    _errorcode = 201;
		    _Access = false;		
		}else{			
			//console.log({"phone":_phone,"nickname":_nickname,"password":_password,"sex":_sex,"token":"","headimg":_headimg});
				
			var iUser = new user({"phone":_phone,"nickname":_nickname,"password":_password,"sex":_sex,"token":"","headimg":_headimg});
			iUser.save(function(err){ 
				var _errorinfo = '',_errorcode = 200;
				if (err) {
				    _errorinfo = "系统繁忙，请稍后重试";
				    _errorcode = 501;
        		//	console.log('保存失败');
    			} 
    		});
    	}   				 
		//返回json
		var _result = {
			"data":{
    			"Access":_Access,
  			},
  			"code":_errorcode,
  			"error":_errorinfo
		}
		res.send(_result);
		
   });
  
});
//登陆
router.get('/login/login', function(req, res) {
    var _phone = req.query.phone||'';
    var _password = req.query.pwd;
	console.log({phone:_phone,password:_password})
	user.findOne({phone:_phone,password:_password}).then(function(doc){ 
		var _errorinfo = '',_errorcode = 200,_token = '';
		console.log(doc);
		if(doc == null){
			_errorinfo = "账号或密码错误";
		    _errorcode = 201;		
		}else{
			//生成token
			var _random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',  
     'S','T','U','V','W','X','Y','Z');//随机数 
			for(var i = 0; i < 10; i++) {//循环操作  
				var index = Math.floor(Math.random()*36);//取得随机数的索引（0~35）  
				_token += _random[index];//根据索引取得随机数加到code上  
			}
			//更新token
			user.update({_id:doc._id},{$set:{token:_token}},function(err){	
				console.log(err);
				var _errorinfo = '',_errorcode = 200;
				if (err){
				    _errorinfo = "系统繁忙，请稍后重试";
				    _errorcode = 501;
        			console.log('保存失败');
    			} 
    		});
    		doc.token = _token;
    	}
    	
		//返回json
		var _result = {
			"data":doc,
  			"code":_errorcode,
  			"error":_errorinfo
		}
		res.send(_result);
   });
  
});


//修改密码
router.get('/login/editpwd', function(req, res) {
    var _userid = req.query.userid;
    var _oldpassword = req.query.oldpwd;
    var _password = req.query.pwd;
    var _token = req.query.token;

	user.update({_id:_userid,password:_oldpassword,token:_token,},{$set:{password:_password}}).then(function(obj){	
		console.log(obj)
		var _errorinfo = '',_errorcode = 200,_Access =true;
		if (!obj.ok){
		    _errorinfo = "密码错误";
			_errorcode = 201;
		    _Access = false;
   		} 
		var _result = {
			"data":{
    			"Access":_Access
  			},
  			"code":_errorcode,
  			"error":_errorinfo
		}
		res.send(_result);
   });
  
});
//发表博客
router.get('/blog/add', function(req, res) {
    var _userid = req.query.userid;
    var _headimg = req.query.headimg;
    var _nickname = req.query.nickname;
    var _title = req.query.title;
    var _content = req.query.content;
    var _token = req.query.token;
   
	//验证token
	user.findOne({_id:_userid,token:_token}).then(function(doc){ 
		var _errorinfo = '',_errorcode = 200,_Access = true;
		console.log(doc);
		if(doc == null){
			_errorinfo = "登陆异常，请重新登陆";
		    _errorcode = 201;
		    _Access = false;		
		}else{			
			var iBlog = new blog({"authorid":_userid,"nickname":_nickname,"headimg":_headimg,"title":_title,"content":_content,"accessCount":0,"commentCount":0,"publishTime":Date.parse(new Date())});
			
			iBlog.save(function(err){ 
				var _errorinfo = '',_errorcode = 200;
				if (err) {
				    _errorinfo = "系统繁忙，请稍后重试";
				    _errorcode = 501;
        		//	console.log('保存失败');
    			} 
    		});
    	}   				 
		//返回json
		var _result = {
			"data":{
    			"Access":_Access,
    			"blogid":iBlog._id
  			},
  			"code":_errorcode,
  			"error":_errorinfo
		}
		res.send(_result);
   });
  
});
//博客详情
router.get('/blog/detail', function(req, res) {
    var _blogid = req.query.blogid;
  
	blog.findOne({_id:_blogid}).then(function(doc){ 
		var _errorinfo = '',_errorcode = 200;
		console.log(doc);
		if(doc == null){
			_errorinfo = "操作错误，请重试";
		    _errorcode = 201;	
		}else{			
			blog.update({_id:_blogid}, {'$inc':{'accessCount':1}}).then(function(err){
				if(err){
					_errorinfo = "系统繁忙，请稍后重试";
				    _errorcode = 501;
				}
			});
    	}   				 
		//返回json
		var _result = {
			"data":doc,
  			"code":_errorcode,
  			"error":_errorinfo
		}
		res.send(_result);
   });
  
});
//博客列表
router.get('/blog/list', function(req, res) {
    var _userid = req.query.userid||'';
    var _keyword = req.query.keyword||'';
    var _limit = parseInt(req.query.limit)||1000;
    var _flag = req.query.flag||'';
    var _direction = req.query.direction||'';
    console.log(_userid);
    
	const reg = new RegExp(_keyword, 'i') //不区分大小写
	var _query = {};
	if(_userid != ''){
		_query['authorid'] = _userid;

	}
	if(_flag != ''){
    	_query['publishTime']= tmp;//大于或小于flag发布时间的列表	
    	//下拉刷新上拉加载
		var condition = '$gt';
    	if(_direction == "up"){
    		condition = '$lt';
   		}
   		var tmp = {};
   		tmp[condition] = _flag;	
	}
	//模糊匹配
    _query['$or']=[{"title":{$regex : reg}},{"content": {$regex : reg}},{"nickname": {$regex : reg}}];
    	
	blog.find(_query).sort({'publishTime': -1}).limit(_limit).then(function(doc){ 
		var _errorinfo = '',_errorcode = 200;

		console.log(doc);
		var _result = {
			"code" : 200,
			"data": doc||[],
  			"code":_errorcode,
  			"error":_errorinfo
		}
		res.send(_result);
   });
  
});
//评论列表
router.get('/blog/comment/list/', function(req, res) {
    var _blogid = req.query.blogid;

	comment.find({blogid:_blogid}).then(function(doc){ 
		var _errorinfo = '',_errorcode = 200;  				 
		//返回json

		var _result = {
			"data":doc,
  			"code":_errorcode,
  			"error":_errorinfo
		}
		res.send(_result);
   });
  
});
//添加评论
router.get('/blog/comment/add/', function(req, res) {
    var _blogid = req.query.blogid;
    var _userid = req.query.userid;
    var _token = req.query.token;
    var _nickname = req.query.nickname;
    var _headimg = req.query.headimg;
    var _content = req.query.content;
  
	//验证token
	user.findOne({_id:_userid,token:_token}).then(function(doc){ 
		var _errorinfo = '',_errorcode = 200,_Access = true;
		console.log(doc);
		if(doc == null){
			_errorinfo = "登陆异常，请重新登陆";
		    _errorcode = 201;
		    _Access = false;		
		}else{			
			var iComment = new comment({"blogid":_blogid,"userid":_userid,"nickname":_nickname,"headimg":_headimg,"content":_content,"publishTime":Date.parse(new Date())});
			
			iComment.save(function(err){ 
				var _errorinfo = '',_errorcode = 200;
				if (err) {
				    _errorinfo = "系统繁忙，请稍后重试";
				    _errorcode = 501;
        		//	console.log('保存失败');
    			}
    			blog.update({_id:_blogid}, {'$inc':{'commentCount':1}}).then(function(err){
					if(err){
						_errorinfo = "系统繁忙，请稍后重试";
					    _errorcode = 501;
					}
				}); 
    		});
    	}   				 
		//返回json
		var _result = {
			"data":{
    			"Access":_Access,
    			"commentid":iComment._id
  			},
  			"code":_errorcode,
  			"error":_errorinfo
		}
		res.send(_result);

   });
  
});
//删除评论
router.get('/blog/comment/delete/', function(req, res) {
    var _blogid = req.query.blogid;
    var _commentid = req.query.commentid;
    var _userid = req.query.userid;
    var _token = req.query.token;
  
	//验证token
	user.findOne({_id:_userid,token:_token}).then(function(doc){ 
		var _errorinfo = '',_errorcode = 200,_Access = true;
		console.log(doc);
		if(doc == null){
			_errorinfo = "登陆异常，请重新登陆";
		    _errorcode = 201;
		    _Access = false;		
		}else{		
			console.log(_commentid)	
			comment.remove({_id:_commentid}).then(function(err){ 
				var _errorinfo = '',_errorcode = 200,_Access = true;  				 
				//返回json
				if(err){
					_errorinfo = "系统繁忙，请稍后重试";
		    		_errorcode = 501;
		    		_Access = false;
				}
				blog.update({_id:_blogid}, {'$inc':{'commentCount':-1}}).then(function(err){
					console.log(err+'del')
					if(err){
						_errorinfo = "系统繁忙，请稍后重试";
					    _errorcode = 501;
					}
				});
		   });
			
    	}   				 
		//返回json
		var _result = {
			"data":{
    			"Access":_Access,
  			},
  			"code":_errorcode,
  			"error":_errorinfo
		}
		res.send(_result);
   });
  
});
module.exports = router;
