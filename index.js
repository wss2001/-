// 引入express模块
const express = require('express')
// 初始化express模块的app
const app = express()

// 引入body-parser模块
const bodyParser = require('body-parser')
// 初始化urlencoded解析器
const urlencodedParser = bodyParser.urlencoded({
    extended: false
})

// 引入cookie-parser模块
const cookieParser = require('cookie-parser')

//引入自己写的mongoControl方法
const mongoControl = require('./dbc').mongoControl

// 引入ejs模块处理后端渲染
const ejs = require('ejs')

// 引入moment模块处理时间格式
const moment = require('moment')

// 初始化文章表
var page = new mongoControl('blog', 'page')
// 初始化存储评论的集合
var comment = new mongoControl('blog', 'comment') 

// 为请求添加中间件：解析cookie
app.use(cookieParser())

// 处理静态文件请求
app.use(express.static('./static', {
    index: false
}))

// /admin请求先拦截进入static中  后台功能接口的静态文件请求
app.use('/admin',express.static('./static',{index: false}))
// 所有的/admin请求都在 ./admin.js文件中做 ./admin.js中的请求自带/admin  后台功能接口/路由
app.use('/admin',require('./admin'))

// 前台程序相关的接口
// 首页接口
app.get('/', (req, res) => {
    // 在page数据库里查找所有文章
    page.find({}, (error, result) => {

        // ejs渲染json文章数据到页面上
        ejs.renderFile('./ejs.tpl/index.ejs', {
            result: result
        }, (err, str) => {
            res.send(str)
        })
        
        // 上面的替换
        // res.send(result)
    })
})
// 文章浏览页面接口
app.get('/p', (req, res) => {
    // 获取前端传入的_id
    var _id = req.query._id
    // console.log(_id)
    // 根据_id查询文章
    page.findById(_id, (error, result) => {
        // 如果没有这篇文章则传404
        if (result.length == 0) {
            res.status(404).send('欢迎进去花园')
            return
        }
        // 根据文章的_id来查询评论

        var data = result[0]  //id查询肯定只返回一条
        // 查询评论  通过查询fid来查询数据，fid为文章的_id
        comment.find({
            fid: _id,
            state:1
        }, (error, result) => {
            // 渲染页面
            ejs.renderFile('./ejs.tpl/page.ejs', {
                data: data,result:result
            }, (err, str) => {
                res.send(str)
            })
        })
    })
})
// 评论发布 前台用户提交评论接口
app.post('/submitComment',urlencodedParser,(req,res)=>{
    // 获取携带在url中的文章_id
    var _id=req.query._id
    // 获取评论内容 email,content
    var {email,content} = req.body
    // console.log(_id,email,content)
    // 简单的表单验证：不允许为空
    if(!_id){
        res.status(500).send('不允许评论')
        return
    }
    if(!email ||!content){
        res.status(500).send('不允许发表空评论或不使用email')
        return
    }
    // 操作评论数据库
    comment.insert([{
        fid:_id,
        content:content,
        author:email,
        date:moment().format('YYYY-MM-DD  HH:mm'),
        state:0
    }],(error,result)=>{
        // 如果数据库操作失败则传500
        if(error){
            res.status(500).send('什么评论把我的服务器弄崩了')
            return
        }
        // 重定向回这个文章界面，并且刷新评论
        res.redirect('/p?_id='+_id)
    })
})

// 监听3000端口
app.listen(3000)