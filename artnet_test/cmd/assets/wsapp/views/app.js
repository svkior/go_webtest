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
    "sendMessage"
]);


//TODO: Перенести в Store
var SendStore = Reflux.createStore({
    listenables: [SendActions],
    onSendMessage: function(msg){
        var m = {
            Name: "Yass",
            Message: msg
        };
        if(this.socket){
            this.socket.send(JSON.stringify(m));
        }
    },
    init(){
        if(!window["WebSocket"]){
            alert("Error: Your browser does not support web sockets.")
        } else {
            this.socket = new WebSocket("ws://" + window.location.host +"/device");
            this.socket.onclose = function(){
                alert("Connection has been closed.");
            };
            this.socket.onmessage = function(e){
                this.messages.push(e.data);
                this.trigger(this.messages);
            }.bind(this);
        }
        this.messages = [];
        this.trigger(this.messages);
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
                <ul>
                    {messages}
                </ul>
                <a href onClick={this.click}>Жать</a>
            </div>
        )
    }
});

module.exports.ArtGateDefault = ArtGateDefault;
module.exports.App = App;


