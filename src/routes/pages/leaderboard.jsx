import { useEffect, useState } from "react";
import { fetchUserAll } from "../../api/api-user";

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await fetchUserAll();
        setUsers(userData);
      } catch (error) {
        console.error('유저 정보 가져오기 실패:', error);
      }
    };
    fetchUsers();
  }, []);

  const getSortedUsers = () => {
    return [...users].sort((a, b) => {
        // 레벨이 같으면 경험치로 비교
        if (b.level === a.level) {
          return b.totalExp - a.totalExp;
        }
        return b.level - a.level;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">리더보드</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                순위
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                유저명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                레벨
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제작한 퍼즐
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getSortedUsers().map((user, index) => (
              <tr key={user.id} className={index < 3 ? 'bg-stone-200 font-semibold' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Lv.{user.level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.createdPuzzles.length}개
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
