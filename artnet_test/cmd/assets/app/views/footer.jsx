
/** @jsx React.DOM **/

var React = require('react');

var ArtGateFooter = React.createClass({
    render(){
        return (
            <footer className="site-footer">
                Разработано &copy; 2014-2015 ООО "Театральные Технологические Системы" <br/>
                Tel: +7 495 730-83-45, +7 495 730-83-46<br/>
                Web: <a href="http://www.ttsy.ru/shop/view/258/" target="_blank">http://www.ttsy.ru</a> <br/>
                E-Mail: <a href="mailto:info@ttsy.ru">info@ttsy.ru</a>
            </footer>
        )
    }
});

module.exports.ArtGateFooter = ArtGateFooter;