
/** @jsx React.DOM **/

var ArtGateTestView = React.createClass({
   render(){

       var prods = [];

       for(var i=0; i< 15; i++){
           prods.push(
               <div className="ag-product panel panel-default">
                <div className="panel-body">
                   <h3>Product</h3>
                </div>
               </div>);
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