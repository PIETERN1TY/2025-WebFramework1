/**
 * /src/components/common/Modal.jsx
 *
 * KRDS 디자인 시스템을 기반으로 하는 공통 모달 컴포넌트입니다.
 * React Hooks를 사용하여 접근성(A11y)과 상호작용을 관리합니다.
 *
 * @param {object} props - 컴포넌트 props
 * @param {boolean} props.isOpen - 모달의 열림/닫힘 상태
 * @param {() => void} props.onClose - 모달을 닫는 함수
 * @param {React.ReactNode} props.children - 모달 내부에 표시될 내용
 * @param {string} [props.title] - 모달의 제목
 */

import React from 'react';
import Button from './Button';

// 포커스 가능한 요소를 찾기 위한 셀렉터 상수

const Modal = ({ isOpen, onClose, children }) =>
{
    if (!isOpen) return null;

    return(
        <>
            <div onClick={onClose} className={"modal-overlay"}>
                <div onClick={(e) => e.stopPropagation()} className={"modal"}>
                    <Button onClick={onClose} className={"icon modal-close"}>
                        <>&times;</>
                    </Button>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Modal;
