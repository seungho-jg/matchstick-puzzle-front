import { StarIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'

export default function PuzzleCard({ puzzle }) {
  const {
    id,
    title,
    difficulty,
    thumbnailUrl,
    tags,
    rating,
    totalRatings,
    author
  } = puzzle

  return (
    <Link 
      to={`/puzzle/${id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      <div className="aspect-w-16 aspect-h-9">
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className={`
            px-2 py-1 rounded text-sm font-medium
            ${difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
              difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}
          `}>
            {difficulty}
          </span>
        </div>
        <div className="flex items-center mb-2">
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <span className="ml-1 text-gray-700">
            {rating} ({totalRatings})
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map(tag => (
            <span 
              key={tag} 
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <img 
            src={author.avatarUrl} 
            alt={author.name}
            className="h-6 w-6 rounded-full"
          />
          <span className="ml-2">{author.name}</span>
        </div>
      </div>
    </Link>
  )
}