import { useEffect, useState } from "react";
import { fetchUserAll } from "../../api/api-user";
import { Link } from "react-router-dom";

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
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold">리더보드</h1>
        <Link to="/support">
          <span className="hover:scale-105 transition-all duration-300 bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">후원하기</span>
        </Link>
      </div>

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
