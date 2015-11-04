/**
 * Created by svkior on 04.11.15.
 *
 *  Стор для Коллекций.
 *
 *
 */

import AppDispatcher from '../dispatcher/AppDispatcher'
import {EventEmitter} from 'events'
import assign from 'object-assign'

var WSActionCreators = require('../actions/WSActionCreators');

var CHANGE_EVENT= 'change';

var collections = {};

function emitChange(collectionName){
    CollectionStore.emit(CHANGE_EVENT+ collectionName);
}

function subscribeCollection(collectionName, cb){
    var collection = collections[collectionName];

    if (collection === undefined){
        console.log("Collection is not exist");
        collection = {
            name: collectionName,
            subscribers: [cb],
            data: {},
            status: 'unsubscribed'
        };
    } else {
        collection.subscribers.push(cb);
    }

    if(collection.status === 'unsubscribed'){
        WSActionCreators.wsSubscribe(collectionName);
    }

    collections[collectionName] = collection;
    emitChange(collectionName);
}

function unsubscribeCollection(collectionName, cb){
    var collection = collections[collectionName];
    if(collection === undefined){
        console.log('Trying to unsubscribe notexistent collections');
        return;
    }

    var idx = collection.subscribers.indexOf(cb);
    if(idx > -1){
        collection.subscribers.slice(idx, 1);
    }
    if(collection.subscribers.length === 0){
        WSActionCreators.wsUnsubscribe(collectionName);
    }
    collections[collectionName] = collection;
    emitChange(collectionName);
}


var CollectionStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function(collectionName, cb){
        subscribeCollection(collectionName,cb);
        this.on(CHANGE_EVENT + collectionName, cb)
    },
    removeChangeListener(collectionName, cb){
        unsubscribeCollection(collectionName, cb);
        this.removeChangeListener(CHANGE_EVENT + collectionName, cb);
    },
    getCollection(collectionName){
        var collection = collections[collectionName];
        if(collection && collection.data)
            return collection.data;
        return null;
    }
});

function handleAction(action){
    var keys;
    switch(action.type){
        case 'ws_connected':
            console.log('Resubscribe all');
            keys = Object.keys(collections);
            keys.forEach(function(key){
                if(collections[key].status === 'unsubscribed'){
                    process.nextTick(() =>WSActionCreators.wsSubscribe(key));
                    console.log("Wake up subscription for ", key);
                }
            });
            break;
        case 'ws_disconnected':
            keys = Object.keys(collections);
            keys.forEach(function(key){
                collections[key].status = 'unsubscribed';
                console.log("Take on hold subscription for ", key);
            });
            break;
        case "ws_message":
            if(action.msg && action.msg.name){
                //console.log("!!!!!!");
                var name = action.msg.name;
                var collection = collections[name];
                if(collection !== undefined){
                    //console.log("CollectionStore got: subscribed:", name);
                    collection.data = action.msg.payload;
                    collections[action.msg.name] = collection;
                    emitChange(name);
                }
            }
            break;
        default:
    }
}

CollectionStore.dispatchToken = AppDispatcher.register(handleAction);

export default CollectionStore