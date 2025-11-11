/**
 * /src/components/pages/layout/Header.jsx
 * 
 * 페이지에 삽입될 헤더 컴포넌트.
 * 로고, 설정 버튼, 위젯 추가 버튼을 포함하며 각 버튼 클릭 시 모달을 엽니다.
 *
 */

import React, { useState } from 'react';
import Modal from '../../common/Modal';
import '../../../styles/css/Header.css';
import Button from '../../common/Button';

import SettingIcon from "./icons/settingIcon.jsx";
import SettingPage from '../SettingPage';

import AddWidget from '../../AddWidget';
import WidgetAddIcon from "./icons/WidgetAddIcon.jsx";

const Header = () => {
    // 모달의 열림/닫힘 상태를 관리하는 State
    const [showSettingModal, setShowSettingModal] = useState(false);
    const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);

    // 모달을 열고 닫는 이벤트 핸들러
    const openSettingModal = () => setShowSettingModal(true);
    const closeSettingModal = () => setShowSettingModal(false);
    const openAddWidgetModal = () => setShowAddWidgetModal(true);
    const closeAddWidgetModal = () => setShowAddWidgetModal(false);

    return (
        <header className="DashboardHeader">
            <a href="/" className="logo">No.8</a>
            <div className="header-actions">
                <Button className={'xlarge icon'} onClick={openSettingModal}><SettingIcon /></Button>
                <Button className={"xlarge icon"} onClick={openAddWidgetModal}><WidgetAddIcon /></Button>
            </div>

            {/* 설정 모달 */}
            <Modal isOpen={showSettingModal} onClose={closeSettingModal} title="설정">
                <SettingPage />
            </Modal>

            {/* 위젯 추가 모달 */}
            <Modal isOpen={showAddWidgetModal} onClose={closeAddWidgetModal} title="위젯 추가">
                <AddWidget />
            </Modal>
        </header>
    );
}

export default Header;
