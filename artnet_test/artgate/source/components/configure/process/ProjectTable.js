/**
 * Created by svkior on 07.12.15.
 */

import React, {PropTypes, Component} from 'react';

import ItemTypes from './ItemTypes';
import {DropTarget} from 'react-dnd';

import ReactDOM from 'react-dom';

import Block from './Block';

import BlockStore from '../../../stores/BlockStore'

import {MoveCursor, AddVia} from '../../../actions/WireActionCreators'

import ProjectCanvas from './ProjectCanvas';



const style = {
    position: 'absolute',
    height: '36rem',
    width: '100%',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px dashed gray',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
    backgroundSize: '50px 50px'
};

function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

const boxTarget = {
    drop(props, monitor, component){
        //console.log('Client Offset: ', monitor.getClientOffset());
        //console.log('Source Client Offset', monitor.getSourceClientOffset());
        //console.log('Initial Client Offset', monitor.getInitialClientOffset());
        //console.log('getDifferenceFromInitialOffset: ', monitor.getDifferenceFromInitialOffset());
        let rDom = ReactDOM.findDOMNode(component);
        let rPos = getPosition(rDom);
        let cPos = monitor.getSourceClientOffset();
        let offset = {
            x: cPos.x - rPos.x,
            y: cPos.y - rPos.y
        };
        //console.log('DOM: ', getPosition(rDom));
        return {
            name: 'ProjectTable',
            delta: monitor.getDifferenceFromInitialOffset(),
            offset: offset
        };
    }
};

function collect(connect, monitor){
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}


function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         (el != null);
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent){

    }
    return {x: lx,y: ly};
}

class ProjectTable extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks: BlockStore.getBlocks()
        };
        this.onBlocksChange = this.onBlocksChange.bind(this);
        BlockStore.addChangeListener(this.onBlocksChange);
        this.myHandleMouseMove = this.myHandleMouseMove.bind(this);
        this.myHandleClick = this.myHandleClick.bind(this);
    }

    componentWillUnmount(){
        BlockStore.removeChangeListener(this.onBlocksChange);
    }

    onBlocksChange(){
        this.setState({
            blocks: BlockStore.getBlocks()
        });
    }

    myHandleClick(e){
        let node = ReactDOM.findDOMNode(this);
        let pos = getPos(node);
        //console.log('click: ',pos.x, pos.y);
        AddVia(e.clientX - pos.x, e.clientY - pos.y);
    }

    myHandleMouseMove(e){
        if(e.button != 0)
            return;
        let node = ReactDOM.findDOMNode(this);
        let pos = getPos(node);
        //console.log(pos.x, pos.y);
        MoveCursor(e.clientX - pos.x, e.clientY - pos.y);
    }

    render(){
        const {connectDropTarget, isOver, canDrop} = this.props;
        const {blocks} = this.state;
        return connectDropTarget(
            <div style={style} onMouseMove={this.myHandleMouseMove} onClick={this.myHandleClick}>
                <ProjectCanvas/>
                {Object.keys(blocks).map(key => {
                    const {left, top, name} = blocks[key];
                    return <Block key={key} id={key} left={left} top={top} name={name}/>;
                })}
            </div>
        );
    }
}

export default DropTarget([ItemTypes.BOX, ItemTypes.BLOCK], boxTarget, collect)(ProjectTable)