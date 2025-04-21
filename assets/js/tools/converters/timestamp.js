/**
 * Timestamp Converter Tool
 * ابزار تبدیل timestamp به تاریخ و زمان و بالعکس
 */
class TimestampConverter {
    constructor() {
        this.bindEvents();
        this.updateCurrentTime();
    }
    
    bindEvents() {
        // Timestamp to Date
        document.getElementById('convert-to-date-btn').addEventListener('click', () => this.convertTimestampToDate());
        document.getElementById('timestamp-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.convertTimestampToDate();
        });
        document.getElementById('current-timestamp-btn').addEventListener('click', () => this.useCurrentTimestamp());
        document.getElementById('clear-timestamp-btn').addEventListener('click', () => this.clearTimestamp());
        
        // Date to Timestamp
        document.getElementById('convert-to-timestamp-btn').addEventListener('click', () => this.convertDateToTimestamp());
        document.getElementById('current-date-btn').addEventListener('click', () => this.useCurrentDate());
        
        // Update current time every second
        setInterval(() => this.updateCurrentTime(), 1000);
    }
    
    convertTimestampToDate() {
        const timestampInput = document.getElementById('timestamp-input').value.trim();
        if (!timestampInput) {
            this.showToast('لطفاً timestamp را وارد کنید', 'error');
            return;
        }
        
        const isMilliseconds = document.getElementById('timestamp-milliseconds').checked;
        const timezone = document.getElementById('timezone').value;
        let timestamp = parseInt(timestampInput);
        
        if (isNaN(timestamp)) {
            this.showToast('timestamp باید یک عدد باشد', 'error');
            return;
        }
        
        // Convert to milliseconds if needed
        if (!isMilliseconds && timestampInput.length === 13) {
            // Probably milliseconds entered but option is seconds
            timestamp = Math.floor(timestamp / 1000);
        } else if (isMilliseconds && timestampInput.length === 10) {
            // Probably seconds entered but option is milliseconds
            timestamp = timestamp * 1000;
        }
        
        // Final conversion based on options
        const finalTimestamp = isMilliseconds ? timestamp : timestamp * 1000;
        const date = new Date(finalTimestamp);
        
        if (isNaN(date.getTime())) {
            this.showToast('timestamp نامعتبر است', 'error');
            return;
        }
        
        // Format dates based on timezone
        let humanDate, isoDate, rfcDate;
        
        if (timezone === 'utc') {
            humanDate = date.toUTCString();
            isoDate = date.toISOString();
            rfcDate = date.toUTCString();
        } else {
            humanDate = date.toLocaleString('fa-IR');
            isoDate = date.toISOString();
            rfcDate = date.toString();
        }
        
        // Update results
        document.getElementById('human-date').textContent = humanDate;
        document.getElementById('iso-date').textContent = isoDate;
        document.getElementById('rfc-date').textContent = rfcDate;
        
        this.showToast('timestamp با موفقیت تبدیل شد', 'success');
    }
    
    convertDateToTimestamp() {
        const year = parseInt(document.getElementById('year-input').value);
        const month = parseInt(document.getElementById('month-input').value);
        const day = parseInt(document.getElementById('day-input').value);
        const hour = parseInt(document.getElementById('hour-input').value);
        const minute = parseInt(document.getElementById('minute-input').value);
        const second = parseInt(document.getElementById('second-input').value);
        
        // Validate inputs
        if (isNaN(year) || year < 1970 || year > 2100) {
            this.showToast('سال باید بین 1970 تا 2100 باشد', 'error');
            return;
        }
        
        if (isNaN(month) || month < 0 || month > 11) {
            this.showToast('ماه نامعتبر است', 'error');
            return;
        }
        
        if (isNaN(day) || day < 1 || day > 31) {
            this.showToast('روز نامعتبر است', 'error');
            return;
        }
        
        if (isNaN(hour) || hour < 0 || hour > 23) {
            this.showToast('ساعت باید بین 0 تا 23 باشد', 'error');
            return;
        }
        
        if (isNaN(minute) || minute < 0 || minute > 59) {
            this.showToast('دقیقه باید بین 0 تا 59 باشد', 'error');
            return;
        }
        
        if (isNaN(second) || second < 0 || second > 59) {
            this.showToast('ثانیه باید بین 0 تا 59 باشد', 'error');
            return;
        }
        
        // Create date object
        const date = new Date(year, month, day, hour, minute, second);
        const timestampSeconds = Math.floor(date.getTime() / 1000);
        const timestampMillis = date.getTime();
        
        // Update results
        document.getElementById('timestamp-seconds').textContent = timestampSeconds;
        document.getElementById('timestamp-millis').textContent = timestampMillis;
        
        this.showToast('تاریخ با موفقیت به timestamp تبدیل شد', 'success');
    }
    
    useCurrentTimestamp() {
        const isMilliseconds = document.getElementById('timestamp-milliseconds').checked;
        const now = isMilliseconds ? Date.now() : Math.floor(Date.now() / 1000);
        document.getElementById('timestamp-input').value = now;
        this.convertTimestampToDate();
    }
    
    useCurrentDate() {
        const now = new Date();
        document.getElementById('year-input').value = now.getFullYear();
        document.getElementById('month-input').value = now.getMonth();
        document.getElementById('day-input').value = now.getDate();
        document.getElementById('hour-input').value = now.getHours();
        document.getElementById('minute-input').value = now.getMinutes();
        document.getElementById('second-input').value = now.getSeconds();
        this.convertDateToTimestamp();
    }
    
    clearTimestamp() {
        document.getElementById('timestamp-input').value = '';
        document.getElementById('human-date').textContent = '---';
        document.getElementById('iso-date').textContent = '---';
        document.getElementById('rfc-date').textContent = '---';
        this.showToast('timestamp پاک شد', 'info');
    }
    
    updateCurrentTime() {
        const now = new Date();
        const timestampSeconds = Math.floor(now.getTime() / 1000);
        const timestampMillis = now.getTime();
        
        document.getElementById('current-timestamp-seconds').textContent = timestampSeconds;
        document.getElementById('current-timestamp-millis').textContent = timestampMillis;
        document.getElementById('current-human-date').textContent = now.toLocaleString('fa-IR');
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
}

// Initialize the tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimestampConverter();
});
