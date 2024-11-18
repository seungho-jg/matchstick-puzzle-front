import PuzzleCanvas from "../../components/PuzzleCanvas";

export default function PuzzleDetail() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <PuzzleCanvas />
      </div>
      <div>
        <h2>Puzzle Info</h2>
        <p>This is where puzzle-related info will go!</p>
      </div>
    </div>
  );
}