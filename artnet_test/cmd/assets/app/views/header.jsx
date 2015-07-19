/** @jsx React.DOM **/

var ReactBootstrap = require('react-bootstrap');
var ReactRouterBootstrap = require('react-router-bootstrap');
var React = require('react');

var Navbar =  ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;

var NavItemLink = ReactRouterBootstrap.NavItemLink;
var MenuItemLink = ReactRouterBootstrap.MenuItemLink;


var ArtGateHeader = React.createClass({
    render: function(){
        return (
            <nav className="navbar navbar-inverse navbar-static-top" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#ag-top-menu">
                            <span className="sr-only">
                                Навигация
                            </span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">TTS ArtGate 4DR v1.0.4</a>
                    </div>
                    <div className="navbar-collapse collapse" id="ag-top-menu">
                        <ul className="nav navbar-nav">
                            <NavItem>О Продукте</NavItem>
                            <NavItemLink to="status">Статус</NavItemLink>
                            <MenuItemLink to="setup:ethernet">Ethernet</MenuItemLink>
                            <MenuItemLink to="setup:artin">ArtNet Вход</MenuItemLink>
                            <MenuItemLink to="setup:artout">ArtNet Выход</MenuItemLink>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
});

module.exports.ArtGateHeader = ArtGateHeader;