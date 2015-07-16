
/** @jsx React.DOM **/

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
            addButton = <ButtonInput onClick={SetupActions.addArtIn} value="Добавить"/>
        } else {
            addButton = <ButtonInput disabled value="Добавить"/>
        }

        return (
            <div className="content">
                <h2>Изменение параметров ArtNet Входов</h2>
                <p> Число входов {edits.length} {addButton}</p>
                <form className="setupForm" onSubmit={SetupActions.uploadArtIns}>
                    {edits}
                    <ButtonInput type="submit" value="Обновить"/>
                </form>
            </div>
        );
    }
});