$(function(){
    var canvas=$("canvas");
    var copy=$(".copy");
    var cobj=canvas[0].getContext("2d");
    $(canvas).attr({
        width:copy.width(),
        height:copy.height(),
        background:"#fff"
    })
    $(".hasson").hover(function () {
        var index=$(this).index();
        $(".hasson").eq(index).find(".son").attr({"data-a":"animate-show"}).css({display:"block"});
    }, function () {
        $(".hasson").find(".son").attr({"data-a":"animate-hide"});
    })

    var obj= new shape(copy[0],canvas[0],cobj,$(".xp"),$(".selectarea"));
    $(".hasson:eq(0)").find(".son li").click(function(){
        if($(this).attr("data-style")!="pen"){
            obj.shapes=$(this).attr("data-style");
            obj.draw();
        }else{
            obj.pen();
        }
    })
    //画图的方式
    $(".type li").click(function(){
         obj.type=$(this).attr("data-style");
    })
    ////边框的颜色
    $(".bordercolor input").change(function(){
        obj.bordercolor=$(this).val();
    })
    //背景的颜色
    $(".bgcolor input").change(function(){
        obj.bgColor=$(this).val();
    })
    //边框粗细
    $(".linewidth li").click(function(){
       obj.lineWidth=$(this).attr("data-style")
    })
    //橡皮擦
    $(".xpsize li").click(function(){
        var w=$(this).attr("data-style");
        var h=$(this).attr("data-style");
        $(".xp").css({
            width:w,height:h
        })
        obj.xp($(".xp"),w,h);
    })
    //文件存储
    $(".file li").click(function(){
        var index=$(this).index(".file li");
        if(index==0){
            if(obj.history.length>0){
                var yes=window.confirm("是否要保存");
                if(yes){
                    location.href=(canvas[0].toDataURL().replace("data:image/png","data:stream/octet"));
                }
            }
            obj.history=[];
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);

        }else if(index==1){
           cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
           if(obj.history.length==0){
               alert("不能后退");
               return;
           }
            var data=obj.history.pop();
            cobj.putImageData(data,0,0);
        }else if(index==2){
            location.href=(canvas[0].toDataURL().replace("data:image/png","data:stream/octet"))
        }
    })
    //选择
    $(".select").click(function(){
        obj.select($(".selectarea"))
    })
    //阻止浏览器默认行为
    $(document).mousedown(function(e){
        e.preventDefault();
    })
})