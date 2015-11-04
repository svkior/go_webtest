/**
 * Created by svkior on 04.11.15.
 *
 * Компонент для реализации верхнего меню
 */

import {Navbar, NavBrand, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import React from 'react'

import {LinkContainer} from 'react-router-bootstrap'


const artgateNavbar = (
    <Navbar inverse toggleNavKey={0}>
        <NavBrand><a href="/">TTS ArtGate 4DR</a></NavBrand>
        <Nav right eventKey={0}>
            <LinkContainer to="/status"><NavItem eventKey={1} >Статус</NavItem></LinkContainer>
            <LinkContainer to="/configure"><NavItem eventKey={2} >Конфигурирование</NavItem></LinkContainer>
            <NavDropdown eventKey={3} title="Система" id="collapsible-navbar-dropdown">
                <LinkContainer to="/save-n-reboot"><MenuItem eventKey="1">Сохранить и Перезагрузить</MenuItem></LinkContainer>
                <LinkContainer to="/reboot"><MenuItem eventKey="2">Перезагрузить</MenuItem></LinkContainer>
                <MenuItem divider />
                <LinkContainer to="/firmware-upgrade"><MenuItem eventKey="3">Обновить прошивку</MenuItem></LinkContainer>
            </NavDropdown>
            <LinkContainer to="/login">
                <NavItem eventKey={4}> Войти </NavItem>
            </LinkContainer>
        </Nav>
    </Navbar>
);


export default artgateNavbar
