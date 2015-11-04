/**
 * Created by svkior on 04.11.15.
 *
 * Окно статуса
 */

import React from 'react'

import StatusSidebar from './StatusSidebar.react'


var Status = React.createClass({
    render(){
        return (
            <div className="row">
                <div className="col-md-3">
                    {StatusSidebar}
                </div>
                {this.props.children}
            </div>
        );
    }
});

export default Status