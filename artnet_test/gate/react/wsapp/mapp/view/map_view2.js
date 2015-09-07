/**
 * Created by svkior on 18/08/15.
 * MAP VIew
 */

import React from 'react'
import Reflux from 'reflux'

//import MapActions from "../actions/map_actions.js"
//import MapStore from "../store/map_store.js"


import {Surface,Group,Text} from 'react-art'
import Circle from 'react-art/shapes/circle.js'
import Rectangle from 'react-art/shapes/rectangle.js'



import {PanelGroup, Panel} from 'react-bootstrap'




var DraggedBox = React.createClass({
    getInitialState(){
      return {
          x: this.props.x,
          y: this.props.y
      }
    },
    handleMouseDown(e){
        this.dragging = true;
        this.coords = {
            x: e.pageX,
            y: e.pageY
        }
    },
    handleMouseUp(){
        this.state.x = Math.round(this.state.x*0.1)*10;
        this.state.y = Math.round(this.state.y*0.1)*10;
        this.dragging = false;
        this.setState(this.state);
    },
    handleMouseMove(e){
        if(this.dragging){
            e.preventDefault();
            var xDiff = this.coords.x - e.pageX;
            var yDiff = this.coords.y - e.pageY;

            this.coords.x = e.pageX;
            this.coords.y = e.pageY;

            this.state.x = this.state.x - xDiff;
            this.state.y = this.state.y - yDiff;
            this.setState(this.state);

        }
    },
    render(){
        return (
            <Group
                x={this.state.x}
                y={this.state.y}
                width={50}
                height={50}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseMove={this.handleMouseMove}
                >
                <Rectangle
                    x = {0}
                    y = {0}
                    width={50}
                    height={50}
                    fill="blue"
                    />
                <Text
                    x = {5}
                    y = {5}
                    />
                </Group>
            );
    }
});

var MapEditor = React.createClass({
    render(){

        return (
            <Surface height={400} width={600}>
                <DraggedBox x={80} y={30} />
                <DraggedBox x={230} y={30}/>
            </Surface>
        );
    }
});

export default MapEditor