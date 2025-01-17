import { toast } from "react-hot-toast"
import { useRef, useEffect, useState, Fragment } from "react"
import { Stage, Layer, Transformer, Text } from "react-konva"
import Matchstick from "./Matchstick"
import ResultModal from "./ResultModal"
import LikeButton from "./LikeBtn"
import useAuthStore from "../store/authStore"
import { useNavigate } from "react-router-dom"
import { updatePuzzleDifficulty, deletePuzzleAdmin, fetchSolvePuzzle } from '../api/api-puzzle';
import useImageStore from "../store/imageStore"
import { getPuzzleCreateCount } from "../api/api-user"

const DIFFICULTY_OPTIONS = ['EASY', 'NORMAL', 'HARD', 'EXTREME'];

export default function PuzzleCanvas({ puzzleData }) {
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = useAuthStore((state) => state.isAdmin())
  const setPuzzleCreateCount = useAuthStore((state) => state.setPuzzleCreateCount);
  const { skinImages, currentSkin, loadUserSettings } = useImageStore()

  // 게임 초기 데이터
  const [initMatchstick, setInitMatchstick] = useState([])
  const [matchsticks, setMatchsticks] = useState([])
  const [gameType, setGameType] = useState("")
  const [limit, setLimit] = useState(0)
  const [scale, setScale] = useState(1) // Stage 확대/축소 비율

  // 게임 상태
  const [selectedMatchstick, setSelectedMatchstick] = useState(null)
  const [history, setHistory] = useState([]) // 상태 기록
  const [currentStep, setCurrentStep] = useState(-1) // 현재 상태
  const [moveCounts, setMoveCounts] = useState({})

  // 모달창
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({})

  const imageRef = useRef(null)
  const transformerRef = useRef(null)
  const stageRef = useRef(null)
  const stageContainerRef = useRef(null)

  const [isChecking, setIsChecking] = useState(false);  // 로딩 상태 추가
  const [isUpdatingDifficulty, setIsUpdatingDifficulty] = useState(false);

  const adjustCenter = () => {
    if (!stageContainerRef.current || !matchsticks.length) return;
    
    const stageContainer = stageContainerRef.current.getBoundingClientRect();
    const stageWidth = stageContainer.width;
    const stageHeight = stageContainer.height;
    
    const PADDING = 20;
    const SCALE_MULTIPLE = 0.65;
    
    // 바운딩 박스 계산
    const minX = Math.min(...matchsticks.map((stick) => stick.x));
    const maxX = Math.max(...matchsticks.map((stick) => stick.x));
    const minY = Math.min(...matchsticks.map((stick) => stick.y));
    const maxY = Math.max(...matchsticks.map((stick) => stick.y));

    // 성냥개비가 1-2개일 때는 바운딩 박스에 패딩 추가
    const boundingWidth = matchsticks.length <= 4 ? 
      Math.max(maxX - minX, 100) + PADDING * 2 : 
      maxX - minX + PADDING;
    
    const boundingHeight = matchsticks.length <= 4 ? 
      Math.max(maxY - minY, 100) + PADDING * 2 : 
      maxY - minY + PADDING;

    // 가로세로 비율 계산
    const aspectRatio = boundingWidth / boundingHeight;
    
    // 스테이지 스케일 계산
    const scaleX = stageWidth / boundingWidth;
    const scaleY = stageHeight / boundingHeight;
    
    // 가로가 긴 경우 (aspectRatio > 1.5) scaleX를 우선적으로 고려
    let newScale;
    if (aspectRatio > 1.5) {
      newScale = scaleX * SCALE_MULTIPLE * 1.4; // 가로가 긴 경우 20% 더 크게
    } else {
      newScale = Math.min(scaleX, scaleY) * SCALE_MULTIPLE;
    }

    const stageCenter = {
      x: stageWidth / 2,
      y: stageHeight / 2,
    };
    
    const matchsticksCenter = {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
    };
    
    const newOffset = {
      x: stageCenter.x - matchsticksCenter.x * newScale,
      y: stageCenter.y - matchsticksCenter.y * newScale,
    };

    setScale(newScale);

    setMatchsticks(prev => prev.map(stick => ({
      ...stick,
      x: stick.x + newOffset.x / newScale,
      y: stick.y + newOffset.y / newScale,
    })));
    
    setInitMatchstick(prev => prev.map(stick => ({
      ...stick,
      x: stick.x + newOffset.x / newScale,
      y: stick.y + newOffset.y / newScale,
    })));
  };
  // JSON 데이터 로드
  useEffect(()=>{
    function loadGameData() {
      if(!puzzleData || !puzzleData.id ) return
      const initialMatchsticks = JSON.parse(puzzleData.initialState);
      setMatchsticks(initialMatchsticks)
      setInitMatchstick(initialMatchsticks)
      setGameType(puzzleData.gameType)
      setLimit(puzzleData.limit)
      setCurrentStep(-1)
      adjustCenter()
    }
    loadGameData()
  }, [puzzleData])

  // matchsticks가 업데이트된 후 중앙 정렬
  
useEffect(() => {
  if (matchsticks.length > 0) {
    adjustCenter();
  }
}, [matchsticks.length]);

  // 이미지 로드
  useEffect(() => {
    loadUserSettings()
  }, []) // 초기 로드

  useEffect(() => {
    if (skinImages[currentSkin]) {
      imageRef.current = skinImages[currentSkin]
      setMatchsticks(sticks => [...sticks]) // 리랜더링 트리거
    }
  }, [currentSkin, skinImages]) // 스킨이나 이미지가 변경될 때 업데이트

  // Transformer 업데이트
  useEffect(() => {
    const tr = transformerRef.current;
    if (tr) {
      if (selectedMatchstick) {
        const selectedNode = stageRef.current.findOne(`#${selectedMatchstick}`);
        if (selectedNode) {
          tr.nodes([selectedNode]) // 선택된 노드에 Transformer 적용
          tr.getLayer().batchDraw()
        }
      } else {
        tr.nodes([]) // 선택 해제 시 Transformer 초기화
      }
    }
  }, [selectedMatchstick, matchsticks])

  const handleSelect = (id) => {
    setSelectedMatchstick((current) => (current === id ? null : id));
  };

  const handleDragEnd = (e, id) => {
    // 드래그 완료 후 위치 업데이트
    if (gameType === "remove") {
      toast.error("현재 상태에서는 이동이 불가능합니다.");
      return;
    }
    // 정수로 반올림
    const x = Math.round(e.target.x())
    const y = Math.round(e.target.y())
    const newPosition = { x, y }

    const findOne = matchsticks.find((stick) =>  stick.id === id)
    
    const currentMoveCount = Object.keys(moveCounts).length;
    // 이동 제한 확인
    if (currentMoveCount >= limit) {
      if (!moveCounts[id]){
        toast.error('이동 제한에 도달했습니다.')
        restorePreviousPosition(id)
        return;
      }
    }
    // 상태 업데이트
    setMatchsticks((prev) =>
      prev.map((stick) =>
        stick.id === id ? { ...stick, ...newPosition } : stick
      )
    )
    const before = {x: findOne.x, y: findOne.y }
    const after = { x, y }
    
    saveState("move", id, before, after)
  }

  const handleRotateEnd = (newAngle, id) => {
    // 정수로 반올림
    const roundedAngle = Math.round(newAngle)
    const findOne = matchsticks.find((stick) =>  stick.id === id)
    
    const currentMoveCount = Object.keys(moveCounts).length;
    // 이동 제한 확인
    if (currentMoveCount >= limit) {
      if (!moveCounts[id]){
        toast.error('이동 제한에 도달했습니다.')
        restorePreviousPosition(id)
        return;
      }
    }
    // 회전 완료 후 각도 업데이트
    setMatchsticks((prev) =>
      prev.map((stick) => 
        stick.id === id ? { ...stick, angle: roundedAngle} : stick
      )
    )
    // 상태 저장
    const before = {angle: findOne.angle}
    const after = {angle: newAngle}
    saveState("rotate", id, before, after)
  }

  const saveState = (type, id, before, after) => {

    const newHistory = history.slice(0, currentStep + 1) // 현재 상태 이후의 기록 삭제
    newHistory.push({
      type,
      id,
      before, 
      after,
    }) // 새로운 상태 저장

    // 이동 카운트 업데이트
    const updatedMoveCounts = {
      ...moveCounts,
      [id]: (moveCounts[id] || 0) + 1,
    };

    setMoveCounts(updatedMoveCounts);
    setHistory(newHistory)
    setCurrentStep(newHistory.length - 1) // 현재 상태를 마지막으로 이동
  }

  // 상태 복원 함수
  const restorePreviousPosition = (id) => {
    const findOne =  initMatchstick.find((stick) =>  stick.id === id)

    setMatchsticks((prev) =>
      prev.map((stick) =>
        stick.id === id ? {...findOne} : stick
      )
    )
    const node = stageRef.current.findOne(`#${id}`);
    if (node) {
      node.position({ x: findOne.x, y: findOne.y }); // React 상태를 Konva 노드에 반영
      node.rotation(findOne.angle);
      node.getLayer().batchDraw(); // 화면 강제 갱신
    }
  }

  const undo = () => {
    if (currentStep >= 0) {
      const { id, before } = history[currentStep]

      setMatchsticks((prev) =>
        prev.map((stick) =>
          stick.id === id ? {...stick , ...before} : stick
        )
      )

      setMoveCounts((prev) => {
        const newCounts = { ...prev };
        newCounts[id] -= 1;
        if (newCounts[id] === 0) {
          delete newCounts[id]; // 카운트가 0이면 삭제
        }
        return newCounts;
      });

      setCurrentStep(currentStep - 1); // 이전 단계로 이동
    }
  }
  const redo = () => {
    if (currentStep < history.length - 1) {
      const { id, after } = history[currentStep + 1]

      setMatchsticks((prev) =>
        prev.map((stick) =>
          stick.id === id ? {...stick, ...after} : stick
        )
      )

      setMoveCounts((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));

      setCurrentStep(currentStep + 1)
    }
  }

  const reset = () => {
    try {
      setMatchsticks(initMatchstick)
      setHistory([])
      setCurrentStep(-1)
      setSelectedMatchstick(null)
      setMoveCounts({})
    } catch (error) {
      console.error("Failed to parse initialState during reset:", error)
      setMatchsticks([]) // 기본값으로 설정
    }
  };

  const handleRemove = () => {
    if (gameType !== "remove") {
      toast.error("삭제할 수 없습니다.")
      return
    }
    if (Object.keys(moveCounts).length >= limit) {
      toast.error("삭제 제한을 초과했습니다.")
      return
    }
    if (selectedMatchstick) {
      const select = matchsticks.find((stick) => stick.id === selectedMatchstick)
      setMatchsticks((prev) =>
        prev.map((stick) =>
          stick.id === selectedMatchstick ? {...stick, isDeleted: true} : stick
        )
      )
      setSelectedMatchstick(null)
      const before = { ...select, isDeleted: false }
      const after = { ...select, isDeleted: true }
      saveState("remove", selectedMatchstick, before, after)
    }
  }

  const handleBackgroundClick = (e) => {
    // 선택한 target이 Stage 일때만 선택 해제
    if (e.target === e.target.getStage()) {
      setSelectedMatchstick(null)
    }
  }
  const handleCheckAnswer = async () => {
    if(!token) {
      setIsChecking(true)
      setModalContent({
        message : "로그인 후 정답을 확인해보세요.",
        buttons: [
          { label: "로그인", onClick: () => navigate('/login') }
        ],
      });
      setIsModalOpen(true);
      setTimeout(() => setIsChecking(false), 2000);
      return;
    }
    try {
      setIsChecking(true);

      const roundedMatchsticks = matchsticks.map(stick => ({
        ...stick,
        x: Math.round(stick.x),
        y: Math.round(stick.y),
        angle: Math.round(stick.angle)
      }));

      const result = await fetchSolvePuzzle(puzzleData.id, roundedMatchsticks);

      setModalContent({
        message: result.alreadySolved ? 
          result.message : 
          result.success ? 
            `정답입니다! (획득 경험치: ${result.expBonus})` : 
            "오답입니다.",
        buttons: [
          { label: "확인", onClick: () => setIsModalOpen(false) }
        ],
      });
      setIsModalOpen(true);

      if (result.levelUp) {
        const response = await getPuzzleCreateCount();
        setPuzzleCreateCount(response.puzzleCreateCount);
        toast.success(`축하합니다! 레벨 ${result.newLevel}이 되었습니다!`);
      }
    } catch (error) {
      console.error('Error checking answer:', error);
      setModalContent({
        message: "오류가 발생했습니다.",
        buttons: [
          { label: "확인", onClick: () => setIsModalOpen(false) }
        ],
      });
      setIsModalOpen(true);
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    const updateStageSize = () => {
      const stageContainer = document.querySelector(".stage-container"); // Tailwind 스타일이 적용된 요소
      if (stageContainer) {
        const width = stageContainer.offsetWidth; // 실제 width 가져오기
        const height = stageContainer.offsetHeight; // 실제 height 가져오기
        stageRef.current.width(width);
        stageRef.current.height(height);
      }
    };
  
    updateStageSize()
    window.addEventListener("resize", updateStageSize)
  
    return () => window.removeEventListener("resize", updateStageSize)
  }, [])

  const handleDifficultyChange = async (newDifficulty) => {
    if (!isAdmin) return;
    
    try {
      setIsUpdatingDifficulty(true);
      const result = await updatePuzzleDifficulty(puzzleData.id, newDifficulty);
      
      setModalContent({
        message: `난이도가 ${newDifficulty}로 변경되었습니다.`,
        buttons: [{ label: "확인", onClick: () => setIsModalOpen(false) }],
      });
      setIsModalOpen(true);
      
      // puzzleData 업데이트
      puzzleData.difficulty = result.difficulty;
      puzzleData.difficultySetAt = result.difficultySetAt;

    } catch (error) {
      setModalContent({
        message: error.message,
        buttons: [{ label: "확인", onClick: () => setIsModalOpen(false) }],
      });
      setIsModalOpen(true);
    } finally {
      setIsUpdatingDifficulty(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) return;

    const confirmed = window.confirm('정말로 이 퍼즐을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await deletePuzzleAdmin(puzzleData.id);
      navigate('/puzzle'); // 퍼즐 목록으로 이동
      toast.success('퍼즐이 삭제되었습니다.');
    } catch (error) {
      toast.error(error.message || '퍼즐 삭제에 실패했습니다.');
    }
  };

  return (
    <>
    <div className="flex flex-row pl-2 gap-1 mt-2 items-center">
      <div className="text-neutral-800 pb-2 font-bold text-2xl">{puzzleData?.title}</div>
      <div className="scale-90 -translate-y-1 text-white text-sm font-bold bg-red-400 rounded-md px-2 py-1 ">정답률 {puzzleData?._count.attemptedByUsers > 0 ? ` ${Math.round(puzzleData?._count.solvedByUsers/puzzleData?._count.attemptedByUsers*100)}% ` : ''}</div>
      {isAdmin && (
        <div className="relative inline-block">
          <select
            value={puzzleData?.difficulty || 'Unrated'}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            disabled={isUpdatingDifficulty}
            className={`
              ml-2 px-2 py-1 rounded-md text-sm font-medium
              ${puzzleData?.difficulty === 'Unrated' ? 'bg-gray-200' : 
                puzzleData?.difficulty === 'Easy' ? 'bg-green-200' :
                puzzleData?.difficulty === 'Normal' ? 'bg-blue-200' :
                puzzleData?.difficulty === 'Hard' ? 'bg-orange-200' :
                'bg-red-200'}
              hover:opacity-80 cursor-pointer disabled:cursor-not-allowed
            `}
          >
            <option value="Unrated">난이도 설정</option>
            {DIFFICULTY_OPTIONS.map((diff) => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
          {isUpdatingDifficulty && (
            <div className="absolute right-0 top-0 h-full flex items-center pr-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          )}
          <button
                onClick={handleDelete}
                className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                삭제
          </button>
        </div>
      )}
    </div>
    {isModalOpen && (
        <ResultModal
          message={modalContent.message}
          buttons={modalContent.buttons}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <div ref={stageContainerRef} className="relative stage-container w-full h-[70vh] bg-stone-200 rounded-3xl">
        <div className="absolute w-full top-2 left-2 flex flex-row z-20 pointer-events-none">
          <div className="pointer-events-auto flex">
            <button className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35" onClick={reset} disabled={currentStep < 0}>⏮️</button>
            <button className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35" onClick={undo} disabled={currentStep < 0}>◀️</button>
            <button className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35" onClick={redo} disabled={currentStep >= history.length - 1}>▶️</button>
            {gameType !== "move" ? <button className="hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35" onClick={handleRemove} disabled={selectedMatchstick == null} >Remove</button> : null}
            <button 
              className={`hover:bg-stone-300 rounded-md px-2 py-1 disabled:opacity-35 relative`} 
              onClick={handleCheckAnswer} 
              disabled={Object.keys(moveCounts).length !== limit || isChecking}
            >
              {isChecking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              ) : '✅'}
            </button>
          </div>
          <div className="absolute top-1.5 right-6 font-mono text-gray-500 select-none pointer-events-none">
            Left : {limit - Object.keys(moveCounts).length}
          </div>
        </div>
        <Stage
          ref={stageRef}
          scaleX={scale}
          scaleY={scale}
          width={stageContainerRef.current?.offsetWidth || window.innerWidth}
          height={stageContainerRef.current?.offsetHeight || window.innerHeight * 0.7}
          onClick={handleBackgroundClick}
          onTap={handleBackgroundClick}
        >
          <Layer>
            {matchsticks
              .filter((stick) => !stick.isDeleted)
              .map((stick) => (
                <Fragment key={stick.id}>
                  <Matchstick
                    key={stick.id}
                    stick={stick}
                    image={imageRef.current}
                    onSelect={handleSelect}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={handleRotateEnd}
                    canMove={gameType === "move"}
                  />
                  {/* 성냥개비 위에 id를 표시 */}
                  {/* <Text
                    x={stick.x} // Rect의 중심 위에 배치
                    y={stick.y } // Rect의 위쪽에 배치
                    text={stick.id}
                    fontSize={14}
                    fill="black"
                    align="center"
                  /> */}
                </Fragment>
            ))}
            {/* Transformer */}
            <Transformer
              ref={transformerRef}
              rotationSnaps={[0, 90, 180, 270]} // 회전 스냅
              anchorSize={10} // 앵커 크기
              anchorCornerRadius={3}
              centeredScaling={true}
              resizeEnabled={false} // 크기 조정 비활성화
              rotateEnabled={gameType === "move"}
            />
          </Layer>
        </Stage>
        <div className="flex items-center justify-between gap-2 -translate-y-10 w-full pointer-events-none">
          <div className="translate-x-2 pointer-events-auto">
            <LikeButton likes={puzzleData?._count.likes} puzzleId={puzzleData?.id}/>
          </div>
          <div className="-translate-x-4 font-serif text-stone-500 select-none">
            createdBy @{puzzleData?.createBy.username}
          </div>
        </div>
      </div>
      <div className="text-neutral-800 text-sm font-bold mt-2 ml-2">[성공: {puzzleData?._count.solvedByUsers} / 시도: {puzzleData?._count.attemptedByUsers}명]</div>
    </>
  )
}