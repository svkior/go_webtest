
/** @jsx React.DOM **/

var ReactBootstrap = require('react-bootstrap');
var React = require('react');


var ArtGateLogin = React.createClass({
   render(){
       return (
           <div className="content">
               <article role="main">
                   <PageHeader>
                       Авторизация
                   </PageHeader>
               </article>
           </div>
       );
   }
});

module.exports.ArtGateLogin = ArtGateLogin;