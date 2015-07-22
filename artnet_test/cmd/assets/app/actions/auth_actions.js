import Reflux from 'reflux';


var AuthActions = Reflux.createActions([
    "updateLogin", // login
    "updatePassword", // password
    "doLogin", // email, pass, callback
    "doLogout" // выход из системы
]);

module.exports.AuthActions = AuthActions;
