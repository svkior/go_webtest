/**
 * Created by svkior on 10.12.15.
 */

import React, {Component} from 'react';

import Box from './Box'
import BoxStore from '../../../stores/BoxStore'

class BoxList extends Component{
    constructor(props){
        super(props);
        this.state = {
            boxes: BoxStore.getBoxes()
        };
        this.onBoxesChange = this.onBoxesChange.bind(this);
        BoxStore.addChangeListener(this.onBoxesChange);
    }

    componentWillUnmount(){
        BoxStore.removeChangeListener(this.onBoxesChange);
    }

    onBoxesChange(){
        this.setState({
            boxes: BoxStore.getBoxes()
        });
    }

    render(){
        const {boxes} = this.state;
        return (
            <div style={{overflow:'hidden', clear: 'both'}}>
                {boxes ? Object.keys(boxes).map(key => {
                    return <Box key={key} id={key} box={boxes[key]} />;
                }) : ""}
            </div>
        );
    }
}

export default BoxList