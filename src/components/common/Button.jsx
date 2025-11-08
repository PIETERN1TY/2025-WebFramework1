/**
 * /src/components/common/Button.jsx
 *
 * KRDS 디자인 시스템을 기반으로 하는 공통 버튼 컴포넌트.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - 버튼 텍스트 ('.text' 클래스 활성화)
 * @param {React.ReactElement} props.icon - 아이콘 요소 ('.icon' 클래스 활성화)
 * @param {string} props.color - 'primary', 'secondary', 'tertiary'
 * @param {string} props.size - 'xs', 's', 'm', 'l', 'xl'
 * @param {boolean} props.iconBorder - 아이콘 테두리 ('.icon.border' 활성화)
 * @param {string} props.className - 상위에서 전달하는 추가 클래스
 * @param {object} props.rest - onClick, type, disabled 등
 */

import React from 'react';

const Button = ({ children = null,
                    icon = null,
                    color = 'primary',
                    size = 'm',
                    iconBorder = false,
                    className = '',
                    ...rest }) =>
{
    const classes = [
        'krds-btn',
        color,
        size,
        children ? 'text' : null,
        icon ? 'icon' : null,
        (icon && iconBorder) ? 'border' : null,
        className
    ].filter(Boolean).join(' ');

    return (
        <button className={classes} {...rest}>
            {icon}
            {children}
        </button>
    );
}

export default Button;