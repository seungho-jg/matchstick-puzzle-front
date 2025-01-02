import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchUserInfo } from "../../api/api-user";

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
              <span className="font-bold text-gray-900 text-md">Level {userInfo?.level} </span>
                <span className="text-xs">(XP {userInfo?.exp})</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-pink-500 rounded-full" 
                    style={{width: `${(userInfo?.exp % 100)}%`}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          성공한 문제
        </div>
        <div>
          시도한 문제
        </div>
        <div>
          제작한 문제
        </div>
    </div>
  );
}