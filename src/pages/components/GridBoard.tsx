import React from 'react'
import GridSquare from './GridSquare'

// Represents a 10 x 18 grid of grid squares

export default function GridBoard(props: { piece: any; color: any; size: string; }) {

    const cols = props.piece[0].length;

    const grid = []
    for (let row = 0; row < props.piece.length; row++) {
        grid.push([])
        for (let col = 0; col < props.piece[row].length; col++) {
            grid[row].push(<GridSquare key={`${col}${row}`} color={`${props.piece[row][col] ? 'red' : props.color}`} />)
        }
    }

    return (
        <div className={"grid-board " + props.board_type} style={{ '--cols': props.piece[0].length }}>
            {grid}
        </div>
    )
}