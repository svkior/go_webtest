/**
 * Created by svkior on 02.11.15.
 * Action Creators
 */

var AppDispatcher = require("../dispatcher/AppDispatcher");

function receiveTweet(tweet){
    var action = {
        type: 'receive_tweet',
        tweet: tweet
    };
    AppDispatcher.dispatch(action);
}

module.exports = {
    receiveTweet: receiveTweet
};
