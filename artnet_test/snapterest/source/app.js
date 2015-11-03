/**
 * Created by svkior on 02.11.15.
 * Первый блин с 14-м реактом
 */
var React = require('react');
var ReactDOM = require('react-dom');

var Application = require('./components/Application.react');
var WebAPIUtils = require('./utils/WebAPIUtils');


WebAPIUtils.initializeStreamOfTweets();

ReactDOM.render(<Application/>,
    document.getElementById('react-application'));
