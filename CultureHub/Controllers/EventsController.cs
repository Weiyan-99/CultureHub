using CultureHub.Data;
using CultureHub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;


namespace CultureHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        public AppDbContext _dbContext { get; }

        public EventsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // 取得全部活動列表 GET: api/Events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> Index()
        {
           return await _dbContext.Events.ToListAsync();
        }
        
        // 單獨頁 GET: api/Events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var eventItem =  await _dbContext.Events.FindAsync(id);
            
            // 如果找不到該活動回傳404
            if (eventItem == null)
            {
                return NotFound();
            }
            return eventItem;
        }

        // 新增 POST api/Create
        // 接收外部資料(參數傳入) -> 執行寫入db -> 回傳結果
        [HttpPost]
        public async Task<ActionResult<Event>> Create(Event eventItem)
        {
            _dbContext.Events.Add(eventItem);
            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEvent), new { id = eventItem.Id }, eventItem);
        }

        // 編輯 PUT api/Edit/5
        // 資料庫抓出要更新的資料 -> 更新資料 -> 儲存狀態 -> 回傳狀態碼
        [HttpPut("{id}")]
        public async Task<ActionResult<Event>> Edit(int id, Event eventItem)
        {
            // 檢查id是否相符
            if(id != eventItem.Id)
            {
                return BadRequest();
            }

            _dbContext.Entry(eventItem).State = EntityState.Modified; //EF 修改

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // 檢查修改項目，不存在回傳404
                if(!_dbContext.Events.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();  //回傳204 無需顯示內容

        }

        // DELETE api/Delete/5
        // 找到物件 -> 移除物件 -> 儲存狀態 -> 回傳狀態碼
        [HttpDelete("{id}")]
        public async Task<ActionResult<Event>> Delete(int id)
        {
            var eventItem = await _dbContext.Events.FindAsync(id);
            
            if(eventItem == null)
            {
                return NotFound();
            }

            _dbContext.Events.Remove(eventItem); //移除

            await _dbContext.SaveChangesAsync(); //db執行

            return NoContent();

        }
    }
}
