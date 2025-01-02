const API_BASE_URL = 'http://localhost:3000'

// 퍼즐 전체 가져오기
export async function fetchAllPuzzles() {
  const response = await fetch(`${API_BASE_URL}/puzzles`)
  if (!response.ok) {
    throw new Error('Falied to fetch all puzzles')
  }
  return response.json()
}

// 퍼즐 가져오기
export async function fetchPuzzleById(id) {
  const response = await fetch(`${API_BASE_URL}/puzzles/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch a puzzle: ', id)
  }
  return response.json()
}

// 퍼즐 생성
export async function createPuzzle(puzzleData) {
  const response = await fetch(`${API_BASE_URL}/puzzles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(puzzleData),
  })
  if (!response.ok) {
    throw new Error('Failed to create a puzzle')
  }
  return response.json()
}