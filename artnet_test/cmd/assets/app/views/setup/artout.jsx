
/** @jsx React.DOM **/

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
            addButton = <ButtonInput onClick={SetupActions.addArtOut} value="Добавить"/>
        } else {
            addButton = <ButtonInput disabled value="Добавить"/>
        }
        return (
            <div className="content">
                <h2>Изменение параметров ArtNet Выходов</h2>
                <p> Число входов {edits.length} {addButton}</p>
                <form className="setupForm" onSubmit={SetupActions.uploadArtOuts}>
                    {edits}
                    <ButtonInput type="submit" value="Обновить"/>
                </form>
            </div>
        );
    }
});