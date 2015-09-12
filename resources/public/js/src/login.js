require('../../bower_components/jquery-1.9.1/index.js');
require('../../bower_components/jquery-modal/jquery.modal.js');
document.loginform.username.focus();
function login_action(){
    if (document.loginform.username.value == '') {
        alert('用户名不能为空');
        document.loginform.username.focus();
        return false;
    }
    if (document.loginform.password.value == '') {
        alert('密码不能为空');
        document.loginform.password.focus();
        return false;
    }

    document.loginform.submit();
}
$('.login-action').click(function(){
    login_action();
});
$(document).keypress(function(e) {
    if(e.which == 13) {
        login_action();
    }
});
$('.reg-form-action').click(function(){
    if ($('#name').val() == '') {
        alert('学校名称不能为空');

        return false;
    }
    if ($('#phone').val() == '') {
        alert('电话不能为空');

        return false;
    }
    if ($('#code').val() == '') {
        alert('验证码不能为空');

        return false;
    }
    $.post('/application_form',
        {name: $('#name').val(),
         phone: $('#phone').val(),
         user_validate: $('#code').val()},
        function(res) {
            if (res.success){
                $('#reg-form').find('.pure-control-group').hide();
                $('.reg-success').show();
            }else{
                alert(res.desc);
            }
    })
});

$('.reg-form,.login-action').on('keyup keypress', function(e) {
    var code = e.keyCode || e.which;
    if (code == 13) {
        e.preventDefault();
        return false;
    }
});
$('.code-btn').click(function(){
    $('.code').attr('src','/code?v='+Math.random());
});