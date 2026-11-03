import { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';

function App() {
  // 宣告狀態 events, 用來放活動資料, 初始值是空陣列 []
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // 用來記錄是否正在讀取中
  const [searchTerm, setSearchTerm] = useState(''); // 用來記錄搜尋關鍵字, 預設空字串
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1); // 用來記錄目前頁數
  const [itemsPerPage] = useState(15); // 每頁顯示幾筆資料, 固定 15 筆



  // 用 useEffect 在畫面載入時去 API 拿資料
  useEffect(() => {
    axios.get('https://localhost:7170/api/Events')
      .then(response => {
        // 成功拿到資料後把資料存進 events 記憶板中
        setEvents(response.data);
        setLoading(false); // 結束讀取狀態
      })
      .catch(error => {
        console.error('取得活動資料失敗:', error);
        setLoading(false); 
      });
  }, []); // 空陣列代表只在畫面第一次長出來時執行一次



  // 資料過濾 (分類 + 關鍵字)
  const filteredEvents = events.filter(event => {
    const matchCategory = selectedCategory === '全部' || event.type === selectedCategory;
    const matchSearch = event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // 計算分頁相關數值
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage); // 總頁數
  const indexOfLastItem = currentPage * itemsPerPage; // 當前頁面最後一筆的索引
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>CultureHub 藝文活動平台</h1>
      
      {/* 左右雙欄大容器 */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* 左側類別選單區 */}
        <div style={{ 
          width: '120px', 
          flexShrink: 0, 
          textAlign: 'left',
          backgroundColor: '#f9fafb', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h3>活動分類</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
            {['全部', '音樂', '展覽', '戲劇', '講座'].map((category) => (
              <li key={category} style={{ marginBottom: '0.5rem' }}>
                <button 
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1); // 每次切換類別，跳回第一頁
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: selectedCategory === category ? '#4f46e5' : 'transparent',
                    color: selectedCategory === category ? '#ffffff' : '#374151',
                    cursor: 'pointer',
                    fontWeight: selectedCategory === category ? 'bold' : 'normal'
                  }}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>      

        {/* 右側主內容區 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 搜尋輸入框 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="活動搜尋"
              value={searchTerm}
              onChange={(e) => { 
                setSearchTerm(e.target.value);
                setCurrentPage(1); // 每次搜尋關鍵字，跳回第一頁
              }}       
              style={{
                padding: '0.5rem 1rem',
                width: '100%',
                maxWidth: '400px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem'         
              }}
            />
          </div>

          {/* 根據狀態顯示對應畫面 */}
          {loading ? (
            <p>資料讀取中，請稍後...</p>
          ) : (
            <div>
              {/* 顯示目前筆數與頁碼資訊 */}
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                找到 {filteredEvents.length} 筆活動 (目前顯示第 {currentPage} / {totalPages || 1} 頁) 
              </p>

              {/* 分頁元件 */}
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={(page) => setCurrentPage(page)} 
              />

              {/* 卡片網格列表 */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {currentEvents.map((event, index) => (
                  <div key={index} style={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    padding: '2rem 1.2rem 1.2rem 1.2rem', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    backgroundColor: '#ffffff'
                  }}>
                    {/* 活動類別標籤 */}
                    <span style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.8rem',
                      borderBottomRightRadius: '8px',
                      fontWeight: 'bold'
                    }}>
                      {event.type || '一般活動'}             
                    </span>

                    <h3 style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>{event.title}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{event.type}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>地點：{event.location || '未提供'}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>時間：{event.startDate} ~ {event.endDate}</p>
                    {event.price && <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>票價：{event.price}</p>}
                    {event.organizer && <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>主辦單位：{event.organizer}</p>}           
                  </div>
                ))}
              </div>

              {/* 分頁元件 */}
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={(page) => {
                  setCurrentPage(page);
                  // 點擊下方分頁時，自動滑動回頁面頂部，體驗更好！
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />

            </div>
          )}
      </div>        
      </div>
    </div>
  );
}

export default App;