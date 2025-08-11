// 工具导航网站主要JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initializeSearch();
    initializeMobileMenu();
    initializeCategoryFilters();
    initializeScrollEffects();
    initializeAnalytics();
    initializeLazyLoading();
});

// 搜索功能
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!searchInput || !searchBtn) return;

    // 搜索功能
    function performSearch() {
        const query = searchInput.value.trim();
        if (query.length < 2) return;

        // 记录搜索事件
        gtag('event', 'search', {
            'search_term': query
        });

        // 实际搜索逻辑
        filterTools(query);
        
        // 高亮搜索词
        highlightSearchResults(query);
    }

    // 事件监听
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 实时搜索提示
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length >= 2) {
            showSearchSuggestions(query);
        } else {
            hideSearchSuggestions();
        }
    });
}

// 工具过滤功能
function filterTools(query) {
    const toolCards = document.querySelectorAll('.tool-card');
    const categoryCards = document.querySelectorAll('.category-card');
    let visibleCount = 0;

    // 过滤工具卡片
    toolCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const searchQuery = query.toLowerCase();

        if (title.includes(searchQuery) || description.includes(searchQuery)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // 过滤分类卡片
    categoryCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const searchQuery = query.toLowerCase();

        if (title.includes(searchQuery) || description.includes(searchQuery)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // 显示搜索结果统计
    showSearchResults(query, visibleCount);
}

// 搜索建议功能
function showSearchSuggestions(query) {
    const suggestions = getSearchSuggestions(query);
    if (suggestions.length === 0) return;

    // 创建建议下拉框
    let suggestionBox = document.getElementById('searchSuggestions');
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.id = 'searchSuggestions';
        suggestionBox.className = 'search-suggestions';
        document.querySelector('.search-container').appendChild(suggestionBox);
    }

    // 生成建议列表
    suggestionBox.innerHTML = suggestions.map(suggestion => 
        `<div class="suggestion-item" data-query="${suggestion}">${suggestion}</div>`
    ).join('');

    // 添加点击事件
    suggestionBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            document.getElementById('searchInput').value = this.dataset.query;
            filterTools(this.dataset.query);
            hideSearchSuggestions();
        });
    });

    suggestionBox.style.display = 'block';
}

// 获取搜索建议
function getSearchSuggestions(query) {
    const suggestions = [
        'PDF转换', 'PDF转Word', 'PDF合并', 'PDF压缩',
        '图片压缩', '图片转换', '图片编辑', '图片裁剪',
        'JSON格式化', 'JSON验证', 'JSON转XML',
        '二维码生成', '条形码生成', '短链生成',
        '密码生成', '哈希计算', 'Base64编码',
        '颜色选择', '颜色转换', 'CSS生成',
        '正则表达式', '文本格式化', '文本对比',
        '时间戳转换', '单位转换', '进制转换'
    ];

    return suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
}

// 隐藏搜索建议
function hideSearchSuggestions() {
    const suggestionBox = document.getElementById('searchSuggestions');
    if (suggestionBox) {
        suggestionBox.style.display = 'none';
    }
}

// 移动端菜单
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });

    // 点击菜单项后关闭菜单
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileToggle.textContent = '☰';
        });
    });
}

// 分类过滤
function initializeCategoryFilters() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            if (category) {
                // 记录分类点击事件
                gtag('event', 'category_click', {
                    'category': category
                });

                // 跳转到分类页面或过滤显示
                window.location.href = `#${category}`;
                filterByCategory(category);
            }
        });
    });
}

// 按分类过滤
function filterByCategory(category) {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        const toolCategory = card.dataset.category;
        if (!toolCategory || toolCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 滚动效果
function initializeScrollEffects() {
    // 返回顶部按钮
    createBackToTopButton();
    
    // 滚动时的导航栏效果
    handleNavbarScroll();
    
    // 元素进入视窗动画
    observeElementsInView();
}

// 创建返回顶部按钮
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    document.body.appendChild(backToTop);

    // 滚动显示/隐藏
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.transform = 'translateY(0)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.transform = 'translateY(10px)';
        }
    });

    // 点击返回顶部
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // 记录返回顶部事件
        gtag('event', 'scroll_to_top');
    });
}

// 导航栏滚动效果
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // 向下滚动，隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });
}

// 元素进入视窗动画
function observeElementsInView() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // 观察需要动画的元素
    document.querySelectorAll('.category-card, .tool-card').forEach(el => {
        observer.observe(el);
    });
}

// 分析和追踪
function initializeAnalytics() {
    // 跟踪页面停留时间
    trackPageTime();
    
    // 跟踪工具点击
    trackToolClicks();
    
    // 跟踪用户行为
    trackUserBehavior();
}

// 跟踪页面停留时间
function trackPageTime() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        gtag('event', 'page_time', {
            'time_spent': timeSpent
        });
    });
}

// 跟踪工具点击
function trackToolClicks() {
    document.querySelectorAll('.tool-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const toolName = this.closest('.tool-card').querySelector('h3').textContent;
            
            gtag('event', 'tool_click', {
                'tool_name': toolName,
                'tool_url': this.href
            });
        });
    });
}

// 跟踪用户行为
function trackUserBehavior() {
    // 跟踪滚动深度
    let maxScrollDepth = 0;
    
    window.addEventListener('scroll', function() {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            
            // 每25%记录一次
            if (maxScrollDepth % 25 === 0) {
                gtag('event', 'scroll_depth', {
                    'depth': maxScrollDepth
                });
            }
        }
    });
}

// 懒加载
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// 工具函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 显示搜索结果
function showSearchResults(query, count) {
    let resultDiv = document.getElementById('searchResults');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'searchResults';
        resultDiv.className = 'search-results';
        document.querySelector('.hero').appendChild(resultDiv);
    }

    resultDiv.innerHTML = `
        <p>搜索 "${query}" 找到 ${count} 个结果</p>
        <button onclick="clearSearch()" class="clear-search">清除搜索</button>
    `;
    resultDiv.style.display = 'block';
}

// 清除搜索
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.tool-card, .category-card').forEach(card => {
        card.style.display = 'block';
    });
    
    const resultDiv = document.getElementById('searchResults');
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
    
    hideSearchSuggestions();
}

// 高亮搜索结果
function highlightSearchResults(query) {
    const elements = document.querySelectorAll('.tool-card h3, .tool-card p, .category-card h3, .category-card p');
    
    elements.forEach(element => {
        const text = element.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        const highlightedText = text.replace(regex, '<mark>$1</mark>');
        
        if (highlightedText !== text) {
            element.innerHTML = highlightedText;
        }
    });
}

// 错误处理
window.addEventListener('error', function(event) {
    console.error('JavaScript错误:', event.error);
    
    // 可选：发送错误到分析服务
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': event.error.message,
            'fatal': false
        });
    }
});

// 性能监控
window.addEventListener('load', function() {
    // 页面加载时间
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                'value': loadTime
            });
        }
    }
});
