import React from "react";
import { RouteHandler } from "react-router";
import Promise from "bluebird";

import ArtGateHeader from './header';
import ArtGateFooter from './footer';

export default class App extends React.Component{
    render(){
        return (
            <div className="container-fluid">
                <ArtGateHeader/>
                <RouteHandler/>
                <ArtGateFooter/>
            </div>
        );
    }
}