import useAuthStore from "../store/authStore"
import { jwtDecode } from "jwt-decode"
const API_BASE_URL = 'http://localhost:3000'

export const getUserId = () => {
  const token = useAuthStore.getState().token
  const userId = jwtDecode(token).sub
  return userId
}
// 유저 정보 가져오기
export async function fetchUserInfo() {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_BASE_URL}/users/me`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )
  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }
  return response.json()
}

//유저 가져오기
export async function fetchUserAll() {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
  })
  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }
  return response.json()
}