require('../../bower_components/jquery-1.9.1/index.js');
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