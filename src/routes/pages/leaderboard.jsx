import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [rank, setRank] = useState([]);
  useEffect(() => {
    // const rank = fetchRank();
    // setRank(rank);
  }, []);
  return <div>LeaderboardPage</div>;
}
