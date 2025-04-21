/**
 * HTML Entities Encoder/Decoder Tool
 * ابزار کدگذاری و رمزگشایی HTML Entities
 */
class HTMLEntitiesConverter {
    constructor() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.getElementById('encode-btn').addEventListener('click', () => this.encodeText(false));
        document.getElementById('encode-all-btn').addEventListener('click', () => this.encodeText(true));
        document.getElementById('decode-btn').addEventListener('click', () => this.decodeText());
        document.getElementById('clear-input-btn').addEventListener('click', () => this.clearInput());
        document.getElementById('copy-output-btn').addEventListener('click', () => this.copyOutput());
        
        // Update preview when output changes
        document.getElementById('output-text').addEventListener('input', () => this.updatePreview());
    }
    
    encodeText(encodeAll) {
        const inputText = document.getElementById('input-text').value;
        if (!inputText.trim()) {
            this.showToast('لطفاً متنی را وارد کنید', 'error');
            return;
        }
        
        try {
            let encoded = '';
            const encodeSpecial = document.getElementById('encode-special').checked;
            const encodeNonAscii = document.getElementById('encode-nonascii').checked;
            const useHex = document.getElementById('encode-hex').checked;
            const useDecimal = document.getElementById('encode-decimal').checked;
            
            for (let i = 0; i < inputText.length; i++) {
                const char = inputText[i];
                const charCode = char.charCodeAt(0);
                
                // Check if character needs encoding
                if (encodeAll || 
                    (encodeSpecial && this.isSpecialChar(char)) || 
                    (encodeNonAscii && charCode > 127)) {
                    
                    if (useHex) {
                        encoded += `&#x${charCode.toString(16)};`;
                    } else if (useDecimal) {
                        encoded += `&#${charCode};`;
                    } else {
                        // Try to find named entity
                        const namedEntity = this.getNamedEntity(char);
                        encoded += namedEntity || `&#${charCode};`;
                    }
                } else {
                    encoded += char;
                }
            }
            
            document.getElementById('output-text').value = encoded;
            this.updatePreview();
            this.showToast('متن با موفقیت کدگذاری شد', 'success');
        } catch (e) {
            this.showToast('خطا در کدگذاری متن', 'error');
            console.error(e);
        }
    }
    
    isSpecialChar(char) {
        const specialChars = ['<', '>', '&', '"', "'"];
        return specialChars.includes(char);
    }
    
    getNamedEntity(char) {
        const entities = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&apos;',
            ' ': '&nbsp;',
            '©': '&copy;',
            '®': '&reg;',
            '€': '&euro;',
            '£': '&pound;',
            '¥': '&yen;',
            '¢': '&cent;',
            '§': '&sect;',
            '¶': '&para;',
            '±': '&plusmn;',
            '×': '&times;',
            '÷': '&divide;'
        };
        return entities[char];
    }
    
    decodeText() {
        const encodedText = document.getElementById('input-text').value;
        if (!encodedText.trim()) {
            this.showToast('لطفاً متنی را وارد کنید', 'error');
            return;
        }
        
        try {
            // Create a temporary div to decode entities
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = encodedText;
            const decoded = tempDiv.textContent || tempDiv.innerText;
            
            document.getElementById('output-text').value = decoded;
            this.updatePreview();
            this.showToast('متن با موفقیت رمزگشایی شد', 'success');
        } catch (e) {
            this.showToast('متن کدگذاری شده نامعتبر است', 'error');
            console.error(e);
        }
    }
    
    updatePreview() {
        const outputText = document.getElementById('output-text').value;
        const previewDiv = document.getElementById('html-preview');
        
        // Use innerHTML to render HTML entities
        previewDiv.innerHTML = outputText || '<span style="color:#999">پیش‌نمایش اینجا نمایش داده می‌شود...</span>';
    }
    
    clearInput() {
        document.getElementById('input-text').value = '';
        document.getElementById('output-text').value = '';
        document.getElementById('html-preview').innerHTML = '<span style="color:#999">پیش‌نمایش اینجا نمایش داده می‌شود...</span>';
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
    new HTMLEntitiesConverter();
});
