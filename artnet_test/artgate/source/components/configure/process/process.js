/**
 * Created by svkior on 06.12.15.
 */

import React, {Component} from 'react';

import BoxList from './BoxList';
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
                <BoxList/>
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