/**
 * JWT Decoder Tool
 * ابزار تجزیه و تحلیل توکن‌های JWT
 */
class JWTDecoder {
    constructor() {
        this.editors = {};
        this.initEditors();
        this.bindEvents();
    }
    
    initEditors() {
        // Initialize CodeMirror editors for each section
        this.editors.header = CodeMirror(document.getElementById('header-editor'), {
            mode: 'application/json',
            theme: 'dracula',
            readOnly: true,
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true
        });
        
        this.editors.payload = CodeMirror(document.getElementById('payload-editor'), {
            mode: 'application/json',
            theme: 'dracula',
            readOnly: true,
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true
        });
        
        this.editors.signature = CodeMirror(document.getElementById('signature-editor'), {
            mode: 'text/plain',
            theme: 'dracula',
            readOnly: true,
            lineNumbers: false
        });
    }
    
    bindEvents() {
        document.getElementById('decode-btn').addEventListener('click', () => this.decodeJWT());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearAll());
        document.getElementById('sample-btn').addEventListener('click', () => this.loadSample());
    }
    
    decodeJWT() {
        const jwtInput = document.getElementById('jwt-input').value.trim();
        
        if (!jwtInput) {
            this.showToast('لطفاً یک توکن JWT وارد کنید', 'error');
            return;
        }
        
        try {
            const [headerEncoded, payloadEncoded, signatureEncoded] = jwtInput.split('.');
            
            if (!headerEncoded || !payloadEncoded) {
                throw new Error('توکن JWT نامعتبر است');
            }
            
            // Decode header
            const headerStr = this.base64UrlDecode(headerEncoded);
            const header = JSON.parse(headerStr);
            this.editors.header.setValue(JSON.stringify(header, null, 4));
            
            // Decode payload
            const payloadStr = this.base64UrlDecode(payloadEncoded);
            const payload = JSON.parse(payloadStr);
            this.editors.payload.setValue(JSON.stringify(payload, null, 4));
            
            // Show signature
            this.editors.signature.setValue(signatureEncoded || '---');
            
            // Show algorithm info
            const alg = header.alg || '---';
            const typ = header.typ || '---';
            document.getElementById('algorithm-info').textContent = alg;
            document.getElementById('token-type').textContent = typ;
            
            // Validate signature (if secret is provided)
            this.validateSignature(jwtInput, alg);
            
            this.showToast('توکن با موفقیت تجزیه شد', 'success');
            
        } catch (e) {
            this.showToast(`خطا در تجزیه توکن: ${e.message}`, 'error');
            console.error(e);
        }
    }
    
    validateSignature(jwt, algorithm) {
        const signatureStatus = document.getElementById('signature-status');
        signatureStatus.style.display = 'flex';
        
        // Only show validation for supported algorithms
        const supportedAlgs = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512'];
        if (!supportedAlgs.includes(algorithm)) {
            signatureStatus.className = 'jwt-signature-status info';
            signatureStatus.querySelector('.icon').className = 'icon-info';
            signatureStatus.querySelector('.message').textContent = 'الگوریتم برای اعتبارسنجی پشتیبانی نمی‌شود';
            return;
        }
        
        // For demo purposes, we can't validate without the secret key
        signatureStatus.className = 'jwt-signature-status info';
        signatureStatus.querySelector('.icon').className = 'icon-info';
        signatureStatus.querySelector('.message').textContent = 'برای اعتبارسنجی امضا، کلید مخفی مورد نیاز است';
    }
    
    base64UrlDecode(input) {
        // Replace non-url compatible chars and add padding
        input = input
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const pad = input.length % 4;
        if (pad) {
            if (pad === 1) {
                throw new Error('InvalidLengthError: Input base64url string is the wrong length');
            }
            input += new Array(5 - pad).join('=');
        }
        
        return decodeURIComponent(atob(input).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
    
    clearAll() {
        document.getElementById('jwt-input').value = '';
        this.editors.header.setValue('');
        this.editors.payload.setValue('');
        this.editors.signature.setValue('');
        document.getElementById('algorithm-info').textContent = '---';
        document.getElementById('token-type').textContent = '---';
        document.getElementById('signature-status').style.display = 'none';
        this.showToast('همه موارد پاک شد', 'info');
    }
    
    loadSample() {
        const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        document.getElementById('jwt-input').value = sampleJWT;
        this.showToast('توکن نمونه بارگذاری شد', 'success');
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
    new JWTDecoder();
});
