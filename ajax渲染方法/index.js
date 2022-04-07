var express=require('express')
var app=express()
var mongoControl=require('../dbc').mongoControl
var contentControl=new mongoControl('test','boke')
app.use(express.static('./static'))
// 获取列表
app.get('/list',(req,res)=>{
contentControl.find({},(error,result)=>{
    res.send(result)
})
})
// 获取内容
app.get('/pages',(req,res)=>{
var _id=req.query._id
contentControl.findById(_id,(error,result)=>{
    res.send(result)
})
})

app.listen(3000)