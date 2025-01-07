import CreatePuzzleCanvas from '../../components/CreatePuzzleCanvas';

export default function CreatePuzzlePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">퍼즐 만들기</h1>
      <CreatePuzzleCanvas />
    </div>
  );
}
