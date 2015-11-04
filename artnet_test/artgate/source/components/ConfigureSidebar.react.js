/**
 * Created by svkior on 04.11.15.
 */

import React from 'react'
import {Link} from 'react-router'

const ConfigureSideBar = (
    <ul>
        <li>
            <Link to="/configure/configurations">Конфигурации</Link>
        </li>
        <li>
            <Link to="/configure/ethernet">Ethernet</Link>
        </li>
        <li>
            <Link to="/configure/artnet">ArtNet</Link>
        </li>
        <li>
            <Link to="/configure/dmx">DMX</Link>
        </li>
        <li>
            <Link to="/configure/processing">Процессинг</Link>
        </li>
    </ul>
);

export default ConfigureSideBar