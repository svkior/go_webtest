/**
 * Created by svkior on 02.11.15.
 */

jest.dontMock('../TweetUtils');

describe('Tweet utilites module', function(){
    it('returns an array of tweet ids', function(){
        var TweetUtils = require('../TweetUtils');
        var tweetsMock = {
            tweet1:{},
            tweet2:{},
            tweet3:{}
        };
        var expectedListOfTweetsIds = ['tweet1', 'tweet2', 'tweet3'];
        var actualListOfTweetsIds = TweetUtils.getListOfTweetIds();

        expect(actualListOfTweetsIds).toEqual(expectedListOfTweetsIds);
    });
});