import React from 'react';

import Router, {Route, DefaultRoute, Link, RouteHandler} from 'react-router';

import {App,ArtGateDefault}  from "./views/app";

var routes = (
    <Route name="app" path="/wsinterface" handler={App}>
        <DefaultRoute handler={ArtGateDefault}/>
    </Route>
);

function analytics(state){
    if(typeof ga !== 'undefined'){
        window.ga('send', 'pageview',{'page': state.path});
    }
}

export default function(agClient){
    agClient.router = Router.run(routes, Router.HistoryLocation, function(Handler, state){
        React.render(<Handler/>, document.body);
        analytics(state);
    })
}
