import { useEffect, useState } from 'react'
import PuzzleCard from '../../components/PuzzleCard'
import { fetchAllPuzzles } from '../../api/api-puzzle';
import { getPuzzleCreateCount } from '../../api/api-user';
import useAuthStore from '../../store/authStore';

export default function Home() {
  const [puzzles, setPuzzles] = useState([])
  const [error, setError] = useState(null);
  const setPuzzleCreateCount = useAuthStore((state) => state.setPuzzleCreateCount);

  const fetchPuzzleCreateCount = async () => {
    try {
      const response = await getPuzzleCreateCount();
      setPuzzleCreateCount(response.puzzleCreateCount);
    } catch (error) {
      console.error('퍼즐 생성 카운트 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchPuzzleCreateCount();
  }, []);

  useEffect(() => {
    async function loadPuzzles() {
      try {
        const data = await fetchAllPuzzles()
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