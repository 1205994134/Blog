/*
   应用程序的启动（入口）文件
*/
//加载express模块
var express = require('express')
//加载模板处理模块
var swig = require('swig')
//加载数据库模块
var mongoose = require('mongoose')
//加载body-parser，用来处理post提交的请求
var bodyParser = require('body-parser');
//加载cookie模块
var Cookies = require('cookies');
//创建App应用 NodeJS Http.createServer()；
var app = express()

var User = require('./models/User')
//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use('/public', express.static(__dirname + '/public'))

//配置应用模块
//模板的使用
//		后端逻辑和页面表现的分离-前后端分离

//模板配置
//		var swig = require('swig');
//		app.engine('html', swig.renderFile);
//			定义模板引擎，使用swig.renderFile方法解析后缀为html文件
//	html文件
//		app.set('views', './views');
//			设置模板存放目录
//		app.set('view engine', 'html');
//			注册模板引擎
//		swig.setDefaults({cache:false});
app.engine('html', swig.renderFile)
app.set('views', './views')
app.set('view engine', 'html')
swig.setDefaults({cache:false})

//bodyparser设置
app.use( bodyParser.urlencoded({extended:true}) )

//设置cookie
app.use(function(req, res, next) {
	req.cookies = new Cookies(req, res);

	//解析登陆用户的cookie信息
	req.userInfo = {};
	if (req.cookies.get('userInfo')) {
		try {
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));

			//读取当前登录用户的类型，是否是管理员
			User.findById(req.userInfo._id).then(function(userInfo) {
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			})
		}catch(e){

		}
	} else {
		next();
	}
	
})

//根据不同的功能划分模块
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))
//处理请求输出
//路由绑定
//	通过app.get()或app.post()等方法可以把一个url路径和一个或N个函数进行绑定
//	app.get('/', function(req, res, next){})
//		req:request对象 - 保存客户端请求相关的一些数据 - http.request
//		res.reponse对象 - 服务端输出对象，提供了一些服务端输出相关的方法 - http.response
//		next: 方法，用于执行下一个和路径匹配的函数

//内容输出
//	通过res.send(string)发送内容至客户端
/*app.get('/', function(req, res, next) {
	//res.send('<h1>欢迎来到我的博客</h1>')
	//读取指定目录下的指定文件，解析并返回给客户端
	//第一个参数表示模板的文件，相对于views目录
	//第二个参数，传递给模板所需要的数据

	res.render('index');

})*/

/*app.get('/main.css', function(req, res, next) {
	res.setHeader('content-type', 'text/css')
	res.send('body {background: red}')
})*/
mongoose.connect('mongodb://localhost:27018/blog', function(err) {
	if (err) {
		console.log('数据库连接失败')
	}else {
		console.log('数据库连接成功')
		app.listen(8080);
	}
});

//用户发送http请求 -> url -> 解析路由 -> 找到匹配的规则 -> 执行指定绑定函数，返回对应内容至用户



