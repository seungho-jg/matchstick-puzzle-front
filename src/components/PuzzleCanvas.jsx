import { useRef, useEffect, useState, Fragment } from "react"
import { Stage, Layer, Transformer, Text } from "react-konva"
import Matchstick from "./Matchstick"
import { normalizeAngle } from "../utils/calculator"
import ResultModal from "./ResultModal"

export default function PuzzleCanvas() {
  // 게임 초기 데이터
  const [gameData, setGameData] = useState(null) // JSON 데이터 저장
  const [matchsticks, setMatchsticks] = useState([])
  const [gameType, setGameType] = useState("")
  const [limit, setLimit] = useState(0)

  // 게임 상태
  const [selectedMatchstick, setSelectedMatchstick] = useState(null)
  const [history, setHistory] = useState([]) // 상태 기록
  const [currentStep, setCurrentStep] = useState(-1) // 현재 상태
  const [moveCounts, setMoveCounts] = useState({})

  // 모달창
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const imageRef = useRef(null);
  const transformerRef = useRef(null);
  const stageRef = useRef(null);

  // JSON 데이터 로드
  useEffect(()=>{
    async function loadGameData() {
      try{
        const response = await fetch("/gameData.json")
        const data = await response.json()
        setGameData(data)
        setMatchsticks(data.initialState)
        setGameType(data.gameType)
        setLimit(data.limit)
        setCurrentStep(-1)
      } catch (error) {
        console.error("Failed to load game data: ", error)
      }
    }
    loadGameData()
  }, [])

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
        // console.log(selectedNode)
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
    const findOne =  gameData.initialState.find((stick) =>  stick.id === id)

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
    setHistory([])
    setCurrentStep(-1)
    setMatchsticks(gameData.initialState)
    setSelectedMatchstick(null)
    setMoveCounts({})
  }

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
      // console.log('이전: ',select)
      setMatchsticks((prev) =>
        prev.map((stick) =>
          stick.id === selectedMatchstick ? {...stick, isDeleted: true} : stick
        )
      )
      // console.log('이후: ',select)
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
    const { solution } = gameData
    let isCorrect = false;
    
    if (gameType === "move") {
      isCorrect = checkMoveSimilarity(matchsticks, solution, 10)
    } else if (gameType === "remove") {
      isCorrect = checkRemoveSimilarity(moveCounts, solution)
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
  function toRelativeCoordinates(sticks) {
    // 전체 중심 좌표 계산
    const centerX = sticks.reduce((sum, stick) => sum + stick.x, 0) / sticks.length
    const centerY = sticks.reduce((sum, stick) => sum + stick.y, 0) / sticks.length

    // 각 성냥개비의 상대 좌표 계산
    return sticks.map((stick) => ({
      id: stick.id,
      relativeX: Math.round(stick.x - centerX),
      relativeY: Math.round(stick.y - centerY),
      angle: Math.abs(stick.angle)
    }))
  }

  const checkRemoveSimilarity = (moveCounts, solution) => {
    // 이동 횟수 확인
    if (Object.keys(moveCounts).length !== limit) return false

    // 삭제된 성냥개비의 id 가져오기
    const removeIds = Object.keys(moveCounts);
    
    // 삭제된 성냥이 solution과 정확히 일치하는지 확인
    return !solution.some(stick => {
      return removeIds.includes(stick.id)
    })
  }

  const checkMoveSimilarity = (currentState, solution, threshold = 30) => {
    // 상대 좌표로 변환
    const relativeCurrent = toRelativeCoordinates(currentState);
    const relativeSolution = toRelativeCoordinates(solution);

    if (relativeCurrent.length !== relativeSolution.length) return false

    return relativeCurrent.every((currentStick) => {
      return relativeSolution.some((solutionStick) => {
        const positionMatch =
        Math.abs(currentStick.relativeX - solutionStick.relativeX) <= threshold &&
        Math.abs(currentStick.relativeY - solutionStick.relativeY) <= threshold;
        const angleMatch =
          normalizeAngle(currentStick.angle) - normalizeAngle(solutionStick.angle) < threshold
        return positionMatch && angleMatch
      })
    })
  }
  return (
    <>
    <div className="flex flex-row gap-2 absolute z-10">
    <button className="bg-slate-200 rounded-md px-1 disabled:opacity-35" onClick={reset} disabled={currentStep < 0}>⏮️</button>
      <button className="bg-slate-200 rounded-md px-1 disabled:opacity-35" onClick={undo} disabled={currentStep < 0}>◀️</button>
      <button className="bg-slate-200 rounded-md px-1 disabled:opacity-35" onClick={redo} disabled={currentStep >= history.length - 1}>▶️</button>
      {gameType !== "move" ? <button className="bg-slate-200 rounded-md px-1 disabled:opacity-35" onClick={handleRemove} disabled={selectedMatchstick == null} >Remove</button> : null}
      <button className="bg-slate-200 rounded-md px-1 disabled:opacity-35" onClick={handleCheckAnswer} disabled={Object.keys(moveCounts).length !== limit}>✅</button>
      <div>남은 횟수 : {limit - Object.keys(moveCounts).length}</div>
    </div>
    <div className="text-center pt-10">{gameData?.title}</div>
    {isModalOpen && (
        <ResultModal
          message={modalContent.message}
          buttons={modalContent.buttons}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
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
    </>
  )
}