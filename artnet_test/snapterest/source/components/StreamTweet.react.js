/**
 * Created by svkior on 02.11.15.
 * StreamTweet
 */


var React = require('react');
var ReactDOM = require('react-dom');

var Header = require('./Header.react');
var Tweet = require('./Tweet.react');

var CollectionActionCreators = require('../actions/CollectionActionCreators');

var StreamTweet = React.createClass({
    getInitialState(){
        return {
            numberOfCharactersIsIncreasing: null,
            headerText: null
        };
    },
    addTweetToCollection(tweet){
        CollectionActionCreators.addTweetToCollection(tweet);
    },
    componentWillMount(){
        this.setState({
            numberOfCharactersIsIncreasing: true,
            headerText: 'Latest public photo from Twitter'
        });
        window.snapterest = {
            numberOfReceivedTweets: 1,
            numberOfDisplayedTweets: 1
        };
    },
    componentDidMount(){
        var componentDOMRepresentation = ReactDOM.findDOMNode(this);
        window.snapterest.headerHtml = componentDOMRepresentation.children[0].outerHTML;
        window.snapterest.tweetHtml  = componentDOMRepresentation.children[1].outerHTML;
    },
    componentWillUnmount(){
        delete window.snapterest;
    },
    componentWillReceiveProps(nextProps){
        var currentTweetLength = this.props.tweet.text.length;
        var nextTweetLength = nextProps.tweet.text.length;
        var isNumberOfCharactersIncreasing = (nextTweetLength > currentTweetLength);

        var headerText;

        this.setState({
            numberOfCharactersIsIncreasing: isNumberOfCharactersIncreasing
        });

        if(isNumberOfCharactersIncreasing){
            headerText = 'Number of characters is increasing';
        }

        this.setState({
            headerText: headerText
        });

        window.snapterest.numberOfReceivedTweets++;
    },
    shouldComponentUpdate(nextProps, nextState){
        return (nextProps.tweet.text.length > 1);
    },
    componentDidUpdate(prevProps, prevState){
        window.snapterest.numberOfDisplayedTweets++;
    },
    render(){
        return (
            <section>
                <Header text={this.state.headerText}/>
                <Tweet tweet={this.props.tweet}
                       onImageClick = {this.addTweetToCollection}/>
            </section>
        );
    }
});

module.exports = StreamTweet;