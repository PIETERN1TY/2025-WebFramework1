// src/components/pages/CanvasPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WIDGET_OPTIONS } from '../../config/WidgetConfig';

const CanvasPage = () => {
  const navigate = useNavigate();
  const [savedCanvases, setSavedCanvases] = useState([]);
  const [activeCanvasId, setActiveCanvasId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // 캔버스 목록 로드 (사용자별)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    loadUserCanvases(user.id);
    
    const activeId = localStorage.getItem(`activeCanvas_${user.id}`);
    setActiveCanvasId(activeId);
  }, [navigate]);

  const loadUserCanvases = (userId) => {
    const canvases = [];
    const keys = Object.keys(localStorage);
    
    // 해당 사용자의 캔버스만 로드
    keys.forEach(key => {
      if (key.startsWith(`canvas_${userId}_`)) {
        try {
          const canvasData = JSON.parse(localStorage.getItem(key));
          canvases.push({
            id: key.replace(`canvas_${userId}_`, ''),
            ...canvasData
          });
        } catch (e) {
          console.error('캔버스 로드 실패:', e);
        }
      }
    });
    
    canvases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setSavedCanvases(canvases);
  };

  // 새 캔버스 생성
  const handleCreateCanvas = () => {
    const newId = Date.now().toString();
    const newCanvas = {
      name: `작업공간 ${savedCanvases.length + 1}`,
      createdAt: new Date().toISOString(),
      layout: []
    };
    
    localStorage.setItem(`canvas_${currentUser.id}_${newId}`, JSON.stringify(newCanvas));
    
    // 첫 캔버스면 자동으로 활성화
    if (savedCanvases.length === 0) {
      localStorage.setItem(`activeCanvas_${currentUser.id}`, newId);
      setActiveCanvasId(newId);
      window.dispatchEvent(new Event('canvasChanged'));
    }
    
    navigate(`/dashboard/canvas/edit/${newId}`);  
  };

  // 캔버스 편집
  const handleEditCanvas = (id) => {
    navigate(`/dashboard/canvas/edit/${id}`); 
  };

  // 캔버스 활성화 (HomePage에 표시)
  const handleActivateCanvas = (e, id) => {
    e.stopPropagation();
    localStorage.setItem(`activeCanvas_${currentUser.id}`, id);
    setActiveCanvasId(id);
    
    window.dispatchEvent(new Event('canvasChanged'));
    
    alert('이 캔버스가 홈 화면에 활성화되었습니다!');
  };

  // 캔버스 삭제
  const handleDeleteCanvas = (e, id) => {
    e.stopPropagation();
    const confirmed = window.confirm('이 캔버스를 삭제하시겠습니까?');
    if (confirmed) {
      localStorage.removeItem(`canvas_${currentUser.id}_${id}`);
      
      // 활성 캔버스를 삭제한 경우
      if (activeCanvasId === id) {
        localStorage.removeItem(`activeCanvas_${currentUser.id}`);
        setActiveCanvasId(null);
        window.dispatchEvent(new Event('canvasChanged'));
      }
      
      loadUserCanvases(currentUser.id);
    }
  };

  if (!currentUser) {
    return <div className="text-center p-10">로딩 중...</div>;
  }

  return (
    <div className="w-full h-full p-10 box-border overflow-auto">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-[2em] text-gray-800 m-0">
          🎨 {currentUser.nickname}님의 캔버스
        </h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white border-none px-8 py-4 rounded-lg text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,123,255,0.3)]"
          onClick={handleCreateCanvas}
        >
          + 새 캔버스 만들기
        </button>
      </div>

      {/* 캔버스 그리드 */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-8 mt-8">
        {savedCanvases.map(canvas => (
          <div 
            key={canvas.id} 
            className={`bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 relative hover:-translate-y-1.5 hover:shadow-xl ${
              activeCanvasId === canvas.id 
                ? 'border-3 shadow-[0_4px_20px_rgba(40,167,69,0.3)]' 
                : ''
            }`}
            style={activeCanvasId === canvas.id ? {
              border: '3px solid var(--theme-primary, #2f4f4f)'
            } : {}}
            onClick={() => handleEditCanvas(canvas.id)}
          >
            {/* 활성 배지 */}
            {activeCanvasId === canvas.id && (
              <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold z-10">
                활성화됨
              </div>
            )}
            
            {/* 캔버스 미리보기 */}
            <div 
              className="w-full h-[200px] flex items-center justify-center relative"
              style={{
                backgroundColor: 'var(--theme-primary, #2f4f4f)'
              }}
            >
              <div className="text-center text-white">
                <div className="text-6xl mb-2.5">📋</div>
                <div className="text-xl font-medium">
                  {canvas.layout?.length || 0}개 위젯
                </div>
              </div>
            </div>
            
            {/* 캔버스 정보 */}
            <div className="p-5">
              <h3 className="text-xl text-gray-800 m-0 mb-2.5 font-semibold">
                {canvas.name}
              </h3>
              <p className="text-sm text-gray-400 m-0">
                {new Date(canvas.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2.5 p-4 bg-gray-50 border-t border-gray-200">
              <button 
                className="flex-1 px-2.5 py-2.5 border-none rounded-md text-sm font-semibold cursor-pointer transition-all duration-300 bg-green-600 hover:bg-green-700 text-white"
                onClick={(e) => handleActivateCanvas(e, canvas.id)}
                title="홈 화면에 활성화"
              >
                {activeCanvasId === canvas.id ? '✓ 활성' : '○ 활성화'}
              </button>
              <button 
                className="flex-[0.3] px-2.5 py-2.5 border-none rounded-md text-sm font-semibold cursor-pointer transition-all duration-300 bg-red-600 hover:bg-red-700 text-white"
                onClick={(e) => handleDeleteCanvas(e, canvas.id)}
                title="캔버스 삭제"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {/* 빈 상태 메시지 */}
        {savedCanvases.length === 0 && (
          <div className="col-[1/-1] text-center py-20 px-5 text-gray-400">
            <p className="text-2xl font-semibold text-gray-600 my-2.5">
              아직 저장된 캔버스가 없습니다.
            </p>
            <p className="text-xl my-2.5">
              새 캔버스를 만들어보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasPage;