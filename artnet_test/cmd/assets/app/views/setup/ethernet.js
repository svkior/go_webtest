
var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Reflux = require('reflux');

var SetupStore = require('../../store/setup_store.jsx').SetupStore;
var SetupActions = require('../../actions/setup_actions.jsx').SetupActions;

var ArtGateSetupEditor = require('../../helpers/forms/editors').ArtGateSetupEditor;


var ButtonInput = ReactBootstrap.ButtonInput;

var ArtGateSetupEthernet = React.createClass({
    mixins: [
        Reflux.connect(SetupStore, 'setup')
    ],
    onSubmit: function(e){
        e.preventDefault();
        SetupActions.uploadEthernet();
    },
    render(){
        var ipAddr;
        var ipMask;
        var ipGw;
        var ipMac;

        if(this.state.setup){

            ipAddr = this.state.setup.Eth.IpAddress;
            ipMask = this.state.setup.Eth.IpMask;
            ipGw = this.state.setup.Eth.IpGw;
            ipMac = this.state.setup.Eth.Mac;
        } else {
            ipAddr = "НЕТ СВЯЗИ С СЕРВЕРОМ";
            ipMask = ipAddr;
            ipGw = ipMask;
            ipMac = ipGw;
        }
        return (
            <div className="row">
                <form onSubmit={this.onSubmit}>

                    <div className="panel-body ag-setup-container">
                        <div className="ag-setup panel panel-default">
                            <h3>Параметры Etherner</h3>
                        </div>
                        
                        <ArtGateSetupEditor name="IP Адрес" value={ipAddr} onChange={SetupActions.setIp}/>
                        <ArtGateSetupEditor name="IP Маска" value={ipMask} onChange={SetupActions.setMask}/>
                        <ArtGateSetupEditor name="IP Маршрутизатор" value={ipGw} onChange={SetupActions.setGw}/>
                        <ArtGateSetupEditor name="MAC Адрес" value={ipMac} onChange={SetupActions.setMac}/>

                        <div className="ag-setup-buttons panel panel-default">
                            <div className="panel-body">
                                <ButtonInput type="submit" value="Обновить"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            );
        }
});
module.exports.ArtGateSetupEthernet = ArtGateSetupEthernet;