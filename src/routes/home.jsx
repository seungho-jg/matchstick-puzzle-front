import { useState } from 'react'
import PuzzleCard from '../components/PuzzleCard'

export default function Home() {
  const [puzzles, setPuzzles] = useState([
    {
      id: '1',
      title: '사각형 만들기',
      description: '4개의 성냥개비로 정사각형을 만드세요',
      difficulty: 'EASY',
      thumbnailUrl: '/thumbnails/puzzle1.png',
      tags: ['기하학', '사각형'],
      rating: 4.5,
      totalRatings: 128,
      author: {
        name: 'John Doe',
        avatarUrl: '/avatars/john.jpg'
      }
    },
    // ... more puzzles
  ])

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