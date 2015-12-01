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
                    d="M 302 152 A 150 120, 0, 1 9, 2 152 A 75 60, 0, 1, 0, 152 152"
                />
                <Shape
                    fill="#cceeff"
                    d="M 152 152 A 75 60, 0, 1, 1, 302 152"
                />
            </Group>
        );
    }
});

