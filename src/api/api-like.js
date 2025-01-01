import useAuthStore from "../store/authStore"

const API_BASE_URL = 'http://localhost:3000/puzzles'
const token = useAuthStore.getState().token
// 좋아요 여부 확인
export async function getLikes(puzzleId) {
  const response = await fetch(`${API_BASE_URL}/${puzzleId}/likes`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // 토큰을 Authorization 헤더에 추가
    },
  })

  if (!response.ok) {
    throw new Error('Failed to post like:', response.statusText)
  }
  return response.json()
}
// 좋아요 추가
export async function postLikes(puzzleId) {
  const response = await fetch(`${API_BASE_URL}/${puzzleId}/likes`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // 토큰을 Authorization 헤더에 추가
    },
  })

  if (!response.ok) {
    throw new Error('Failed to post like')
  }
  return response.json()
}

// 좋아요 취소
export async function removeLikes(puzzleId) {

  const response = await fetch(`${API_BASE_URL}/${puzzleId}/likes`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })

  if (!response.ok) {
    throw new Error('Failed to remove like')
  }
  return response.json()
}