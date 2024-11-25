import { useRef, useEffect, useState } from "react"
import { Stage, Layer, Transformer } from "react-konva"
import Matchstick from "./Matchstick";

export default function PuzzleCanvas() {
  // 임시 데이터
  const [matchsticks, setMatchsticks] = useState([
    { id: "1", x: 50, y: 50, angle: 10 },
    { id: "2", x: 200, y: 100, angle: 30 },
    { id: "3", x: 100, y: 150, angle: 180 },
    { id: "4", x: 150, y: 100, angle: 270 },
  ]);

  const [selectedMatchstick, setSelectedMatchstick] = useState(null)
  const [history, setHistory] = useState([]) // 상태 기록
  const [currentStep, setCurrentStep] = useState(-1) // 현재 상태

  const imageRef = useRef(null);
  const transformerRef = useRef(null);
  const stageRef = useRef(null);

  // 초기 상태 관리
  useEffect(() => {
    setHistory([matchsticks])
    setCurrentStep(0)
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

    // 정수로 반올림
    const x = Math.round(e.target.x())
    const y = Math.round(e.target.y())

    const newPosition = { x, y }
    const findOne = matchsticks.find((stick) =>  stick.id === id)

    setMatchsticks((prev) =>
      prev.map((stick) =>
        stick.id === id ? { ...stick, ...newPosition } : stick
      )
    )
    // 상태 저장
    
    const before = {x: findOne.x, y: findOne.y }
    const after = { x, y }
    saveState("move", id, before, after)
  }

  const handleRotateEnd = (newAngle, id) => {
    // 정수로 반올림
    const roundedAngle = Math.round(newAngle)
    const findOne = matchsticks.find((stick) =>  stick.id === id)

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
    newHistory.push({ type, id, before, after}) // 새로운 상태 저장
    setHistory(newHistory)
    setCurrentStep(newHistory.length - 1) // 현재 상태를 마지막으로 이동
  }

  const undo = () => {
    if (currentStep >=0) {
      const { id, before } = history[currentStep]

      setMatchsticks((prev) =>
        prev.map((stick) =>
          stick.id === id ? {...stick , ...before} : stick
        )
      )
      setCurrentStep(currentStep - 1); // 이전 단계로 이동
      console.log(matchsticks)
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
      setCurrentStep(currentStep + 1)
    }
  }

  const remove = () => {
    if (selectedMatchstick) {
      const select = matchsticks.find((stick) => stick.id === selectedMatchstick)
      console.log('이전: ',select)
      setMatchsticks((prev) =>
        prev.map((stick) =>
          stick.id === selectedMatchstick ? {...stick, isDeleted: true} : stick
        )
      )
      console.log('이후: ',select)
      setSelectedMatchstick(null)
      const before = {...select, isDeleted: false}
      const after = { ...select, isDeleted: true}
      saveState("remove", selectedMatchstick, before, after)
    }
  }

  const handleBackgroundClick = (e) => {
    // 선택한 target이 Stage 일때만 선택 해제
    if (e.target === e.target.getStage()) {
      setSelectedMatchstick(null)
    }
  }

  return (
    <>
    <div className="flex flex-row gap-2 absolute z-10">
      <button className="bg-slate-200 rounded-md px-1 disabled:opacity-35" onClick={undo} disabled={currentStep <= 0}>Undo</button>
      <button className="bg-slate-200 rounded-md px-1 disabled:opacity-35" onClick={redo} disabled={currentStep >= history.length - 1}>Redo</button>
      <button className="bg-slate-200 rounded-md px-1 disabled:opacity-35" onClick={remove} disabled={selectedMatchstick == null} >Remove</button>
    </div>
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
          <Matchstick
            key={stick.id}
            stick={stick}
            image={imageRef.current}
            isSelected={stick.id === selectedMatchstick}
            onSelect={handleSelect}
            onDragEnd={handleDragEnd}
            onTransformEnd={handleRotateEnd}
          />
        ))}
        {/* Transformer */}
        <Transformer
          ref={transformerRef}
          rotationSnaps={[0, 90, 180, 270]} // 회전 스냅
          anchorSize={10} // 앵커 크기
          anchorCornerRadius={3}
          centeredScaling={true}
          resizeEnabled={false} // 크기 조정 비활성화
        />
      </Layer>
    </Stage>
    </>
  )
}