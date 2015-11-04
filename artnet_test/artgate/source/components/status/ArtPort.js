/**
 * Created by svkior on 04.11.15.
 */

import React from 'react'

export default React.createClass({
    render(){
        var port = this.props.port;
        var universe = port.universe;
        var type = port.type;
        return (
        <ul>
            <li>ArtNet {type}</li>
            <li>Номер потока {universe}</li>
            <li>TODO: Активность интерфейса</li>
            <li>
                TODO: Список абонентов для порта
                <ul>
                    <li>TODO: IP: 000.000.000.000</li>
                    <li>TODO: ShortName</li>
                    <li>TODO: Статус работы</li>
                </ul>
            </li>
        </ul>
        );
    }
});