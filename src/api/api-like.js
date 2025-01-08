import useAuthStore from "../store/authStore"

// API 기본 URL을 환경변수에서 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


// 좋아요 여부 확인
export async function getLikes(puzzleId) {
  const token = useAuthStore.getState().token
  try {
    const response = await fetch(`${API_BASE_URL}/puzzles/${puzzleId}/likes`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get likes')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to get likes:', error)
    throw error
  }
}
// 좋아요 추가
export async function postLikes(puzzleId) {
  const token = useAuthStore.getState().token
  try {
    const response = await fetch(`${API_BASE_URL}/puzzles/${puzzleId}/likes`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to post like')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to post like:', error)
    throw error
  }
}

// 좋아요 취소
export async function removeLikes(puzzleId) {
  const token = useAuthStore.getState().token
  try {
    const response = await fetch(`${API_BASE_URL}/puzzles/${puzzleId}/likes`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to remove like')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to remove like:', error)
    throw error
  }
}