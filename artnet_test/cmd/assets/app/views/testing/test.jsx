
var ReactBootstrap = require('react-bootstrap');
var React = require('react');

var ArtGateJumbo = require('../../helpers/forms/editors').ArtGateJumbo;


var ArtGateTestView = React.createClass({
   render(){

       var prods = [];

       for(var i=0; i< 15; i++){
           prods.push(
               <div className="ag-product panel panel-default" key={i}>
                <div className="panel-body">
                   <h3>Product{i}</h3>
                </div>
               </div>
           );
       }

       return (
           <div className="row">
               <ArtGateJumbo nam="Test"/>
               <div className="panel-body ag-product-container">
                   {prods}
               </div>
           </div>
       )
   }
});

module.exports.ArtGateTestView = ArtGateTestView;