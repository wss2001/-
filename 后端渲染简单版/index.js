const express=require('express')
const fs=require('fs')
var app=express()
var mongoControl=require('../dbc').mongoControl
var page = new mongoControl('test','boke')
var ejs=require('ejs')  //引入ejs模块

// 后端渲染：  html产生的tpl，和mongodb的json数据结合 产生一个新的html ，由新产生的html来渲染页面
// 首页请求，读取文件，传过来data并复制给tpl  通过替换html模板来发送和mongodb更改好的tpl来展现  send(tpl)
app.get('/',(req,res)=>{
    // fs.readFile('./static/index.html',{encoding:'utf-8'},(err,data)=>{
    //     if(err){
    //         res.status(500)
    //     }
    //     var html=''
    //     var tpl = data
    //     page.find({},(error,result)=>{
    //         result.forEach(element => {
    //             html+=`<li><a href="/p?_id=${element._id}">${element.title}</a></li>`
    //         });
    //         tpl = tpl.replace('<!-- htmlTpl -->',html)
    //         console.log(html)
    //         res.send(tpl)
    //     })
    // })

    // ejs渲染方法
    page.find({},(error,result)=>{
        ejs.renderFile('./static/index.ejs',{result:result},(err,str)=>{
            res.send(str)
        })
    })
})

// 内容请求  点击首页替换的 a 标签来进入/p?_id=.... 同样通过查询mongodb中的_id替换其中的内容
app.get('/p',(req,res)=>{
    var _id=req.query._id
    // fs.readFile('./static/page.html',{encoding:'utf-8'},(err,data)=>{
    //     if(err){
    //         res.status(500)
    //     }
    //     page.findById(_id,(error,result)=>{
    //         // console.log(result)
    //         var json=result[0]
    //         var html=''
    //         html+=data.replace('<!-- htmlTitle -->',json.title)
    //         .replace('<!-- htmlContent -->',json.content)
    //         res.send(html)
    //     })
    // })

    // ejs渲染方法
    page.findById(_id,(error,result)=>{
        var data=result[0]
        ejs.renderFile('./static/page.ejs',{data:data},(err,html)=>{
            res.send(html)
        })
    })
})


app.listen(3000)