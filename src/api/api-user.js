import useAuthStore from "../store/authStore"
import { jwtDecode } from "jwt-decode"

import { API_BASE_URL } from '../config'

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

// 퍼즐 생성 카운트 조회
export const getPuzzleCreateCount = async () => {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${API_BASE_URL}/users/puzzle-create-count`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('퍼즐 생성 카운트 조회에 실패했습니다.');
  }

  return response.json();
};