/**
 * Created by svkior on 04.11.15.
 */

import AppDispatcher from '../dispatcher/AppDispatcher'

module.exports = {
    // Подписаться на коллекцию
    Subscribe: function(collectionName){
        var action = {
            type: 'collection_subscribe',
            name: collectionName
        };
        AppDispatcher.dispatch(action)
    },
    // Отписаться от коллекции
    UnSubscribe: function(collectionName){
        var action = {
            type: 'collection_unsubscribe',
            name: collectionName
        }
    }
};