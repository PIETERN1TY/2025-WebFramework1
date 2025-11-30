// src/components/pages/CanvasPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CanvasPage.css';
import { WIDGET_OPTIONS } from '../../config/WidgetConfig';  // ✅


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
    
    navigate(`/dashboard/canvas/edit/${id}`);  
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
    return <div>로딩 중...</div>;
  }

  return (
    <div className="canvas-page-container">
      <div className="canvas-page-header">
        <h1>🎨 {currentUser.nickname}님의 캔버스</h1>
        <button className="create-canvas-btn" onClick={handleCreateCanvas}>
          + 새 캔버스 만들기
        </button>
      </div>

      <div className="canvas-grid">
        {savedCanvases.map(canvas => (
          <div 
            key={canvas.id} 
            className={`canvas-card ${activeCanvasId === canvas.id ? 'active-canvas' : ''}`}
            onClick={() => handleEditCanvas(canvas.id)}
          >
            {activeCanvasId === canvas.id && (
              <div className="active-badge">활성화됨</div>
            )}
            
            <div className="canvas-preview">
              <div className="canvas-preview-content">
                <div className="canvas-icon">📋</div>
                <div className="widget-count">
                  {canvas.layout?.length || 0}개 위젯
                </div>
              </div>
            </div>
            
            <div className="canvas-info">
              <h3 className="canvas-name">{canvas.name}</h3>
              <p className="canvas-date">
                {new Date(canvas.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>

            <div className="canvas-actions">
              <button 
                className="activate-canvas-btn"
                onClick={(e) => handleActivateCanvas(e, canvas.id)}
                title="홈 화면에 활성화"
              >
                {activeCanvasId === canvas.id ? '✓ 활성' : '○ 활성화'}
              </button>
              <button 
                className="delete-canvas-btn"
                onClick={(e) => handleDeleteCanvas(e, canvas.id)}
                title="캔버스 삭제"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {savedCanvases.length === 0 && (
          <div className="empty-canvas-message">
            <p>아직 저장된 캔버스가 없습니다.</p>
            <p>새 캔버스를 만들어보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasPage;