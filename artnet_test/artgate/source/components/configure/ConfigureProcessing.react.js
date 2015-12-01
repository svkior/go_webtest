/**
 * Created by svkior on 04.11.15.
 */

import React from 'react'

import ExStage from './art/art_test1'
import Chess from './dnd/chess';

var ConfigureProcessing = React.createClass({
    render(){
        return (
            <div className="col-md-9">
                {/*<ExStage height="500" width="500"/>*/}
                <Chess/>
                <h4>Настройка Processing</h4>
                <p>TODO: Список операторов</p>
                <p>TODO: Редактор примитивов</p>
                <p>TODO: Соединитель интерфейсов</p>
                <p>TODO: Блоки Javascript</p>
                <p>TODO: Переименование блоков</p>
                <p>TODO: Добавление новых блоков</p>
                <p>TODO: Мультиплексоры</p>
                <p>TODO: Демультиплексоры</p>
            </div>
        )
    }
});

export default ConfigureProcessing
