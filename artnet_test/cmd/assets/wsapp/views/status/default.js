/**
 * Created by s.kior on 23.07.2015.
 */
import React from 'react';
import Reflux from 'reflux'
import WSActions from "../../actions/wsactions.js"
import WSStore from "../../store/wsstore.js"

import ArtGateStatusLog from "./log.js"

var ArtGateDefault = React.createClass({
    mixins: [
        Reflux.connect(WSStore, 'send')
    ],
    click(e){
        e.preventDefault();
        WSActions.sendMessage("Test")
    },
    pageReload(e){
        e.preventDefault();
        location.reload();
    },
    render(){
        var messages;
        if(this.state.send){
            messages = this.state.send.map(function(message, key){
                return <li key={key}>{message}</li>;
            });
        } else {
            messages = "";
        }
        return (
            <div>
                <h3>Окно статуса</h3>
                <ArtGateStatusLog/>
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

export default ArtGateDefault