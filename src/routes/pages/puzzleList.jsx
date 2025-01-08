import { useEffect, useState } from 'react'
import PuzzleCard from '../../components/PuzzleCard'
import { fetchAllPuzzles } from '../../api/api-puzzle';
import { useAllPuzzles } from '../../hooks/usePuzzle';

export default function PuzzleListPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const { 
    data: puzzles,
    isLoading,
    isError,
    error
  } = useAllPuzzles();
  
  useEffect(() => {
    async function loadPuzzles() {
      // 모든 카테고리를 개별 태그로 분리하여 중복 제거
      const categories = [...new Set(puzzles.flatMap(puzzle => 
        // 문자열로 된 배열을 파싱하고 평탄화
        JSON.parse(puzzle.category).flat()
      ))];
      setAllCategories(categories);
      
    }
    loadPuzzles();
  }, [puzzles]);
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // 선택된 카테고리에 따라 퍼즐 필터링
  const filteredPuzzles = selectedCategories.length === 0
    ? puzzles
    : puzzles.filter(puzzle => {
        const puzzleCategories = JSON.parse(puzzle.category);
        return selectedCategories.some(selected => 
          puzzleCategories.includes(selected)
        );
      });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 카테고리 필터 버튼들 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {allCategories.map(category => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-4 py-2 text-sm rounded-full transition-colors
              ${selectedCategories.includes(category)
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            #{category}
          </button>
        ))}
      </div>

      {/* 퍼즐 개수 표시 */}
      <div className="mb-4 text-gray-600">
        총 {filteredPuzzles.length}개의 퍼즐이 있습니다
      </div>

      {/* 퍼즐 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPuzzles.map(puzzle => (
          <PuzzleCard 
            key={puzzle.id} 
            puzzle={puzzle} 
          />
        ))}
      </div>
    </div>
  )
}