/**
 * Created by svkior on 04.11.15.
 */

import React from 'react'

import ArtPort from './ArtPort'

export default React.createClass({
    getListOfPortIds(){
        if(this.props.ports)
            return Object.keys(this.props.ports);
        return [];
    },
    getPortElement(portId){
        var port = this.props.ports[portId];
        var portElement;

        portElement = (
            <ArtPort port={port}/>
        );

        return <li key={portId}>{portElement}</li>;
    },
    render(){
        var PortElements = this.getListOfPortIds().map(this.getPortElement);
        return (
        <ul>
            {PortElements}
        </ul>

        );
    }
});