import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function Profile() {
  const outletData = useOutletContext()
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const username = outletData?.username
    if (username) {
      setUsername(username);
    }
  }, [outletData]);

  return (
    <div className="space-y-8">
      <div className="flex flex-row gap-3 items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {username || "알 수 없음"}
        </h1>
      </div>
    </div>
  );
}