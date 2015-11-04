/**
 * Created by svkior on 04.11.15.
 */

import AppDispatcher from '../dispatcher/AppDispatcher'
import {EventEmitter} from 'events'
import assign from 'object-assign'


import WSAPIUtils from '../utils/WSAPIUtils'

var CHANGE_EVENT = 'change';

var websocketStatus = 'disconnected';

/*
 * Функция, которая вызывается в случае получения Connected
 */
function setWSConnected(){
    websocketStatus = 'connected';
    // Подписаться на respawn
    WSAPIUtils.Subscribe('respawn');
}

function setWSDisconnected(){
    websocketStatus = 'disconnected';
}

function emitChange(){
    WSStore.emit(CHANGE_EVENT);
}

var WSStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener(cb){
        this.removeChangeListener(CHANGE_EVENT, cb);
    },
    getWSStatus(){
        return websocketStatus;
    }
});

function handleAction(action){
    switch(action.type){
        case 'ws_connected':
            setWSConnected();
            emitChange();
            break;
        case 'ws_disconnected':
            setWSDisconnected();
            emitChange();
            break;
        case "ws_message":
            if(action.msg && action.msg.type){
                // TODO: Осуществить разбор различных типов пакетов
                switch(action.msg.type){
                    case 'reload':
                        console.log("Change of js is detected. Reloading after 1 sec...");
                        setTimeout(function(){location.reload();}, 1000);
                        break;
                    default:
                }
            }
            break;
        case 'ws_subscribe':
            if(websocketStatus === 'connected'){
                console.log("WS_SUBSCRIBE: Subscribing to ", action.name);
                WSAPIUtils.Subscribe(action.name);
            }
            break;
        default:
    }
}

WSStore.dispatchToken = AppDispatcher.register(handleAction);

export default WSStore