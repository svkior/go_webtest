/**
 * Created by svkior on 06.12.15.
 */

import React, {Component} from 'react';
import ItemTypes from './ItemTypes';
import {DragSource} from 'react-dnd';

import {MoveBlock} from '../../../actions/BlockActionCreators'
import {RemoveBlock} from '../../../actions/BlockActionCreators';

import OutPort from './OutPort'
import InPort from './InPort'


const blockSource = {
    beginDrag(props){
        return {
            name: props.name,
            left: props.left,
            top: props.top,
            id: props.id
        };
    },
    endDrag(props, monitor, component){
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();
        const pixRound = 10;

        if(dropResult){
            const bLeft = Math.round((item.left + dropResult.delta.x)/pixRound)*pixRound;
            const bTop = Math.round((item.top + dropResult.delta.y)/pixRound)*pixRound;
            MoveBlock(item.id, bLeft, bTop);
        }
    }
};

function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class Block extends Component{
    constructor(props){
        super(props);
        this.handleClose = this.handleClose.bind(this);

    }

    handleClose(e){
        e.preventDefault();
        RemoveBlock(this.props.id);
    }

    render(){
        const { connectDragSource, isDragging} = this.props;
        if(isDragging)
            return null;

        return connectDragSource(
            <div className="panel panel-primary" width="100px" style={{
                position: 'absolute',
                left: this.props.left,
                top: this.props.top
            }}>
                <div className="panel-heading clearfix">
                    <div className="panel-title pull-left" style={{
                        paddingTop: '7.5px',
                        cursor: 'move'
                    }}>
                        {this.props.name}
                    </div>
                    <div className="btn-group pull-right">
                        <a href="#" className="btn btn-default btn-sm" onClick={this.handleClose}>
                            x
                        </a>
                    </div>
                </div>
                <table className="table table-condensed">
                    <tbody>
                    <tr>
                        <td><InPort id={this.props.id}/> Inp</td>
                        <td>Val1</td>
                        <td>Out <OutPort id={this.props.id}/></td>
                    </tr>
                    </tbody>
                </table>
            </div>


);
    }
}

export default DragSource(ItemTypes.BLOCK, blockSource, collect)(Block);