
import React from 'react';
import router from "./router";
/*
import Router, { Route, DefaultRoute, Link, RouteHandler } from 'react-router';

import {SetupActions} from './actions/setup_actions.jsx';

//var SetupActions = require('./actions/setup_actions.jsx').SetupActions;

import {ArtGateStatus} from './views/status/status.jsx';
import {ArtGateSetupEthernet} from './views/setup/ethernet.jsx';
import {ArtGateSetupArtIn} from './views/setup/artin.jsx';
import {ArtGateSetupArtOut} from './views/setup/artout.jsx';
import {ArtGateTestView} from './views/testing/test.jsx';
import {ArtGateLogin} from './views/auth/login.jsx';

import {ArtGateHeader} from './views/header.jsx';
import {ArtGateFooter} from './views/footer.jsx';
*/

var client = {};

// FOR DEBUG ONLY
window.React = React;
window.ArtGate = router(client);

/*
var ArtGateMain = React.createClass({
    render: function(){
        return (
            <div className="container-fluid">
                <ArtGateHeader/>
                <RouteHandler/>
                <ArtGateFooter/>
            </div>
        );
    }
});


function requireAuth(nextState, transition) {
    console.log("Require");
    if (!AuthActions.loggedIn())
        transition.to('/login', null, { nextPathname: nextState.location.pathname });
}

var routes = (
    <Route name="app" path="/" handler={ArtGateMain}>
        <Route name="status" path="status" handler={ArtGateStatus} onEnter={requireAuth}/>
        <Route name="setup:ethernet" path="setup/ethernet" handler={ArtGateSetupEthernet} onEnter={requireAuth}/>
        <Route name="setup:artin" path="setup/artin" handler={ArtGateSetupArtIn} onEnter={requireAuth}/>
        <Route name="setup:artout" path="setup/artout" handler={ArtGateSetupArtOut} onEnter={requireAuth}/>
        <Route name="auth:login" path="login" handler={ArtGateLogin}/>
        <DefaultRoute handler={ArtGateTestView}/>
    </Route>
);


Router.run(routes, function(Handler){
    React.render(<Handler/>, document.body);
});
*/