
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
                    <NavItemLink /*to="about"*/>� ��������</NavItemLink>
                    <NavItemLink /*to="status"*/>������</NavItemLink>
                    <DropdownButton title='���������'>
                        <MenuItemLink /*to="confselect"*/ eventKey='1'>����� ������������</MenuItemLink>
                        <MenuItem >�������������� ������������</MenuItem>
                        <MenuItem >��� �� ���</MenuItem>
                        <MenuItem divider />
                        <MenuItem >���������� ��</MenuItem>
                    </DropdownButton>
                    <DropdownButton title="�������">
                        <MenuItemLink to="reboot">������������</MenuItemLink>
                        <MenuItemLink to="shutdown">����������</MenuItemLink>
                    </DropdownButton>
                </Nav>
            </Navbar>
        )
    }
});
