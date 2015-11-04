/**
 * Created by svkior on 04.11.15.
 */
import React from 'react'

var StatusArtnet = React.createClass({
    render(){
        return (
            <div className="col-md-9">
                <h4>ArtNet (TODO: Имя интерфейса) (TODO: версия):</h4>
                <ul>
                    <li>
                        TODO: ArtNet TX 0
                        <ul>
                            <li>TODO: Номер вселенной</li>
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
                    </li>
                    <li>
                        TODO: ArtNet TX 1
                    </li>
                    <li>
                        TODO: .....
                    </li>
                </ul>
            </div>
        );
    }
});

export default StatusArtnet