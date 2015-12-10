/**
 * Created by svkior on 10.12.15.
 */

import AppDispatcher from '../dispatcher/AppDispatcher'
import {EventEmitter} from 'events';
import assign from 'object-assign';

import generateUUID from '../utils/Guids'

import CollectionStore from './CollectionStore'


/*
var boxes = {


};*/


var boxes = CollectionStore.getCollection('config');

var CHANGE_EVENT = 'change';

function emitChange(){
    BoxStore.emit(CHANGE_EVENT);
}

var BoxStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener: function(cb){
        this.removeListener(CHANGE_EVENT,cb)
    },
    getBoxes(){
        return boxes;
    }
});

function handleAction(action){
    switch(action.type){

    }
}

function onConfigChange(){
    let config = CollectionStore.getCollection('config');
    if(config && config.boxes){
        boxes = config.boxes;
        console.log('Hey!: ',boxes);
        emitChange();
    }
}

CollectionStore.addChangeListener('config', onConfigChange);

BoxStore.dispatchToken = AppDispatcher.register(handleAction);



export default BoxStore