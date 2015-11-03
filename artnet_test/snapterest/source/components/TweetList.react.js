/**
 * Created by svkior on 02.11.15.
 * Tweet List
 */

var React = require('react');
var Tweet = require('./Tweet.react');

var CollectionActionCreators = require('../actions/CollectionActionCreators');


var listStyle = {
    padding: '0'
};

var listItemStyle = {
    display: 'inline-block',
    listStyle: 'none'
};

var TweetList = React.createClass({
    getListOfTweetIds(){
        return Object.keys(this.props.tweets);
    },
    removeTweetFromCollection(tweet){
        console.log("Remove Tweet From Collection");
        CollectionActionCreators.removeTweetFromCollection(tweet.id);
    },
    getTweetElement(tweetId){
        var tweet = this.props.tweets[tweetId];
        var handleRemoveTweetFromCollection = this.removeTweetFromCollection;

        var tweetElement;

        tweetElement = (
            <Tweet tweet={tweet}
                   onImageClick={handleRemoveTweetFromCollection}
           />
            );

        return <li style={listItemStyle} key={tweet.id}>{tweetElement}</li>;
    },
    render(){
        var tweetElements = this.getListOfTweetIds().map(this.getTweetElement);

        return (
            <ul style={listStyle}>
                {tweetElements}
            </ul>
        );
    }
});

module.exports = TweetList;