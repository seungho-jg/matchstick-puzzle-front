export function calculateSimilarity(currentState, solution) {
  let totalDifference = 0

  currentState.forEach((currentStick) => {
    const closestSolutionStick = solution.reduce((closest, solutionStick) => {
      const positionDifference =
        Math.abs(currentStick.x - solutionStick.x) +
        Math.abs(currentStick.y - solutionStick.y)
      const angleDifference = (Math.abs(currentStick.angle) % 180) - (Math.abs(solutionStick.angle) % 180)

      const totalDifference = positionDifference + angleDifference
      return totalDifference < closest.difference
        ? { stick: solution, difference: totalDifference }
        : closest
    }, { stick: null, difference: Infinity })

    totalDifference += closestSolutionStick.difference
  })
  return totalDifference / currentState.length
}

export function normalizeAngle(angle) {
  return angle % 180; // 0~179 범위로 변환
}