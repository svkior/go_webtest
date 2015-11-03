/**
 * Created by svkior on 03.11.15.
 *
 * Utils to work with websockets
 */

var SnapkiteStreamClient = require('snapkite-stream-client');
var TweetActionCreators = require('../actions/TweetActionCreators');

function initializeStreamOfTweets(){
    SnapkiteStreamClient.initializeStream(TweetActionCreators.receiveTweet, {
        hostname: location.hostname
    });
}

module.exports = {
    initializeStreamOfTweets: initializeStreamOfTweets
};
