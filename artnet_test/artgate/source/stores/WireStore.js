/**
 * Created by svkior on 08.12.15.
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import assign from 'object-assign';

import generateUUID from '../utils/Guids'

var wires = {
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
            delete wires[curWire].endOnPort;
            wires[curWire].toX = posX;
            wires[curWire].toY = posY;
            break;
        case 'from_end':
            delete wires[curWire].beginOnPort;
            wires[curWire].fromX = posX;
            wires[curWire].fromY = posY;
            break;
    }
}

function deleteSelectedWire(){
    Object.keys(wires).forEach(key => {
        if(wires[key].selected){
            delete wires[key];
        }
    });
}

function clickWire(wireId){
    if(wires[wireId]){
        wires[wireId].selected = !wires[wireId].selected;
    }
}

function cancelWire(){
    //console.log('Cancel Wire!!!!');
    if(state != 'idle'){
        deleteWire(curWire);
    }
}

function addVia(x, y){

    switch(state){
        case 'from_begin':
            if(wires[curWire]){
                let dX = 0;
                let dY = 0;
                let prevX = 0;
                let prevY = 0;
                if(wires[curWire].via.length == 0){
                    // Это если у нас первый сегмент
                    prevX = wires[curWire].fromX;
                    prevY = wires[curWire].fromY;
                } else {
                    let prevVia = wires[curWire].via[wires[curWire].via.length-1];
                    prevX =  prevVia.x;
                    prevY = prevVia.y;
                }
                //console.log('X:',x,'Y:',y,'pX:', prevX, 'pY:', prevY);

                dX = x - prevX;
                dY = y - prevY;

                if(Math.abs(dX) > Math.abs(dY)){
                    wires[curWire].via.push({x:x, y:prevY});
                } else {
                    wires[curWire].via.push({x:prevX, y:y});
                }
            }
            break;
        case 'from_end':
            if(wires[curWire]){
                wires[curWire].via.unshift({x:x, y:y});
            }
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
                beginBlock: blockId,
                endBlock: null,
                fromX: fromX,
                fromY: fromY,
                toX: fromX,
                toY: fromY,
                draft: true,
                selected: true,
                via: []
            };
            break;
        case 'from_end':
            // Закончили тянуть провод
            state = 'idle';
            wires[curWire].beginBlock = blockId;
            wires[curWire].fromX = fromX;
            wires[curWire].fromY = fromY;
            wires[curWire].draft = false;
            wires[curWire].selected = false;
            break;
    }
}

function cursorOnPortIn(portId, fromX, fromY){
    if(state == 'from_begin' && wires[curWire]){
        wires[curWire].toX = fromX;
        wires[curWire].toY = fromY;
        wires[curWire].endOnPort = portId;
    }
}

function addWireFromEnd(blockId, toX, toY){
    switch(state){
        case 'idle':
            // Начали тянуть провод
            state = 'from_end';
            curWire = getUniqueUUID();
            wires[curWire] = {
                beginBlock: null,
                endBlock: blockId,
                fromX: toX,
                fromY: toY,
                toX: toX,
                toY: toY,
                draft: true,
                selected: true,
                via: []
            };
            break;
        case 'from_begin':
            // Закончили тянуть провод
            state = 'idle';
            wires[curWire].endBlock = blockId;
            wires[curWire].toX = toX;
            wires[curWire].toY = toY;
            wires[curWire].draft = false;
            wires[curWire].selected = false;
            break;
    }
}

function deleteWire(wireId){
    state = 'idle';
    if(wires[wireId]){
        delete wires[wireId];
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
            break;
        case 'wire_cancel':
            cancelWire();
            emitChange();
            break;
        case 'wire_click':
            clickWire(action.wireId);
            emitChange();
            break;
        case 'wire_delete_selected':
            deleteSelectedWire();
            emitChange();
            break;
        case 'wire_add_via':
            addVia(action.x, action.y);
            emitChange();
            break;
        case 'wire_inport_cursor':
            cursorOnPortIn(action.blockId, action.x, action.y);
            emitChange();
            break;
    }
}

WireStore.dispatchToken = AppDispatcher.register(handleAction);

export default WireStore