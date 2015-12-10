/**
 * Created by svkior on 08.12.15.
 */

import React, {Component} from 'react'

import {AddLineFromEnd, InPortCursor} from '../../../actions/WireActionCreators'

const style = {
    display: 'inline-block',
    borderRadius: "0 50% 50% 0",
    backgroundColor: "yellow",
    border: "1px solid yellow",
    width: 10,
    height: 10,
    cursor: 'crosshair'
};
function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         (el != null);
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent){
        if(el.offsetParent.className == 'anchor')
            return {x: lx, y: ly};

    }
    return {x: lx,y: ly};
}


class InPort extends Component{
    constructor(props){
        super(props);
        this.onPortClick = this.onPortClick.bind(this);
        this.onPortMove = this.onPortMove.bind(this);
    }

    onPortMove(e){
        e.stopPropagation();
        let posBegin = getPos(e.target);
        InPortCursor(this.props.id, posBegin.x, posBegin.y+5);
    }

    onPortClick(e){
        e.stopPropagation();
        let posBegin = getPos(e.target);
//        console.log('Pos: ', getPos(e.target));
        AddLineFromEnd(this.props.id, posBegin.x, posBegin.y+5);
    }

    render(){
        return (
            <div style={style} onClick={this.onPortClick} onMouseMove={this.onPortMove}>
            </div>
        );
    }
}

export default InPort