function shape(copy,canvas,cobj,xpobj,selectobj){
    this.copy=copy;//获取的是copy值
    this.canvas=canvas;//获取的是canvas值
    this.cobj=cobj;
    this.xpobj=xpobj;
    this.selectobj=selectobj;
    this.bgColor="#000";//背景色填充
    this.bordercolor="#000";//边框颜色
    this.lineWidth=1;//默认线条宽度为1
    this.type="stroke";//默认是边框，可以是填充
    this.shapes="line";//到底画什么图形，默认线
    this.history=[];
    this.selectFlag=true;
}
shape.prototype={
    init:function(){
        //  图形初始化
        this.selectobj.css("display","none");
        if (this.temp) {
            this.history.push(this.cobj.getImageData(0, 0, this.canvas.width, this.canvas.height));
            this.temp = null;
        }
        this.cobj.fillStyle=this.bgColor;
        this.cobj.strokeStyle=this.bordercolor;
        this.cobj.lineWidth=this.lineWidth;
    },
    line: function (x,y,x1,y1) {
        var that=this;
        that.init();
        that.cobj.beginPath();
        that.cobj.moveTo(x,y);
        that.cobj.lineTo(x1,y1);
        that.cobj.closePath();
        that.cobj.stroke();
    },
    draw:function () {
        var that=this;
        that.copy.onmousedown= function (e) {
            var startx= e.offsetX;
            var starty= e.offsetY;

            that.copy.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.canvas.width,that.canvas.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;
                that[that.shapes](startx,starty,endx,endy);
            }
            that.copy.onmouseup= function () {
                that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    rect: function (x,y,x1,y1) {
        var that=this;
        that.init();
        that.cobj.beginPath();
        that.cobj.rect(x,y,x1-x,y1-y);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    circle: function (x,y,x1,y1) {
        var that=this;
        that.init();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        that.cobj.beginPath();
        that.cobj.arc(x,y,r,0,Math.PI*2);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    five:function(x,y,x1,y1){
        var that=this;
        that.init();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r1=r/2;
        that.cobj.beginPath();
        that.cobj.moveTo(x+r,y);
        for(var i=1;i<10;i++){
            if(i%2==0){
                that.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r,y+Math.sin(i*36*Math.PI/180)*r);
            }else{
                that.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r1,y+Math.sin(i*36*Math.PI/180)*r1);
            }
        }
        that.cobj.closePath();
        that.cobj[that.type]();
     },
    pen:function(){
        var that=this;
        that.copy.onmousedown= function (e) {
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.init();
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function(e){
                var endx= e.offsetX;
                var endy= e.offsetY;
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();
            }
            that.copy.onmouseup= function () {
                that.cobj.closePath();
                that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    xp:function(xpobj,w,h){
        var that=this;
        that.copy.onmousemove=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            var lefts=ox-w/2;
            var tops=oy-h/2;
            if(lefts<0){
                lefts=0;
            }
            if(lefts>that.canvas.width-w){
                lefts=that.canvas.width-w;
            }
            if(tops<0){
                tops=0;
            }
            if(tops>that.canvas.height-h){
                tops=that.canvas.height-h;
            }
            xpobj.css({
                left:lefts,
                top:tops,
                display:"block"
            })
        }
        that.copy.onmouseup=function(){
            that.copy.onmousemove=null;
            that.copy.onmouseup=null;
        }
        that.copy.onmousedown=function(){
            that.copy.onmousemove=function(e){
                var ox= e.offsetX;
                var oy= e.offsetY;
                var lefts=ox-w/2;
                var tops=oy-h/2;
                that.cobj.clearRect(ox,oy,w,h);//开始点 宽和高
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.canvas.width-w){
                    lefts=that.canvas.width-w;
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.canvas.height-h){
                    tops=that.canvas.height-h;
                }
                xpobj.css({
                    left:lefts,
                    top:tops,
                    display:"block"
                })
            }
            that.copy.onmouseup=function(){
                xpobj.css({
                    display:"none"
                })
                that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    select:function(selectareaobj){
        var that=this;
        that.init();
        that.copy.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY,minx,miny, w,h;
            that.init();
            that.copy.onmousemove=function(e){
                that.init();
                var endx= e.offsetX;
                var endy= e.offsetY;
                minx=startx>endx?endx:startx;
                miny=starty>endy?endy:starty;
                w=Math.abs(startx-endx);
                h=Math.abs(starty-endy);
                selectareaobj.css({
                    display:"block",
                    left:minx,
                    top:miny,
                    width:w,
                    height:h
                 })

            }
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.temp=that.cobj.getImageData(minx,miny,w,h);
                that.cobj.clearRect(minx,miny,w,h);
                that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
                that.cobj.putImageData(that.temp,minx,miny);
                that.move(minx,miny,w,h,selectareaobj);
            }
        }
    },
    move:function(x,y,w,h,selectareaobj){
        var that=this;
        that.copy.onmousemove=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.canvas.style.cursor="move";
            }else{
                that.canvas.style.cursor="default";
            }
        }
        that.copy.onmousedown=function(e) {
            var ox = e.offsetX;
            var oy = e.offsetY;
            var cx = ox - x;
            var cy = oy - y;
            if (ox > x && ox < x + w && oy > y && oy < y + h) {
                that.copy.style.cursor = "move";
            } else {
                that.copy.style.cursor = "default";
                return;
            }

            that.copy.onmousemove = function (e) {

                that.cobj.clearRect(0, 0, that.width, that.height);
                if (that.history.length !== 0) {
                    that.cobj.putImageData(that.history[that.history.length - 1], 0, 0);
                }
                var endx = e.offsetX;
                var endy = e.offsetY;
                var lefts = endx - cx;
                var tops = endy - cy;
                if (lefts < 0) {
                    lefts = 0;
                }
                if (lefts > that.width - w) {
                    lefts = that.width - w;
                }

                if (tops < 0) {
                    tops = 0;
                }
                if (tops > that.height - h) {
                    tops = that.height - h;
                }
                selectareaobj.css({
                    left: lefts,
                    top: tops
                });
                x = lefts;
                y = tops;
                that.cobj.putImageData(that.temp,lefts, tops);
            }
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.move(x,y,w,h,selectareaobj)

            }
        }
    }
}