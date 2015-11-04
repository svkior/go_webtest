/**
 * Created by svkior on 04.11.15.
 * Описывается футер для приложения
 */


import {Navbar} from 'react-bootstrap'
import React from 'react'

import WSStore from '../../stores/WSStore'
import CollectionStore from '../../stores/CollectionStore'

var ArtgateFooter = React.createClass({
    getInitialState: function(){
        return {
            status: WSStore.getWSStatus(),
            ticker: CollectionStore.getCollection('ticker')
        };
    },
    componentDidMount(){
        WSStore.addChangeListener(this.onStatusChange);
        CollectionStore.addChangeListener('ticker', this.onTickerChange);
    },
    componentWillUnmount(){
        WSStore.removeChangeListener(this.onStatusChange);
        CollectionStore.removeChangeListener('ticker', this.onTickerChange);
    },
    onStatusChange(){
        this.setState({
            status: WSStore.getWSStatus()
        });
    },
    onTickerChange(){
        this.setState({
            ticker: CollectionStore.getCollection('ticker')
        });
    },
    render(){
        var status = this.state.status;
        var ticker = this.state.ticker;
        var alloc;
        var increment;
        if (ticker && ticker.Alloc){
            alloc = ticker.Alloc;
        }
        if (ticker && ticker.Increment){
            increment = ticker.Increment;
        }
        return (
            <Navbar inverse className="navbar-fixed-bottom">
                <p className="text-muted">
                    &copy; 2013-2015 by Kior Theatre Systems, LLC, ArtGate is {status} | {alloc} | {increment} |
                </p>
            </Navbar>
        );
    }
});


export default ArtgateFooter