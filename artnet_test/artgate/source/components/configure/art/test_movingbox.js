/**
 * Created by svkior on 07.11.15.
 */
import React from 'react'

let ReactART = require('react-art');

let Group = ReactART.Group;
let Shape = ReactART.Shape;


export default React.createClass({
    getInitialState(){
        return {
            x:100,
            y:100,
            curX: 0,
            curY: 0,
            dragging: false
        }
    },
    handleMouseDown(evt){
        console.log("Down: ", evt);
        this.setState({
            curX: evt.x,
            curY: evt.y,
            dragging: true
        });
    },
    handleMouseUp(evt){
        console.log("Up: ", evt);
        this.setState({
            dragging: false
        })
    },
    handleMouseMove(evt){
        if(this.state.dragging){
            let deltaX = evt.x - this.state.curX;
            let deltaY = evt.y - this.state.curY;
            console.log("Dx:", deltaX, " Dy: ", deltaY);
            this.setState({
                x: this.state.x + deltaX,
                y: this.state.y + deltaY
            });
        }
    },
    render(){
        let x = this.state.x;
        let y = this.state.y;
        return (
            <Group
                x={x}
                y={y}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseMove={this.handleMouseMove}
            >
                <Shape
                    stroke="#888888"
                    fill="#777777"
                    d="M 0,0 l 0,100 l 100,0 l 0,-100 Z"
                    />
            </Group>
        )
    }
});