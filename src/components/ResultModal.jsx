export default function ResultModal({ message, buttons, onClose }) {
  return(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // 모달 외부를 클릭하면 닫힘
    >
      <div
        className="bg-white rounded-lg shadow-lg p-5 w-80"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 이벤트 전파 방지
      >
        <div className="text-center text-lg mb-4">{message}</div>
        <div className="flex justify-around">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              onClick={button.onClick}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}