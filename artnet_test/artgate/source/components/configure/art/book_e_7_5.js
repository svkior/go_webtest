/**
 * Created by svkior on 07.11.15.
 */

import React from 'react'

let ReactART = require('react-art');

let Group = ReactART.Group;
let Shape = ReactART.Shape;

export default React.createClass({
    render(){
        let x = this.props.x;
        let y = this.props.y;
        return (
            <Group
                x={x}
                y={y}
            >
                <Shape
                    fill="#ffcccc"
                    d="M 0 0, 60 0, 60 60, 0 60 Z
                    M15 15, 45 15, 45 45, 15 45Z"
                />
                <Shape
                    fill="#cceeff"
                    d="M 100 0, 160 0, 160 60, 100 60 Z
                    M115 15, 115 45, 145 45, 145 15 Z"
                />
            </Group>
        );
    }
});

