/**
 * Created by svkior on 04.11.15.
 */

import React from 'react'
import {Link} from 'react-router'

const StatusSideBar = (

    <ul>
        <li>
            <Link to="/status/version">Версия ПО</Link>
        </li>
        <li>
            <Link to="/status/network">Ethernet</Link>
        </li>
        <li>
           <Link to="/status/artnet">ArtNet</Link>
        </li>
        <li>
            <Link to="/status/dmx">DMX</Link>
        </li>
    </ul>
);

export default StatusSideBar
