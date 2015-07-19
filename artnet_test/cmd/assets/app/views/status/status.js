
var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Reflux = require('reflux');

var SetupStore = require('../../store/setup_store.jsx').SetupStore;

var PageHeader = ReactBootstrap.PageHeader,
    Label = ReactBootstrap.Label,
    Table = ReactBootstrap.Table;

/*
var interfaces = [
    {name: "ArtNet Вход №4", status: "ОТКЛЮЧЕН",desc: "", bsStyle: "danger"},
    {name: "DMX Выход 3", status: "РАБОТА",desc: "", bsStyle: "success"},
    {name: "DMX Выход 4", status: "ОТКЛЮЧЕН",desc: "", bsStyle: "danger"}
];
*/

var InterfaceStatus = React.createClass({
    render(){
        return (
            <div className="ag-status panel panel-default">
                <div className="panel-header">
                    {this.props.name}<br/><Label bsStyle={this.props.bsStyle}>{this.props.status}</Label>
                </div>
                <div className="panel-body">

                    {this.props.desc}
                </div>
            </div>
        );
    }
});

var ArtGateStatus = React.createClass({
    mixins: [Reflux.connect(SetupStore, "setup")],
    render(){

        var IfaceNodes = [];
        if(this.state.setup){
            // Статус ETH
            var ethString = <ul>
                    <li>IP:{this.state.setup.Eth.IpAddress}</li>
                    <li> Msk:{this.state.setup.Eth.IpMask}</li>
                    <li> Gw:{this.state.setup.Eth.IpGw}</li>
                    <li> Mac:{this.state.setup.Eth.Mac}</li>
                </ul>;
            IfaceNodes.push(
                <InterfaceStatus
                    key={IfaceNodes.length}
                    name="Ethernet0"
                    status="ВКЛЮЧЕН"
                    bsStyle="success"
                    desc={ethString}
                    />
            );
            // Входы ArtNet
            for (var i = 0; i < this.state.setup.ArtIns.length; i++) {
                var artIn = this.state.setup.ArtIns[i];
                IfaceNodes.push(
                    <InterfaceStatus
                        key={IfaceNodes.length}
                        name={"ArtNet In" + i}
                        status={artIn.Enabled ? "ВКЛЮЧЕН" : "ОТКЛЮЧЕН"}
                        bsStyle={artIn.Enabled ? "success" : "warning"}
                        desc={"Universe: " + artIn.Universe}
                        />
                );
            }
            // Выходы ArtNet
            for (i = 0; i < this.state.setup.ArtOuts.length; i++) {
                var artOut = this.state.setup.ArtOuts[i];
                IfaceNodes.push(
                    <InterfaceStatus
                        key={IfaceNodes.length}
                        name={"ArtNet Out" + i}
                        status={artOut.Enabled ? "ВКЛЮЧЕН" : "ОТКЛЮЧЕН"}
                        bsStyle={artOut.Enabled ? "success" : "warning"}
                        desc={"Universe: " + artOut.Universe}
                        />
                );
            }

        }
        return (
            <div className="row">
                <div className="panel-body ag-setup-container">
                    <div className="ag-setup panel panel-default">
                        <h3>Статус</h3>
                    </div>
                </div>
                <div className="panel-body ag-setup-container">
                    {IfaceNodes}
                </div>
            </div>
        );
    }
});

module.exports.ArtGateStatus = ArtGateStatus;