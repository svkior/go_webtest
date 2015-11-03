/**
 * Created by svkior on 02.11.15.
 * Стрим с twitter
 */

var React = require('react');
var StreamTweet = require('./StreamTweet.react');
var Header = require('./Header.react');
var TweetStore = require('../stores/TweetStore');

var Stream = React.createClass({
    getInitialState: function(){
        return {
            tweet: TweetStore.getTweet()
        }
    },
    componentDidMount(){
        TweetStore.addChangeListener(this.onTweetChange);
    },
    componentWillUnmount(){
        TweetStore.removeChangeListener(this.onTweetChange);
    },
    onTweetChange(){
       this.setState({
           tweet: TweetStore.getTweet()
       });
    },
    render(){
        var tweet = this.state.tweet;
        if(tweet){
            return (
                <StreamTweet tweet={tweet} />
            );
        }

        return (
            <Header text="Waiting for public photos from Twitter..." />
        )
    }
});

module.exports = Stream;