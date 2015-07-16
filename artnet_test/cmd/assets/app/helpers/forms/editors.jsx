
/** @jsx React.DOM **/



var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;


var ArtGateSetupEditor = React.createClass({
    handleChange: function(e){
        //this.setState({value: event.target.value});
        this.props.onChange(event.target.value, this.props.number);
    },
    render: function(){
        //console.log(this.props.value);
        return(
            <Input type="text" label={this.props.name} onChange={this.handleChange} value={this.props.value} ref="ip" />
        );
    }
});

var ArtGateSetupEditDeleteEnable = React.createClass({
    handleChange: function(e){
        //this.setState({value: event.target.value});
        this.props.onChange(event.target.value, this.props.number);
    },
    edWork: function(){
        this.props.onEnableDisable(!this.props.Enabled, this.props.number);
    },
    delWork: function(){
        this.props.onDelete(this.props.number);
    },
    render: function() {
        var edBtn;
        if (!this.props.Enabled) {
            edBtn = <ButtonInput onClick={this.edWork} bsStyle='warning' value="Включить"/>
        } else {
            edBtn = <ButtonInput onClick={this.edWork} value="Отключить"/>
        }

        var btnDel = <ButtonInput onClick={this.delWork} bsStyle='danger' value="Удалить"/>

        return (
                <Input
                    type="text"
                    label={this.props.name}
                    onChange={this.handleChange}
                    value={this.props.value}
                    ref="ip"
                    buttonBefore={edBtn}
                    buttonAfter={btnDel}
                />
        );
    }
});

