/**
 * Created by svkior on 04.11.15.
 *
 *  Websocket Actions
 */

import AppDispatcher from '../dispatcher/AppDispatcher'

module.exports = {
    wsConnected: function(){
        var action = {
            type: 'ws_connected'
        };
        AppDispatcher.dispatch(action);
    },
    wsDisconnected: function(){
        var action = {
            type: 'ws_disconnected'
        };
        AppDispatcher.dispatch(action);
    },
    wsMessage: function(msg){
        var action = {
            type: 'ws_message',
            msg: msg
        };
        AppDispatcher.dispatch(action);
    },
    wsSubscribe: function(collectionName){
        var action = {
            type: 'ws_subscribe',
            name: collectionName
        };
        AppDispatcher.dispatch(action);
    },
    wsUnsubscribe: function(collectionName){
        var action = {
            type: 'ws_unsubscribe',
            name: collectionName
        };
        AppDispatcher.dispatch(action);
    }
};