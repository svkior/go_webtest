/**
 * Created by svkior on 08.12.15.
 */

import React, {Component} from 'react'

import {AddLineFromBegin} from '../../../actions/WireActionCreators'

const style = {
    display: 'inline-block',
    borderRadius: "50% 0 0 50%",
    backgroundColor: "green",
    width: 10,
    height: 10,
    cursor: 'crosshair'
};

function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         (el != null);
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent){
        //console.log('Element:', el.className);
        if(el.offsetParent.className == 'anchor')
            return {x: lx, y: ly};

    }
    return {x: lx,y: ly};
}

class OutPort extends Component{
    constructor(props){
        super(props);
        this.onPortClick = this.onPortClick.bind(this);
    }

    onPortClick(e){
        e.preventDefault();
        let posBegin = getPos(e.target);
        //console.log('Event: ',e);
        //console.log('Client: ',e.clientX, e.clientY);
        console.log('Pos: ', getPos(e.target));
        AddLineFromBegin(this.props.id,posBegin.x,posBegin.y);
    }

    render(){
        return (
            <div style={style} onClick={this.onPortClick}>
            </div>
        );
    }
}

export default OutPort