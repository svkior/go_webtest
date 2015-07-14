
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
    getInitialState: function(){
        return {interfaces: []};
    },
    componentDidMount: function(){
        $.get("http://localhost:8080/api/status", function(result){
            if(this.isMounted()){
                //console.log(result);
                var lSt = [];
                // Статус ETH
                ethString = "IP:"+ result.Eth.IpAddress
                    +" Msk:" + result.Eth.IpMask + " Gw:" + result.Eth.IpGw + " Mac:" + result.Eth.Mac;
                lSt.push({name:"Ethernet0", status:"ВКЛЮЧЕН", desc: ethString, bsStyle: "success"});
                // Входы ArtNet
                var numArtInputs = result.ArtnetInputs;
                for(var i=0; i<numArtInputs; i++){
                    var artIn = result.ArtIns[i];
                    lSt.push({
                        name:"ArtNet In" + i,
                        status: artIn.Enabled ? "ВКЛЮЧЕН": "ОТКЛЮЧЕН",
                        desc: "Universe: " + artIn.Universe,
                        bsStyle: artIn.Enabled ? "success" :"warning"
                    })
                }
                // Выходы ArtNet
                var numArtOutputs = result.ArtnetOutputs;
                for(i=0; i<numArtOutputs; i++){
                    var artOut = result.ArtOuts[i];
                    lSt.push({
                        name:"ArtNet Out" + i,
                        status: artOut.Enabled ? "ВКЛЮЧЕН": "ОТКЛЮЧЕН",
                        desc: "Universe: " + artOut.Universe,
                        bsStyle: artOut.Enabled ? "success" :"warning"
                    })

                }

                this.setState({interfaces: lSt});
            }
        }.bind(this));
    },
    render(){
        var IfaceNodes = this.state.interfaces.map(function(iface){
            return <InterfaceStatus
                name={iface.name}
                status={iface.status}
                bsStyle={iface.bsStyle}
                desc={iface.desc}
                />
        });
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