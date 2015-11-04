/**
 * Created by svkior on 04.11.15.
 */
import React from 'react'

var StatusNetwork = React.createClass({
    render(){
        return (
            <div className="col-md-9">
                <h4>Ethernet (TODO: Имя интерфейса) (TODO: Наличие линка):</h4>
                <ul>
                    <li>TODO: Тип IP: DHCP Client/DHCP Server/Manual</li>
                    <li>TODO: MAC Адрес:  00:00:00:00:00:00</li>
                    <li>TODO: IP Адрес:   000.000.000.000</li>
                    <li>TODO: IP Маска:   255.000.000.000</li>
                    <li>TODO: IP Шлюз:    010.000.000.001</li>
                    <li>TODO: DNS сервер: 010.000.000.001</li>
                    <li>TODO: NTP сервер: 010.000.000.001</li>
                </ul>
            </div>
        );
    }
});

export default StatusNetwork