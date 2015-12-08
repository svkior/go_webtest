/**
 * Created by svkior on 07.12.15.
 */

import AppDispatcher from '../dispatcher/AppDispatcher'

module.exports = {
    MoveBlock: function(blockId, toX, toY){
        var action = {
            type: 'block_move',
            name: blockId,
            toX: toX,
            toY: toY
        };
        AppDispatcher.dispatch(action);
    },
    AddBlock: function(blockType, toX, toY){
        var action = {
            type:'block_add',
            blkType: blockType,
            toX: toX,
            toY: toY
        };
        AppDispatcher.dispatch(action);
    },
    RemoveBlock: function(blockId){
        var action = {
            type: 'block_remove',
            name: blockId
        };
        //console.log('Action:', action);
        AppDispatcher.dispatch(action);
    }
};
