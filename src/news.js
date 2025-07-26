var news=[
    "您知道吗？新闻里可能会有随地大小刀",
    "老婆饼里没有老婆，佛跳墙里没有佛，所以巴尔泽布没有__ (2分)",
    "快排已死，STL当立",
    "ST表是啥，我只知道线段树大法好",
    "十年OI一场空，不开longlong见祖宗",
    "提瓦特初代神：温迪，钟离，雷电真，后面是谁来着",
    "用左脸抽了别人的手后，一定要乘胜追击，用右脸继续抽别人的手 ———梅洛彼得堡福利餐",
    "182376只是一个普通的自然数...吗？",
    "我曾遭到π/60背叛",
    "如何区分温迪和巴巴托斯？",
    "你们好啊，我是Farmer John，我要开始放牛了，害怕的OIer已经划走了"
]
function updateNews(){
    var str=news[Math.floor(Math.random()*11)];
    document.getElementById("news").innerHTML=str;
}
setInterval(updateNews,5000);