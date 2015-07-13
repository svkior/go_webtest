
/** @jsx React.DOM **/

var PageHeader = ReactBootstrap.PageHeader,
    Label = ReactBootstrap.Label,
    Table = ReactBootstrap.Table;


var interfaces = [
    {name: "Ethernet ����", status: "������", desc: "192.168.7.103", bsStyle: "success"},
    {name: "ArtNet ����� �1", status: "������", desc: "��������� 0 �  ArtGate(10.2.3.4)", bsStyle: "success"},
    {name: "ArtNet ����� �2", status: "������", desc: "��� �����������", bsStyle: "warning"},
    {name: "ArtNet ����� �3", status: "��������", desc: "", bsStyle: "danger"},
    {name: "ArtNet ����� �4", status: "��������",desc: "", bsStyle: "danger"},
    {name: "ArtNet ���� �1", status: "������",desc: "��������� 3 �� Unknown(10.1.1.1)", bsStyle: "success"},
    {name: "ArtNet ���� �2", status: "������",desc: "��� ������� �������", bsStyle: "warning"},
    {name: "ArtNet ���� �3", status: "��������",desc: "", bsStyle: "danger"},
    {name: "ArtNet ���� �4", status: "��������",desc: "", bsStyle: "danger"},
    {name: "DMX ����� 1", status: "������",desc: "", bsStyle: "success"},
    {name: "DMX ����� 2", status: "������",desc: "", bsStyle: "success"},
    {name: "DMX ����� 3", status: "������",desc: "", bsStyle: "success"},
    {name: "DMX ����� 4", status: "��������",desc: "", bsStyle: "danger"},
    {name: "DMX ���� 1", status: "��������",desc: "", bsStyle: "danger"},
    {name: "DMX ���� 2", status: "��������",desc: "", bsStyle: "danger"},
    {name: "DMX ���� 3", status: "��������",desc: "", bsStyle: "danger"},
    {name: "DMX ���� 4", status: "��������",desc: "", bsStyle: "danger"}
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
                        ������ ����������
                    </PageHeader>
                    <Table striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th> ��������� </th>
                            <th className="text-center"> ������ </th>
                            <th className="text-center"> ����������</th>
                        </tr>
                        </thead>
                        <tbody>
                        {IfaceNodes}
                        </tbody>
                    </Table>
                    <footer>
                        <p> ���������� �������� ��������� </p>
                    </footer>
                </article>
                /*<ArtGateStatusMenu/>*/
            </div>

        );

    }
});