import { useState, useEffect } from "react"
import { getLikes, postLikes, removeLikes } from '../api/api-like'
import useAuthStore from "../store/authStore"

export default function LikeButton({ puzzleId, likes: initialLikes }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState(false)
  const token = useAuthStore((state) => state.token)  // 로그인 상태 확인

  // 컴포넌트 마운트 시 좋아요 상태 확인
  useEffect(() => {
    const checkLikeStatus = async () => {
      // 로그인하지 않은 경우 체크하지 않음
      if (!token) {
        setIsLoading(false)
        return
      }
      try{
        setIsLoading(true)
        const { isLiked } = await getLikes(puzzleId)
        setLiked(isLiked)
      } catch (error) {
        console.error('Failed to check like status:', error)
        setLiked(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkLikeStatus()
  }, [puzzleId])

  useEffect(() => {
    setLikeCount(initialLikes)
  }, [initialLikes])

  
  const handleLike = async () => {
    if (!token) {
      alert('로그인이 필요합니다.')
      return
    }
    try {
      if (liked) {
        await removeLikes(puzzleId)
        setLikeCount(prev => prev - 1)
        setLiked(false)
      } else {
        await postLikes(puzzleId)
        setLikeCount(prev => prev + 1)
        setLiked(true)
      }
    } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error)
        alert('좋아요 처리 중 문제가 발생했습니다.')
        // 실패 시 상태를 원래대로 되돌립니다
        setLiked(prev => !prev)
        setLikeCount(prev => liked ? prev + 1 : prev - 1)
    }
  };

  return (
    <div className="flex flex-row items-center">
      <button 
        onClick={handleLike}
        disabled={isLoading}
        className={`text-red-500 hover:text-red-600 transition-colors
          ${isLoading ? 'cursor-not-allowed' : ''}
          `}
      >
        {liked 
          ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
        }
      </button>
      <span className="font-mono text-gray-700 ml-1">{likeCount} Likes</span>
    </div>
  );
}