// src/components/widget/Basic/memo/MemoWidgetLarge.jsx

import React, { useState, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

const MemoWidgetLarge = () => {
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

    const deleteMemo = (memoId, e) => {
        e.preventDefault();

        const confirmed = window.confirm('이 메모를 삭제하시겠습니까?');
        if (!confirmed) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const updatedMemos = memos.filter(memo => memo.id !== memoId);
        localStorage.setItem(`memos_${currentUser.id}`, JSON.stringify(updatedMemos));
        setMemos(updatedMemos);

        window.dispatchEvent(new Event('memoUpdated'));
    };

    return (
        <>
            {/* 메모 위젯 - 대형 */}
            <div className="bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden min-h-[200px]">
                {/* 헤더 */}
                <div 
                    className="px-4 py-3 flex justify-between items-center text-white transition-all duration-300"
                    style={{
                        background: 'var(--theme-gradient, linear-gradient(135deg, #2d7a4f 0%, #3d9b63 100%))'
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📝</span>
                        <span className="text-xl font-bold">메모</span>
                    </div>
                    <button 
                        className="bg-white/20 hover:bg-white/30 border-none rounded-md px-2.5 py-1.5 text-white cursor-pointer transition-all duration-200 text-[0.7em] hover:scale-105"
                        onClick={openEditor}
                    >
                        <FaPencilAlt />
                    </button>
                </div>

                {/* 메모 목록 */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {memos.length > 0 ? (
                        memos.slice(0, 3).map((memo) => (
                            <div 
                                key={memo.id}
                                className="bg-gray-50 hover:bg-gray-200 p-3 rounded-lg mb-2.5 cursor-pointer transition-all duration-200 hover:translate-x-1.5"
                                style={{
                                    borderLeft: '4px solid var(--theme-secondary, #2d7a4f)'
                                }}
                                onClick={() => openEditMemo(memo)}
                                onContextMenu={(e) => deleteMemo(memo.id, e)}
                                title="클릭: 편집 | 우클릭: 삭제"
                            >
                                <div className="text-[0.8em] font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {memo.title}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 py-10 text-sm">
                            메모가 없습니다.
                        </div>
                    )}
                </div>
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
                            className="bg-white/20 hover:bg-red-400/40 border-none rounded-lg px-3.5 py-2.5 text-white cursor-pointer transition-all duration-200 text-base flex items-center justify-center min-w-[20px] min-h-[20px] hover:scale-110"
                            onClick={onClose}
                            title="취소"
                        >
                            ✕
                        </button>
                        <button 
                            className="bg-white/20 hover:bg-white/40 border-none rounded-lg px-3.5 py-2.5 text-white cursor-pointer transition-all duration-200 text-xl flex items-center justify-center min-w-[20px] min-h-[20px] hover:scale-110"
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
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl text-[0.7em] font-semibold transition-all duration-200 box-border flex-shrink-0 focus:outline-none focus:border-[var(--theme-secondary,#2d7a4f)] focus:shadow-[0_0_0_3px_rgba(45,122,79,0.1)]"
                    />

                    <textarea
                        placeholder="내용을 입력하세요..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 min-h-0 px-4 py-3.5 border-2 border-gray-300 rounded-xl text-[0.7em] leading-relaxed resize-none transition-all duration-200 box-border focus:outline-none focus:border-[var(--theme-secondary,#2d7a4f)] focus:shadow-[0_0_0_3px_rgba(45,122,79,0.1)]"
                        style={{
                            fontFamily: 'inherit'
                        }}
                    />
                </div>
            </div>


        </div>
    );
};

export default MemoWidgetLarge;