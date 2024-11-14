import { useParams } from "react-router-dom";
// import PuzzleCanvas from "../components/PuzzleCanvas";
// import PuzzleInfo from "../components/PuzzleInfo";

export default function PuzzleDetail() {
  const { puzzleId } = useParams();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {/* <PuzzleCanvas puzzleId={puzzleId} /> */}
      </div>
      <div>
        {/* <PuzzleInfo puzzleId={puzzleId} /> */}
      </div>
    </div>
  );
}