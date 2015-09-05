$(".get-task").click(function(){
    var id = this.id;
    $.ajax({url:"/sources-pool/get-task/"+this.id,success:function(resp){
        if(resp.success){
            alert("领取成功");
            $("#"+id).parent().parent().remove();
        }else{
            alert(resp.desc);
        }

    }})
});

$("#set_limit").click(function(){
    var id = this.id;
    if($("#up").val()==""){
        alert("添加数量不能为空");

        return;
    }
    if($("#down").val()==""){
        alert("领取数量不能为空");

        return;
    }
    if(isNaN($("#up").val())){
        alert("添加数量必须为数字");

        return;
    }
    if(isNaN($("#down").val())){
        alert("领取数量必须为数字");

        return;
    }
    $.ajax({
        method:"post",
        url:"/sources-pool/set-limit",
        data:{up: $("#up").val(),
                    down: $("#down").val()},
        success:function(resp){
        alert("设置成功了！");

    }})
});