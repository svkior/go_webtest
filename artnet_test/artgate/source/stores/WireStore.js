/**
 * Created by svkior on 08.12.15.
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import assign from 'object-assign';

import generateUUID from '../utils/Guids'

var wires = {
//    'a' : {fromX: 10, fromY:10, toX: 100, toY: 100},
//    'b' : {fromX: 100, fromY:10, toX: 10, toY: 100}
};

let state = 'idle';
let curWire = '';

function getUniqueUUID(){
    let wireId = generateUUID();
    while(wires[wireId]){
        wireId = generateUUID();
    }
    return wireId;
}

function onMoveCursor(posX, posY){
    switch(state){
        case 'from_begin':
            wires[curWire].toX = posX;
            wires[curWire].toY = posY;
            break;
        case 'from_end':
            wires[curWire].fromX = posX;
            wires[curWire].fromY = posY;
            break;
    }
}




function addWireFromBegin(blockId, fromX, fromY){

    switch(state){
        case 'idle':
            // Начали тянуть провод
            state = 'from_begin';
            curWire = getUniqueUUID();
            wires[curWire] = {
                fromX: fromX,
                fromY: fromY,
                toX: fromX,
                toY: fromY,
                draft: true
            };
            break;
        case 'from_end':
            // Закончили тянуть провод
            state = 'idle';
            wires[curWire].fromX = fromX;
            wires[curWire].fromY = fromY;
            wires[curWire].draft = false;
            break;
    }
}

function addWireFromEnd(blockId, toX, toY){
    switch(state){
        case 'idle':
            // Начали тянуть провод
            state = 'from_end';
            curWire = getUniqueUUID();
            wires[curWire] = {
                fromX: toX,
                fromY: toY,
                toX: toX,
                toY: toY,
                draft: true
            };
            break;
        case 'from_begin':
            // Закончили тянуть провод
            state = 'idle';
            wires[curWire].toX = toX;
            wires[curWire].toY = toY;
            wires[curWire].draft = false;
            break;
    }
}

var CHANGE_EVENT = 'change';
var DRAFT_EVENT = 'draft';

function emitChange(){
    WireStore.emit(CHANGE_EVENT);
}

var WireStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener: function(cb){
        this.removeListener(CHANGE_EVENT, cb);
    },
    getWires(){
        return wires;
    },
    getInDraft(){
        return state != 'idle';
    }
});

function handleAction(action){
    switch(action.type){
        case 'wire_add_from_begin':
            addWireFromBegin(action.blkId, action.toX, action.toY );
            emitChange();
            break;
        case 'wire_add_from_end':
            addWireFromEnd(action.blkId, action.toX, action.toY );
            emitChange();
            break;
        case 'wire_move_cursor':
            onMoveCursor(action.posX, action.posY);
            if(state != 'idle'){
                emitChange();
            }
    }
}

WireStore.dispatchToken = AppDispatcher.register(handleAction);

export default WireStore