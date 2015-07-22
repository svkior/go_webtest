import Reflux from 'reflux';

import {AuthActions} from '../actions/auth_actions.js';

var AuthStore = Reflux.createStore({
    listenables: [AuthActions],
    onUpdateLogin: function(newLogin){
        //console.log("New login:", newLogin);
        this.credintals.login = newLogin;
        this.updateCredintals(this.credintals);
    },
    onUpdatePassword: function(newPassword){
        this.credintals.password = newPassword;
        this.updateCredintals(this.credintals);
    },
    onDoLogin: function(){
        console.log("Do Login");
        var urll = window.location.protocol + "//" + window.location.host + "/api/login";
        var data = {
            username: this.credintals.login,
            password: this.credintals.password
        };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: urll,
            data: JSON.stringify(data),
            dataType: 'json',
            cache: false,
            success: function(result){
                console.log(result);
                this.credintals.jwt = result.token;
                this.credintals.password = "";
                this.updateCredintals(this.credintals);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(urll, status, err.toString());
            }
        });
    },
    loggedIn(){
        //console.log("Logged In");
        return false;
    },
    updateCredintals: function(credintals){
        //console.log("Update Setup: ", setup);
        this.credintals = credintals;
        this.trigger(credintals);
    },
    init: function(){
        console.log("Auth Init");
        this.credintals = {
            login: "",
            password: "",
            jwt: ""
        };
    },
    getInitialState: function(){
        return this.credintals;
    }
});

export default AuthStore;