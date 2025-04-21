/**
 * Text to Binary Converter Tool
 * ابزار تبدیل متن به باینری و بالعکس
 */
class TextBinaryConverter {
    constructor() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.getElementById('text-to-binary-btn').addEventListener('click', () => this.convertTextToBinary());
        document.getElementById('binary-to-text-btn').addEventListener('click', () => this.convertBinaryToText());
        document.getElementById('clear-input-btn').addEventListener('click', () => this.clearInput());
        document.getElementById('copy-binary-btn').addEventListener('click', () => this.copyBinary());
        document.getElementById('sample-text-btn').addEventListener('click', () => this.loadSample());
        
        // Update preview when binary output changes
        document.getElementById('binary-output').addEventListener('input', () => this.updateBinaryPreview());
    }
    
    convertTextToBinary() {
        const inputText = document.getElementById('input-text').value;
        if (!inputText.trim()) {
            this.showToast('لطفاً متنی را وارد کنید', 'error');
            return;
        }
        
        try {
            const addSpaces = document.getElementById('add-spaces').checked;
            const showUnicode = document.getElementById('show-unicode').checked;
            const showAscii = document.getElementById('show-ascii').checked;
            
            let binaryOutput = '';
            let previewHtml = '';
            
            for (let i = 0; i < inputText.length; i++) {
                const char = inputText[i];
                const charCode = char.charCodeAt(0);
                let binaryChar = charCode.toString(2).padStart(8, '0');
                
                // For Unicode characters that need more than 1 byte
                if (charCode > 255) {
                    const utf8Bytes = this.charToUTF8Bytes(char);
                    binaryChar = utf8Bytes.map(byte => byte.toString(2).padStart(8, '0')).join(addSpaces ? ' ' : '');
                }
                
                // Add to binary output
                if (addSpaces && i > 0) {
                    binaryOutput += ' ' + binaryChar;
                } else {
                    binaryOutput += binaryChar;
                }
                
                // Prepare preview HTML
                previewHtml += `<div class="binary-char">
                    <span class="char">${this.escapeHtml(char)}</span>
                    <span class="binary">${binaryChar}</span>`;
                
                if (showAscii && charCode <= 255) {
                    previewHtml += `<span class="ascii">ASCII: ${charCode}</span>`;
                }
                
                if (showUnicode) {
                    previewHtml += `<span class="unicode">U+${charCode.toString(16).toUpperCase().padStart(4, '0')}</span>`;
                }
                
                previewHtml += '</div>';
            }
            
            document.getElementById('binary-output').value = binaryOutput;
            document.getElementById('binary-preview').innerHTML = previewHtml || '<span style="color:#999">پیش‌نمایش اینجا نمایش داده می‌شود...</span>';
            this.showToast('متن به باینری تبدیل شد', 'success');
        } catch (e) {
            this.showToast('خطا در تبدیل متن به باینری', 'error');
            console.error(e);
        }
    }
    
    charToUTF8Bytes(char) {
        const code = char.charCodeAt(0);
        if (code <= 0x7F) return [code];
        
        let bytes = [];
        if (code <= 0x7FF) {
            bytes[0] = 0xC0 | (code >> 6);
            bytes[1] = 0x80 | (code & 0x3F);
        } else if (code <= 0xFFFF) {
            bytes[0] = 0xE0 | (code >> 12);
            bytes[1] = 0x80 | ((code >> 6) & 0x3F);
            bytes[2] = 0x80 | (code & 0x3F);
        } else {
            bytes[0] = 0xF0 | (code >> 18);
            bytes[1] = 0x80 | ((code >> 12) & 0x3F);
            bytes[2] = 0x80 | ((code >> 6) & 0x3F);
            bytes[3] = 0x80 | (code & 0x3F);
        }
        return bytes;
    }
    
    convertBinaryToText() {
        const binaryInput = document.getElementById('binary-output').value;
        if (!binaryInput.trim()) {
            this.showToast('لطفاً کد باینری را وارد کنید', 'error');
            return;
        }
        
        try {
            // Clean binary input (remove spaces and non-binary chars)
            const binaryString = binaryInput.replace(/[^01]/g, '');
            
            // Split into 8-bit chunks
            const binaryArray = [];
            for (let i = 0; i < binaryString.length; i += 8) {
                const byte = binaryString.substr(i, 8);
                if (byte.length === 8) {
                    binaryArray.push(byte);
                }
            }
            
            // Convert each byte to character
            let textOutput = '';
            for (let i = 0; i < binaryArray.length; i++) {
                const byte = binaryArray[i];
                const charCode = parseInt(byte, 2);
                textOutput += String.fromCharCode(charCode);
            }
            
            // Handle UTF-8 characters properly
            const decodedText = this.decodeUTF8(textOutput);
            document.getElementById('input-text').value = decodedText;
            this.showToast('باینری به متن تبدیل شد', 'success');
        } catch (e) {
            this.showToast('کد باینری نامعتبر است', 'error');
            console.error(e);
        }
    }
    
    decodeUTF8(encoded) {
        // Simple UTF-8 decoder (for basic usage)
        try {
            return decodeURIComponent(escape(encoded));
        } catch (e) {
            return encoded;
        }
    }
    
    updateBinaryPreview() {
        const binaryOutput = document.getElementById('binary-output').value;
        const previewDiv = document.getElementById('binary-preview');
        
        if (!binaryOutput.trim()) {
            previewDiv.innerHTML = '<span style="color:#999">پیش‌نمایش اینجا نمایش داده می‌شود...</span>';
            return;
        }
        
        // Simple preview without conversion
        previewDiv.textContent = binaryOutput;
    }
    
    clearInput() {
        document.getElementById('input-text').value = '';
        document.getElementById('binary-output').value = '';
        document.getElementById('binary-preview').innerHTML = '<span style="color:#999">پیش‌نمایش اینجا نمایش داده می‌شود...</span>';
        this.showToast('ورودی پاک شد', 'info');
    }
    
    copyBinary() {
        const binaryOutput = document.getElementById('binary-output').value;
        if (!binaryOutput.trim()) {
            this.showToast('هیچ کد باینری برای کپی کردن وجود ندارد', 'error');
            return;
        }
        
        navigator.clipboard.writeText(binaryOutput)
            .then(() => this.showToast('کد باینری کپی شد', 'success'))
            .catch(err => this.showToast('خطا در کپی کردن کد باینری', 'error'));
    }
    
    loadSample() {
        const sampleText = 'ToolsFree.ir - ابزارهای رایگان برای توسعه‌دهندگان';
        document.getElementById('input-text').value = sampleText;
        this.showToast('نمونه متن بارگذاری شد', 'success');
    }
    
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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
    new TextBinaryConverter();
});
