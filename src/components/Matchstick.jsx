import { Image } from "react-konva";

export default function Matchstick({ stick, image, isSelected, onSelect, onDragEnd, onTransformEnd, canMove }) {
  // console.log(isSelected)
  return (
    <Image
      id={stick.id}
      x={stick.x}
      y={stick.y}
      rotation={stick.angle}
      width={18}
      height={150}
      offset={{
        x: 9, // 이미지 폭의 절반
        y: 75, // 이미지 높이의 절반
      }}
      image={image}
      draggable={canMove}
      onTap={() => onSelect(stick.id)} // 모바일 지원
      onClick={() => onSelect(stick.id)} // 선택
      onDragEnd={(e) => onDragEnd(e, stick.id, e)}
      onTransformEnd={(e) => onTransformEnd(e.target.rotation(), stick.id)}
    />
  )
}