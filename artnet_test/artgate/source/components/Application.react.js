/**
 * Created by svkior on 04.11.15.
 *
 * Главный модуль.
 */

import React from 'react'

import {Router, Route, Link} from 'react-router'

import navBar from './nav/Navbar.react'
import ArtgateFooter from './nav/Footer.react'

import {createHistory, useBasename} from 'history'

const history = useBasename(createHistory)({basename:'/'});



var App = React.createClass({
    render(){
        return (
            <div className="container-fluid">
                {navBar}
                {this.props.children}
                <ArtgateFooter/>
            </div>
        );
    }
});

import AuthLogin from './auth/AuthLogin.react'
import Status from './Status.react'
import StatusNetwork from './StatusNetwork.react'
import StatusVersion from './StatusVersion.react'
import StatusArtnet from './StatusArtnet.react'
import StatusDMX from './StatusDMX.react'
import Configure from './Configure.react'
import ConfigureSelector from './configure/ConfigureSelector.react'
import ConfigureEthernet from './configure/ConfigureEthernet.react'
import ConfigureArtnet from './configure/ConfigureArtnet.react'
import ConfigureDMX from './configure/ConfigureDMX.react'
import ConfigureProcessing from './configure/ConfigureProcessing.react'
import ConfigureProcessing2 from './configure/ConfigureProcessing2.react'
import SaveNReboot from './SaveNReboot.react'
import Reboot from './Reboot.react'
import FirmwareUpgrade from './FirmwareUpgrade.react'

const routes = {
    path: '/',
    component: App,
    childRoutes: [
        {
            path: 'login',
            component: AuthLogin
        },{
            path: 'status',
            component: Status,
            childRoutes:[
                {
                    path: 'network', component: StatusNetwork
                },{
                    path: 'version', component: StatusVersion
                },{
                    path: 'artnet', component: StatusArtnet
                },{
                    path: 'dmx', component: StatusDMX
                }
            ]
        },{
            path: 'configure',
            component: Configure,
            childRoutes: [
                {path: 'configurations', component: ConfigureSelector},
                {path: 'ethernet', component: ConfigureEthernet},
                {path: 'artnet', component: ConfigureArtnet},
                {path: 'dmx', component: ConfigureDMX},
                {path: 'processing', component: ConfigureProcessing},
                {path: 'processing2', component: ConfigureProcessing2}
            ]
        },{path: 'save-n-reboot', component: SaveNReboot},
        {path: 'reboot', component: Reboot},
        {path: 'firmware-upgrade', component: FirmwareUpgrade }
    ]
};


var Application = React.createClass({
    render(){
        return <Router history={history} routes={routes}/>;
    }
});

export default Application