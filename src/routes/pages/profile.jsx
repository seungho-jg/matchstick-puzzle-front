import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchUserInfo } from "../../api/api-user";
import { Link } from "react-router-dom";

// 다음 레벨까지 필요한 경험치 계산
function getRequiredExp(level) {
  return Math.floor(100 * Math.pow(1.2, level - 1));
}
export default function Profile() {
  const outletData = useOutletContext()
  const [username, setUsername] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const username = outletData?.username
    if (username) {
      setUsername(username);
    }
  }, [outletData]);

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await fetchUserInfo()
      setUserInfo(userInfo)
    }
    getUserInfo()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-row gap-3 text-left items-center">
        <h1 className="text-3xl font-bold text-gray-900">
            {username || "알 수 없음"}
          </h1>
          <div className="flex flex-row gap-2 items-center">
            <div className="text-sm text-gray-500">
              <span className="font-bold text-gray-900 text-md">Level {userInfo?.user.level} </span>
                <span className="text-xs">({userInfo?.user.exp} / {getRequiredExp(userInfo?.user.level + 1)} XP)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-pink-500 rounded-full" 
                    style={{width: `${(userInfo?.user.exp % 100)}%`}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-md  font-bold mb-4">성공한 문제 ( {userInfo?.stats.totalSolved} )</h2>
          <div className="grid gap-4">
            {userInfo?.solved.map((puzzle) => (
              <Link 
                to={`/puzzle/${puzzle.id}`}
                key={puzzle.id} 
                className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="font-medium">{puzzle.title}</div>
                <div className="text-sm text-gray-500">
                  난이도: {puzzle.difficulty} | 유형: {puzzle.gameType}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div>
        <h2 className="text-md  font-bold mb-4">시도한 문제 ( {userInfo?.stats.totalAttempted} )</h2>
          <div className="grid gap-4">
            {userInfo?.attempted.map((puzzle) => (
              <Link 
                to={`/puzzle/${puzzle.id}`}
                key={puzzle.id} 
                className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="font-medium">{puzzle.title}</div>
                <div className="text-sm text-gray-500">
                  난이도: {puzzle.difficulty} | 유형: {puzzle.gameType}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-md  font-bold mb-4">제작한 문제 ( {userInfo?.stats.totalCreated} )</h2>
          <div className="grid gap-4">
            {userInfo?.created.map((puzzle) => (
              <Link 
                to={`/puzzle/${puzzle.id}`}
                key={puzzle.id} 
                className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="font-medium">{puzzle.title}</div>
                <div className="text-sm text-gray-500">
                  난이도: {puzzle.difficulty} | 유형: {puzzle.gameType}
                  <span className="ml-2">❤️ {puzzle._count?.likes || 0}</span>
                  <span className="ml-2">✅ {puzzle._count?.solvedByUsers || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
    </div>
  );
}