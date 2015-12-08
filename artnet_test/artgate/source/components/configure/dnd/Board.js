/**
 * Created by svkior on 07.11.15.
 */

import React,{Component, PropTypes} from 'react';
import Knight from './Knight';
import BoardSquare from './BoardSquare'

import {canMoveKnight, moveKnight} from './Game';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


class Board extends Component {
    constructor(props){
        super(props);
    }
    renderSquare(i){
        const x = i % 8;
        const y = Math.floor(i/8);

        return (
            <div
                key={i}
                style={{width:'12.5%', height: '12.5%'}}>
                <BoardSquare x={x} y={y}>
                    {this.renderPiece(x, y)}
                </BoardSquare>
            </div>
        )
    }

    renderPiece(x, y){
        const [knightX, knightY] = this.props.knightPosition;
        if (x === knightX && y === knightY){
            return <Knight/>;
        }
    }

    render(){
        const squares = [];
        for(let i=0; i < 64; i++){
            squares.push(this.renderSquare(i));
        }
        return (
            <div style={{
             width:'100%',
             height: '100%',
             display:'flex',
             flexWrap: 'wrap'
            }}>
                {squares}
            </div>
        );
    }
}

Board.propTypes = {
    knightPosition: PropTypes.arrayOf(
        PropTypes.number.isRequired
    ).isRequired
};

export default DragDropContext(HTML5Backend)(Board);