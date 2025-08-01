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
class Upgrade{
    constructor(n,cost,scaling){
        this.n=n;
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
            ],
            upgrades:[
                new Upgrade(1,1e18,1e9),
                new Upgrade(2,1e24,1e12),
                new Upgrade(3,1e32,1e16),
                new Upgrade(4,1e48,1e24),
                new Upgrade(5,1e90,1e60),
                new Upgrade(6,1e150,1e150),
                new Upgrade(7,1e280,1e280),
                new Upgrade(8,'1e400','1e400')
            ],
            powers:[D(1),D(1),D(1),D(1),D(1),D(1),D(1),D(1)]
        }
function tab(n){
    for(var i=0;i<=2;i++)
        document.getElementById("tab"+i).className=(i==n)?"":"hidden";
}
function format(x){
    var de=D(x);
    if(de.lessThan(0))return "-"+format(de.times(-1));
    if(de.equals(0))return "0.00"
    if(de.lt(0.01))return "("+format(de.pow(-1))+")<sup>-1</sup>";
    if(de.lt(1e3))return (Math.floor(Number(de)*100)/100).toFixed(2);
    if(de.lt(1e6))return Math.floor(Number(de)).toLocaleString();
    if(de.lt('ee6'))return (Math.floor(Number(de.mantissa)*100)/100).toFixed(2)+"×10<sup>"+
        Math.floor(Number(de.e)).toLocaleString()+"</sup>";
    if(de.lt('10^^4'))return '10<sup>'+format(x.log10())+"</sup>";
    if(de.lt('F1e6')){
        var mag=de.mag;
        var layer=de.layer;
        while(mag.gte(10)){
            mag=mag.log10();
            layer=layer.plus(1);
        }
        return '(10^)^'+floor(Number(layer))+' '+format(mag);
    }
    return "10^^"+format(de.slog());
}
function deriupdate(d){
    if(d.n==1 && d.f0.plus(d.k).times(D(2).pow(d.k.divideBy(10).floor())).pow(game.powers[d.n-1]).gt(1e60)){
        var F=d.f0.plus(d.k).times(D(2).pow(d.k.divideBy(10).floor())).pow(game.powers[d.n-1]);
        var x=F.log10();
        x=x.minus(60);
        x=x.times(0.3);
        x=x.plus(60);
        x=D(10).pow(x);
        document.getElementById('f\'1').innerHTML=format(x)
    }
        else document.getElementById('f\''+d.n).innerHTML=format(d.f0.plus(d.k).times(D(2).pow(d.k.divideBy(10).floor())).pow(game.powers[d.n-1]));
        document.getElementById('f0\''+d.n).innerHTML=format(d.f0);
        document.getElementById('k'+d.n).innerHTML=format(d.k);
        document.getElementById('k'+d.n+'cost').innerHTML='Req:'+format(d.cost);
        document.getElementById('k'+d.n+'cost10').innerHTML='Req:'+format(d.cost
            .times(D(1).minus(d.scaling.pow(10))).divideBy(D(1).minus(d.scaling))
            /*等比数列求和 a(1-q^n)/(1-q)*/
        )
        var deri=d;
        var num;
        if(game.fx.lte(0))num=new D(0);
        else num=game.fx.divideBy(deri.cost).log(deri.scaling).plus(1).floor().max(0);
        var cost=deri.scaling.pow((num.plus(-1).max(0))).times(deri.cost);
        document.getElementById('k'+d.n+'max').innerHTML='Req:'+format(cost);
        document.getElementById('k'+d.n+'cost').style='color:'+
        (d.cost.gt(game.fx)?'gray':'blue');
        document.getElementById('k'+d.n+'max').style='color:'+
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
function buymax(x){
    var deri=game.derivatives[x-1];
    game.fx=game.fx.plus(1e-9);
    var num=game.fx.divideBy(deri.cost).log(deri.scaling).plus(1).floor().max(0);
    if(num.lte(0))return;
    var cost=deri.scaling.pow((num.minus(1).max(0))).times(deri.cost);
    game.fx=game.fx.minus(cost);
    deri.k=deri.k.plus(num);
    deri.cost=deri.cost.times(deri.scaling.pow(num));
    game.derivatives[x-1]=deri;
}
function buyTick(){
    if(game.tickCost.gt(game.fx))return;
    game.fx=game.fx.minus(game.tickCost);
    game.tick=game.tick.plus(1);
    game.tickCost=game.tickCost.times(10);
}
function maxTick(){
    var num=game.fx.plus(1e-9).log10().floor();
    if(num.lt(game.tick))return;
    game.tick=num.plus(1);
    game.tickCost=D(10).pow(game.tick)
    game.fx=game.fx.minus(D(10).pow(game.tick.plus(-1)));
}
for(var i=1;i<=8;i++){
    document.getElementById('k'+i+'cost').href="javascript:buyk("+i+")";
    document.getElementById('k'+i+'cost10').href="javascript:buyk10("+i+")";
    document.getElementById('k'+i+'max').href="javascript:buymax("+i+")";
}
function save(){
    localStorage.fxIncremental=JSON.stringify(game);
}
function maxAll(){
   maxTick();
   for(var i=8;i>=1;i--)
    buymax(i);
}
function buyUpg(x){
    var upg=game.upgrades[x-1];
    if(game.fx.gt(upg.cost)){
        game.fx=game.fx.minus(upg.cost);
        upg.cost=upg.cost.times(upg.scaling);
        game.powers[x-1]=game.powers[x-1].plus(0.05);
    }
}
function checkOldVersion(){
    if(game.tick==undefined)game.tick=D(0);
    if(game.tickmul==undefined)game.tickmul=D(1.1);
    if(game.tickCost==undefined)game.tickCost=D(1);
    if(game.upgrades==undefined){
        game.upgrades=[
                new Upgrade(1,1e18,1e9),
                new Upgrade(2,1e24,1e12),
                new Upgrade(3,1e32,1e16),
                new Upgrade(4,1e48,1e24),
                new Upgrade(5,1e90,1e60),
                new Upgrade(6,1e150,1e150),
                new Upgrade(7,1e280,1e280),
                new Upgrade(8,'1e400','1e400')
            ]
    }
    if(game.powers==undefined){
        game.powers=[D(1),D(1),D(1),D(1),D(1),D(1),D(1),D(1)];
    }
}
function init(){
    checkOldVersion();
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
        }
        for(var i=0;i<8;i++){
            var upg=_game.upgrades[i];
            upg.cost=D(upg.cost);
            upg.scaling=D(upg.scaling);
            _game.powers[i]=D(_game.powers[i]);
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
        f[i]=deri.f0.plus(deri.k).times(D(2).pow(deri.k.divideBy(10).floor())).pow(game.powers[i]);
    }
    document.getElementById('sc1').style="color:red"+((f[0].gt(1e60))?"":";display:none");
    if(f[0].gt(1e60)){
        var x=f[0].log10();
        x=x.minus(60);
        x=x.times(0.3);
        x=x.plus(60);
        x=D(10).pow(x);
        game.fx=game.fx.plus(x.times(Dt));
    }
    else game.fx=game.fx.plus(f[0].times(Dt));
    document.getElementById("fx").innerHTML=format(game.fx);
    for(var i=1;i<8;i++)
        game.derivatives[i-1].f0=game.derivatives[i-1].f0.plus(
        f[i].times(Dt));
    for(var i=1;i<=8;i++){
        document.getElementById('upg'+i).innerHTML=format(game.powers[i-1]);
        document.getElementById('upg'+i+'cost').innerHTML=format(game.upgrades[i-1].cost);
    }
}
function exportSave(){
    var Save=btoa(JSON.stringify(game));
    document.getElementById("savearea").value=Save;
}
function importSave(){
    var Save=document.getElementById("savearea").value;
    if(window.confirm("要导入存档吗？")){
        game=JSON.parse(atob(Save));
        save();
        init();
    }
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
