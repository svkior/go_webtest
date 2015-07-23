/**
 * Created by s.kior on 23.07.2015.
 */
import Reflux from 'reflux'

import StatusActions from "../actions/status_actions.js"
import WSActions from "../actions/wsactions.js"

var WSStore = Reflux.createStore({
    listenables: [WSActions],
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
            if(un.type === "reload"){
                console.log("Change of js detected. Reloading after 0.5 sec...");
                setTimeout(function(){location.reload();}, 500);
            }
        }

        this.messages.push(msg);
        this.trigger(this.messages);
    },
    connectToWs(){
        this.socket = new WebSocket("ws://" + window.location.host +"/device");
        this.socket.onopen = function(){
            this.messages = [];
            this.trigger(this.messages);
            StatusActions.wsconnected();
        }.bind(this);

        this.socket.onclose = function(){
            console.log("Connection has been closed.");
            WSActions.disconnected();
            setTimeout(this.connectToWs, 2000);
        }.bind(this);
        this.socket.onmessage = function(e){
            this.processMessage(e.data);
        }.bind(this);
    },
    init(){
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

export default WSStore