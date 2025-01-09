import { useParams } from "react-router-dom";
import PuzzleCanvas from "../../components/PuzzleCanvas";
import { usePuzzleById } from "../../hooks/usePuzzle";
import LoadingFallback from "../../components/LoadingFallback";
export default function PuzzleDetail() {
  const { puzzleId } = useParams()
  const { data: puzzleData, isLoading, error } = usePuzzleById(puzzleId)
  
  if (isLoading) return <LoadingFallback />
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