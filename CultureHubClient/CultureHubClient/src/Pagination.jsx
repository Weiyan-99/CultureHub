
export default function Pagination({ currentPage, totalPages, onPageChange }){
    const getPaginationGroup = () => {
        let pages = [];
        let maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            } else {
            pages.push(1);
            
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            
            if (currentPage <= 3) {
                end = 4;
            } else if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }
            
            if (start > 2) {
                pages.push('...');
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (end < totalPages - 1) {
                pages.push('...');
            }
            
            pages.push(totalPages);
            }
            return pages;
    };

    // 如果只有 1 頁或沒有資料，就不渲染分頁列
    if (totalPages <= 1) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', margin: '1rem 0', flexWrap: 'wrap' }}>
        
        {/* 上一頁按鈕 */}
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
            padding: '0.5rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: currentPage === 1 ? '#f3f4f6' : '#ffffff',
            color: currentPage === 1 ? '#9ca3af' : '#374151',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
            }}
        >
            上一頁
        </button>

        {/* 智慧頁碼按鈕 */}
        {getPaginationGroup().map((item, index) => {
            if (item === '...') {
            return <span key={index} style={{ padding: '0 0.3rem', color: '#6b7280' }}>...</span>;
            }

            return (
            <button
                key={index}
                onClick={() => onPageChange(item)}
                style={{
                padding: '0.5rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: currentPage === item ? '#4f46e5' : '#ffffff',
                color: currentPage === item ? '#ffffff' : '#374151',
                cursor: 'pointer',
                fontWeight: currentPage === item ? 'bold' : 'normal',
                minWidth: '36px',
                fontSize: '0.9rem'
                }}
            >
                {item}
            </button>
            );
        })}

        {/* 下一頁按鈕 */}
        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
            padding: '0.5rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#ffffff',
            color: currentPage === totalPages ? '#9ca3af' : '#374151',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
            }}
        >
            下一頁
        </button>
        </div>
    )
}