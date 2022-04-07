const express = require('express')
var router = express.Router() //router功能和app一样
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({
    extended: false
})
const path = require('path')
const moment = require('moment')
const mongoControl = require('./dbc').mongoControl
// 引入cookie管理模块
const cookieControl = require('./cookie')
const admin = new cookieControl()

// 设置权限token
// const token = '123456'

var page = new mongoControl('blog', 'page')
var comment = new mongoControl('blog', 'comment')

// 登陆页面
router.get('/login', (req, res) => {
    res.sendFile(path.resolve('./static/login.html'))
})
// 判断登录数据
router.post('/login', urlencodedParser, (req, res) => {
    if (req.body.username == 'admin' && req.body.password == 'admin') {
        // 登陆成功给权限
        res.cookie('token', admin.getToken())
        // 重定向
        res.redirect('/admin')
    } else {
        res.status(403).send('账号密码错误登录失败')
        return
    }
})

router.get('/', (req, res) => {
    // 判断cookie来决定让你是否进去管理者页面
    // checkToken()方法返回的是true或者false
    if (admin.checkToken(req.cookies.token)) {
        res.sendFile(path.resolve('./static/admin.html'))
    } else {
        res.redirect('/admin/login')
    }

})
// /admin/uploadPage
router.post('/uploadPage', urlencodedParser, (req, res) => {
    var {
        sort,
        title,
        intro,
        author,
        content
    } = req.body
    // var now=moment().format('YYYY-MM-DD  HH:mm')
    page.insert([{
        sort: sort,
        title: title,
        intro: intro,
        date: moment().format('YYYY-MM-DD  HH:mm'),
        author: author,
        content: content
    }], (error, result) => {
        res.send('文章发表成功')
    })
})

// 评论相关接口
router.get('/getComment', (req, res) => {
    // 检查cookie权限
    if (admin.checkToken(req.cookies.token)) {

    } else {
        res.status(404).send('你没有权限')
        return
    }
    // 静态调试设置headers
    // res.setHeader('Access-Control-Allow-Origin','*')
    comment.find({
        state: 0
    }, (error, data) => {
        // 如果没有对0判断的话，会没法进入for循环没有res.send值
        if (data.length == 0) {
            res.send([])
            return
        }
        // 哨兵变量 查看异步回调是否结束
        var count = 0
        for (var i = 0; i < data.length; i++) {
            var nowData = data[i]
            var nowDataFid = nowData.fid
            page.findById(nowDataFid, (error, result) => {
                // 将文章的标题和简介加入到 comment数据中
                nowData.f_title = result[0].title
                nowData.f_intro = result[0].intro
                // 哨兵变量 当count值等于data.length时，意味者完成所有查询data
                count++
                if (count == data.length) {
                    res.send(data)
                }
            })
        }
    })
})

router.get('/passComment', (req, res) => {
    // 检查cookie权限
    if (admin.checkToken(req.cookies.token)) {

    } else {
        res.status(404).send('你没有权限')
        return
    }
    // res.setHeader('Access-Control-Allow-Origin','*')
    var _id = req.query._id
    comment.updateById(_id, {
        state: 1
    }, (error, result) => {
        res.send('result:ok')
    })
})
router.get('/noPassComment', (req, res) => {
    // 检查cookie权限
    if (admin.checkToken(req.cookies.token)) {

    } else {
        res.status(404).send('你没有权限')
        return
    }
    // res.setHeader('Access-Control-Allow-Origin','*')
    var _id = req.query._id
    comment.updateById(_id, {
        state: 2
    }, (error, result) => {
        res.send('result:ok')
    })
})

// 引出模块
module.exports = router