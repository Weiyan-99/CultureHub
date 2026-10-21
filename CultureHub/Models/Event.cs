using System.ComponentModel.DataAnnotations;

namespace CultureHub.Models
{
    public class Event
    {
        /// <summary>
        ///  流水號
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 活動名稱
        /// </summary>
        public required string Title { get; set; }

        /// <summary>
        /// 活動性質(如: 展覽, 音樂會, 歌劇)
        /// </summary>
        public required string Type { get; set; }

        /// <summary>
        /// 概述
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// 開始日期
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// 結束日期
        /// </summary>
        public DateTime? EndDate { get; set; }

        /// <summary>
        /// 場次與營業時間說明
        /// </summary>
        public string? ShowTimeInfo { get; set; }

        /// <summary>
        /// 地點
        /// </summary>
        public string? Location { get; set; }

        /// <summary>
        /// 縣市
        /// </summary>
        public string? City { get; set; }

        /// <summary>
        /// 票價
        /// </summary>
        public string? Price { get; set; }

        /// <summary>
        /// 主辦單位
        /// </summary>
        public string? Organizer { get; set; }

        /// <summary>
        /// 活動資訊連結
        /// </summary>
        public string? Link { get; set; }

        /// <summary>
        /// 資料建立時間
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    }
}
