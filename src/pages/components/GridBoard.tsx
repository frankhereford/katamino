import React from 'react'
import GridSquare from './GridSquare'

// Represents a 10 x 18 grid of grid squares

export default function GridBoard(props) {

    // generates an array of 18 rows, each containing 10 GridSquares.

    const cols = 5;

    const grid = []
    for (let row = 0; row < 5; row++) {
        grid.push([])
        for (let col = 0; col < cols; col++) {
            grid[row].push(<GridSquare key={`${col}${row}`} color={`${props.color}`} />)
        }
    }

    return (
        <div className={"grid-board " + props.size}>
            {grid}
        </div>
    )
}