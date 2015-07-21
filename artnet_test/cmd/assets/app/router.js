
import React from 'react';
import Router, { Route, DefaultRoute, Link, RouteHandler } from 'react-router';

import App from "./views/app";


import {ArtGateStatus} from "./views/status/status";
import {ArtGateSetupEthernet} from "./views/setup/ethernet";
import {ArtGateSetupArtIn} from "./views/setup/artin";
import {ArtGateSetupArtOut} from "./views/setup/artout";
import ArtGateLogin from "./views/auth/login";

import {ArtGateTestView} from "./views/testing/test.jsx";


import {AuthActions} from "./actions/auth_actions";
import AuthStore from "./store/auth_store";

/**
 * Guard the Component router handler with the given function.  If the function fails
 * (i.e. returns a falsey value) then redirect to the given state and parameters.
 *
 * @param fn The guard function, returning true (if the transition is allowed) or false if not
 * @param Component The React component used as the route handler
 * @param state The name of the state to redirect to if the guard fails
 * @param params Optional parameters for the redirect state
 * @returns {*}
 */
const guardRoute = function(fn, Component, { state, params = {} }) {
    return React.createClass({
        statics: {
            willTransitionTo(transition, currentParams, currentQuery) {
                if (!fn(currentParams)) transition.redirect(state, params);
            }
        },
        render() {
            return <Component {...this.props} />;
        },
        displayName: `${Component.displayName}(Guarded)`
    });
};

var loggedInUser = "dave";

// With bind
const isLoggedIn = guardRoute.bind(this, () => AuthStore.loggedIn());

var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="status" path="status" handler={isLoggedIn(ArtGateStatus, {state: "auth:login"})}/>
        <Route name="setup:ethernet" path="setup/ethernet" handler={isLoggedIn(ArtGateSetupEthernet, {state: "auth:login"})}/>
        <Route name="setup:artin" path="setup/artin" handler={isLoggedIn(ArtGateSetupArtIn, {state: "auth:login"})}/>
        <Route name="setup:artout" path="setup/artout" handler={isLoggedIn(ArtGateSetupArtOut, {state: "auth:login"})}/>
        <Route name="auth:login" path="login" handler={ArtGateLogin}/>
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