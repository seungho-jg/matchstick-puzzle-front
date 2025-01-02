const API_BASE_URL = 'http://localhost:3000'

// 유저 정보 가져오기
export async function fetchUserInfo() {
  const response = await fetch(`${API_BASE_URL}/auth/user`)
  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }
  return response.json()
}