export default function SupportPage() {

  return (
    <div className="flex flex-col items-center h-screen mt-10">
      <h1 className="text-2xl font-bold">후원하기</h1>
      <p className="text-sm text-gray-500 mb-4">☕️ 커피 한 잔 후원해주세요.</p>
      
      <img 
        src="/support.png"
        alt="후원하기" 
        className="w-1/2 mb-6"
        onError={(e) => {
          console.error('Image load error:', e);
          setImgError(true);
        }}
      />
      
      <p className="text-sm text-gray-500">정말 감사합니다!</p>
      <p className="text-sm text-gray-500">이메일을 남겨주시면 생성크레딧을 추가해드리겠습니다.</p>
    </div>
  )
}
