/**
 * Created by svkior on 04.11.15.
 *
 *  WebSocket API
 */

var wsActions = require('../actions/WSActionCreators');

var socket;

var ConnectToWS = function(){
    if(!window["WebSocket"]){
        alert("Error: Ваш браузер не поддерживает WebSockets");
        return
    }
    socket = new WebSocket("ws://" + window.location.host + "/device");
    socket.onopen = function(){
        console.log("Connected");
        wsActions.wsConnected();
    };
    socket.onclose = function(){
        console.log("Connection to device has been closed.");
        wsActions.wsDisconnected();
        setTimeout(ConnectToWS, 2000);
    };
    socket.onmessage = function(e){
        //console.log("Пришло сообщение:",e.data);
        wsActions.wsMessage(JSON.parse(e.data));
    };
};

var PostMessage = function(msg){
    if(socket){
        socket.send(JSON.stringify(msg));
    }
};

module.exports = {
    ConnectToWS: ConnectToWS,
    PostMessage: PostMessage,
    Subscribe: function(name){
        var m = {
            type: "subscribe",
            broadcast: true,
            name: name
        };
        PostMessage(m);
    },
    Unsubscribe: function(name){
        var m ={
            type: "unsubscribe",
            broadcst: true,
            name: name
        };
        PostMessage(m);
    }
};