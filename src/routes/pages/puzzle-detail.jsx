import { useParams } from "react-router-dom";
import PuzzleCanvas from "../../components/PuzzleCanvas";
import { useEffect, useState } from "react";
import { fetchPuzzleById } from "../../api/api-puzzle";

export default function PuzzleDetail() {
  const { puzzleId } = useParams()
  const [puzzleData, setPuzzleData] = useState(null);
  useEffect(() => {
    async function loadPuzzle() {
      if (!puzzleId) {
        console.error("puzzleId is undefined"); // 디버깅 로그 추가
        return;
      }
      try {
        const data = await fetchPuzzleById(puzzleId)
        setPuzzleData(data)
      } catch (error) {
        console.error("Failed to load a puzzle data:", error)
      }
    }
    loadPuzzle()
  }, [puzzleId])
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