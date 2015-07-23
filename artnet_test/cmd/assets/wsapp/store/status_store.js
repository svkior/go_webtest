/**
 * Created by s.kior on 23.07.2015.
 */
import Reflux from 'reflux'

import StatusActions from "../actions/status_actions.js"


/*
 * Хранилище статусных сообщений
 */
var StatusStore = Reflux.createStore({
    listenables: [StatusActions],
    onWsconnected(){
        console.log("StatusStore: Connected!!!!!!");
    },
    init(){
        this.log = ["123","123324"];
        this.trigger(this.log);
    },
    getInitialState(){
        return this.log;
    }
});

export default StatusStore