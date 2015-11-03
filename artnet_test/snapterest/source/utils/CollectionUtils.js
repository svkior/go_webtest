/**
 * Created by svkior on 04.11.15.
 * Utils to work with collections
 */

function getNumberOfTweetsInCollection(collection){
    var TweetUtils = require('./TweetUtils');
    var listOfCollectionTweetIds = TweetUtils.getListOfTweetIds(collection);
    return listOfCollectionTweetIds.length;
}

function isEmptyCollection(collection){
    return (getNumberOfTweetsInCollection(collection) === 0);
}

module.exports = {
    getNumberOfTweetsInCollection: getNumberOfTweetsInCollection,
    isEmptyCollection: isEmptyCollection
};
