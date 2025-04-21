document.addEventListener('DOMContentLoaded', function() {
    // فعال کردن تب‌ها
    const tabs = document.querySelectorAll('.neumorphic-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // مدیریت منوی موبایل
    const mobileMenuBtn = document.createElement('div');
    mobileMenuBtn.className = 'mobile-menu-btn neumorphic';
    mobileMenuBtn.innerHTML = '<i class="icon-menu"></i>';
    document.querySelector('header').prepend(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', function() {
        document.querySelector('nav').classList.toggle('active');
    });

    // اسکرول نرم برای لینک‌ها
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // نمایش ابزارهای پرکاربرد
    fetchPopularTools();
});

function fetchPopularTools() {
    // در اینجا می‌توانید از AJAX برای دریافت ابزارهای پرکاربرد از سرور استفاده کنید
    // این یک نمونه ساده است
    const popularTools = [
        {id: 1, name: 'JSON Formatter', icon: 'icon-json', category: 'converters', desc: 'فرمت و زیباسازی کدهای JSON'},
        {id: 2, name: 'Base64 Encoder/Decoder', icon: 'icon-base64', category: 'converters', desc: 'کدگذاری و رمزگشایی Base64'},
        // ...
    ];
    
    const toolsGrid = document.querySelector('.tools-grid');
    popularTools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card neumorphic';
        toolCard.innerHTML = `
            <div class="tool-header">
                <i class="${tool.icon}"></i>
                <h3>${tool.name}</h3>
            </div>
            <p>${tool.desc}</p>
            <a href="tools/${tool.category}/${tool.id}.html" class="btn btn-small neumorphic">استفاده از ابزار</a>
        `;
        toolsGrid.appendChild(toolCard);
    });
}

// توابع ابزارها
const Tools = {
    // JSON Formatter
    formatJSON: function(input) {
        try {
            const parsed = JSON.parse(input);
            return JSON.stringify(parsed, null, 4);
        } catch (e) {
            return 'Invalid JSON: ' + e.message;
        }
    },
    
    // Base64 Encode/Decode
    base64Encode: function(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, 
            function(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    },
    
    base64Decode: function(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },
    
    // سایر توابع ابزارها
    // ...
};
