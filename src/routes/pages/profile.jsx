import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchUserInfo } from "../../api/api-user";
import { Link } from "react-router-dom";
import { deletePuzzle } from "../../api/api-puzzle";
import SkinSelector from "../../components/SkinSelector";
import { useInvalidatePuzzles } from '../../hooks/usePuzzle';
import toast from 'react-hot-toast';
// 다음 레벨까지 필요한 경험치 계산

export default function Profile() {
  const outletData = useOutletContext()
  const [username, setUsername] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [requiredExp, setRequiredExp] = useState(100);
  const { invalidatePuzzles } = useInvalidatePuzzles();
  const [createdPuzzles, setCreatedPuzzles] = useState([])

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
      // 데이터를 받아온 후 바로 다음 레벨 필요 경험치 계산
      if (userInfo?.user?.level) {
        const nextLevelExp = Math.floor(100 * Math.pow(1.2, userInfo.user.level));
        setRequiredExp(nextLevelExp);
      }
      setCreatedPuzzles(userInfo?.created)
    }
    getUserInfo()
  }, [userInfo?.user?.level])

    const handleDeletePuzzle = async (e, puzzleId) => {
      e.preventDefault()
      toast((t) => (
        <div className="flex flex-col gap-2">
          <span>정말로 이 퍼즐을 삭제하시겠습니까?</span>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={() => toast.dismiss(t.id)}
            >
              취소
            </button>
            <button
              className="px-3 py-1 text-sm bg-rose-500 text-white rounded-md hover:bg-rose-600"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deletePuzzle(puzzleId);
                  setCreatedPuzzles(prevPuzzles => 
                    prevPuzzles.filter(puzzle => puzzle.id !== puzzleId)
                  );
                  toast.success('퍼즐이 삭제되었습니다.');
                  // 퍼즐 목록 새로고침 로직
                  invalidatePuzzles()
                } catch (error) {
                  toast.error('퍼즐 삭제에 실패했습니다.');
                }
              }}
            >
              삭제
            </button>
          </div>
        </div>
      ), {
        duration: 5000,  // 5초 동안 표시
        position: 'top-center',
      });
    };
  return (
    <div className="space-y-8">
      <div className="flex flex-row gap-3 text-left items-center">
        <h1 className="text-3xl font-bold text-gray-900">
            {username || "알 수 없음"}
          </h1>
          <div className="flex flex-row gap-2 items-center">
            <div className="text-sm text-gray-500">
              <span className="font-bold text-gray-900 text-md">Level {userInfo?.user.level} </span>
                <span className="text-xs">({userInfo?.user.exp || 0} / {requiredExp} XP)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-rose-400 rounded-full" 
                    style={{width: `${(userInfo?.user.exp % 100)}%`}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
          <SkinSelector />
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
            {createdPuzzles.map((puzzle) => (
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
                  <span className="ml-2 bg-red-300 text-white hover:bg-red-500 rounded-md py-1 px-2" onClick={(e) => handleDeletePuzzle(e, puzzle.id)} >삭제하기</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
    </div>
  );
}