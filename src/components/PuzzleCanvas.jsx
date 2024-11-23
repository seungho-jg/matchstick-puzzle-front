import { useRef, useEffect, useState } from "react"
import { Stage, Layer, Image, Transformer } from "react-konva"
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
  // const [history, setHistory] = useState([]) // 상태 기록
  // const [currentStep, setCurrentStep]

  const imageRef = useRef(null);
  const transformerRef = useRef(null);
  const stageRef = useRef(null);

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
    const newPosition = { x: e.target.x(), y: e.target.y() }

    setMatchsticks((prev) =>
      prev.map((stick) =>
        stick.id === id ? { ...stick, ...newPosition } : stick
      )
    )
    // 상태 저장
    saveState()
  }

  const handleRotateEnd = (newAngle, id) => {
    // 정수로 반올림
    const roundedAngle = Math.round(newAngle)
    
    // 회전 완료 후 각도 업데이트
    setMatchsticks((prev) =>
      prev.map((stick) => 
        stick.id === id ? { ...stick, angle: roundedAngle} : stick
      )
    )
    // 상태 저장
    saveState()
  }

  const saveState = () => {

  }

  const handleBackgroundClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedMatchstick(null)
    }
  }

  return (
    <>
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={handleBackgroundClick}
      onTap={handleBackgroundClick}
    >
      <Layer>
        {matchsticks.map((stick) => (
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