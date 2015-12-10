/**
 * Created by svkior on 07.12.15.
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import assign from 'object-assign';

import generateUUID from '../utils/Guids'

var blocks = {
};

function removeBlock(blockId){
    if(blocks[blockId]){
        delete blocks[blockId];
        //console.log('OK!!');
    }
}

function addBlock(box, toX, toY){
    let guid = generateUUID();
    const left = toX;
    const top = toY;
    while(blocks[guid]){
        guid = generateUUID();
    }

    blocks[guid] = {
        top: top,
        left: left,
        box: box
    };
}

function moveBlock(blockId, toX, toY){
    if(blocks[blockId]){
        blocks[blockId].left = toX;
        blocks[blockId].top = toY;
    }
}

var CHANGE_EVENT = 'change';

function emitChange(){
    BlockStore.emit(CHANGE_EVENT);
}

var BlockStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener: function(cb){
        this.removeListener(CHANGE_EVENT, cb);
    },
    getBlocks(){
        return blocks;
    }
});

function handleAction(action){
    switch(action.type){
        case 'block_move':
            moveBlock(action.name, action.toX, action.toY);
            emitChange();
            break;
        case 'block_add':
            addBlock(action.blkType, action.toX, action.toY);
            emitChange();
            break;
        case 'block_remove':
            removeBlock(action.name);
            emitChange();
            break;
    }
}

BlockStore.dispatchToken = AppDispatcher.register(handleAction);

export default BlockStore