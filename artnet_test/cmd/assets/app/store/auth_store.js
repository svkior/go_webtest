import Reflux from 'reflux';

import {AuthActions} from '../actions/auth_actions';

import {SetupActions} from '../actions/setup_actions.jsx';

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
    checkLogin: function(){
        var urll = window.location.protocol + "//" + window.location.host + "/api/status";
        $.ajax({
            url: urll,
            dataType: 'json',
            cache: false,
            success: function(){
                SetupActions.putToken(this.credintals.jwt);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(urll, status, err.toString());
            },
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + this.credintals.jwt);
            }.bind(this)

        });
    },
    onDoLogin: function(){
        //console.log("Do Login");
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
                //console.log(result);
                this.credintals.jwt = result.token;
                this.credintals.password = "";
                this.updateCredintals(this.credintals);
                //console.log(SetupActions);
                SetupActions.putToken(result.token);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(urll, status, err.toString());
            }
        });
    },
    onDoLogout(){
        this.credintals.jwt = "";
        this.updateCredintals(this.credintals);
    },
    updateCredintals: function(credintals){
        //console.log("Update Setup: ", setup);
        this.credintals = credintals;
        if(this.credintals.ls){
            localStorage.setItem("credintals", JSON.stringify(credintals));
        }
        this.trigger(credintals);
    },
    init: function(){
        if(typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            //console.log("Local Storage");
            var jsonString = localStorage.getItem("credintals");
            //console.log(jsonString);
            var ls = JSON.parse(jsonString);
            //console.log(ls);
            if(ls){
                //console.log("credintals");
                this.credintals = ls;
            } else {
                this.credintals = {
                    login: "",
                    password: "",
                    jwt: "",
                    ls: true
                };
            }
        } else {
            //console.log("Auth Init");
            this.credintals = {
                login: "",
                password: "",
                jwt: "",
                ls: false
            };
            // Sorry! No Web Storage support..
        }

        if(this.credintals.jwt !== ""){
            this.checkLogin();
        }
        this.trigger(this.credintals);
    },
    getInitialState: function(){
        return this.credintals;
    }
});

export default AuthStore;