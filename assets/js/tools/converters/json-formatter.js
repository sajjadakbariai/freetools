/**
 * JSON Formatter Tool
 * ابزار فرمت و اعتبارسنجی JSON
 */

const JSONFormatter = {
    /**
     * فرمت کردن JSON با رعایت تو رفتگی‌ها
     * @param {string} jsonString - رشته JSON ورودی
     * @returns {string} - JSON فرمت شده
     */
    format: function(jsonString) {
        try {
            const obj = JSON.parse(jsonString);
            return JSON.stringify(obj, null, 4);
        } catch (error) {
            throw new Error(`خطای ساختاری در JSON: ${error.message}`);
        }
    },
    
    /**
     * فشرده کردن JSON با حذف فاصله‌های اضافه
     * @param {string} jsonString - رشته JSON ورودی
     * @returns {string} - JSON فشرده شده
     */
    minify: function(jsonString) {
        try {
            const obj = JSON.parse(jsonString);
            return JSON.stringify(obj);
        } catch (error) {
            throw new Error(`خطای ساختاری در JSON: ${error.message}`);
        }
    },
    
    /**
     * اعتبارسنجی ساختار JSON
     * @param {string} jsonString - رشته JSON ورودی
     * @returns {object} - نتیجه اعتبارسنجی
     */
    validate: function(jsonString) {
        try {
            JSON.parse(jsonString);
            return {
                valid: true,
                message: "JSON معتبر است",
                size: this.getSize(jsonString),
                lines: jsonString.split('\n').length
            };
        } catch (error) {
            return {
                valid: false,
                message: error.message,
                position: this.findErrorPosition(jsonString, error)
            };
        }
    },
    
    /**
     * پیدا کردن موقعیت خطا در JSON
     * @param {string} jsonString - رشته JSON ورودی
     * @param {Error} error - شیء خطا
     * @returns {object} - موقعیت خطا (خط و ستون)
     */
    findErrorPosition: function(jsonString, error) {
        if (!error.message.includes('at position')) {
            return null;
        }
        
        const positionMatch = error.message.match(/at position (\d+)/);
        if (!positionMatch) return null;
        
        const position = parseInt(positionMatch[1]);
        const lines = jsonString.substring(0, position).split('\n');
        
        return {
            line: lines.length,
            column: lines[lines.length - 1].length + 1
        };
    },
    
    /**
     * محاسبه حجم JSON
     * @param {string} jsonString - رشته JSON ورودی
     * @returns {string} - حجم با واحد مناسب
     */
    getSize: function(jsonString) {
        const bytes = new Blob([jsonString]).size;
        if (bytes < 1024) return `${bytes} بایت`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} کیلوبایت`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} مگابایت`;
    },
    
    /**
     * تولید نمونه JSON
     * @returns {string} - نمونه JSON
     */
    generateSample: function() {
        return JSON.stringify({
            "name": "ToolsFree.ir",
            "description": "ابزارهای رایگان برای توسعه‌دهندگان",
            "version": "1.0.0",
            "keywords": ["json", "formatter", "tools"],
            "author": {
                "name": "تیم ToolsFree",
                "email": "info@toolsfree.ir"
            },
            "contributors": [
                "Developer 1",
                "Developer 2"
            ],
            "license": "MIT",
            "features": {
                "jsonFormatter": true,
                "jsonValidator": true,
                "minify": true
            },
            "stats": {
                "users": 1500,
                "rating": 4.8,
                "active": true
            }
        }, null, 2);
    }
};

// توابع کمکی برای کار با کلیپ‌بورد
function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            successful ? resolve() : reject(new Error('کپی انجام نشد'));
        } catch (error) {
            reject(error);
        }
    });
}

// توابع مربوط به دانلود فایل
function downloadFile(filename, content, type = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// اتصال توابع به محیط جهانی برای دسترسی از HTML
window.JSONFormatter = JSONFormatter;
window.copyToClipboard = copyToClipboard;
window.downloadFile = downloadFile;
