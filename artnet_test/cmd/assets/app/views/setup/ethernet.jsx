
/** @jsx React.DOM **/

var ButtonInput = ReactBootstrap.ButtonInput;

var ArtGateSetupEthernet = React.createClass({
    mixins: [
        Reflux.connect(SetupStore, 'setup')
    ],
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
            <div className="content">
                <h2> Изменение параметров Ethernet</h2>
                <form className="setupForm" onSubmit={SetupActions.uploadEthernet}>
                    <ArtGateSetupEditor name="IP Адрес" value={ipAddr} onChange={SetupActions.setIp}/>
                    <ArtGateSetupEditor name="IP Маска" value={ipMask} onChange={SetupActions.setMask}/>
                    <ArtGateSetupEditor name="IP Маршрутизатор" value={ipGw} onChange={SetupActions.setGw}/>
                    <ArtGateSetupEditor name="MAC Адрес" value={ipMac} onChange={SetupActions.setMac}/>
                    <ButtonInput type="submit" value="Обновить"/>
                </form>
            </div>
            );
        }
});