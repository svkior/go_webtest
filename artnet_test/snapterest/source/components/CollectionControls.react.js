/**
 * Created by svkior on 02.11.15.
 * Collection Controls
 */


var React = require('react');
var Header = require('./Header.react');
var Button = require('./Button.react');

var CollectionRenameForm = require('./CollectionRenameForm.react');
var CollectionExportForm = require('./CollectionExportForm.react');

var CollectionActionCreators = require('../actions/CollectionActionCreators');
var CollectionStore = require('../stores/CollectionStore');

var CollectionControls = React.createClass({
    getInitialState(){
        return {
            isEditingName: false
        };
    },
    getHeaderText(){
        var numberOfTweetsInCollection = this.props.numberOfTweetsInCollection;
        var text = numberOfTweetsInCollection;
        var name = CollectionStore.getCollectionName();

        if(numberOfTweetsInCollection === 1){
            text = text + ' tweet in your';
        } else {
            text = text + ' tweets in your';
        }

        return (
            <span> {text} <strong>{name}</strong> collection</span>
        );
    },
    toggleEditCollectionName(){
        this.setState({
            isEditingName: !this.state.isEditingName
        });
    },
    setCollectionName(name){
        this.setState({
            name: name,
            isEditingName:false
        });
    },
    removeAllTweetsFromCollection: function(){
        CollectionActionCreators.removeAllTweetsFromCollection();
    },
    render(){
        if(this.state.isEditingName){
            return (
                <CollectionRenameForm
                    name={this.state.name}
                    onCancelCollectionNameChange= {this.toggleEditCollectionName}/>
            );
        }

        return (
            <div>
                <Header text={this.getHeaderText()} />
                <Button
                    label="Rename collection"
                    handleClick={this.toggleEditCollectionName}/>
                <Button
                    label="Empty Collection"
                    handleClick={this.removeAllTweetsFromCollection}/>
                <CollectionExportForm htmlMarkup={this.props.htmlMarkup}/>
            </div>
        )
    }
});

module.exports = CollectionControls;