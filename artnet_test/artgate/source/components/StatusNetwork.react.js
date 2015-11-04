/**
 * Created by svkior on 04.11.15.
 */
import React from 'react'


import CollectionStore from '../stores/CollectionStore'

var StatusNetwork = React.createClass({
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
        console.log('StatusNetwork: ',this.state.config);
        var netConfig;
        var ipType;
        var ipAddr;
        var ipMask;
        var Mac;
        var gw;
        var dns;
        var ntp;
        var dnsEnabled = false;
        var ntpEnabled = false;
        var iface;
        if(this.state.config && this.state.config.ethernet){
            netConfig = this.state.config.ethernet;
            iface = netConfig.interface ? netConfig.interface : "НЕ ОПРЕДЕЛЕНО";
            ipType = netConfig.ipType ? netConfig.ipType : "НЕ ОПРЕДЕЛЕНО";
            ipAddr = netConfig.Addr ? netConfig.Addr: "НЕ ОПРЕДЕЛЕНО";
            ipMask = netConfig.Mask ? netConfig.Mask: "НЕ ОПРЕДЕЛЕНО";
            Mac = netConfig.MAC ? netConfig.MAC: "НЕ ОПРЕДЕЛЕНО";
            gw = netConfig.Gw ? netConfig.Gw : "НЕ ОПРЕДЕЛЕНО";

            dnsEnabled = netConfig.EnableDNS ? true : false;
            ntpEnabled = netConfig.EnableNPT ? true : false;
            dns = dnsEnabled && netConfig.DNS ? netConfig.DNS : "ОТКЛЮЧЕНО";
            ntp = ntpEnabled && netConfig.NTP ? netConfig.NTP : "ОТКЛЮЧЕНО";
        }
        return (
            <div className="col-md-9">
                <h4>Ethernet {iface} (TODO: Наличие линка):</h4>
                <ul>
                    <li>Конфигурация сети: {ipType}</li>
                    <li>MAC Адрес:  {Mac}</li>
                    <li>IP Адрес:   {ipAddr}</li>
                    <li>IP Маска:   {ipMask}</li>
                    <li>IP Шлюз:    {gw}</li>
                    <li>DNS сервер: {dns}</li>
                    <li>NTP сервер: {ntp}</li>
                </ul>
            </div>
        );
    }
});

export default StatusNetwork