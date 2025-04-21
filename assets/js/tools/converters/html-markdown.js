/**
 * HTML to Markdown Converter Tool
 * ابزار تبدیل HTML به Markdown
 */
class HtmlToMarkdownConverter {
    constructor() {
        this.initEditors();
        this.bindEvents();
        this.initTurndown();
    }
    
    initEditors() {
        // Initialize CodeMirror editors
        this.htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-input'), {
            mode: 'htmlmixed',
            theme: 'dracula',
            lineNumbers: true,
            lineWrapping: true,
            autoCloseTags: true,
            autoCloseBrackets: true
        });
        
        this.markdownEditor = CodeMirror(document.getElementById('markdown-editor'), {
            mode: 'markdown',
            theme: 'dracula',
            readOnly: true,
            lineNumbers: true,
            lineWrapping: true
        });
    }
    
    initTurndown() {
        this.turndownService = new TurndownService({
            headingStyle: 'atx',
            hr: '---',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced',
            fence: '```',
            emDelimiter: '*',
            strongDelimiter: '**',
            linkStyle: 'inlined',
            linkReferenceStyle: 'full'
        });
        
        // Add custom rules
        this.turndownService.addRule('pre', {
            filter: 'pre',
            replacement: function(content) {
                return '\n```\n' + content + '\n```\n';
            }
        });
        
        this.turndownService.addRule('img', {
            filter: 'img',
            replacement: function(content, node) {
                const alt = node.alt || '';
                const src = node.src || '';
                return '![' + alt + '](' + src + ')';
            }
        });
        
        this.turndownService.addRule('table', {
            filter: 'table',
            replacement: function(content, node) {
                const rows = node.querySelectorAll('tr');
                let markdown = '\n';
                
                // Process headers
                const headers = rows[0].querySelectorAll('th, td');
                markdown += '|';
                headers.forEach(header => {
                    markdown += ' ' + header.textContent + ' |';
                });
                markdown += '\n|';
                headers.forEach(() => {
                    markdown += ' --- |';
                });
                markdown += '\n';
                
                // Process rows
                for (let i = 1; i < rows.length; i++) {
                    const cells = rows[i].querySelectorAll('td');
                    markdown += '|';
                    cells.forEach(cell => {
                        markdown += ' ' + cell.textContent + ' |';
                    });
                    markdown += '\n';
                }
                
                return markdown + '\n';
            }
        });
    }
    
    bindEvents() {
        document.getElementById('convert-btn').addEventListener('click', () => this.convertHtml());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearAll());
        document.getElementById('sample-btn').addEventListener('click', () => this.loadSample());
        document.getElementById('copy-md-btn').addEventListener('click', () => this.copyMarkdown());
        document.getElementById('download-md-btn').addEventListener('click', () => this.downloadMarkdown());
    }
    
    convertHtml() {
        const html = this.htmlEditor.getValue();
        if (!html.trim()) {
            this.showToast('لطفاً کد HTML را وارد کنید', 'error');
            return;
        }
        
        try {
            // Convert HTML to Markdown
            const markdown = this.turndownService.turndown(html);
            
            // Set Markdown in editor
            this.markdownEditor.setValue(markdown);
            
            // Update preview
            document.getElementById('markdown-preview').innerHTML = marked.parse(markdown);
            
            this.showToast('HTML با موفقیت به Markdown تبدیل شد', 'success');
        } catch (e) {
            this.showToast('خطا در تبدیل HTML', 'error');
            console.error(e);
        }
    }
    
    clearAll() {
        this.htmlEditor.setValue('');
        this.markdownEditor.setValue('');
        document.getElementById('markdown-preview').innerHTML = '<span style="color:#999">پیش‌نمایش اینجا نمایش داده می‌شود...</span>';
        this.showToast('همه موارد پاک شد', 'info');
    }
    
    loadSample() {
        const sampleHtml = `<h1>عنوان اصلی</h1>
<h2>عنوان فرعی</h2>

<p>این یک پاراگراف معمولی است. می‌توانید متن را <strong>بولد</strong> یا <em>ایتالیک</em> کنید.</p>

<h3>لیست‌ها</h3>
<ul>
    <li>آیتم لیست 1</li>
    <li>آیتم لیست 2</li>
    <li>آیتم لیست 3</li>
</ul>

<h3>لینک‌ها و تصاویر</h3>
<p><a href="https://toolsfree.ir">ToolsFree.ir</a></p>
<p><img src="https://toolsfree.ir/logo.png" alt="لوگو ToolsFree"></p>

<h3>کد</h3>
<pre><code class="language-javascript">function hello() {
  console.log("Hello World!");
}
</code></pre>

<h3>نقل قول</h3>
<blockquote>
    این یک نقل قول است که می‌تواند چند خطی باشد.
</blockquote>

<h3>جدول</h3>
<table>
    <tr>
        <th>ستون 1</th>
        <th>ستون 2</th>
    </tr>
    <tr>
        <td>مقدار 1</td>
        <td>مقدار 2</td>
    </tr>
</table>`;
        
        this.htmlEditor.setValue(sampleHtml);
        this.showToast('نمونه HTML بارگذاری شد', 'success');
    }
    
    copyMarkdown() {
        const markdown = this.markdownEditor.getValue();
        if (!markdown.trim()) {
            this.showToast('هیچ متن Markdown برای کپی کردن وجود ندارد', 'error');
            return;
        }
        
        navigator.clipboard.writeText(markdown)
            .then(() => this.showToast('متن Markdown کپی شد', 'success'))
            .catch(err => this.showToast('خطا در کپی کردن متن Markdown', 'error'));
    }
    
    downloadMarkdown() {
        const markdown = this.markdownEditor.getValue();
        if (!markdown.trim()) {
            this.showToast('هیچ متن Markdown برای دانلود وجود ندارد', 'error');
            return;
        }
        
        try {
            const blob = new Blob([markdown], { type: 'text/markdown' });
            saveAs(blob, 'converted-html.md');
            this.showToast('فایل Markdown دانلود شد', 'success');
        } catch (e) {
            this.showToast('خطا در ایجاد فایل Markdown', 'error');
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
    new HtmlToMarkdownConverter();
});
