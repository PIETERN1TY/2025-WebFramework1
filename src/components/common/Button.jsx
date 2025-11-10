/**
 * /src/components/common/Button.jsx
 *
 * KRDS 디자인 시스템을 기반으로 하는 공통 버튼 컴포넌트.
 *
 * @param {React.ReactNode} [props.children] - 버튼 내부에 표시될 내용.
 * @param {string} [props.className] - 버튼에 추가로 적용할 CSS 클래스.
 * @param {object} props - 컴포넌트 props
 * @description `onClick`, `disabled` 등 나머지 모든 표준 `button` 속성도 `props`로 전달할 수 있습니다.
 */
import React from 'react';

const Button = ({ children, className, ...props }) =>
{
    const classes = [
        "krds-btn",
        className
    ].join(" ");

    return(
            <button className={classes} {...props}>
                {children}
            </button>
    )
}

export default Button;