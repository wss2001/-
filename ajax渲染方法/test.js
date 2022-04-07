var cahru = require('../dbc').mongoControl
var cahruu = new cahru('test', 'boke')
cahruu.insert([{
    title: '风云往事',
    content: '<h2>风云往事</h2><p>话说当年，吃擦汗丰原，一天接站白人卡丹哦</p>'
}, {
    title: '东百往事',
    content: '<h2>东百往事</h2><p>话说当年，胡歌，杀马特团长开会哦卡拉的监考</p>'
}],(error,result)=>{
    
})