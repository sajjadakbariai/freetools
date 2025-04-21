/**
 * URL Encoder/Decoder Tool
 * ابزار کدگذاری و رمزگشایی URL
 */
class URLEncoder {
    constructor() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.getElementById('encode-btn').addEventListener('click', () => this.encodeURL(false));
        document.getElementById('encode-full-btn').addEventListener('click', () => this.encodeURL(true));
        document.getElementById('decode-btn').addEventListener('click', () => this.decodeURL());
        document.getElementById('clear-input-btn').addEventListener('click', () => this.clearInput());
        document.getElementById('copy-output-btn').addEventListener('click', () => this.copyOutput());
    }
    
    encodeURL(fullEncode) {
        const inputText = document.getElementById('input-text').value;
        if (!inputText.trim()) {
            this.showToast('لطفاً متنی را وارد کنید', 'error');
            return;
        }
        
        try {
            let encoded;
            if (fullEncode) {
                // Encode all characters except A-Z, a-z, 0-9
                encoded = encodeURIComponent(inputText);
            } else {
                // Custom encoding based on options
                encoded = this.customEncode(inputText);
            }
            
            document.getElementById('output-text').value = encoded;
            this.showToast('متن با موفقیت کدگذاری شد', 'success');
        } catch (e) {
            this.showToast('خطا در کدگذاری متن', 'error');
            console.error(e);
        }
    }
    
    customEncode(text) {
        // Get encoding options
        const encodeSlash = document.getElementById('encode-slash').checked;
        const encodeColon = document.getElementById('encode-colon').checked;
        const encodeQuestion = document.getElementById('encode-question').checked;
        const encodeEquals = document.getElementById('encode-equals').checked;
        const encodeAmpersand = document.getElementById('encode-ampersand').checked;
        
        // First encode everything
        let encoded = encodeURIComponent(text);
        
        // Then selectively decode some characters based on options
        if (!encodeSlash) encoded = encoded.replace(/%2F/g, '/');
        if (!encodeColon) encoded = encoded.replace(/%3A/g, ':');
        if (!encodeQuestion) encoded = encoded.replace(/%3F/g, '?');
        if (!encodeEquals) encoded = encoded.replace(/%3D/g, '=');
        if (!encodeAmpersand) encoded = encoded.replace(/%26/g, '&');
        
        return encoded;
    }
    
    decodeURL() {
        const encodedText = document.getElementById('input-text').value;
        if (!encodedText.trim()) {
            this.showToast('لطفاً متنی را وارد کنید', 'error');
            return;
        }
        
        try {
            const decoded = decodeURIComponent(encodedText.replace(/\+/g, ' '));
            document.getElementById('output-text').value = decoded;
            this.showToast('متن با موفقیت رمزگشایی شد', 'success');
        } catch (e) {
            this.showToast('متن کدگذاری شده نامعتبر است', 'error');
            console.error(e);
        }
    }
    
    clearInput() {
        document.getElementById('input-text').value = '';
        document.getElementById('output-text').value = '';
        this.showToast('ورودی پاک شد', 'info');
    }
    
    copyOutput() {
        const outputText = document.getElementById('output-text').value;
        if (!outputText.trim()) {
            this.showToast('هیچ متنی برای کپی کردن وجود ندارد', 'error');
            return;
        }
        
        navigator.clipboard.writeText(outputText)
            .then(() => this.showToast('متن کپی شد', 'success'))
            .catch(err => this.showToast('خطا در کپی کردن متن', 'error'));
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
    new URLEncoder();
});
