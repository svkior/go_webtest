
/** @jsx React.DOM **/

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
            <tr>
                <td>
                    {this.props.name}
                </td>
                <td className="text-center">
                    <Label bsStyle={this.props.bsStyle}> {this.props.status} </Label>
                </td>
                <td>
                    {this.props.desc}
                </td>
            </tr>
        );
    }
});

var ArtGateStatus = React.createClass({
    mixins: [Reflux.connect(SetupStore, "setup")],
    render(){

        var IfaceNodes = [];
        if(this.state.setup){
            // Статус ETH
            ethString = "IP:" + this.state.setup.Eth.IpAddress
                + " Msk:" + this.state.setup.Eth.IpMask
                + " Gw:" + this.state.setup.Eth.IpGw
                + " Mac:" + this.state.setup.Eth.Mac;
            IfaceNodes.push(
                <InterfaceStatus
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
                        name={"ArtNet Out" + i}
                        status={artOut.Enabled ? "ВКЛЮЧЕН" : "ОТКЛЮЧЕН"}
                        bsStyle={artOut.Enabled ? "success" : "warning"}
                        desc={"Universe: " + artOut.Universe}
                        />
                );
            }

        }

        return (
            <div className="content">
                <article role="main">
                    <PageHeader>
                        Статус Устройства
                    </PageHeader>
                    <Table striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th> Интерфейс </th>
                            <th className="text-center"> Статус </th>
                            <th className="text-center"> Примечание</th>
                        </tr>
                        </thead>
                        <tbody>
                        {IfaceNodes}
                        </tbody>
                    </Table>
                    <footer>
                        <p> Устройство работает нормально </p>
                    </footer>
                </article>
            </div>
        );
    }
});