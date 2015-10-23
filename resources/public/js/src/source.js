$(".del-source").click(function(){
    var id = this.id;
    $.ajax({url:"/data/del/sources?id="+this.id,success:function(resp){
        alert("标记成功");
       $("#"+id).parent().parent().remove();
    }})
});
$('.submit').click(function(){
    if ($('#name').val() == ''){
        bao.alert_show('请输入学生姓名!')
        return
    }
    $('.form').submit()
});