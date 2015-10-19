$('.submit').click(function(){
    if ($('#name').val() == ''){
        bao.alert_show('请输入姓名!')
        return
    }
    if ($('#phone').val() == ''){
        bao.alert_show('请输入电话!')
        return
    }
    if ($('#email').val() == ''){
        bao.alert_show('请输入邮箱!')
        return
    }
    if ($('#password').val() == ''){
        bao.alert_show('请输入密码!')
        return
    }
    $('.form').submit()
});