
/** @jsx React.DOM **/

var ButtonInput = ReactBootstrap.ButtonInput;

var ArtGateSetupEthernet = React.createClass({
    loadEthFromServer: function(){
        $.ajax({
            url: "http://localhost:8080/api/status",
            dataType: 'json',
            cache: false,
            success: function(data){
                this.setState(data.Eth);
            }.bind(this),
            error: function(xhr, status, err){
                console.error("/api/status", status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function(){
        return {
            IpAddress: "-1",
            IpMask: "-1",
            IpGw: "-1",
            Mac: "-1"
        };
    },
    componentDidMount: function(){
        this.loadEthFromServer();
        //setInterval(this.loadEthFromServer, 2000);
    },
    handleSubmit: function(e){
        //console.log(JSON.stringify(this.state));
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/setup/ethernet",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            async: true,
            data: JSON.stringify(this.state),
            success: function(){

            }.bind(this),
            error: function(xhr, status, err){
                console.log(err.toString());
                //console.error(xhr.responseText, status, err.toString());
            }.bind(this)
        });
    },
    changeIp: function(ip){
        //console.log("Can change ", ip);
        this.setState({IpAddress: ip});
    },
    changeIpMask: function(ip){
        //console.log("Can change ", ip);
        this.setState({IpMask: ip});
    },
    changeIpGw: function(ip){
        //console.log("Can change ", ip);
        this.setState({IpGw: ip});
    },
    changeMac: function(mac){
        this.setState({Mac: mac})
    },
    render(){
        return (
            <div className="content">
                <h2> Изменение параметров Ethernet</h2>
                <form className="setupForm" onSubmit={this.handleSubmit}>
                    <ArtGateSetupEditor name="IP Адрес" value={this.state.IpAddress} onChange={this.changeIp} />
                    <ArtGateSetupEditor name="IP Маска" value={this.state.IpMask} onChange={this.changeIpMask} />
                    <ArtGateSetupEditor name="IP Маршрутизатор" value={this.state.IpGw} onChange={this.changeIpGw} />
                    <ArtGateSetupEditor name="MAC Адрес" value={this.state.Mac} onChange={this.changeMac} />
                    <ButtonInput type="submit" value="Обновить" />
                </form>
            </div>
            );
        }
});