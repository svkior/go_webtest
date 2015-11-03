/**
 * Created by svkior on 02.11.15.
 * HEader
 */

var React = require('react');

var headerStyle = {
    fontSize: '16px',
    fontWeight: '300',
    display: 'inline-block',
    margin: '20px 10px'
};

var Header = React.createClass({
    getDefaultProps(){
        return {
            text: 'Default Header'
        };
    },
    render(){
        return (
            <h2 style={headerStyle}>{this.props.text}</h2>
        );
    }
});

module.exports = Header;