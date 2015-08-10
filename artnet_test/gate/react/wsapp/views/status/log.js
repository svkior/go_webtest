/**
 * Created by s.kior on 23.07.2015.
 */
import React from 'react'
import Reflux from 'reflux'

import StatusStore from "../../store/status_store.js"

var ArtGateStatusLog = React.createClass({
    mixins: [
        Reflux.connect(StatusStore, 'status')
    ],
    render(){
        var messages;
        if(this.state.status){
            messages = this.state.status.map(function(message, key){
                return <li key={key}>{message}</li>;
            });
        } else {
            messages = <li>Нет подключения к серверу!!!</li>;
        }
        return (
            <div>
                <h3> Сообщения от сервера </h3>
                <ul>
                    {messages}
                </ul>
            </div>
        );
    }
});

export default ArtGateStatusLog
