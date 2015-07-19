
/** @jsx React.DOM **/

var AuthActions = Reflux.createActions([
    "doLogin", // email, pass, callback
    "loggedIn"
]);

module.exports.AuthActions = AuthActions;
