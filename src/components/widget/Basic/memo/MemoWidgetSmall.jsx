// src/components/widget/Basic/memo/MemoWidgetSmall.jsx

import React, { useState, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import './MemoWidget.css';

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
            <div className="memo-widget memo-small">
                <div className="memo-header">
                    <div className="memo-title-section">
                        <span className="memo-icon">📝</span>
                        <span className="memo-title">메모</span>
                    </div>
                    <button className="memo-edit-btn" onClick={openEditor}>
                        <FaPencilAlt />
                    </button>
                </div>

                {latestMemo ? (
                    <div 
                        className="memo-detail"
                        onClick={() => openEditMemo(latestMemo)}
                        style={{ cursor: 'pointer' }}
                        title="클릭하여 수정"
                    >
                        <div className="memo-detail-title">{latestMemo.title}</div>
                        <div className="memo-detail-content">
                            {latestMemo.content || '내용이 없습니다.'}
                        </div>
                        <div className="memo-detail-date">
                            {new Date(latestMemo.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="memo-empty">
                        메모가 없습니다.
                    </div>
                )}
            </div>

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
        <div className="memo-modal-overlay" onClick={onClose}>
            <div 
                className="memo-modal" 
                onClick={(e) => e.stopPropagation()}

            >
                <div className="memo-modal-header">
                    <div className="memo-modal-title">
                        <span className="memo-icon">📝</span>
                        <span>{initialMemo ? '메모 수정' : '메모 작성'}</span>
                    </div>
                    <div className="memo-modal-actions">
                        <button className="memo-cancel-btn" onClick={onClose} title="취소">
                            ✕
                        </button>
                        <button className="memo-save-btn" onClick={handleSave} title="저장">
                            💾
                        </button>
                    </div>
                </div>

                <div className="memo-modal-body">
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="memo-input-title"
                    />

                    <textarea
                        placeholder="내용을 입력하세요..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="memo-input-content"
                    />
                </div>
            </div>
        </div>
    );
};

export default MemoWidgetSmall;