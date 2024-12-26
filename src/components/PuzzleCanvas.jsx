import { useRef, useEffect, useState, Fragment } from "react"
import { Stage, Layer, Transformer, Text } from "react-konva"
import Matchstick from "./Matchstick"
import {checkRemoveSimilarity, checkMoveSimilarity } from "../utils/calculator"
import ResultModal from "./ResultModal"

export default function PuzzleCanvas({ puzzleData }) {
  // 게임 초기 데이터
  const [initMatchstick, setInitMatchstick] = useState([])
  const [matchsticks, setMatchsticks] = useState([])
  const [gameType, setGameType] = useState("")
  const [limit, setLimit] = useState(0)
  const [scale, setScale] = useState(1) // Stage 확대/축소 비율
  const [likes, setLikes] = useState(0) 

  // 게임 상태
  const [selectedMatchstick, setSelectedMatchstick] = useState(null)
  const [history, setHistory] = useState([]) // 상태 기록
  const [currentStep, setCurrentStep] = useState(-1) // 현재 상태
  const [moveCounts, setMoveCounts] = useState({})

  // 모달창
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({})

  const imageRef = useRef(null)
  const transformerRef = useRef(null)
  const stageRef = useRef(null)
  const stageContainerRef = useRef(null)

  const adjustCenter = () => {
    if (!stageContainerRef.current || !matchsticks.length) return
    
    const stageContainer = stageContainerRef.current.getBoundingClientRect()
    const stageWidth = stageContainer.width
    const stageHeight = stageContainer.height
    
    // 성냥의 바운딩 박스 계산
    const minX = Math.min(...matchsticks.map((stick) => stick.x))
    const maxX = Math.max(...matchsticks.map((stick) => stick.x))
    const minY = Math.min(...matchsticks.map((stick) => stick.y))
    const maxY = Math.max(...matchsticks.map((stick) => stick.y))

    const boundingWidth = maxX - minX
    const boundingHeight = maxY - minY

    // 스테이지 스케일 계산
    const scaleX = stageWidth / boundingWidth;
    const scaleY = stageHeight / boundingHeight;
    const newScale = Math.min(scaleX, scaleY) * 0.77 // 여백을 위해 0.77 배율 추가

    const stageCenter = {
      x: stageWidth / 2,
      y: stageHeight / 2,
    };
    
    const matchsticksCenter = {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
    };
    
    const newOffset = {
      x: stageCenter.x - matchsticksCenter.x * newScale,
      y: stageCenter.y - matchsticksCenter.y * newScale,
    };

    setScale(newScale); // 스케일 업데이트

    setMatchsticks(prev => prev.map(stick => ({
      ...stick,
      x: stick.x + newOffset.x,
      y: stick.y + newOffset.y,
    })));
    setInitMatchstick(prev => prev.map(stick => ({
      ...stick,
      x: stick.x + newOffset.x,
      y: stick.y + newOffset.y,
    })))
  };
  // JSON 데이터 로드
  useEffect(()=>{
    function loadGameData() {
      if(!puzzleData || !puzzleData.id ) return

      const initialMatchsticks = JSON.parse(puzzleData.initialState);
      setMatchsticks(initialMatchsticks)
      setInitMatchstick(initialMatchsticks)
      setGameType(puzzleData.gameType)
      setLimit(puzzleData.limit)
      setCurrentStep(-1)
      adjustCenter()
    }
    loadGameData()
  }, [puzzleData])

  // 이미지 로드
  useEffect(() => {
    const img = new window.Image()
    img.src = "/matchstick.webp" // 이미지 경로
    img.onload = () => {
      imageRef.current = img;
      setMatchsticks((sticks) => [...sticks])
    };
  }, []);

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
  }, [selectedMatchstick, matchsticks])

  const handleSelect = (id) => {
    setSelectedMatchstick((current) => (current === id ? null : id));
  };

  const handleDragEnd = (e, id) => {
    // 드래그 완료 후 위치 업데이트
    if (gameType === "remove") {
      alert("현재 상태에서는 이동이 불가능합니다.");
      return;
    }
    // 정수로 반올림
    const x = Math.round(e.target.x())
    const y = Math.round(e.target.y())
    const newPosition = { x, y }

    const findOne = matchsticks.find((stick) =>  stick.id === id)
    
    const currentMoveCount = Object.keys(moveCounts).length;
    // 이동 제한 확인
    if (currentMoveCount >= limit) {
      if (!moveCounts[id]){
        alert('이동 제한에 도달했습니다.')
        restorePreviousPosition(id)
        return;
      }
    }
    // 상태 업데이트
    setMatchsticks((prev) =>
      prev.map((stick) =>
        stick.id === id ? { ...stick, ...newPosition } : stick
      )
    )
    const before = {x: findOne.x, y: findOne.y }
    const after = { x, y }
    
    saveState("move", id, before, after)
  }

  const handleRotateEnd = (newAngle, id) => {
    // 정수로 반올림
    const roundedAngle = Math.round(newAngle)
    const findOne = matchsticks.find((stick) =>  stick.id === id)
    
    const currentMoveCount = Object.keys(moveCounts).length;
    // 이동 제한 확인
    if (currentMoveCount >= limit) {
      if (!moveCounts[id]){
        alert('이동 제한에 도달했습니다.')
        restorePreviousPosition(id)
        return;
      }
    }
    // 회전 완료 후 각도 업데이트
    setMatchsticks((prev) =>
      prev.map((stick) => 
        stick.id === id ? { ...stick, angle: roundedAngle} : stick
      )
    )
    // 상태 저장
    const before = {angle: findOne.angle}
    const after = {angle: newAngle}
    saveState("rotate", id, before, after)
  }

  const saveState = (type, id, before, after) => {

    const newHistory = history.slice(0, currentStep + 1) // 현재 상태 이후의 기록 삭제
    newHistory.push({
      type,
      id,
      before, 
      after,
    }) // 새로운 상태 저장

    // 이동 카운트 업데이트
    const updatedMoveCounts = {
      ...moveCounts,
      [id]: (moveCounts[id] || 0) + 1,
    };

    setMoveCounts(updatedMoveCounts);
    setHistory(newHistory)
    setCurrentStep(newHistory.length - 1) // 현재 상태를 마지막으로 이동
  }

  // 상태 복원 함수
  const restorePreviousPosition = (id) => {
    const findOne =  initMatchstick.find((stick) =>  stick.id === id)

    setMatchsticks((prev) =>
      prev.map((stick) =>
        stick.id === id ? {...findOne} : stick
      )
    )
    const node = stageRef.current.findOne(`#${id}`);
    if (node) {
      node.position({ x: findOne.x, y: findOne.y }); // React 상태를 Konva 노드에 반영
      node.rotation(findOne.angle);
      node.getLayer().batchDraw(); // 화면 강제 갱신
    }
  }

  const undo = () => {
    if (currentStep >= 0) {
      const { id, before } = history[currentStep]

      setMatchsticks((prev) =>
        prev.map((stick) =>
          stick.id === id ? {...stick , ...before} : stick
        )
      )

      setMoveCounts((prev) => {
        const newCounts = { ...prev };
        newCounts[id] -= 1;
        if (newCounts[id] === 0) {
          delete newCounts[id]; // 카운트가 0이면 삭제
        }
        return newCounts;
      });

      setCurrentStep(currentStep - 1); // 이전 단계로 이동
    }
  }
  const redo = () => {
    if (currentStep < history.length - 1) {
      const { id, after } = history[currentStep + 1]

      setMatchsticks((prev) =>
        prev.map((stick) =>
          stick.id === id ? {...stick, ...after} : stick
        )
      )

      setMoveCounts((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));

      setCurrentStep(currentStep + 1)
    }
  }

  const reset = () => {
    try {
      setMatchsticks(initMatchstick)
      setHistory([])
      setCurrentStep(-1)
      setSelectedMatchstick(null)
      setMoveCounts({})
    } catch (error) {
      console.error("Failed to parse initialState during reset:", error)
      setMatchsticks([]) // 기본값으로 설정
    }
  };

  // 좋아요 증가 핸들러
  const handleLike = () => {
    setLikes((prev) => prev + 1);
  };

  const handleRemove = () => {
    if (gameType !== "remove") {
      alert("삭제할 수 없습니다.")
      return
    }
    if (Object.keys(moveCounts).length >= limit) {
      alert("삭제 제한을 초과했습니다.")
      return
    }
    if (selectedMatchstick) {
      const select = matchsticks.find((stick) => stick.id === selectedMatchstick)
      setMatchsticks((prev) =>
        prev.map((stick) =>
          stick.id === selectedMatchstick ? {...stick, isDeleted: true} : stick
        )
      )
      setSelectedMatchstick(null)
      const before = { ...select, isDeleted: false }
      const after = { ...select, isDeleted: true }
      saveState("remove", selectedMatchstick, before, after)
    }
  }

  const handleBackgroundClick = (e) => {
    // 선택한 target이 Stage 일때만 선택 해제
    if (e.target === e.target.getStage()) {
      setSelectedMatchstick(null)
    }
  }
  const handleCheckAnswer = () => {
    const solution = JSON.parse(puzzleData.solution)
    let isCorrect = false;
    
    if (gameType === "move") {
      isCorrect = checkMoveSimilarity(matchsticks, solution, 10)
    } else if (gameType === "remove") {
      isCorrect = checkRemoveSimilarity(moveCounts, solution, limit)
    }
    if (isCorrect) {
      setModalContent({
        message: "정답입니다!",
        buttons: [
          { label: "확인", onClick: () => setIsModalOpen(false) }
        ],
      });
    } else {
      setModalContent({
        message: "오답입니다.",
        buttons: [
          { label: "확인", onClick: () => setIsModalOpen(false) }
        ],
      });
    }
    setIsModalOpen(true)
  }
  
  useEffect(() => {
    const updateStageSize = () => {
      const stageContainer = document.querySelector(".stage-container"); // Tailwind 스타일이 적용된 요소
      if (stageContainer) {
        const width = stageContainer.offsetWidth; // 실제 width 가져오기
        const height = stageContainer.offsetHeight; // 실제 height 가져오기
        stageRef.current.width(width);
        stageRef.current.height(height);
      }
    };
  
    updateStageSize()
    window.addEventListener("resize", updateStageSize)
  
    return () => window.removeEventListener("resize", updateStageSize)
  }, [])

  return (
    <>
    <div className="pt-5 text-neutral-800 pl-2 pb-2 font-bold text-2xl">{puzzleData?.title}</div>
    {isModalOpen && (
        <ResultModal
          message={modalContent.message}
          buttons={modalContent.buttons}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <div ref={stageContainerRef} className="relative stage-container w-full h-[70vh] bg-stone-200 rounded-3xl">
        <div className="absolute w-full top-2 left-2 flex flex-row z-20">
            <button className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35" onClick={reset} disabled={currentStep < 0}>⏮️</button>
            <button className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35" onClick={undo} disabled={currentStep < 0}>◀️</button>
            <button className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35" onClick={redo} disabled={currentStep >= history.length - 1}>▶️</button>
            {gameType !== "move" ? <button className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35" onClick={handleRemove} disabled={selectedMatchstick == null} >Remove</button> : null}
            <button className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35" onClick={handleCheckAnswer} disabled={Object.keys(moveCounts).length !== limit}>✅</button>
          <div className="absolute top-1.5 right-6 font-mono text-gray-500">Left : {limit - Object.keys(moveCounts).length}</div>
        </div>
        <Stage
          ref={stageRef}
          scaleX={scale}
          scaleY={scale}
          width={stageContainerRef.current?.offsetWidth || window.innerWidth}
          height={stageContainerRef.current?.offsetHeight || window.innerHeight * 0.7}
          onClick={handleBackgroundClick}
          onTap={handleBackgroundClick}
        >
          <Layer>
            {matchsticks
              .filter((stick) => !stick.isDeleted)
              .map((stick) => (
                <Fragment key={stick.id}>
                  <Matchstick
                    key={stick.id}
                    stick={stick}
                    image={imageRef.current}
                    isSelected={stick.id === selectedMatchstick}
                    onSelect={handleSelect}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={handleRotateEnd}
                    canMove={gameType === "move"}
                  />
                  {/* 성냥개비 위에 id를 표시 */}
                  <Text
                    x={stick.x} // Rect의 중심 위에 배치
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
              rotateEnabled={gameType === "move"}
            />
          </Layer>
        </Stage>
        <div className="flex items-center justify-between gap-2 -translate-y-10 w-full">
          <div className="translate-x-2">
            <button
              onClick={handleLike}
              className="px-2 py-1 rounded-full hover:bg-pink-200"
            >
            ❤️ 
            </button>
            <span className="font-mono text-gray-700 ml-1">{likes} Likes</span>
          </div>
          <div className="-translate-x-4 font-serif text-stone-500">
            createdBy @seungho
          </div>
        </div>
      </div>
    </>
  )
}