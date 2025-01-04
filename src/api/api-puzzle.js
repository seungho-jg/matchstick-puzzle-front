import useAuthStore from "../store/authStore"

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
// 퍼즐 제거
export async function deletePuzzle(id) {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_BASE_URL}/puzzles/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!response.ok) {
    throw new Error('Failed to delete a puzzle: ', id)
  }
}

// 퍼즐 생성
export async function createPuzzle(puzzleData) {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_BASE_URL}/puzzles`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(puzzleData),
  })
  if (!response.ok) {
    throw new Error('Failed to create a puzzle')
  }
  return response.json()
}

// 퍼즐 난이도 업데이트 (관리자용)
export async function updatePuzzleDifficulty(puzzleId, difficulty) {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_BASE_URL}/admin/puzzle/${puzzleId}/difficulty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ difficulty })
  });

  if (!response.ok) {
    throw new Error('난이도 업데이트에 실패했습니다.');
  }

  return response.json();
}