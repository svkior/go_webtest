
/** @jsx React.DOM **/


var Input = ReactBootstrap.Input;

var ArtGateSetupEditor = React.createClass({
    handleChange: function(e){
        //this.setState({value: event.target.value});
        this.props.onChange(event.target.value);
    },
    render: function(){
        //console.log(this.props.value);
        return(
            <Input type="text" label={this.props.name} onChange={this.handleChange} value={this.props.value} ref="ip" />
        );
    }
});

