/**
 * Markdown to HTML Converter Tool
 * ابزار تبدیل Markdown به HTML
 */
class MarkdownToHtmlConverter {
    constructor() {
        this.initEditors();
        this.bindEvents();
        this.setupToolbar();
    }
    
    initEditors() {
        // Initialize CodeMirror editors
        this.markdownEditor = CodeMirror.fromTextArea(document.getElementById('markdown-input'), {
            mode: 'markdown',
            theme: 'dracula',
            lineNumbers: true,
            lineWrapping: true,
            indentUnit: 4
        });
        
        this.htmlEditor = CodeMirror(document.getElementById('html-editor'), {
            mode: 'htmlmixed',
            theme: 'dracula',
            readOnly: true,
            lineNumbers: true,
            lineWrapping: true,
            autoCloseTags: true,
            autoCloseBrackets: true
        });
    }
    
    bindEvents() {
        document.getElementById('convert-btn').addEventListener('click', () => this.convertMarkdown());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearAll());
        document.getElementById('sample-btn').addEventListener('click', () => this.loadSample());
        document.getElementById('copy-html-btn').addEventListener('click', () => this.copyHtml());
        document.getElementById('download-html-btn').addEventListener('click', () => this.downloadHtml());
    }
    
    setupToolbar() {
        document.querySelectorAll('.markdown-toolbar button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.insertMarkdown(
                    btn.getAttribute('data-insert'),
                    btn.getAttribute('data-selected')
                );
            });
        });
    }
    
    insertMarkdown(template, selectText = null) {
        const cursor = this.markdownEditor.getCursor();
        const selection = this.markdownEditor.getSelection();
        
        if (template.includes('\n')) {
            // Handle multi-line templates
            const lines = template.split('\n');
            const line = this.markdownEditor.getLine(cursor.line);
            
            this.markdownEditor.replaceRange(
                lines[0] + selection + lines[1],
                { line: cursor.line, ch: 0 },
                { line: cursor.line, ch: line.length }
            );
            
            // Set cursor position
            const newCursor = {
                line: cursor.line + Math.floor(lines.length / 2),
                ch: lines[0].length
            };
            this.markdownEditor.setCursor(newCursor);
        } else {
            // Handle single-line templates
            const [before, after] = template.split(' ');
            
            if (selection) {
                // Wrap selected text
                this.markdownEditor.replaceSelection(before + selection + after);
                
                // Set cursor position after the inserted text
                const newCursor = {
                    line: cursor.line,
                    ch: cursor.ch + before.length + selection.length + after.length
                };
                this.markdownEditor.setCursor(newCursor);
            } else {
                // Insert template and place cursor in the middle
                this.markdownEditor.replaceRange(
                    before + after,
                    cursor,
                    cursor
                );
                
                // Set cursor position between the inserted text
                const newCursor = {
                    line: cursor.line,
                    ch: cursor.ch + before.length
                };
                this.markdownEditor.setCursor(newCursor);
            }
        }
        
        // Focus the editor
        this.markdownEditor.focus();
    }
    
    convertMarkdown() {
        const markdownText = this.markdownEditor.getValue();
        if (!markdownText.trim()) {
            this.showToast('لطفاً متن Markdown را وارد کنید', 'error');
            return;
        }
        
        try {
            // Convert Markdown to HTML
            const html = marked.parse(markdownText);
            
            // Set HTML in editor
            this.htmlEditor.setValue(html);
            
            // Update preview
            document.getElementById('html-preview').innerHTML = html;
            
            this.showToast('Markdown با موفقیت به HTML تبدیل شد', 'success');
        } catch (e) {
            this.showToast('خطا در تبدیل Markdown', 'error');
            console.error(e);
        }
    }
    
    clearAll() {
        this.markdownEditor.setValue('');
        this.htmlEditor.setValue('');
        document.getElementById('html-preview').innerHTML = '<span style="color:#999">پیش‌نمایش اینجا نمایش داده می‌شود...</span>';
        this.showToast('همه موارد پاک شد', 'info');
    }
    
    loadSample() {
        const sampleMarkdown = `# عنوان اصلی

## عنوان فرعی

این یک پاراگراف معمولی است. می‌توانید متن را **بولد** یا *ایتالیک* کنید.

### لیست‌ها

- آیتم لیست 1
- آیتم لیست 2
- آیتم لیست 3

### لینک‌ها و تصاویر

[ToolsFree.ir](https://toolsfree.ir)

![لوگو ToolsFree](https://toolsfree.ir/logo.png)

### کد

\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

### نقل قول

> این یک نقل قول است که می‌تواند چند خطی باشد.

### جدول

| ستون 1 | ستون 2 |
|--------|--------|
| مقدار 1 | مقدار 2 |`;
        
        this.markdownEditor.setValue(sampleMarkdown);
        this.showToast('نمونه Markdown بارگذاری شد', 'success');
    }
    
    copyHtml() {
        const html = this.htmlEditor.getValue();
        if (!html.trim()) {
            this.showToast('هیچ کد HTML برای کپی کردن وجود ندارد', 'error');
            return;
        }
        
        navigator.clipboard.writeText(html)
            .then(() => this.showToast('کد HTML کپی شد', 'success'))
            .catch(err => this.showToast('خطا در کپی کردن کد HTML', 'error'));
    }
    
    downloadHtml() {
        const html = this.htmlEditor.getValue();
        if (!html.trim()) {
            this.showToast('هیچ کد HTML برای دانلود وجود ندارد', 'error');
            return;
        }
        
        try {
            const blob = new Blob([html], { type: 'text/html' });
            saveAs(blob, 'converted-markdown.html');
            this.showToast('فایل HTML دانلود شد', 'success');
        } catch (e) {
            this.showToast('خطا در ایجاد فایل HTML', 'error');
            console.error(e);
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
    new MarkdownToHtmlConverter();
});
