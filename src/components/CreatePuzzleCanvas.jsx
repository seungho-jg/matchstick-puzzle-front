import { useState, useRef, useEffect, Fragment } from 'react';
import { Stage, Layer, Transformer, Text } from 'react-konva';
import Matchstick from './Matchstick';
import { v4 as uuidv4 } from 'uuid';
import { createPuzzle } from '../api/api-puzzle';
import { useNavigate } from 'react-router-dom';

export default function CreatePuzzleCanvas() {
  const navigate = useNavigate();
  // 상태 관리
  const [title, setTitle] = useState('');
  const [gameType, setGameType] = useState('move');
  const [category, setCategory] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [limit, setLimit] = useState(1);
  const [limitcheck, setLimitcheck] = useState(1);
  const [moveCounts, setMoveCounts] = useState({})

  const [currentMathchstick, setCurrentMatchstick] = useState([]);
  const [initialMathchstick, setInitialMatchstick] = useState([]);
  const [solutions, setSolutions] = useState([[]]);  // 복수의 정답을 위한 배열
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [selectedMatchstick, setSelectedMatchstick] = useState(null);
  const [isInitialStateConfirmed, setIsInitialStateConfirmed] = useState(false);
  const [isHandToolActive, setIsHandToolActive] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const imageRef = useRef(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null)
  const stageContainerRef = useRef(null);

  // 이미지 로드
  useEffect(() => {
    const img = new window.Image();
    img.src = "/matchstick.webp";
    img.onload = () => {
      imageRef.current = img;
    };
  }, []);



  // 성냥개비 추가
  const handleAdd = () => {
    if (isInitialStateConfirmed) {
      return; // 초기 상태 확인 후에는 새로운 성냥개비 추가 불가
    }

    const container = stageContainerRef.current.getBoundingClientRect();
    const newMatchstick = {
      id: uuidv4().substring(0,5),
      x: container.width / 2,
      y: container.height / 2,
      angle: 0,
    };

    setCurrentMatchstick(prev => [...prev, newMatchstick]);
  };

  
  const handleRemove = () => {
    if (limitcheck <= Object.keys(moveCounts).length) {
      alert("제거할 수 있는 성냥개비가 없습니다.")
      return
    }
    if (isInitialStateConfirmed && !moveCounts[selectedMatchstick]) {
      setMoveCounts(prev => ({
        ...prev,
        [selectedMatchstick]: true
      }));
    }
    if (selectedMatchstick) {
      setCurrentMatchstick((prev) =>
        prev.filter((stick) => stick.id !== selectedMatchstick)
      );
      setSelectedMatchstick(null);
    }
  }

  const handleBackgroundClick = (e) => {
    // 선택한 target이 Stage 일때만 선택 해제
    if (e.target === e.target.getStage()) {
      setSelectedMatchstick(null)
    }
  }

  // 초기 상태 확인
  const handleConfirmInitialState = () => {
    if (currentMathchstick.length === 0) {
      alert("성냥개비가 없습니다.")
      return
    }

    if (limit > currentMathchstick.length) {
      alert("초기 상태 개수가 제한 개수보다 많습니다.")
      return
    }

    setInitialMatchstick(currentMathchstick.map(stick => ({ ...stick, id: "initial-" + stick.id })));
    setSolutions([]);
    setLimitcheck(limit);
    setIsInitialStateConfirmed(true);
  };

  // 이동 횟수 체크
  const canMove = (id) => {
    if (!isInitialStateConfirmed) return true;  // 초기 상태에서는 모두 이동 가능
    if (moveCounts[id]) return true;  // 이미 이동한 성냥개비는 계속 이동 가능
    return Object.keys(moveCounts).length < limitcheck;  // 새로운 성냥개비는 limit 체크
  };
  // 초기화
  const handleReset = () => {
    setCurrentMatchstick(initialMathchstick.map(stick => ({ ...stick , id: stick.id.replace('initial-', '')})));
    setMoveCounts({});
    setSolutions([[]]);
    setCurrentSolutionIndex(0);
    setInitialMatchstick([]);
    setIsInitialStateConfirmed(false);
  }

  // 새로운 정답 추가
  const handleAddSolution = () => {
    if (Object.keys(moveCounts).length === 0) {
      alert("이동한 성냥개비가 없습니다.")
      return
    }
    setSolutions(prev => [...prev, currentMathchstick.map(stick => ({ ...stick }))]);
    setCurrentSolutionIndex(prev => prev + 1);
    setCurrentMatchstick(initialMathchstick.map(stick => ({ ...stick , id: stick.id.replace('initial-', '')})));
    setMoveCounts({});
  };

  // 카테고리 추가
  const handleAddCategory = () => {
    if (categoryInput.trim() && !category.includes(categoryInput.trim())) {
      setCategory(prev => [...prev, categoryInput.trim()]);
      setCategoryInput('');
    }
  };

  // 퍼즐 제출
  const handleSubmit = async () => {
    const puzzleData = {
      title,
      gameType,
      limit,
      initialState: initialMathchstick.map(stick => ({
        ...stick,
        id: stick.id.replace('initial-', '')
      })),
      solution: solutions,
      category,
    };

    try {
      await createPuzzle(puzzleData);
      alert('퍼즐이 성공적으로 생성되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('퍼즐 생성 실패:', error);
      alert('퍼즐 생성에 실패했습니다.');
    }
  };

  const handleDragEnd = (e, id) => {
    // 드래그 완료 후 위치 업데이트
    // 정수로 반올림
    const x = Math.round(e.target.x())
    const y = Math.round(e.target.y())
    const newPosition = { x, y }

    if (isInitialStateConfirmed && !moveCounts[id]) {
      // 처음 이동하는 경우에만 카운트 증가
      setMoveCounts(prev => ({
        ...prev,
        [id]: true
      }));
    }

    // 상태 업데이트
    setCurrentMatchstick((prev) =>
      prev.map((stick) =>
        stick.id === id ? { ...stick, ...newPosition } : stick
      )
    )
  }

  const handleRotateEnd = (newAngle, id) => {
    // 정수로 반올림
    const roundedAngle = Math.round(newAngle)
    
    if (isInitialStateConfirmed && !moveCounts[id]) {
      setMoveCounts(prev => ({
        ...prev,
        [id]: true
      }));
    }
    // 회전 완료 후 각도 업데이트
    setCurrentMatchstick((prev) =>
      prev.map((stick) => 
        stick.id === id ? { ...stick, angle: roundedAngle} : stick
      )
    )
  }

  // Transformer 업데이트
  useEffect(() => {
    const tr = transformerRef.current;
    if (tr) {
      if (selectedMatchstick) {
        const selectedNode = stageRef.current.findOne(`#${selectedMatchstick}`);
        if (selectedNode) {
          tr.nodes([selectedNode]) // 선택된 노드에 Transformer 적용
          tr.getLayer().batchDraw()
        }
      } else {
        tr.nodes([]) // 선택 해제 시 Transformer 초기화
      }
    }
  }, [selectedMatchstick, currentMathchstick])

  // 줌 인
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3)); // 최대 3배까지 확대
  };

  // 줌 아웃
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.3)); // 최소 0.3배까지 축소
  };

  // 핸드툴 활성/비활성
  const handleHandTool = () => {
    setIsHandToolActive(!isHandToolActive);
    setSelectedMatchstick(null);
  };

  // 스테이지 이동 (핸드툴)
  const handleDragStage = (e) => {
    if (!isHandToolActive) return;
    setStagePos({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="퍼즐 제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="카테고리 추가"
            value={categoryInput}
            onChange={e => setCategoryInput(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button 
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            추가
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.map((cat, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-200 rounded"
              onClick={() => setCategory(prev => prev.filter((_, i) => i !== index))}
            >
              {cat} ×
            </span>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute w-full top-2 left-2 flex flex-row z-20 pointer-events-none">
          <div className="pointer-events-auto flex">
          <button 
              className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35"
              onClick={() => {setGameType(gameType === "move" ? "remove" : "move")}}
              disabled={isInitialStateConfirmed}
            >
              {gameType === "move" ? "이동" : "제거"}
            </button>
            <button 
              className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35"
              onClick={handleZoomOut}
            >
              🔍-
            </button>
            <button 
              className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35"
              onClick={handleZoomIn}
            >
              🔍+
            </button>
            <button 
              className={`hover:bg-stone-300 rounded-md px-2 py-1 ${isHandToolActive ? 'bg-stone-300' : ''}`}
              onClick={handleHandTool}
            >
              ✋
            </button>
          </div>
          {isInitialStateConfirmed ? (
            <div className="absolute top-1.5 right-6 font-mono text-gray-500 select-none pointer-events-none">
              limit : {limitcheck - Object.keys(moveCounts).length}
            </div>
          ) : (
            <div className="flex flex-row gap-2 absolute right-4 top-1.5">
            <div className="font-mono text-gray-500 select-none pointer-events-none">
              limit :
            </div>
            <input
              type="number"
              min="1"
              value={limit}
              onChange={e => setLimit(Number(e.target.value))}
              placeholder={`${gameType === 'move' ? '이동' : '제거'} 개수`}
              className="text-center w-12 border rounded pointer-events-auto"
            />
            </div>
          )}
        </div>

        <div 
          ref={stageContainerRef}
          className={`w-full h-[50vh] bg-stone-200 rounded-lg overflow-hidden ${
            isHandToolActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}>
          <Stage
            ref={stageRef}
            width={stageContainerRef.current?.offsetWidth || window.innerWidth}
            height={stageContainerRef.current?.offsetHeight || window.innerHeight * 0.5}
            scaleX={zoom}
            scaleY={zoom}
            x={stagePos.x}
            y={stagePos.y}
            draggable={isHandToolActive}
            onDragEnd={handleDragStage}
            onClick={handleBackgroundClick}
            onTap={handleBackgroundClick}
          >
            <Layer>
            {isInitialStateConfirmed && initialMathchstick.map((stick) => (
              <Matchstick
                key={`initial-${stick.id}`}
                stick={stick}
                image={imageRef.current}
                isSelected={false}
                onSelect={() => {}} // 선택 불가
                opacity={0.4} // 반투명 처리
                draggable={false} // 드래그 불가
              />
            ))}
              {currentMathchstick
                .map((stick) => (
                  <Fragment key={stick.id}>
                    <Matchstick
                      key={stick.id}
                      stick={stick}
                      image={imageRef.current}
                      onSelect={() => {
                        // 초기 상태이거나, 이미 이동한 성냥개비이거나, limit을 초과하지 않은 경우만 선택 가능
                        if (!isHandToolActive && (!isInitialStateConfirmed || moveCounts[stick.id] || Object.keys(moveCounts).length < limitcheck)) {
                          setSelectedMatchstick(stick.id);
                        }
                      }}
                      onDragEnd={(e) => handleDragEnd(e, stick.id)}
                      onTransformEnd={(angle) => handleRotateEnd(angle, stick.id)}
                      canMove={!isHandToolActive && canMove(stick.id)}
                    />
                    {/* 성냥개비 위에 id를 표시 */}
                    <Text
                      x={stick.x-10} // Rect의 중심 위에 배치
                      y={stick.y } // Rect의 위쪽에 배치
                      text={stick.id}
                      fontSize={14}
                      fill="black"
                      align="center"
                    />
                  </Fragment>
              ))}
              {/* Transformer */}
              <Transformer
                ref={transformerRef}
                rotationSnaps={[0, 90, 180, 270]} // 회전 스냅
                anchorSize={10} // 앵커 크기
                anchorCornerRadius={3}
                centeredScaling={true}
                resizeEnabled={false} // 크기 조정 비활성화
                rotateEnabled={!isInitialStateConfirmed || isInitialStateConfirmed&&(gameType === "move")}
              />
            </Layer>
          </Stage>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="space-x-2">
          <button 
            onClick={handleAdd}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-200 disabled:text-gray-300"
            disabled={isInitialStateConfirmed}
          >
            추가
          </button>
          <button 
            onClick={handleRemove}
            disabled={!selectedMatchstick || (isInitialStateConfirmed && gameType === "move")}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-200 disabled:text-gray-300"
          >
            제거
          </button>
        </div>
        {!isInitialStateConfirmed ? (
          <button 
            onClick={handleConfirmInitialState}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            초기값 확인
          </button>
        ) : (
          <div className="space-x-2">
            <select
              value={currentSolutionIndex}
              onChange={e => setCurrentSolutionIndex(Number(e.target.value))}
              className="p-2 border rounded"
            >
              {solutions.map((_, index) => (
                <option key={index} value={index}>정답 {index + 1}</option>
              ))}
            </select>
            <button 
              onClick={handleAddSolution}
              className="px-2 py-2 bg-blue-500 text-white rounded"
            >
              추가
            </button>
            <button 
              onClick={handleSubmit}
              className="px-2 py-2 bg-green-500 text-white rounded"
            >
              제출
            </button>
            <button 
              onClick={handleReset}
              className="px-2 py-2 bg-red-500 text-white rounded"
            >
              초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
