import Reflux from 'reflux';

import {AuthActions} from '../actions/auth_actions.js';

var AuthStore = Reflux.createStore({
    listenables: [AuthActions],
    onUpdateLogin: function(newLogin){
        //console.log("New login:", newLogin);
        this.credintals.login = newLogin;
    },
    onDoLogin: function(){
        console.log("Do Login");
    },
    loggedIn(){
        console.log("Logged In");
        return false;
    },
    init: function(){
        console.log("Auth Init");
        this.credintals = {
            login: "",
            password: "",
            jwt: ""
        };
    }
});

export default AuthStore;