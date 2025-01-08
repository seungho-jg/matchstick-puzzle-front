import useImageStore from '../store/imageStore'

export default function SkinSelector() {
  const { skins, currentSkin, setCurrentSkin, skinImages, isLoading } = useImageStore()

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">스킨 선택</h2>
      <div className="flex gap-4">
        {skins.map(skin => (
          <button
            key={skin.id}
            onClick={() => setCurrentSkin(skin.id)}
            disabled={isLoading}
            className="relative group"
          >
            {/* 이미지 컨테이너 */}
            <div className={`
              w-16 h-16 rounded-full overflow-hidden
              border-2 transition-all duration-200
              ${currentSkin === skin.id 
                ? 'border-blue-500 scale-110' 
                : 'border-gray-200 hover:border-blue-300'}
            `}>
              {/* 이미지 */}
              {skinImages[skin.id] && (
                <img
                  src={skinImages[skin.id].src}
                  alt={skin.name}
                  className={`
                    w-full h-full object-cover
                    ${currentSkin === skin.id ? 'brightness-90' : 'group-hover:brightness-95'}
                  `}
                />
              )}
              
              {/* 로딩 상태 */}
              {!skinImages[skin.id] && (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
              
              {/* 선택 오버레이 */}
              <div className={`
                absolute inset-0 rounded-full transition-opacity duration-200
                ${currentSkin === skin.id 
                  ? 'bg-black/20' 
                  : 'bg-black/0 group-hover:bg-black/10'}
              `} />
            </div>
            
            {/* 스킨 이름 */}
            <span className={`
              block mt-2 text-sm text-center
              ${currentSkin === skin.id ? 'font-bold text-blue-600' : 'text-gray-600'}
            `}>
              {skin.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}