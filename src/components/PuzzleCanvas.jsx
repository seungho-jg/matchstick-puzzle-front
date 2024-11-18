import { useRef, useEffect, useState } from "react"
import { Stage, Layer, Image, Transformer } from "react-konva"

export default function PuzzleCanvas() {
  const [matchsticks, setMatchsticks] = useState([
    { id: "1", x: 50, y: 50, angle: 10 },
    { id: "2", x: 200, y: 100, angle: 30 },
    { id: "3", x: 100, y: 150, angle: 180 },
    { id: "4", x: 150, y: 100, angle: 270 },
  ]);

  const [selectedMatchstick, setSelectedMatchstick] = useState(null)

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

  const handleDragMove = (e, id) => {
    const newPosition = { x: e.target.x(), y: e.target.y() };
    setMatchsticks((prev) =>
      prev.map((stick) =>
        stick.id === id ? { ...stick, ...newPosition } : stick
      )
    );
  };

  const handleRotate = (angle, id) => {
    setMatchsticks((prev) =>
      prev.map((stick) =>
        stick.id === id ? { ...stick, angle } : stick
      )
    );
  };

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
    >
      <Layer>
        {matchsticks.map((stick) => (
          <Image
            key={stick.id}
            id={stick.id}
            x={stick.x}
            y={stick.y}
            rotation={stick.angle}
            width={18}
            height={150}
            image={imageRef.current}
            draggable
            onTap={() => handleSelect(stick.id)} // 모바일 지원
            onClick={() => handleSelect(stick.id)} // 선택
            onDragMove={(e) => handleDragMove(e, stick.id)} // 이동
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
  )
}