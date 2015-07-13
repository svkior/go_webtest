
/** @jsx React.DOM **/

var PageHeader = ReactBootstrap.PageHeader,
    Label = ReactBootstrap.Label,
    Table = ReactBootstrap.Table;


var interfaces = [
    {name: "Ethernet порт", status: "РАБОТА", desc: "192.168.7.103", bsStyle: "success"},
    {name: "ArtNet Выход №1", status: "РАБОТА", desc: "Вселенная 0 в  ArtGate(10.2.3.4)", bsStyle: "success"},
    {name: "ArtNet Выход №2", status: "РАБОТА", desc: "Нет подписчиков", bsStyle: "warning"},
    {name: "ArtNet Выход №3", status: "ОТКЛЮЧЕН", desc: "", bsStyle: "danger"},
    {name: "ArtNet Выход №4", status: "ОТКЛЮЧЕН",desc: "", bsStyle: "danger"},
    {name: "ArtNet Вход №1", status: "РАБОТА",desc: "Вселенная 3 из Unknown(10.1.1.1)", bsStyle: "success"},
    {name: "ArtNet Вход №2", status: "РАБОТА",desc: "НЕТ Входных Пакетов", bsStyle: "warning"},
    {name: "ArtNet Вход №3", status: "ОТКЛЮЧЕН",desc: "", bsStyle: "danger"},
    {name: "ArtNet Вход №4", status: "ОТКЛЮЧЕН",desc: "", bsStyle: "danger"},
    {name: "DMX Выход 1", status: "РАБОТА",desc: "", bsStyle: "success"},
    {name: "DMX Выход 2", status: "РАБОТА",desc: "", bsStyle: "success"},
    {name: "DMX Выход 3", status: "РАБОТА",desc: "", bsStyle: "success"},
    {name: "DMX Выход 4", status: "ОТКЛЮЧЕН",desc: "", bsStyle: "danger"},
    {name: "DMX Вход 1", status: "ОТКЛЮЧЕН",desc: "", bsStyle: "danger"},
    {name: "DMX Вход 2", status: "ОТКЛЮЧЕН",desc: "", bsStyle: "danger"},
    {name: "DMX Вход 3", status: "ОТКЛЮЧЕН",desc: "", bsStyle: "danger"},
    {name: "DMX Вход 4", status: "ОТКЛЮЧЕН",desc: "", bsStyle: "danger"}
];

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
        return {interfaces: interfaces};
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
                /*<ArtGateStatusMenu/>*/
            </div>

        );

    }
});