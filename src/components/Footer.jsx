export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 서비스 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              <div className="flex items-center gap-2">
                <a 
                  href="https://www.youtube.com/@%EC%84%B1%EB%83%A5%ED%8D%BC%EC%A6%90" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center"
                >
                  성냥퍼즐 
                  <span className="text-rose-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 inline-block ml-1">
                      <path d="M21.582 7.172a2.513 2.513 0 0 0-1.768-1.768C18.254 5 12 5 12 5s-6.254 0-7.814.404c-.86.23-1.538.908-1.768 1.768C2 8.732 2 12 2 12s0 3.268.418 4.828c.23.86.908 1.538 1.768 1.768C5.746 19 12 19 12 19s6.254 0 7.814-.404a2.513 2.513 0 0 0 1.768-1.768C22 15.268 22 12 22 12s0-3.268-.418-4.828Z" />
                      <path fill="white" d="M10 15V9l5.2 3-5.2 3Z" />
                    </svg>
                  </span>
                </a>
                <a 
                  href="https://www.tiktok.com/@matchstick.puzzle?_t=ZS-8swxF4X384t&_r=1"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center"
                >
                  <span className="text-white dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-5 h-5">
                      <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3v178.8a162.6 162.6 0 1 1 -140.6-161.8v87a74.6 74.6 0 1 0 52.2 71.2V0h88.2a121.2 121.2 0 0 0 1.9 22.2 122.2 122.2 0 0 0 53.9 80.2 121.4 121.4 0 0 0 67.2 20.5z"/>
                    </svg>
                  </span>
                </a>
              </div>
            </h3>
            <p className="text-sm">
              성냥으로 재미있는 퍼즐을 만들어 공유해보세요!
            </p>

          </div>
          
          {/* 연락처 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">문의하기</h3>
            <ul className="space-y-2 text-sm">
              <li>이메일: duo_bus@icloud.com</li>
              <a className="font-bold text-yellow-500" href="https://open.kakao.com/o/gOQnoG9g" target="_blank" rel="noopener noreferrer">카카오톡 오픈채팅방 바로가기</a>
            </ul>
          </div>
        </div>
        
        {/* 저작권 정보 */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} matchstick-puzzle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};