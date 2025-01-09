import PuzzleCard from '../../components/PuzzleCard'
import { useAllPuzzles } from '../../hooks/usePuzzle';

export default function Home() {
  
  const { 
    data: puzzles,
    isLoading,
    isError,
    error
  } = useAllPuzzles();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {puzzles.map(puzzle => (
          <PuzzleCard key={puzzle.id} puzzle={puzzle} />
        ))}
      </div>
    </div>
  )
}