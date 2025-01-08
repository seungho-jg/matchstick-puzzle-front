import { StarIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { Stage, Layer } from 'react-konva'
import { useRef, useEffect, useState } from 'react'
import Matchstick from './Matchstick'
import useImageStore from '../store/imageStore'

export default function PuzzleCard({ puzzle }) {
  const {
    id,
    title,
    difficulty,
    category,
    createBy,
    initialState,
    _count,
    createAt,
  } = puzzle

  const [matchsticks, setMatchsticks] = useState([])
  const [scale, setScale] = useState(1)
  const imageRef = useRef(null)
  const containerRef = useRef(null)
  const { skinImages, currentSkin, loadUserSettings } = useImageStore()

  // 스테이지 크기 업데이트
  const updateStageSize = () => {
    if (!containerRef.current || !matchsticks.length) return;

    const container = containerRef.current.getBoundingClientRect();
    const padding = 10;
    
    // 바운딩 박스 계산
    const minX = Math.min(...matchsticks.map((stick) => stick.x));
    const maxX = Math.max(...matchsticks.map((stick) => stick.x));
    const minY = Math.min(...matchsticks.map((stick) => stick.y));
    const maxY = Math.max(...matchsticks.map((stick) => stick.y));

    // 성냥개비가 1-2개일 때는 바운딩 박스에 패딩 추가
    const boundingWidth = matchsticks.length <= 4 ? 
      Math.max(maxX - minX, 100) + padding * 2 : 
      maxX - minX;
    
    const boundingHeight = matchsticks.length <= 4 ? 
      Math.max(maxY - minY, 100) + padding * 2 : 
      maxY - minY;

    // 스케일 계산
    const scaleX = container.width / boundingWidth;
    const scaleY = container.height / boundingHeight;
    const newScale = Math.min(scaleX, scaleY) * 0.7;

    setScale(newScale);
    
    // 중앙 정렬을 위한 오프셋 계산
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const updatedMatchsticks = matchsticks.map(stick => ({
      ...stick,
      x: stick.x - centerX + container.width / (2 * newScale),
      y: stick.y - centerY + container.height / (2 * newScale),
    }));

    if (JSON.stringify(updatedMatchsticks) !== JSON.stringify(matchsticks)) {
      setMatchsticks(updatedMatchsticks);
    }
  };


    // 이미지 로드
    useEffect(() => {
      loadUserSettings()
      const initialMatchsticks = JSON.parse(initialState)
      setMatchsticks(initialMatchsticks)
    }, []) // 초기 로드
  
    useEffect(() => {
      if (skinImages[currentSkin]) {
        imageRef.current = skinImages[currentSkin]
        setMatchsticks(sticks => [...sticks])
      }
    }, [currentSkin, skinImages]) // 스킨이나 이미지가 변경될 때 업데이트

    
  // 리사이즈 이벤트 리스너 등록
  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(updateStageSize);
    };
    
    if (matchsticks.length > 0) {
      updateStageSize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [matchsticks.length]); // matchsticks.length만 의존성으로 추가

  const categoryList = JSON.parse(category)

  const isNew = () => {
    const now = new Date();
    const createDate = new Date(createAt);
    const diffTime = Math.abs(now - createDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <Link 
      to={`/puzzle/${id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      <div 
        ref={containerRef}
        className="aspect-w-16 aspect-h-9 bg-stone-200"
      >
        <div className="z-30 absolute flex flex-row gap-1 pl-2 mt-2 items-center">
          {isNew() && <div className="animate-pulse text-white text-sm font-bold bg-blue-400 rounded-md px-2 py-0.5">NEW</div>}
          {_count?.attemptedByUsers > 0 && <div className="text-white text-sm font-bold bg-red-400 rounded-md px-2 py-0.5">{` ${Math.round(_count?.solvedByUsers/_count?.attemptedByUsers*100)}% `}</div>}
        </div>
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
        <div className="flex items-start justify-between mb-2 gap-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className={`
            px-2 py-1 rounded text-sm font-medium
            ${difficulty === 'Unrated' ? 'bg-gray-100 text-gray-800' :
              difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
              difficulty === 'NORMAL' ? 'bg-blue-100 text-blue-800' :
              difficulty === 'HARD' ? 'bg-orange-100 text-orange-800' :
              difficulty === 'EXTREME' ? 'bg-rose-200 text-rose-800' :
              'bg-gray-100 text-gray-800'}
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
          <span className="ml-2">{createBy?.username}</span>
        </div>
      </div>
    </Link>
  )
}