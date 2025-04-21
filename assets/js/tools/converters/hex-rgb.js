/**
 * HEX to RGB Converter Tool
 * ابزار تبدیل کدهای رنگ HEX به RGB و بالعکس
 */
class HexRgbConverter {
    constructor() {
        this.bindEvents();
        this.updateColorPreview();
    }
    
    bindEvents() {
        // HEX to RGB conversion
        document.getElementById('hex-to-rgb-btn').addEventListener('click', () => this.convertHexToRgb());
        document.getElementById('hex-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.convertHexToRgb();
        });
        
        // RGB to HEX conversion
        document.getElementById('rgb-to-hex-btn').addEventListener('click', () => this.convertRgbToHex());
        
        // RGB sliders
        document.getElementById('red-slider').addEventListener('input', () => this.updateRgbFromSliders());
        document.getElementById('green-slider').addEventListener('input', () => this.updateRgbFromSliders());
        document.getElementById('blue-slider').addEventListener('input', () => this.updateRgbFromSliders());
        
        // Clear buttons
        document.getElementById('clear-hex-btn').addEventListener('click', () => {
            document.getElementById('hex-input').value = '';
            this.updateColorPreview();
        });
        
        // Random color
        document.getElementById('random-color-btn').addEventListener('click', () => this.generateRandomColor());
        
        // Copy buttons
        document.getElementById('copy-hex-btn').addEventListener('click', () => this.copyToClipboard('hex-value', 'کد HEX کپی شد'));
        document.getElementById('copy-rgb-btn').addEventListener('click', () => this.copyToClipboard('rgb-value', 'مقدار RGB کپی شد'));
        document.getElementById('copy-rgb-full-btn').addEventListener('click', () => this.copyToClipboard('rgb-value', 'مقدار RGB کپی شد'));
        document.getElementById('copy-hsl-btn').addEventListener('click', () => this.copyToClipboard('hsl-value', 'مقدار HSL کپی شد'));
        document.getElementById('copy-rgb-css-btn').addEventListener('click', () => {
            const rgb = document.getElementById('rgb-value').textContent;
            navigator.clipboard.writeText(`color: ${rgb};`)
                .then(() => this.showToast('CSS RGB کپی شد', 'success'));
        });
        document.getElementById('copy-rgb-js-btn').addEventListener('click', () => {
            const rgb = document.getElementById('rgb-value').textContent;
            const [r, g, b] = rgb.match(/\d+/g);
            navigator.clipboard.writeText(`{ r: ${r}, g: ${g}, b: ${b} }`)
                .then(() => this.showToast('JavaScript RGB کپی شد', 'success'));
        });
    }
    
    convertHexToRgb() {
        const hexInput = document.getElementById('hex-input').value.trim();
        if (!hexInput) {
            this.showToast('لطفاً کد HEX را وارد کنید', 'error');
            return;
        }
        
        // Remove # if exists
        let hex = hexInput.startsWith('#') ? hexInput.slice(1) : hexInput;
        
        // Validate HEX code
        if (!/^[0-9A-Fa-f]{3,6}$/.test(hex)) {
            this.showToast('کد HEX نامعتبر است', 'error');
            return;
        }
        
        // Expand short HEX notation
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        
        // Convert HEX to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Update RGB sliders
        document.getElementById('red-slider').value = r;
        document.getElementById('green-slider').value = g;
        document.getElementById('blue-slider').value = b;
        
        // Update displayed values
        this.updateRgbValues(r, g, b);
        this.updateColorPreview();
        this.showToast('کد HEX به RGB تبدیل شد', 'success');
    }
    
    convertRgbToHex() {
        const r = parseInt(document.getElementById('red-slider').value);
        const g = parseInt(document.getElementById('green-slider').value);
        const b = parseInt(document.getElementById('blue-slider').value);
        
        // Convert RGB to HEX
        const hex = '#' + 
            ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        
        // Update HEX input
        document.getElementById('hex-input').value = hex.slice(1);
        
        // Update displayed values
        document.getElementById('hex-value').textContent = hex;
        this.updateColorPreview();
        this.showToast('مقادیر RGB به HEX تبدیل شد', 'success');
    }
    
    updateRgbFromSliders() {
        const r = parseInt(document.getElementById('red-slider').value);
        const g = parseInt(document.getElementById('green-slider').value);
        const b = parseInt(document.getElementById('blue-slider').value);
        
        // Update displayed values
        document.getElementById('red-value').textContent = r;
        document.getElementById('green-value').textContent = g;
        document.getElementById('blue-value').textContent = b;
        
        this.updateRgbValues(r, g, b);
        this.updateColorPreview();
    }
    
    updateRgbValues(r, g, b) {
        // Update RGB value display
        document.getElementById('rgb-value').textContent = `rgb(${r}, ${g}, ${b})`;
        
        // Update HEX value display
        const hex = '#' + 
            ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        document.getElementById('hex-value').textContent = hex;
        
        // Update HSL value display
        const hsl = this.rgbToHsl(r, g, b);
        document.getElementById('hsl-value').textContent = 
            `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1])}%, ${Math.round(hsl[2])}%)`;
    }
    
    rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }

        return [h, s * 100, l * 100];
    }
    
    updateColorPreview() {
        const hexColor = document.getElementById('hex-value').textContent;
        const rgbColor = document.getElementById('rgb-value').textContent;
        
        document.getElementById('hex-color-preview').style.backgroundColor = hexColor;
        document.getElementById('rgb-color-preview').style.backgroundColor = rgbColor;
    }
    
    generateRandomColor() {
        // Generate random HEX color
        const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
        
        // Update HEX input
        document.getElementById('hex-input').value = randomHex.slice(1);
        
        // Convert to RGB
        this.convertHexToRgb();
        this.showToast('رنگ تصادفی ایجاد شد', 'success');
    }
    
    copyToClipboard(elementId, message) {
        const text = document.getElementById(elementId).textContent;
        navigator.clipboard.writeText(text)
            .then(() => this.showToast(message, 'success'))
            .catch(err => this.showToast('خطا در کپی کردن', 'error'));
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
    new HexRgbConverter();
});
