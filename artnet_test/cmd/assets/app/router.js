/**
 * Created by svkior on 20/07/15.
 */
import React from 'react';
import Router, { Route, DefaultRoute, Link, RouteHandler } from 'react-router';

import App from "./views/app";


import {ArtGateStatus} from "./views/status/status";
import {ArtGateSetupEthernet} from "./views/setup/ethernet";
import {ArtGateSetupArtIn} from "./views/setup/artin";
import {ArtGateSetupArtOut} from "./views/setup/artout";

import {ArtGateTestView} from "./views/testing/test.jsx";

var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="status" path="status" handler={ArtGateStatus}/>
        <Route name="setup:ethernet" path="setup/ethernet" handler={ArtGateSetupEthernet}/>
        <Route name="setup:artin" path="setup/artin" handler={ArtGateSetupArtIn}/>
        <Route name="setup:artout" path="setup/artout" handler={ArtGateSetupArtOut}/>
        <Route name="auth:login" path="login" handler={ArtGateTestView}/>
        <DefaultRoute handler={ArtGateTestView}/>
    </Route>
);

function analytics(state){
    if(typeof ga !== 'undefined'){
        window.ga('send', 'pageview',{'page': state.path});
    }
}

export default function(artgClient){
    artgClient.router = Router.run(routes, Router.HistoryLocation, function(Handler, state){
        React.render(<Handler user={artgClient.user}/>, document.body);
        analytics(state);
    })
}