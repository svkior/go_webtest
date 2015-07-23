import React from 'react';
import {RouteHandler} from 'react-router';

var App = React.createClass({
    render(){
        return (
            <RouteHandler/>
        )
    }
});


//TODO: Перенести в Action
import Reflux from 'reflux';

var SendActions = Reflux.createActions([
    "sendMessage",
    "disconnected"
]);


//TODO: Перенести в Store
var SendStore = Reflux.createStore({
    listenables: [SendActions],
    onSendMessage: function(msg){
        var m = {
            type: "status",
            payload: {
                Message: "тестовое сообщение"
            }
        };
        if(this.socket){
            this.socket.send(JSON.stringify(m));
        }
    },
    processMessage(msg){
        var un = JSON.parse(msg);

        if(un && un.type){
            // У нас есть тип сообщения
            // FIXME: Поменять тип
            if(un.type === "update"){
                location.reload();
            }
        }

        this.messages.push(msg);
        this.trigger(this.messages);
    },
    connectToWs(){
        console.log('Connecting to WS');
        this.socket = new WebSocket("ws://" + window.location.host +"/device");
        this.socket.onopen = function(){
            console.log('Connected');
            this.messages = [];
            this.trigger(this.messages);
        }.bind(this);

        this.socket.onclose = function(){
            console.log("Connection has been closed.");
            //SendActions.disconnected();
            setTimeout(this.connectToWs, 2000);
        }.bind(this);
        this.socket.onmessage = function(e){
            this.processMessage(e.data);
        }.bind(this);
    },
    init(){
        console.log("Hello, World");
        if(!window["WebSocket"]){
            alert("Error: Your browser does not support web sockets.");
            this.messages = [];
            this.trigger(this.messages);
        } else {
            this.connectToWs();
        }
    },
    getInitialState(){
        return this.messages;
    }
    });

var ArtGateDefault = React.createClass({
    mixins: [
        Reflux.connect(SendStore, 'send')
    ],
    click(e){
        e.preventDefault();
        SendActions.sendMessage("Test")
    },
    pageReload(e){
        e.preventDefault();
        location.reload();
    },
    render(){
        var messages;
        if(this.state.send){
            messages = this.state.send.map(function(message){
                return <li>{message}</li>;
            });
        } else {
            messages = "";
        }
        return (
            <div>
                <h3>Статусные сообщения</h3>
                <ul>
                    {messages}
                </ul>
                <hr/>
                <ul>
                 <li><a href onClick={this.click}>Отправить сообщение</a></li>
                 <li><a href onClick={this.pageReload}>Перегрузить</a></li>
                </ul>
            </div>
        )
    }
});

module.exports.ArtGateDefault = ArtGateDefault;
module.exports.App = App;


