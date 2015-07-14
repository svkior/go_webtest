
/** @jsx React.DOM **/

var DefaultRoute = ReactRouter.DefaultRoute;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;
var RouteHandler= ReactRouter.RouteHandler;

var ArtGateMain = React.createClass({
    render: function(){
        return (
            <div className="page">
                <ArtGateHeader/>
                <RouteHandler/>
                <ArtGateFooter/>
            </div>
        );
    }
});

var routes = (
    <Route name="app" path="/" handler={ArtGateMain}>
        <Route name="status" path="status" handler={ArtGateStatus}/>
        <Route name="setup:ethernet" path="setup/ethernet" handler={ArtGateSetupEthernet}/>
        <Route name="setup:artin" path="setup/artin" handler={ArtGateSetupArtIn}/>
        <DefaultRoute handler={ArtGateStatus}/>
    </Route>
);



ReactRouter.run(routes, function(Handler){
    React.render(<Handler/>, document.body);
});