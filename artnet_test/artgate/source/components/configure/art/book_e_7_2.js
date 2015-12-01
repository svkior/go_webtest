/**
 * Created by svkior on 07.11.15.
 */

import React from 'react'

let ReactART = require('react-art');

let Group = ReactART.Group;
let Shape = ReactART.Shape;

let BAR_PATH = "M3.00191459,0 C1.34400294,0 0,1.34559019 0,3.00878799 L0,21 C0,21 0,21 0,21 L280,21 C280,21 280,21 280,21 L280,3.00878799 C280,1.34708027 278.657605,0 276.998085,0 L3.00191459,0 Z M3.00191459,0";

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
                    stroke="#FFFFFF"
                    d="M10,10 L 40,10 L 40,30 L 10,30 L 10,10"
                />
                <Shape
                    stroke="#FFFFFF"
                    d="M60,10 L 90,10 L 90,30 L 60,30 Z"
                />
                <Shape
                    stroke="#FFFFFF"
                    d="M 40 60 L 10 60 L 40 42.68 Z
                    M 60 60 L 90 60 L 60 42.68 Z"
                />
            </Group>
        );
    }
});

