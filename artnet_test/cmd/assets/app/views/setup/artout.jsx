
/** @jsx React.DOM **/

var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Reflux = require('reflux');

var SetupStore = require('../../store/setup_store.jsx').SetupStore;
var SetupActions = require('../../actions/setup_actions.jsx').SetupActions;

var ArtGateSetupEditDeleteEnable = require('../../helpers/forms/editors.jsx').ArtGateSetupEditDeleteEnable;

var ButtonInput = ReactBootstrap.ButtonInput;


var ArtGateSetupArtOut = React.createClass({
    mixins: [
        Reflux.connect(SetupStore, 'setup')
    ],
    render(){
        var edits = [];
        var addButton = "";
        if(this.state.setup){
            edits = this.state.setup.ArtOuts.map(function(artin, i){
                return (
                    <ArtGateSetupEditDeleteEnable
                        key={i}
                        name={artin.Name}
                        value={artin.Universe}
                        onChange={SetupActions.editArtOut}
                        onEnableDisable={SetupActions.toggleArtOut}
                        onDelete={SetupActions.removeArtOut}
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
                        <ButtonInput onClick={SetupActions.addArtOut} value="Добавить"/>
                    </div>
                </div>
        } else {
            addButton = "";
        }
        return (
            <div className="row">
                <form className="setupForm" onSubmit={SetupActions.uploadArtOuts}>
                    <div className="panel-body ag-setup-container">
                        <div className="ag-setup panel panel-default">
                            <h3>Параметры ArtNet Выходов</h3>
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

module.exports.ArtGateSetupArtOut = ArtGateSetupArtOut;