/**
 * Created by svkior on 04.11.15.
 */

import React from 'react'

import ConfigureSidebar from './ConfigureSidebar.react'

var Configure = React.createClass({
    render(){
        return (
            <div className="row">
                <div className="col-md-3">
                    {ConfigureSidebar}
                </div>
                {this.props.children}
            </div>
        );
    }
});

export default Configure