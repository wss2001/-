// 添加数据到数据库  moment日期类库 可以查看moment.js使用
const mongoControl=require('./dbc').mongoControl
var page=new mongoControl('blog','page')
var comment=new mongoControl('blog','comment')
const moment=require('moment')
// page.insert([{
//     sort:'js',
//     title:'东百十年往事',
//     intro:'话说当年一篇混战，胡歌杀马特团长',
//     date:moment().format('YYYY-MM-DD  HH:mm'),
//     author:'王守帅',
//     content:'呃让龙湖豪杰天下熙熙攘攘。胡歌叱诧风云，谍战生死交投让人久久不能忘怀。'
// }],()=>{})

comment.insert([{
    fid:'61d3e41db2a57e3a95a134fc',
    content:'要不是你长得帅我才不评论',
    date:moment().format('YYYY-MM-DD  HH:mm'),
    author:'wss2001@outlook.com'
}],()=>{})