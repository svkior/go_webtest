
/** @jsx React.DOM **/


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
            <Navbar brand="TTS ArtGate 4DR v1.0.4" inverse toggleNavKey={0}>
                <Nav eventKey={0}> {}
                    <NavItemLink /*to="about"*/>О Продукте</NavItemLink>
                    <NavItemLink /*to="status"*/>Статус</NavItemLink>
                    <DropdownButton title='Настройка'>
                        <MenuItemLink /*to="confselect"*/ eventKey='1'>Выбор конфигурации</MenuItemLink>
                        <MenuItem >Редактирование конфигурации</MenuItem>
                        <MenuItem >Что то еще</MenuItem>
                        <MenuItem divider />
                        <MenuItem >Обновление ПО</MenuItem>
                    </DropdownButton>
                    <DropdownButton title="Система">
                        <MenuItemLink to="reboot">Перезагрузка</MenuItemLink>
                        <MenuItemLink to="shutdown">Отключение</MenuItemLink>
                    </DropdownButton>
                </Nav>
            </Navbar>
        )
    }
});
