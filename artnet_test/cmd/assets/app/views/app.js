import React from "react";
import Reflux from "reflux";
import { RouteHandler } from "react-router";
import Promise from "bluebird";

import ArtGateHeader from './header';
import ArtGateFooter from './footer';

import AuthStore from '../store/auth_store';
import {AuthActions} from '../actions/auth_actions';

import AuthLogin from './auth/login.js';

import {NavItem} from 'react-bootstrap';
//import {NavItemLink, MenuItemLink} from 'react-router-bootstrap';


let ArtGLogin = React.createClass({
   render(){
       return <NavItem>Вход</NavItem>
   }
});

let ArtGLogout = React.createClass({
    logout: function(e){
        e.preventDefault();
        AuthActions.doLogout();
    },
    render(){
        return <NavItem onClick={this.logout}> Выход</NavItem>
    }
});

let ArtGConnect = React.createClass({
    render(){
        return <NavItem>Соединение...</NavItem>
    }
});


export default React.createClass({
    mixins: [
        Reflux.connect(AuthStore, 'auth')
    ],
    logoutProc: function(e){
        e.preventDefault();
        console.log("qwe");
    },
    render(){
        var mainBoard;
        var loginout;
        if(this.state.auth){
            // Есть вообще аутентикация

            if(this.state.auth.jwt && this.state.auth.jwt.length > 5){
                // Есть токен и авторизация
                mainBoard = <RouteHandler/>;
                loginout = <ArtGLogout onClick={this.logoutProc}/>;
            } else {
                mainBoard = <AuthLogin/>;
                loginout = <ArtGLogin/>;
            }
        } else {
            mainBoard = <h1>Соединение с сервером</h1>;
            loginout = <ArtGConnect/>;
        }

        return (
            <div className="container-fluid">
                <ArtGateHeader loginout={loginout}/>
                {mainBoard}
                <ArtGateFooter/>
            </div>
        );
    }
});