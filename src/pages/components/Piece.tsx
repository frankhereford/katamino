import React, { useState, useEffect } from 'react'
import { trpc } from "../../utils/trpc";

// One of the pieces in the game

interface PieceProps {
  id?: string;
}

export default function PiecePage(props: PieceProps) {

  // may not need this randomPiece call..., if i had an ID passed to me and could get the typing figured out
  const { data: randomPiece } = trpc.piece.randomPiece.useQuery(undefined, { enabled: true });
  const { data: propsPiece } = trpc.piece.getPiece.useQuery({ id: props.id }, {enabled: (props.id != null)});
  const [piece, setPiece] = useState<typeof randomPiece | null | undefined>(randomPiece) // somehow tell it that it's a piece

  useEffect(() => {
    if (!piece?.id && props.id) {
      setPiece(propsPiece)
    }
    else if (!piece?.id && !props.id) {
      setPiece(randomPiece)
    }
  })


  return (
    <div>
      Piece: {piece?.id}
    </div>
  );
}