// x学会使用ejs  可以查看文档 直接搜 ejs即可  
var ejs=require('ejs')
var people = ['geddy', 'neil', 'alex']
var html=`
<h1>
<%= people.join(',')%>
</h1>
`
// var html = ejs.render('<%= people.join(", "); %>', {people: people});
console.log(ejs.render(html,{people: people}))