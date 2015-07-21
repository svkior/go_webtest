import Reflux from 'reflux';


var AuthActions = Reflux.createActions([
    "updateLogin", // login
    "updatePassword", // password
    "doLogin" // email, pass, callback
]);

module.exports.AuthActions = AuthActions;
