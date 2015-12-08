/**
 * Created by svkior on 08.12.15.
 */

import AppDispatcher from '../dispatcher/AppDispatcher'

module.exports = {
    AddLineFromBegin: function(blockId, toX, toY){
        var action = {
            type: 'wire_add_from_begin',
            blkId: blockId,
            toX: toX,
            toY: toY
        };
        //console.log('AddLineFromBegin:', action);
        AppDispatcher.dispatch(action);
    },
    AddLineFromEnd: function(blockId, toX, toY){
        var action = {
            type: 'wire_add_from_end',
            blkId: blockId,
            toX: toX,
            toY: toY
        };
        AppDispatcher.dispatch(action);
    },
    MoveCursor: function(posX, posY){
        var action = {
            type: 'wire_move_cursor',
            posX: posX,
            posY: posY
        };
        AppDispatcher.dispatch(action);
    }
};
