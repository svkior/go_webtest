/**
 * Created by svkior on 06.12.15.
 */

import React, {Component} from 'react';

import Box from './Box';
import ProjectTable from './ProjectTable';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


class Process extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
            <div>
                <div style={{overflow:'hidden', clear: 'both'}}>
                    <Box name="IP"/>
                    <Box name="DMX In"/>
                    <Box name="DMX Out"/>
                    <Box name="Art In"/>
                    <Box name="Art Out"/>
                    <Box name="Block"/>
                </div>
            </div>
            <div>
                <div style={{position: 'relative'}} className="anchor">
                    <ProjectTable/>
                </div>
            </div>
        </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Process)