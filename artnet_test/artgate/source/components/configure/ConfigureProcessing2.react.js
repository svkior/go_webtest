/**
 * Created by svkior on 04.11.15.
 */

import React from 'react'

import Chess from './dnd/chess';

var ConfigureProcessing = React.createClass({
    render(){
        return (
            <div className="col-md-10">
                <Chess/>
            </div>
        )
    }
});

export default ConfigureProcessing
