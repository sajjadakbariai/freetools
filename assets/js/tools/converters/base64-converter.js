/**
 * Base64 Encoder/Decoder Tool
 * ابزار کدگذاری و رمزگشایی Base64
 */
class Base64Converter {
    constructor() {
        this.selectedFile = null;
        this.bindEvents();
        this.initTabs();
    }
    
    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    bindEvents() {
        // Text encoding/decoding
        document.getElementById('encode-btn').addEventListener('click', () => this.encodeText());
        document.getElementById('decode-btn').addEventListener('click', () => this.decodeText());
        document.getElementById('clear-text-btn').addEventListener('click', () => this.clearText());
        document.getElementById('copy-base64-btn').addEventListener('click', () => this.copyBase64());
        
        // File handling
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileSelect(e));
        document.getElementById('encode-file-btn').addEventListener('click', () => this.encodeFile());
        document.getElementById('clear-file-btn').addEventListener('click', () => this.clearFile());
        document.getElementById('copy-file-base64-btn').addEventListener('click', () => this.copyFileBase64());
        document.getElementById('download-file-btn').addEventListener('click', () => this.downloadFile());
    }
    
    encodeText() {
        const inputText = document.getElementById('input-text').value;
        if (!inputText.trim()) {
            this.showToast('لطفاً متن را وارد کنید', 'error');
            return;
        }
        
        try {
            const encoded = this.btoaUTF8(inputText);
            document.getElementById('output-base64').value = encoded;
            this.showToast('متن با موفقیت کدگذاری شد', 'success');
        } catch (e) {
            this.showToast('خطا در کدگذاری متن', 'error');
            console.error(e);
        }
    }
    
    decodeText() {
        const base64Text = document.getElementById('output-base64').value;
        if (!base64Text.trim()) {
            this.showToast('لطفاً کد Base64 را وارد کنید', 'error');
            return;
        }
        
        try {
            const decoded = this.atobUTF8(base64Text);
            document.getElementById('input-text').value = decoded;
            this.showToast('متن با موفقیت رمزگشایی شد', 'success');
        } catch (e) {
            this.showToast('کد Base64 نامعتبر است', 'error');
            console.error(e);
        }
    }
    
    clearText() {
        document.getElementById('input-text').value = '';
        document.getElementById('output-base64').value = '';
        this.showToast('متن پاک شد', 'info');
    }
    
    copyBase64() {
        const base64Text = document.getElementById('output-base64').value;
        if (!base64Text.trim()) {
            this.showToast('هیچ متنی برای کپی کردن وجود ندارد', 'error');
            return;
        }
        
        navigator.clipboard.writeText(base64Text)
            .then(() => this.showToast('متن کپی شد', 'success'))
            .catch(err => this.showToast('خطا در کپی کردن متن', 'error'));
    }
    
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        this.selectedFile = file;
        document.getElementById('file-info').innerHTML = `
            <strong>نام فایل:</strong> ${file.name}<br>
            <strong>نوع فایل:</strong> ${file.type || 'ناشناخته'}<br>
            <strong>حجم فایل:</strong> ${this.formatFileSize(file.size)}
        `;
        
        // Enable buttons
        document.getElementById('encode-file-btn').disabled = false;
        document.getElementById('clear-file-btn').disabled = false;
    }
    
    encodeFile() {
        if (!this.selectedFile) {
            this.showToast('لطفاً فایلی را انتخاب کنید', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target.result.split(',')[1];
            document.getElementById('file-base64-output').value = base64String;
            
            // Enable download and copy buttons
            document.getElementById('download-file-btn').disabled = false;
            document.getElementById('copy-file-base64-btn').disabled = false;
            
            this.showToast('فایل با موفقیت کدگذاری شد', 'success');
        };
        reader.onerror = (e) => {
            this.showToast('خطا در خواندن فایل', 'error');
            console.error(e);
        };
        reader.readAsDataURL(this.selectedFile);
    }
    
    clearFile() {
        document.getElementById('file-input').value = '';
        document.getElementById('file-base64-output').value = '';
        document.getElementById('file-info').innerHTML = '';
        this.selectedFile = null;
        
        // Disable buttons
        document.getElementById('encode-file-btn').disabled = true;
        document.getElementById('clear-file-btn').disabled = true;
        document.getElementById('download-file-btn').disabled = true;
        document.getElementById('copy-file-base64-btn').disabled = true;
        
        this.showToast('فایل پاک شد', 'info');
    }
    
    copyFileBase64() {
        const base64Text = document.getElementById('file-base64-output').value;
        if (!base64Text.trim()) {
            this.showToast('هیچ متنی برای کپی کردن وجود ندارد', 'error');
            return;
        }
        
        navigator.clipboard.writeText(base64Text)
            .then(() => this.showToast('متن کپی شد', 'success'))
            .catch(err => this.showToast('خطا در کپی کردن متن', 'error'));
    }
    
    downloadFile() {
        const base64Text = document.getElementById('file-base64-output').value;
        if (!base64Text.trim() || !this.selectedFile) {
            this.showToast('هیچ فایلی برای دانلود وجود ندارد', 'error');
            return;
        }
        
        try {
            const byteString = atob(base64Text);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            
            const blob = new Blob([ab], { type: this.selectedFile.type });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = this.selectedFile.name || 'decoded-file';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('فایل با موفقیت دانلود شد', 'success');
        } catch (e) {
            this.showToast('خطا در ایجاد فایل', 'error');
            console.error(e);
        }
    }
    
    // UTF-8 safe encoding/decoding
    btoaUTF8(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, 
            (match, p1) => String.fromCharCode('0x' + p1)));
    }
    
    atobUTF8(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), 
            (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 بایت';
        const k = 1024;
        const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    new Base64Converter();
});
