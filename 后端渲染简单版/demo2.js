// 测试ejs 与index.ejs 一起使用 index.ejs为模板  
// ejs将js写在html里
var ejs=require('ejs')
var mongoControl= require('../dbc').mongoControl
var page=new mongoControl('test','boke')
page.find({},(error,result)=>{
    ejs.renderFile('./index.ejs',{result:result},(err,str)=>{
        console.log(str)
    })
})