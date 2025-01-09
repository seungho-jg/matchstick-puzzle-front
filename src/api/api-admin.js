import { API_BASE_URL } from '../config';
import useAuthStore from '../store/authStore';
// 사용자 검색
export const searchUsers = async (query) => {
  const token = useAuthStore.getState().token
  
  const response = await fetch(
    `${API_BASE_URL}/admin/users/search?query=${encodeURIComponent(query)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('관리자 권한이 필요합니다.');
    }
    throw new Error('사용자 검색에 실패했습니다.');
  }

  return response.json();
};

// 권한 부여
export const makeRole = async (userId, role) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_BASE_URL}/admin/make-role`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, role }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('관리자 권한이 필요합니다.');
    }
    throw new Error('권한 부여에 실패했습니다.');
  }

  return response.json();
};
// 생성크래딧 추가
export const addCreateCredit = async (userId, amount) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_BASE_URL}/admin/add-create-credit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, amount }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('관리자 권한이 필요합니다.');
    }
    throw new Error('생성크래딧 추가에 실패했습니다.');
  }

  return response.json();
};