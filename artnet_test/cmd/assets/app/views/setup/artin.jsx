
/** @jsx React.DOM **/

var ButtonInput = ReactBootstrap.ButtonInput;


var ArtGateSetupArtIn = React.createClass({
    loadArtInFromServer: function(){
        $.ajax({
            url: "http://localhost:8080/api/status",
            dataType: 'json',
            cache: false,
            success: function(data){
                this.setState({artIns: data.ArtIns});
            }.bind(this),
            error: function(xhr, status, err){
                console.error("/api/status", status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function(){
        return {
            artIns: []
        };
    },
    componentDidMount: function(){
        this.loadArtInFromServer();
        //setInterval(this.loadEthFromServer, 2000);
    },
    handleSubmit: function(e){
        console.log(e);
    },
    render(){
        var edits = this.state.artIns.map(function(artin){
            console.log(artin);
            return (
                <ArtGateSetupEditor name={artin.Name} value={artin.Universe} />
            );
        });
        return (
            <div className="content">
                <h2> Изменение параметров ArtNet Входов</h2>
                <p> Число входов {this.state.artIns.length}</p>
                <form className="setupForm" onSubmit={this.handleSubmit}>
                    {edits}
                    <ButtonInput type="submit" value="Обновить"/>
                </form>
            </div>
        );
    }
});