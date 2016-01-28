/**
 * Created by svkior on 04.11.15.
 *
 *  Главноый файл прошивок для гейта
 *
 */

import React from 'react'
import ReactDOM from 'react-dom'
import Application from './components/Application.react'
import WSAPIUtils from './utils/WSAPIUtils'

WSAPIUtils.ConnectToWS();

ReactDOM.render(<Application/>, document.getElementById('artgate-application'));
