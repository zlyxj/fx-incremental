function D(x){return new Decimal(x)};
class Deri{
    constructor(n,f0,k,cost,scaling){
        this.n=n;
        this.f0=D(f0);
        this.k=D(k);
        this.cost=D(cost);
        this.scaling=D(scaling);
    }

}
const game0={
            fx:D(20),
            tick:D(0),
            tickCost:D(1),
            tickmul:D(1.1),
            derivatives:[
                new Deri(1,0,0,10,2),
                new Deri(2,0,0,100,4),
                new Deri(3,0,0,1e3,6),
                new Deri(4,0,0,1e5,12),
                new Deri(5,0,0,5e7,24),
                new Deri(6,0,0,1e10,32),
                new Deri(7,0,0,1e15,45),
                new Deri(8,0,0,1e21,60)
            ]
        }
function tab(n){
    for(var i=0;i<=1;i++)
        document.getElementById("tab"+i).className=(i==n)?"":"hidden";
}
function format(x){
    var de=D(x);
    if(de.lessThan(0))return "-"+format(de.times(-1));
    if(de.equals(0))return "0.00"
    if(de.lt(0.01))return "("+format(de.pow(-1))+")<sup>-1</sup>";
    if(de.lt(1e3))return Number(de).toFixed(2);
    if(de.lt(1e6))return Math.round(Number(de)).toLocaleString();
    if(de.lt('ee6'))return de.mantissa.toFixed(2)+" × 10<sup>"+
        Math.floor(Number(de.e)).toLocaleString()+"</sup>";
    if(de.lt('10^^4'))return '10<sup>'+format(x.log10())+"</sup>";
    if(de.lt('F1e6')){
        var mag=de.mag;
        var layer=de.layer;
        while(mag.gte(10)){
            mag=mag.log10();
            layer=layer.plus(1);
        }
        return format(mag)+'F'+floor(Number(layer));
    }
    return "F"+format(de.slog());
}
function deriupdate(d){
        document.getElementById('f\''+d.n).innerHTML=format(d.f0.plus(d.k).times(D(2).pow(d.k.divideBy(10).floor())));
        document.getElementById('f0\''+d.n).innerHTML=format(d.f0);
        document.getElementById('k'+d.n).innerHTML=format(d.k);
        document.getElementById('k'+d.n+'cost').innerHTML='Req:'+format(d.cost);
        document.getElementById('k'+d.n+'cost10').innerHTML='Req:'+format(d.cost
            .times(D(1).minus(d.scaling.pow(10))).divideBy(D(1).minus(d.scaling))
            /*等比数列求和 a(1-q^n)/(1-q)*/
        )
        document.getElementById('k'+d.n+'cost').style='color:'+
        (d.cost.gt(game.fx)?'gray':'blue');
        document.getElementById('k'+d.n+'cost10').style='color:'+
        ((d.cost
            .times(D(1).minus(d.scaling.pow(10))).divideBy(D(1).minus(d.scaling))
        ).gt(game.fx)?'gray':'blue');
}
var game=game0;
function buyk(x){
    var deri=game.derivatives[x-1];
    if(game.fx.gte(deri.cost)){
        game.fx=game.fx.minus(deri.cost);
        deri.cost=deri.cost.times(deri.scaling);
        deri.k=deri.k.plus(1);
    }
    game.derivatives[x-1]=deri;
}
function buyk10(x){
    if(game.fx.lt((game.derivatives[x-1].cost
            .times(D(1).minus(game.derivatives[x-1].scaling.pow(10))).divideBy(D(1).minus(game.derivatives[x-1].scaling))
        )))return;
    var i=10;
    while(i--)
        buyk(x);
}
function buyTick(){
    if(game.tickCost.gt(game.fx))return;
    game.fx=game.fx.minus(game.tickCost);
    game.tick=game.tick.plus(1);
    game.tickCost=game.tickCost.times(10);
}
for(var i=1;i<=8;i++){
    document.getElementById('k'+i+'cost').href="javascript:buyk("+i+")";
    document.getElementById('k'+i+'cost10').href="javascript:buyk10("+i+")";
}
function save(){
    localStorage.fxIncremental=JSON.stringify(game);
}
function maxAll(){
    window.alert("我还没做呢（狗头）");
}
function checkOldVersion(){
    if(game.tick==undefined)game.tick=D(0);
    if(game.tickmul==undefined)game.tickmul=D(1.1);
    if(game.tickCost==undefined)game.tickCost=D(1);
}
function init(){
    if(localStorage.fxIncremental!=undefined){
        var save=localStorage.fxIncremental;
        var _game=JSON.parse(save);
        _game.fx=D(_game.fx);
        _game.tick=D(_game.tick);
        _game.tickmul=D(_game.tickmul);
        _game.tickCost=D(_game.tickCost);
        for(var i=0;i<8;i++){
            var deri=_game.derivatives[i];
            deri.n=Number(deri.n);
            deri.f0=D(deri.f0);
            deri.k=D(deri.k);
            deri.cost=D(deri.cost);
            deri.scaling=D(deri.scaling);
            _game.derivatives[i]=deri;
        }game=_game;
    }
}
init();
checkOldVersion();
function update(){
    // f=(f0+k)*2^(floor(k/10))
    var Dt=game.tickmul.pow(game.tick).times(0.05);
    document.getElementById('tick').innerHTML=format(Dt.times(20));
    document.getElementById('tickcost').innerHTML=format(game.tickCost);
    var f=new Array(8)
    for(var i=0;i<8;i++){
        const deri=game.derivatives[i];
        deriupdate(deri);
        f[i]=deri.f0.plus(deri.k).times(D(2).pow(deri.k.divideBy(10).floor()));
    }
    game.fx=game.fx.plus(f[0].times(Dt));
    document.getElementById("fx").innerHTML=format(game.fx);
    for(var i=1;i<8;i++)
        game.derivatives[i-1].f0=game.derivatives[i-1].f0.plus(
        f[i].times(Dt));
    
}
function hardReset(){
    var text=[
        'Kamisato Ayaka',
        'Furina de Fontaine',
        'Aether',
        'Klee',
        'Raiden Ei',
        'Nahida',
        'Xiangling',
        'Xingqiu',
        'Hu Tao'
    ];
    var x=text[Math.floor(Math.random()*9)];
    var y=window.prompt("你确定要重置吗？这不会给你任何加成！\n输入以下文本继续："+x);
    if(y==x){
        game=game0;
        save();
        init();
    }
}
setInterval(update,50);
setInterval(save,5000);