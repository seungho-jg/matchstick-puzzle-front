import { toast } from "react-hot-toast"
import { useState } from "react"
import { addCreateCredit, makeRole, searchUsers } from "../../api/api-admin"

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState([])
  
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return;
    
    try {
      const result = await searchUsers(searchQuery.trim())
      setUsers(result)
    } catch (error) {
      console.error('사용자 검색 실패:', error)
    }
  }

  const handleMakeEditor = async (userId) => {
    try {
      await makeRole(userId, 'editor')
    } catch (error) {
      console.error('에디터 권한 부여 실패:', error)
    }
  }

  const handleAddCreateCredit = async (userId, amount) => {
    try {
      if (!userId) {
        throw new Error('사용자를 선택해주세요.');
      }
      await addCreateCredit(userId, amount);
      toast('생성크래딧이 추가되었습니다.',{
        icon: '🎉',
      });
      if (searchQuery) {
        const result = await searchUsers(searchQuery.trim());
        setUsers(result);
      }
    } catch (error) {
      console.error('생성크래딧 추가 실패:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이메일 또는 사용자 이름으로 검색"
              className="w-full p-2 border rounded"
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            검색
          </button>
        </form>
      </div>

      {/* 검색 결과 표시 */}
      <div className="bg-white rounded-lg shadow">
        {users.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">역할</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">레벨</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">코인</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">푼 퍼즐</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.level}</td>
                  <td className="px-6 py-4">{user.createCount}</td>
                  <td className="px-6 py-4">{user._count?.createdPuzzles || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            검색 결과가 없습니다
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <button onClick={()=>handleMakeEditor(users[0].id)} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={users.length === 0}>에디터 권한 부여</button>
        <button onClick={()=>handleAddCreateCredit(users[0].id, 5)} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={users.length === 0}>추가 (+5)</button>
        <button onClick={()=>handleAddCreateCredit(users[0].id, 10)} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={users.length === 0}>추가 (+10)</button>
      </div>
    </div>
  );
}