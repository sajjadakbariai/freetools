/**
 * JSON Formatter Tool
 * فرمت‌کننده و اعتبارسنج JSON
 */
class JSONFormatterTool {
    constructor() {
        this.initEditor();
        this.bindEvents();
    }
    
    initEditor() {
        // ویرایشگر کد برای نمایش JSON فرمت شده
        this.editor = CodeMirror(document.getElementById('json-editor'), {
            lineNumbers: true,
            mode: 'application/json',
            theme: 'dracula',
            readOnly: true,
            lineWrapping: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 4
        });
    }
    
    bindEvents() {
        document.getElementById('format-btn').addEventListener('click', () => this.formatJSON());
        document.getElementById('minify-btn').addEventListener('click', () => this.minifyJSON());
        document.getElementById('validate-btn').addEventListener('click', () => this.validateJSON());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearAll());
        document.getElementById('sample-btn').addEventListener('click', () => this.loadSample());
        document.getElementById('copy-btn').addEventListener('click', () => this.copyResult());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadJSON());
    }
    
    formatJSON() {
        const input = document.getElementById('json-input').value;
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 4);
            this.editor.setValue(formatted);
            this.showValidationResult(true, 'JSON با موفقیت فرمت شد.');
        } catch (e) {
            this.showValidationResult(false, `خطا در فرمت کردن JSON: ${e.message}`);
        }
    }
    
    minifyJSON() {
        const input = document.getElementById('json-input').value;
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            this.editor.setValue(minified);
            this.showValidationResult(true, 'JSON با موفقیت فشرده شد.');
        } catch (e) {
            this.showValidationResult(false, `خطا در فشرده کردن JSON: ${e.message}`);
        }
    }
    
    validateJSON() {
        const input = document.getElementById('json-input').value;
        try {
            JSON.parse(input);
            this.editor.setValue(input);
            this.showValidationResult(true, 'JSON معتبر است.');
        } catch (e) {
            this.showValidationResult(false, `JSON نامعتبر: ${e.message}`);
        }
    }
    
    showValidationResult(isValid, message) {
        const validator = document.getElementById('validator-result');
        const msgElement = document.getElementById('validation-message');
        
        validator.style.display = 'block';
        validator.className = `validator-result ${isValid ? 'valid' : 'invalid'}`;
        msgElement.textContent = message;
    }
    
    clearAll() {
        document.getElementById('json-input').value = '';
        this.editor.setValue('');
        document.getElementById('validator-result').style.display = 'none';
    }
    
    loadSample() {
        const sampleJSON = {
            "name": "ToolsFree.ir",
            "description": "مجموعه ابزارهای رایگان برای توسعه‌دهندگان",
            "tools": [
                {"name": "JSON Formatter", "category": "Converters"},
                {"name": "Base64 Encoder", "category": "Converters"},
                {"name": "JWT Decoder", "category": "Converters"}
            ],
            "stats": {
                "visitors": 15000,
                "rating": 4.9,
                "languages": ["Persian", "English"]
            }
        };
        
        document.getElementById('json-input').value = JSON.stringify(sampleJSON, null, 2);
    }
    
    copyResult() {
        const jsonValue = this.editor.getValue();
        if (!jsonValue) {
            this.showToast('خطا: هیچ محتوایی برای کپی کردن وجود ندارد', 'error');
            return;
        }
        
        navigator.clipboard.writeText(jsonValue)
            .then(() => this.showToast('محتوا با موفقیت کپی شد', 'success'))
            .catch(err => this.showToast(`خطا در کپی کردن: ${err}`, 'error'));
    }
    
    downloadJSON() {
        const jsonValue = this.editor.getValue();
        if (!jsonValue) {
            this.showToast('خطا: هیچ محتوایی برای دانلود وجود ندارد', 'error');
            return;
        }
        
        try {
            const blob = new Blob([jsonValue], {type: 'application/json'});
            saveAs(blob, 'formatted-json.json');
            this.showToast('فایل با موفقیت دانلود شد', 'success');
        } catch (e) {
            this.showToast(`خطا در ایجاد فایل: ${e.message}`, 'error');
        }
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
    new JSONFormatterTool();
});
