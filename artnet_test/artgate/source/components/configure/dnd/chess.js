/**
 * Created by svkior on 07.11.15.
 *
 */

import React, {Component} from 'react';

import Board from './Board'


import {observe} from './Game';


export default class Chess extends Component {

    constructor(props){
        super(props);
        this.state = {
            knightPos: [0,0]
        };
        this.updateKnightPos = this.updateKnightPos.bind(this);
    }
    componentDidMount(){
        observe(this.updateKnightPos)
    }
    updateKnightPos(knightPos){
        this.setState({
            knightPos:knightPos
        });
    }
    render(){
        let knightPos = this.state.knightPos;
        return (
            <Board knightPosition={knightPos}/>
        );
    }
}
