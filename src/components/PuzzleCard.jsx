import { StarIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { Stage, Layer } from 'react-konva'
import { useRef, useEffect, useState } from 'react'
import Matchstick from './Matchstick'

export default function PuzzleCard({ puzzle }) {
  const {
    id,
    title,
    difficulty,
    category,
    createBy,
    initialState
  } = puzzle

  const [matchsticks, setMatchsticks] = useState([])
  const [scale, setScale] = useState(1)
  const imageRef = useRef(null)
  const containerRef = useRef(null)

  // 이미지 로드
  useEffect(() => {
    const img = new window.Image()
    img.src = "/matchstick.webp"
    img.onload = () => {
      imageRef.current = img
      const initialMatchsticks = JSON.parse(initialState)
      setMatchsticks(initialMatchsticks)
    }
  }, [initialState])

  // 스테이지 크기 업데이트
  const updateStageSize = () => {
    if (!containerRef.current || !matchsticks.length) return;

    const container = containerRef.current.getBoundingClientRect();
    console.log('Container size:', container.width, container.height);  // 디버깅 로그

    const containerWidth = container.width;
    const containerHeight = container.height;

    // 성냥의 바운딩 박스 계산
    const minX = Math.min(...matchsticks.map((stick) => stick.x));
    const maxX = Math.max(...matchsticks.map((stick) => stick.x));
    const minY = Math.min(...matchsticks.map((stick) => stick.y));
    const maxY = Math.max(...matchsticks.map((stick) => stick.y));

    console.log('Bounding box:', { minX, maxX, minY, maxY });  // 디버깅 로그

    const boundingWidth = maxX - minX;
    const boundingHeight = maxY - minY;

    // 스케일 계산
    const scaleX = containerWidth / boundingWidth;
    const scaleY = containerHeight / boundingHeight;
    const newScale = Math.min(scaleX, scaleY) * 0.7;

    console.log('New scale:', newScale);  // 디버깅 로그

    setScale(newScale);
    
    // 중앙 정렬을 위한 오프셋 계산
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setMatchsticks(prev => prev.map(stick => ({
      ...stick,
      x: stick.x - centerX + containerWidth / (2 * newScale),
      y: stick.y - centerY + containerHeight / (2 * newScale),
    })));
  };

  // 리사이즈 이벤트 리스너 등록
  useEffect(() => {
    updateStageSize();  // 초기 실행
    const handleResize = () => {
      requestAnimationFrame(updateStageSize);  // 성능 최적화
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [matchsticks]);  // matchsticks가 변경될 때마다 실행

  const categoryList = JSON.parse(category)

  return (
    <Link 
      to={`/puzzle/${id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      <div 
        ref={containerRef}
        className="aspect-w-16 aspect-h-9 bg-stone-200"
      >
        <Stage
          width={containerRef.current?.offsetWidth || 300}
          height={containerRef.current?.offsetHeight || 169}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            {matchsticks.map((stick) => (
              <Matchstick
                key={stick.id}
                stick={stick}
                image={imageRef.current}
                isSelected={false}
                onSelect={() => {}}
                onDragEnd={() => {}}
                onTransformEnd={() => {}}
                canMove={false}
              />
            ))}
          </Layer>
        </Stage>
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
        <div className="flex flex-wrap gap-2 mb-3">
          {categoryList.map(tag => (
            <span 
              key={tag} 
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="ml-2">{createBy}</span>
        </div>
      </div>
    </Link>
  )
}