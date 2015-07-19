
/** @jsx React.DOM **/

var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Reflux = require('reflux');

var SetupStore = require('../../store/setup_store.jsx').SetupStore;
var SetupActions = require('../../actions/setup_actions.jsx').SetupActions;

var ArtGateSetupEditDeleteEnable = require('../../helpers/forms/editors.jsx').ArtGateSetupEditDeleteEnable;

var ButtonInput = ReactBootstrap.ButtonInput;


var ArtGateSetupArtIn = React.createClass({
    mixins: [
        Reflux.connect(SetupStore, 'setup')
    ],
    render(){
        var edits = [];
        var addButton = "";
        if(this.state.setup){
            edits = this.state.setup.ArtIns.map(function(artin, i){
                return (
                    <ArtGateSetupEditDeleteEnable
                        key={i}
                        name={artin.Name}
                        value={artin.Universe}
                        onChange={SetupActions.editArtIn}
                        onEnableDisable={SetupActions.toggleArtIn}
                        onDelete={SetupActions.removeArtIn}
                        number={i}
                        Enabled={artin.Enabled}
                        />
                );
            }.bind(this));

        }
        if(edits.length < 4){
            addButton =
                <div className="ag-setup-buttons panel panel-default">
                    <div className="panel-body">
                        <ButtonInput onClick={SetupActions.addArtIn} value="Добавить"/>
                    </div>
                </div>
        } else {
            addButton ="";
        }

        return (
            <div className="row">
                <form className="setupForm" onSubmit={SetupActions.uploadArtIns}>
                    <div className="panel-body ag-setup-container">
                       <div className="ag-setup panel panel-default">
                            <h3>Параметры ArtNet Входов</h3>
                       </div>
                        {edits}
                        {addButton}
                        <div className="ag-setup-buttons panel panel-default">
                            <div className="panel-body">
                                <ButtonInput type="submit" value="Обновить"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports.ArtGateSetupArtIn = ArtGateSetupArtIn;