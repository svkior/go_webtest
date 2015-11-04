/**
 * Created by svkior on 04.11.15.
 */
import React from 'react'

import CollectionStore from '../stores/CollectionStore'

import ArtPortList from './status/ArtPortList'

var StatusArtnet = React.createClass({
    getInitialState: function(){
        return {
            config: CollectionStore.getCollection('config')
        }
    },
    componentDidMount(){
        CollectionStore.addChangeListener('config', this.onConfigChange);
    },
    componentWillUnmount(){
        CollectionStore.removeChangeListener('config', this.onConfigChange);
    },
    onConfigChange(){
        this.setState({
            config: CollectionStore.getCollection('config')
        });
    },
    render(){
        var vers;
        var ports;
        if(this.state.config && this.state.config.artnet){
            var cfg = this.state.config.artnet;

            vers = cfg.version ? cfg.version : "НЕ ОПРЕДЕЛЕНА";
            ports = cfg.Ports ? cfg.Ports : [];
        }
        return (
            <div className="col-md-9">
                <h4>ArtNet (TODO: Имя интерфейса) Версия протокола: {vers}</h4>
                <ArtPortList ports={ports}/>

            </div>
        );
    }
});

export default StatusArtnet