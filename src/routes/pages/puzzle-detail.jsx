import { useParams } from "react-router-dom";
import PuzzleCanvas from "../../components/PuzzleCanvas";
import { useEffect, useState } from "react";
import { fetchPuzzleById } from "../../api/api-puzzle";
import { usePuzzleById } from "../../hooks/usePuzzle";

export default function PuzzleDetail() {
  const { puzzleId } = useParams()
  const { data: puzzleData, isLoading, error } = usePuzzleById(puzzleId)
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <PuzzleCanvas puzzleData={puzzleData}/>
      </div>
      <div>
      </div>
    </div>
  );
}