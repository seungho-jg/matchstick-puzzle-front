const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white to-gray-50">
    <div className="relative w-16 h-16">
      <div className="absolute w-16 h-16 border-4 border-rose-200 rounded-full animate-ping opacity-75" />
      <div className="absolute w-16 h-16 border-4 border-rose-500 rounded-full animate-spin border-t-transparent" />
    </div>
    <div className="mt-6 text-lg font-semibold">
      로딩중
      <span className="inline-block animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
      <span className="inline-block animate-bounce" style={{ animationDelay: "200ms" }}>.</span>
      <span className="inline-block animate-bounce" style={{ animationDelay: "400ms" }}>.</span>
    </div>
  </div>
);

export default LoadingFallback;