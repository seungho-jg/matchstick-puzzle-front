import { useEffect, useState } from 'react'
import PuzzleCard from '../../components/PuzzleCard'
import { fetchAllPuzzles } from '../../api/api-puzzle';

export default function Home() {
  const [puzzles, setPuzzles] = useState([])
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPuzzles() {
      try {
        const data = await fetchAllPuzzles()
        console.log('data: ', data)
        setPuzzles(data)
      } catch (error) {
        setError(error.message)
      }
    }
    loadPuzzles();
  }, [])

  if (error) {
    return <div>Error: {error}</div>;
  }

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