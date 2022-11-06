import React, { useState, useEffect } from 'react'
import { trpc } from "../../utils/trpc";

// One of the pieces in the game

interface PieceProps {
  id?: string;
}

export default function PiecePage(props: PieceProps) {

  const [piece, setPiece] = useState() // somehow tell it that it's a piece
  const { data: randomPiece } = trpc.piece.randomPiece.useQuery(undefined, {enabled: (!piece && !props.id)});
  const { data: propsPiece } = trpc.piece.getPiece.useQuery({ id: props.id }, {enabled: (props.id != null)});

  useEffect(() => {
    if (!piece?.id && props.id) {
      //console.log('just need to get a particular piece')
      //console.log(propsPiece)
      //console.log(typeof propsPiece)
      setPiece(propsPiece)
    }
    else if (!piece?.id && !props.id) {
      //console.log('just need to get a random piece')
      //console.log(randomPiece)
      setPiece(randomPiece)
    }
  })

  //if (!props.id) {
    //console.log('yo')
    //props.id = randomPiece?.id ?? "1";
    //console.log(props)
  //}


  return (
    <div>
      Piece: {piece?.id}
    </div>
  );
}