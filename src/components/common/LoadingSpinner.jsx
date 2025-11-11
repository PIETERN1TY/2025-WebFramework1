/**
 * /src/components/common/LoadingSpinner.jsx
 *
 * 공통적으로 사용될 Loading Spinner
 */

const LoadingSpinner = () =>
{
    return (
        <div className="krds-spinner" role="status">
            <span className="sr-only">로딩 중</span>
            Loading data..
        </div>
    )
}

export default LoadingSpinner;