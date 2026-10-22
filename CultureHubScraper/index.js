// 先抓外掛進來
const axios = require('axios');
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

// 抓取 api 網址
// const apiUrl = 'https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6';


// 待使用分類對應表           
// function classifyEvent(title, description){
//     const text = (title + '' + description).toLocaleLowerCase();

//     if(text.includes('快閃') || text.includes('pop-up') || text.includes('popup') ){
//         return '快閃店';
//     }
//      if(text.includes('市集') || text.includes('手作') || text.includes('文創') ){
//         return '市集/手作';
//     }
//      if(text.includes('演唱會') || text.includes('音樂會') || text.includes('演奏') ){
//         return '音樂/演出';
//     }
//      if(text.includes('展') || text.includes('特展') || text.includes('美術館') ){
//         return '展覽/藝術';
//     }
//      if(text.includes('講座') || text.includes('導覽') || text.includes('分享會') ){
//         return '講座/論壇';
//     }
//      if(text.includes('影展') || text.includes('電影') || text.includes('放映') ){
//         return '影視/映演';
//     }

//     return '其他活動';
// }

// 根據文化部官方介接說明文件整理的分類清單
const targetSources = [
    { id: '1', defaultType: '音樂' },
    { id: '2', defaultType: '戲劇' },
    { id: '3', defaultType: '舞蹈' },
    { id: '4', defaultType: '親子' },
    { id: '5', defaultType: '獨立音樂' },
    { id: '6', defaultType: '展覽' },
    { id: '7', defaultType: '講座' },
    { id: '8', defaultType: '電影' },
    { id: '17', defaultType: '演唱會' },
    { id: '200', defaultType: '閱讀' }
];

// 定義方法
async function fetchCultureData(){
    try{
        for(const target of targetSources){

            const apiUrl = `https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=${target.id}`

            console.log(`正在向政府Open Data 請求${target.defaultType}活動資料...`);

            // 抓取
            const response = await axios.get(apiUrl);
            
            // 將資料轉成物件
            const events = response.data;

            console.log(`成功取得${target.defaultType}資料，共${events.length}筆活動`);
            

            // 迴圈處理傳入資料
            for(const item of events){
            
                // 處理地點與城市
                const rawLocation = item.showInfo[0]?.locationName || '';

                const newEvent = {
                    title: item.title,
                    type: target.defaultType,
                    description: item.descriptionFilterHtml || '',
                    startDate: new Date(item.startDate).toISOString(),
                    endDate: new Date(item.endDate).toISOString(),
                    showTimeInfo: item.showInfo[0]?.time || '',
                    location: rawLocation,
                    city: rawLocation.slice(0, 3),
                    price: item.showInfo[0]?.price || '',
                    organizer: Array.isArray(item.masterUnit) ? item.masterUnit.join(', ') : (item.masterUnit || ''),
                    link: item.webSales || ''
                };

                try{                
                    // 發送POST給api
                    const response = await axios.post('https://localhost:7170/api/Events', newEvent, {httpsAgent});
                    console.log(`成功匯入: ${newEvent.title}`);
                }
                catch(error){
                    console.error(`匯入失敗[${newEvent.title}]`, error.response?.data || error.message);
                }

            }
            console.log('所有官方分類資料同步完成！');
        }
    }    
    catch(error){
        console.error('抓取資料時發生錯誤:', error.message);
    }  
}

fetchCultureData();
