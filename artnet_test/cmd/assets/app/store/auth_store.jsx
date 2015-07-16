
/** @jsx React.DOM **/

var AuthStore = Reflux.createStore({
    listenables: [AuthActions],
    onDoLogin: function(){
        console.log("Do Login");
    },
    onLoggedIn: function(){
        console.log("Ask about logged in");
        return false;
    }
});