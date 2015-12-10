/**
 * Created by svkior on 06.12.15.
 */

import React, {Component} from 'react';
import ItemTypes from './ItemTypes';
import {DragSource} from 'react-dnd';

import {AddBlock} from '../../../actions/BlockActionCreators'

const style = {
    border: '1px dashed gray',
    backgoundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'copy',
    float: 'left'
};

const boxSource = {
    beginDrag(props){
        return {
            box: props.box
        };
    },
    endDrag(props, monitor){
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if(dropResult){
            //console.log('Drop: ', dropResult);
            //console.log('Item: ', item);
            AddBlock(item.box, dropResult.offset.x, dropResult.offset.y);
        }
    }
};

function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class Box extends Component{
    render(){
        const { connectDragSource, isDragging} = this.props;

        return connectDragSource(<div style={style}>
            {this.props.box.name}
        </div>);
    }
}

export default DragSource(ItemTypes.BOX, boxSource, collect)(Box);