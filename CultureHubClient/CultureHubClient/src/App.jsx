import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // 宣告狀態events, 用來放活動資料, 初始值是空陣列[]
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); //用來記錄是否正在讀取中
  const [searchTerm, setSearchTerm] = useState(''); //用來記錄搜尋關鍵字,預設空字串
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // 用useEffect在畫面載入時去API拿資料
  useEffect(()=> {
    axios.get('https://localhost:7170/api/Events')
      .then(response =>{
        //成功拿到資料後把資料存進events記憶板中
        setEvents(response.data);
        setLoading(false);//結束讀取狀態
      })
      .catch(error =>{
        console.error('取得活動資料失敗:', error);
        setLoading(false); 
      });
    },[]); //空陣列代表只在畫面第一次長出來時執行一次


  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>CultureHub 藝文活動平台</h1>
      {/* 左右雙欄大容器 */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* 左側類別選單區 */}
        <div style={{ 
          width: '100px', 
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
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: 'none',
                    // 如果目前被選中，就變成深色背景；否則透明
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
        <div style={{flex:1}}>
          {/* 搜尋輸入框 */}
          <div style={{marginBottom: '1.5rem'}}>
            <input
              type="text"
              placeholder="活動搜尋"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}       
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
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '1.5rem', 
              marginTop: '1.5rem' 
            }}>
              {/* 先過濾資料再進行map轉換*/}
              {events
                .filter(event =>{
                  // 條件1:類別搜尋
                  const matchCategory = selectedCategory === '全部' || event.type === selectedCategory;
                  // 條件2:關鍵字搜尋
                  const matchSearch =event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase());

                  return matchCategory && matchSearch;
                })
                .map((event, index) => (
                  <div key={index} style={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    padding: '1.2rem', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    backgroundColor: '#ffffff'
                  }}>
                    {/* 活動類別標籤 */}
                    <span style={{
                      position: 'absolute',
                      top:'0',
                      left:'0',
                      backgroundColor: '#4f46e5', // 漂亮的靛藍色
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.8rem',
                      borderBottomRightRadius: '8px', // 讓右下角圓圓的，好看！
                      fontWeight: 'bold'
                      }}>
                      {event.type || '一般活動'}                 
                    </span>

                    <h3 style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>{event.title}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{event.type}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>地點:{event.location}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>時間:{event.startDate}~{event.endDate}</p>
                    {event.price && <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>票價:{event.price}</p>}
                    {event.organizer && <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>主辦單位:{event.organizer}</p>}              
                  </div>
                ))}          
            </div>
          )}
        </div>
      </div>        
    </div>
  );
}

export default App;
