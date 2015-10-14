require('../../bower_components/jquery-1.9.1/index.js');

jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();
require('./jquery.history.min.js');
require('../../bower_components/web-socket-js/swfobject.js')
require('../../bower_components/web-socket-js/web_socket.js')

// Let the library know where WebSocketMain.swf is:
WEB_SOCKET_SWF_LOCATION = "/bower_components/web-socket-js/WebSocketMain.swf";

// Write your code in the same way as for native WebSocket:
var ws = new WebSocket("ws://"+window.location.host+"/ws");

ws.onmessage = function(e) {
    $("#ws-tips").show();
    $("#ws-tips-text").text(e.data);

};
$('.header input').keypress(function(e){
    var key = e.which;
    if(key == 13)  // the enter key code
    {
        location.href= location.pathname + '?keywords=' + $(this).val();
    }

});
window.bao = {}
bao.alert_show = function(text){
    $('.alert').text(text)
    $('#alert').show()
}
$('#alert').click(function(){
    $(this).hide()
})