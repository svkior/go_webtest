/**
 * Created by svkior on 04.11.15.
 */
import React from 'react'

var StatusDMX = React.createClass({
    render(){
        return (
            <div className="col-md-9">
                <h4>DMX (TODO: Имя интерфейса) (TODO: версия):</h4>
                <ul>
                    <li>
                        TODO: DMX TX 0
                        <ul>
                            <li>TODO: Тип протокола</li>
                            <li>TODO: Активность интерфейса</li>
                            <li>
                                TODO: Список абонентов для порта (Если BiDMX)
                                <ul>
                                    <li>TODO: id $1</li>
                                    <li>TODO: ShortName</li>
                                    <li>TODO: Статус работы</li>
                                </ul>
                            </li>


                        </ul>
                    </li>
                    <li>
                        TODO: DMX TX 1
                    </li>
                    <li>
                        TODO: .....
                    </li>
                </ul>
            </div>
        );
    }
});

export default StatusDMX