// 配置表
var passableList = ["hole"]; // 通行表
var point = 0;
var targetPoint = 1;

// 定义一些初始参数
var map = [];
var test = [0,1,2,3,4,5,6,7,8,9];
// 功能函数集合
function xyToi(x,y,linelen=13){  // 二维点到一维
    var ret = 0;
    ret = y * linelen + x; 
    return ret;
}
function itoxy(i,linelen=13){  // 一维点到二维
    var ret = {
        x:0,
        y:0
    }
    ret.x = i % linelen;
    ret.y = parseInt(i / linelen);
    return ret;
}


// 取地图快
CreatePlayer.prototype.mapxy = function(x, y){
    return this.map[xyToi(x, y)];
}
// 渲染界面
CreatePlayer.prototype.render = function (mode="clean") {
    if(mode == "clean"){
        this.mapxy(this.lastx, this.lasty).className = this.originClass;
    }
    this.mapxy(this.x, this.y).className = this.originClass + " " +this.class;
    this.lastx = this.x;
    this.lasty = this.y;
}
// 移动
CreatePlayer.prototype.move = function (dir = "up", isevent=true) {
    if(dir == "up"){
        if(this.y - 1 >= 0 && this.passable(this.x, this.y - 1) ){
            if(this.mapxy(this.x, this.y-1).this instanceof Array && isevent){
                for(var i of this.mapxy(this.x, this.y-1).this){
                    i.$onit({target:this, direct:dir});
                }
            }
            for(var i of this.mapxy(this.x, this.y).this){
                if(i != this){
                    i.$leave({target:this, direct:dir});
                }
            }
            this.y -= 1;
        }else{
            if(this.mapxy(this.x, this.y-1) && this.mapxy(this.x, this.y-1).this instanceof Array && isevent){
                for(var i of this.mapxy(this.x, this.y-1).this){
                    i.$collision({target:this, direct:dir});
                }
            }
        }
    }
    if(dir == "down"){
        if(this.y + 1 <= 12 && this.passable(this.x, this.y + 1) ){
            if(this.mapxy(this.x, this.y+1).this instanceof Array && isevent){
                for(var i of this.mapxy(this.x, this.y+1).this){
                    i.$onit({target:this, direct:dir});
                }
            }
            for(var i of this.mapxy(this.x, this.y).this){
                if(i != this){
                    i.$leave({target:this, direct:dir});
                }
            }
            this.y += 1;
        }else{
            if(this.mapxy(this.x, this.y+1) && this.mapxy(this.x, this.y+1).this instanceof Array && isevent){
                for(var i of this.mapxy(this.x, this.y+1).this){
                    i.$collision({target:this, direct:dir});
                }
            }
        }
    }
    if(dir == "right"){
        if(this.x + 1 <= 12 && this.passable(this.x + 1, this.y) ){
            if(this.mapxy(this.x+1, this.y).this instanceof Array && isevent){
                for(var i of this.mapxy(this.x+1, this.y).this){
                    i.$onit({target:this, direct:dir});
                }
            }
            for(var i of this.mapxy(this.x, this.y).this){
                if(i != this){
                    i.$leave({target:this, direct:dir});
                }
            }
            this.x += 1;
        }else{
            if(this.mapxy(this.x+1, this.y) && this.mapxy(this.x+1, this.y).this instanceof Array && isevent){
                for(var i of this.mapxy(this.x+1, this.y).this){
                    i.$collision({target:this, direct:dir});
                }
            }
        }
    }
    if(dir == "left"){
        if(this.x - 1 >= 0 && this.passable(this.x - 1, this.y) ){
            if(this.mapxy(this.x-1, this.y).this instanceof Array && isevent){
                for(var i of this.mapxy(this.x-1, this.y).this){
                    i.$onit({target:this, direct:dir});
                }
            }
            for(var i of this.mapxy(this.x, this.y).this){
                if(i != this){
                    i.$leave({target:this, direct:dir});
                }
            }
            this.x -= 1;
        }else{
            if(this.mapxy(this.x-1, this.y) && this.mapxy(this.x-1, this.y).this instanceof Array && isevent){
                for(var i of this.mapxy(this.x-1, this.y).this){
                    i.$collision({target:this, direct:dir});
                }
            }
        }
    }
    this.rebandDom();

}
// 前方是否可通行
CreatePlayer.prototype.passable = function (x, y) {
    var ret = false;
    for(var i of this.__terrain_passable){
        if(this.mapxy(x, y).className == this.originClass + " " + i){
            ret = true;
            break;
        }
    }
    if(this.mapxy(x, y).className == this.originClass){
        ret = true;
    }
    return ret;

}
// 事件重绑
CreatePlayer.prototype.rebandDom = function () {
    if(!this.mapxy(this.x, this.y).this){
        this.mapxy(this.x, this.y).this = [];
    }
    if(this.mapxy(this.lastx, this.lasty).this){
        var len = this.mapxy(this.lastx, this.lasty).this.length;
        var arr = this.mapxy(this.lastx, this.lasty).this;
        for(var i = len-1; i > -1; i--){
            if(arr[i] === this){
                arr.splice(i,1);
            }
            break;
        }
    }
    this.mapxy(this.x, this.y).this.push(this);
    this.render();
    if(arr && arr.length > 0){
        arr[arr.length-1].render();
    }
}
function CreatePlayer(map,x=5,y=5,classes="player", originClass="block", passableList = []) {
    this.map = map; // 地图矩阵
    this.x = x; // 对象坐标x
    this.y = y; // 对象坐标y
    this.lastx = x; // 对象上一次坐标x
    this.lasty = y; // 对象上一次坐标y
    this.class = classes; // 对象class
    this.originClass = originClass; // 继承class（如果你的地图矩阵是构造的，而非获取的，这个没用意义，但记住在move时候，传入参数mode=”banOriginClass“）
    // 下面是隐藏属性
    this.__terrain_passable = passableList;  // 地形，可通行图块
    // 下面是事件
    this.$collision = function (e) {  // 碰撞事件

    }
    this.$onit = function (e) {  // 重合事件

    }
    this.$leave = function (e) {  // 离开事件

    }
    // init
    this.rebandDom();

}


// 创建各种活体对象
var player = new CreatePlayer(block, 5, 5, "player", "block", passableList);
var hole = new CreatePlayer(block, 8, 10, "hole", "block", passableList);
var box = new CreatePlayer(block, 4, 9, "box", "block", passableList);
box.$collision= function(e){
    if(e.target.class == "player"){
        this.move(e.direct);
        e.target.move(e.direct,false);
    }
}
hole.$leave = function(e){
    if(e.target.class == "box"){
        point--;
        tips.innerText = "现在分数："+point+"     "+"目标分数："+targetPoint;
        console.log("现在分数："+point+"     "+"目标分数："+targetPoint);
    }
}
hole.$onit = function(e){
    if(e.target.class == "box"){
        point++;
        tips.innerText = "现在分数："+point+"     "+"目标分数："+targetPoint;
        console.log("现在分数："+point+"     "+"目标分数："+targetPoint);
    }
}
// 随机生成墙
for(var i = 0; i < 20; i++){
    while(1){
        var x = parseInt(Math.random()*12);
        var y = parseInt(Math.random()*12);
        if(player.mapxy(x,y).className == "block"){
            player.mapxy(x,y).className = "block wall";
            break;
        }
    }
}
function happyRand() { // 测试向函数
    var ret = {};
    while(1){
        ret.x = parseInt(Math.random()*12);
        ret.y = parseInt(Math.random()*12);
        if(player.mapxy(x,y).className == "block"){
            break;
        }
    }
    return ret;
}