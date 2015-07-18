
/** @jsx React.DOM **/

var DefaultRoute = ReactRouter.DefaultRoute;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;
var RouteHandler= ReactRouter.RouteHandler;



var ArtGateMain = React.createClass({
    render: function(){
        return (
            <div className="container-fluid">
                <ArtGateHeader/>
                <RouteHandler/>
                <ArtGateFooter/>
            </div>
        );
    }
});


function requireAuth(nextState, transition) {
    console.log("Require");
    if (!AuthActions.loggedIn())
        transition.to('/login', null, { nextPathname: nextState.location.pathname });
}

var routes = (
    <Route name="app" path="/" handler={ArtGateMain}>
        <Route name="status" path="status" handler={ArtGateStatus} onEnter={requireAuth}/>
        <Route name="setup:ethernet" path="setup/ethernet" handler={ArtGateSetupEthernet} onEnter={requireAuth}/>
        <Route name="setup:artin" path="setup/artin" handler={ArtGateSetupArtIn} onEnter={requireAuth}/>
        <Route name="setup:artout" path="setup/artout" handler={ArtGateSetupArtOut} onEnter={requireAuth}/>
        <Route name="auth:login" path="login" handler={ArtGateLogin}/>
        <DefaultRoute handler={ArtGateTestView}/>
    </Route>
);


ReactRouter.run(routes, function(Handler){
    React.render(<Handler/>, document.body);
});