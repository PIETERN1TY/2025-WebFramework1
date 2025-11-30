// src/components/widget/Basic/memo/MemoWidgetSmall.jsx

import React, { useState, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

const MemoWidgetSmall = () => {
    const [memos, setMemos] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [editingMemo, setEditingMemo] = useState(null);

    useEffect(() => {
        const loadMemos = () => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) return;

            const savedMemos = JSON.parse(localStorage.getItem(`memos_${currentUser.id}`)) || [];
            setMemos(savedMemos);
        };

        loadMemos();

        const handleMemoUpdate = () => {
            loadMemos();
        };

        window.addEventListener('memoUpdated', handleMemoUpdate);
        return () => window.removeEventListener('memoUpdated', handleMemoUpdate);
    }, []);

    const openEditor = () => {
        setEditingMemo(null);
        setShowEditor(true);
    };

    const openEditMemo = (memo) => {
        setEditingMemo(memo);
        setShowEditor(true);
    };

    const closeEditor = () => {
        setShowEditor(false);
        setEditingMemo(null);
    };

    const saveMemo = (title, content) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        let updatedMemos;

        if (editingMemo) {
            updatedMemos = memos.map(memo => 
                memo.id === editingMemo.id 
                    ? { ...memo, title, content, updatedAt: new Date().toISOString() }
                    : memo
            );
        } else {
            const newMemo = {
                id: Date.now(),
                title: title,
                content: content,
                createdAt: new Date().toISOString()
            };
            updatedMemos = [newMemo, ...memos];
        }

        localStorage.setItem(`memos_${currentUser.id}`, JSON.stringify(updatedMemos));
        setMemos(updatedMemos);
        
        window.dispatchEvent(new Event('memoUpdated'));
        closeEditor();
    };

    const latestMemo = memos[0];

    return (
        <>
            {/* 메모 위젯 - 소형 */}
            <div className="bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden min-h-[250px]">
                {/* 헤더 */}
                <div 
                    className="px-4 py-3 flex justify-between items-center text-white transition-all duration-300"
                    style={{
                        background: 'var(--theme-gradient, linear-gradient(135deg, #2d7a4f 0%, #3d9b63 100%))'
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📝</span>
                        <span className="text-lg font-bold">메모</span>
                    </div>
                    <button 
                        className="bg-white/20 hover:bg-white/30 border-none rounded-md px-2.5 py-1.5 text-white cursor-pointer transition-all duration-200 text-sm hover:scale-105"
                        onClick={openEditor}
                    >
                        <FaPencilAlt />
                    </button>
                </div>

                {/* 메모 상세 내용 */}
                {latestMemo ? (
                    <div 
                        className="flex-1 p-4 flex flex-col gap-2.5 cursor-pointer"
                        onClick={() => openEditMemo(latestMemo)}
                        title="클릭하여 수정"
                    >
                        <div 
                            className="text-base font-bold mb-2 transition-colors duration-300"
                            style={{
                                color: 'var(--theme-secondary, #2d7a4f)'
                            }}
                        >
                            {latestMemo.title}
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed flex-1 overflow-y-auto line-clamp-5">
                            {latestMemo.content || '내용이 없습니다.'}
                        </div>
                        <div className="text-xs text-gray-400 text-right mt-auto">
                            {new Date(latestMemo.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-10 text-sm">
                        메모가 없습니다.
                    </div>
                )}
            </div>

            {/* 메모 작성/편집 모달 */}
            {showEditor && (
                <MemoEditorModal 
                    onSave={saveMemo} 
                    onClose={closeEditor}
                    initialMemo={editingMemo}
                />
            )}
        </>
    );
};

// 메모 편집 모달
const MemoEditorModal = ({ onSave, onClose, initialMemo }) => {
    const [title, setTitle] = useState(initialMemo?.title || '');
    const [content, setContent] = useState(initialMemo?.content || '');

    const handleSave = () => {
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        onSave(title, content);
    };

    return (
        // 오버레이
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center animate-fadeIn"
            style={{ zIndex: 999999 }}
            onClick={onClose}
        >
            {/* 모달 */}
            <div 
                className="bg-white rounded-2xl w-[350px] h-[350px] flex flex-col shadow-2xl overflow-hidden relative animate-slideUp"
                style={{ zIndex: 1000000 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div 
                    className="px-5 py-4 flex justify-between items-center rounded-t-2xl flex-shrink-0 transition-all duration-300"
                    style={{
                        background: 'var(--theme-gradient, linear-gradient(135deg, #2d7a4f 0%, #3d9b63 100%))'
                    }}
                >
                    <div className="flex items-center gap-2.5 text-white text-xl font-bold">
                        <span>📝</span>
                        <span>{initialMemo ? '메모 수정' : '메모 작성'}</span>
                    </div>
                    <div className="flex gap-2.5">
                        <button 
                            className="bg-white/20 hover:bg-red-400/40 border-none rounded-lg px-3.5 py-2.5 text-white cursor-pointer transition-all duration-200 text-base flex items-center justify-center min-w-[44px] min-h-[44px] hover:scale-110"
                            onClick={onClose}
                            title="취소"
                        >
                            ✕
                        </button>
                        <button 
                            className="bg-white/20 hover:bg-white/40 border-none rounded-lg px-3.5 py-2.5 text-white cursor-pointer transition-all duration-200 text-xl flex items-center justify-center min-w-[44px] min-h-[44px] hover:scale-110"
                            onClick={handleSave}
                            title="저장"
                        >
                            💾
                        </button>
                    </div>
                </div>

                {/* 바디 */}
                <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto min-h-0">
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl text-base font-semibold transition-all duration-200 box-border flex-shrink-0 focus:outline-none focus:border-[var(--theme-secondary,#2d7a4f)] focus:shadow-[0_0_0_3px_rgba(45,122,79,0.1)]"
                    />

                    <textarea
                        placeholder="내용을 입력하세요..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 min-h-0 px-4 py-3.5 border-2 border-gray-300 rounded-xl text-base leading-relaxed resize-none transition-all duration-200 box-border focus:outline-none focus:border-[var(--theme-secondary,#2d7a4f)] focus:shadow-[0_0_0_3px_rgba(45,122,79,0.1)]"
                        style={{
                            fontFamily: 'inherit'
                        }}
                    />
                </div>
            </div>

        </div>
    );
};

export default MemoWidgetSmall;