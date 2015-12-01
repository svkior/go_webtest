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
                    stroke="gray"
                    strokeWidth={8}
                    d="M 10 10 L 40 10 L 40 30 L 10 30 L 10 10"
                />
                <Shape
                    stroke="gray"
                    strokeWidth={8}
                    d="M 60 10 L 90 10 L 90 30 L 60 30 Z"
                />
            </Group>
        );
    }
});

