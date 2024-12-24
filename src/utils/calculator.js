function normalizeAngle(angle) {
  return angle % 180; // 0~179 범위로 변환
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

export const checkRemoveSimilarity = (moveCounts, solution, limit) => {
  // 이동 횟수 확인
  if (Object.keys(moveCounts).length !== limit) return false

  // 삭제된 성냥개비의 id 가져오기
  const removeIds = Object.keys(moveCounts);
  
  // 삭제된 성냥이 solution과 정확히 일치하는지 확인
  return !solution.some(stick => {
    return removeIds.includes(stick.id)
  })
}

 export const checkMoveSimilarity = (currentState, solution, threshold = 30) => {
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