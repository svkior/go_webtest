/**
 * Created by svkior on 09.12.15.
 */
import React, {Component} from 'react'

import {Path} from '../../svg/svg';

import {ClickWire} from '../../../actions/WireActionCreators'

function addRectPath(fx, fy, tx, ty){
    let dx = tx - fx;
    let dy = ty - fy;

    if(dy < dx){
        return ` l ${dx/2} 0 l 0 ${dy} L ${tx} ${ty}`;
    } else {
        return ` l 0 ${dy/2} l ${dx} 0 L ${tx} ${ty}`;
    }
}

function addEndSquarePath(fx, fy, tx, ty){
    if(tx > fx){
        return ` L ${fx} ${ty} L ${tx} ${ty}`;
    }
    return ` L ${tx - 30} ${fy} L ${tx - 30} ${ty} L ${tx} ${ty}`;
}


function addLinePath(tx, ty){

    return ` L ${tx} ${ty}`;
}

class Wire extends Component {
    constructor(props){
        super(props);
        this.onWiresClick = this.onWiresClick.bind(this);
    }

    onWiresClick(){
        ClickWire(this.props.id);
    }

    render(){
        let {wire} = this.props;
        let d = `M ${wire.fromX} ${wire.fromY}`;
        let lastX = wire.fromX;
        let lastY = wire.fromY;
        let hasVia = false;

        wire.via.forEach( point => {
            hasVia = true;
            if(lastX == wire.fromX && wire.beginOnPort){
                d += addRectPath(lastX, lastY, point.x, point.y);
            } else {
                d += addLinePath(point.x, point.y);
            }
            lastX = point.x;
            lastY = point.y;
        });
        let signX = Math.sign(wire.toX - lastX);
        let signY = Math.sign(wire.toY - lastY);

        if(wire.draft){
            if(wire.endOnPort){
                if(hasVia){
                    d += addEndSquarePath(lastX, lastY, wire.toX, wire.toY);
                } else {
                    d += addRectPath(lastX, lastY, wire.toX, wire.toY);
                }
                d += `  l -10 -5 m 0 10 l 10 -5`;
            } else {
                d += addLinePath(wire.toX - 2*signX, wire.toY - 2*signY)
            }
        } else {
            if(hasVia){
                d += addEndSquarePath(lastX, lastY, wire.toX, wire.toY);
            } else {
                d += addRectPath(lastX, lastY, wire.toX, wire.toY);
            }
            d += `  l -10 -5 m 0 10 l 10 -5`;
        }

        return (<Path
                d={d}
                stroke={wire.selected ? 'orange' :'gray'}
                strokeWidth={3}
                fill='none'
                style={{
                   cursor: 'pointer'
                }}
                onClick={this.onWiresClick}
        />);
    }
}

export default Wire