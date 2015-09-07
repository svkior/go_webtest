/**
 * Created by svkior on 18/08/15.
 *
 */
import Reflux from 'reflux'

import MapActions from "../actions/map_actions.js"


import WSActions from "../../actions/wsactions.js"


var MapStore = Reflux.createStore({
    listenables: [MapActions],
    onSendMessage(msg_string){
        WSActions.sendMessage(msg_string);
    },
    onGotMessage(msg){
        console.log("MapStore Got: ", msg)
    },
    init(){
        this.log = [];
        this.trigger(this.log);
    },
    getInitialState(){
        return this.log;
    }
});

export default MapStore