/**
 * LATEST KHABAR v6.0 - PRODUCTION-GRADE SPA ENGINE
 * 
 * Architecture: State | Router | Services | Renderer | Utils
 * Security: DOMPurify | URL Validation | CSP-Aligned
 * Performance: LRU Cache | Scroll Restoration | LCP Optimization
 * SEO: Dynamic JSON-LD | OG Tags | Breadcrumbs
 */

import { db } from './firebase-config.js';
import {
    collection, getDocs, getDoc, query, orderBy, limit, doc, updateDoc, increment, where
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.es.mjs';

// ============================================================================
// 1. SCHEMA VALIDATION
// ============================================================================

const Schema = {
    validateArticle(rawData, docId) {
        if (!rawData || typeof rawData !== 'object') return null;
        const title = String(rawData.title || '').trim();
        const content = String(rawData.content || '').trim();
        const category = String(rawData.category || 'समाचार').trim();
        const imageUrl = String(rawData.imageUrl || '').trim();
        const views = Number(rawData.views) || 0;
        const seoDescription = String(rawData.seoDescription || '').trim();
        const author = String(rawData.author || 'Latest Khabar').trim();
        const featured = Boolean(rawData.featured);
        const trending = Boolean(rawData.trending);

        if (!title || !content) return null;

        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        const description = seoDescription || cleanContent.substring(0, 160);
        const readTime = Math.max(1, Math.ceil(cleanContent.split(/\s+/).length / 200));

        let timestamp = new Date();
        if (rawData.timestamp && typeof rawData.timestamp.toDate === 'function') {
            timestamp = rawData.timestamp.toDate();
        } else if (rawData.timestamp instanceof Date) {
            timestamp = rawData.timestamp;
        }

        return {
            id: String(docId), title, content, description, category,
            imageUrl, views, seoDescription, author, featured, trending,
            timestamp, readTime
        };
    }
};

// ============================================================================
// 2. ANALYTICS GATEWAY
// ============================================================================

const Analytics = {
    track(event, metadata = {}) {
        // Production: Replace with GA4/Mixpanel
        // window.gtag?.('event', event, metadata);
    },
    trackArticleView(articleId, totalViews) {
        this.track('article_view', { articleId, totalViews });
    },
    trackError(errorMsg, context = {}) {
        this.track('app_error', { error: errorMsg, url: window.location.href, ...context });
    }
};

// ============================================================================
// 3. CENTRALIZED STATE
// ============================================================================

const App = {
    state: {
        currentRequestId: 0,
        cache: new Map(),
        maxCache: 150,
        scrollMap: new Map(),
        isOnline: navigator.onLine,
        currentArticle: null,
        bookmarks: JSON.parse(localStorage.getItem('lk_bookmarks') || '[]'),
        allArticles: [],
        currentCategory: null
    },

    async guard(asyncFn) {
        const requestId = ++this.state.currentRequestId;
        try {
            const result = await asyncFn();
            return requestId === this.state.currentRequestId ? result : null;
        } catch (error) {
            Analytics.trackError(error.message, { requestId });
            throw error;
        }
    },

    saveScrollPosition(route) {
        this.state.scrollMap.set(route || 'home', window.scrollY);
    },

    restoreScrollPosition(route) {
        const pos = this.state.scrollMap.get(route || 'home') || 0;
        window.scrollTo({ top: pos, behavior: 'auto' });
    },

    toggleBookmark(articleId) {
        const idx = this.state.bookmarks.indexOf(articleId);
        if (idx === -1) {
            this.state.bookmarks.push(articleId);
        } else {
            this.state.bookmarks.splice(idx, 1);
        }
        localStorage.setItem('lk_bookmarks', JSON.stringify(this.state.bookmarks));
        return idx === -1;
    },

    isBookmarked(articleId) {
        return this.state.bookmarks.includes(articleId);
    }
};

// ============================================================================
// 4. SECURITY LAYER
// ============================================================================

const URLUtils = {
    isValidImageUrl(url) {
        if (!url || typeof url !== 'string') return false;
        try {
            const parsed = new URL(url);
            return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.hostname && parsed.hostname.includes('.');
        } catch { return false; }
    },
    getSafeImageUrl(url) {
        if (this.isValidImageUrl(url)) return url;
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="18"%3EImage Not Available%3C/text%3E%3C/svg%3E';
    }
};

DOMPurify.setConfig({
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote', 'h2', 'h3', 'h4', 'figure', 'figcaption', 'img'],
    ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'width', 'height', 'loading'],
    KEEP_CONTENT: true
});

// ============================================================================
// 5. SEO ENGINE
// ============================================================================

const SEO = {
    update(article) {
        document.title = `${article.title} | Latest Khabar`;
        const seoDesc = article.seoDescription || article.description;
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: DOMPurify.sanitize(article.title),
            description: seoDesc,
            image: { '@type': 'ImageObject', url: URLUtils.getSafeImageUrl(article.imageUrl), height: 675, width: 1200 },
            datePublished: article.timestamp.toISOString(),
            dateModified: article.timestamp.toISOString(),
            author: { '@type': 'Person', name: article.author || 'Latest Khabar' },
            publisher: {
                '@type': 'Organization', name: 'Latest Khabar',
                logo: { '@type': 'ImageObject', url: 'https://latestkhabar.xyz/Latest%20Khabar%20Logo.webp' }
            },
            articleBody: article.content.substring(0, 500).replace(/<[^>]*>/g, ''),
            inLanguage: 'hi-IN',
            mainEntityOfPage: { '@type': 'WebPage', '@id': window.location.href },
            wordCount: article.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
            interactionStatistic: {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/ReadAction',
                userInteractionCount: article.views || 0
            }
        };
        let script = document.getElementById('json-ld');
        if (!script) {
            script = document.createElement('script');
            script.id = 'json-ld';
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schema);
    },
    updateMetaTags(article) {
        const desc = article.seoDescription || article.description;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = desc;
        const updateOG = (prop, val) => {
            const tag = document.querySelector(`meta[property="${prop}"]`);
            if (tag) tag.content = val;
        };
        updateOG('og:title', article.title);
        updateOG('og:description', desc);
        updateOG('og:image', URLUtils.getSafeImageUrl(article.imageUrl));
        updateOG('og:type', 'article');
    },
    resetHome() {
        document.title = 'Latest Khabar - ताज़ा खबरें, ब्रेकिंग न्यूज़ | Premium Hindi News Portal';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = 'Latest Khabar: भारत की सबसे विश्वसनीय डिजिटल समाचार वेबसाइट। ताजा खबर, ब्रेकिंग न्यूज, राजनीति, व्यापार, क्रिकेट, तकनीक - सब कुछ एक जगह।';
    }
};

// ============================================================================
// 6. FIRESTORE DATA SERVICE
// ============================================================================

const NewsService = {
    async fetchLatest(limitCount = 30) {
        const q = query(collection(db, 'articles'), orderBy('timestamp', 'desc'), limit(limitCount));
        const snap = await getDocs(q);
        const articles = snap.docs.map(d => Schema.validateArticle(d.data(), d.id)).filter(Boolean);
        App.state.allArticles = articles;
        return articles;
    },

    async fetchByCategory(cat, limitCount = 20) {
        const q = query(collection(db, 'articles'), where('category', '==', cat), orderBy('timestamp', 'desc'), limit(limitCount));
        const snap = await getDocs(q);
        return snap.docs.map(d => Schema.validateArticle(d.data(), d.id)).filter(Boolean);
    },

    async fetchById(id) {
        if (App.state.cache.has(id)) return App.state.cache.get(id);
        const docRef = doc(db, 'articles', id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return null;
        const article = Schema.validateArticle(snap.data(), snap.id);
        if (!article) return null;

        try {
            await updateDoc(docRef, { views: increment(1) });
            const updatedSnap = await getDoc(docRef);
            article.views = updatedSnap.data()?.views || 1;
            Analytics.trackArticleView(id, article.views);
        } catch (err) {
            Analytics.trackError('View increment failed', { articleId: id });
        }

        if (App.state.cache.size >= App.state.maxCache) {
            const firstKey = App.state.cache.keys().next().value;
            App.state.cache.delete(firstKey);
        }
        App.state.cache.set(id, article);
        App.state.currentArticle = article;
        return article;
    },

    async search(term) {
        const articles = App.state.allArticles.length ? App.state.allArticles : await this.fetchLatest(50);
        const lower = term.toLowerCase();
        return articles.filter(a =>
            a.title.toLowerCase().includes(lower) ||
            a.category.toLowerCase().includes(lower) ||
            a.description.toLowerCase().includes(lower)
        );
    }
};

// ============================================================================
// 7. RENDERER
// ============================================================================

const Renderer = {
    main: null,
    primaryContent: null,
    sidebar: null,

    init() {
        this.main = document.getElementById('app-root');
        this.primaryContent = document.getElementById('primary-content');
        this.sidebar = document.getElementById('sidebar');
    },

    // --- Helpers ---
    formatDate(date) {
        return date.toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    },

    timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'अभी';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} मिनट पहले`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} घंटे पहले`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} दिन पहले`;
        return this.formatDate(date);
    },

    getCategoryClass(category) {
        const map = {
            'राजनीति': 'category-politics', 'व्यापार': 'category-market', 'टेक': 'category-tech',
            'क्रिकेट': 'category-sports', 'मनोरंजन': 'category-entertainment', 'स्वास्थ्य': 'category-health',
            'खेल': 'category-sports', 'विश्व': 'category-politics', 'शिक्षा': 'category-tech'
        };
        return map[category] || '';
    },

    // --- Breaking Ticker ---
    ticker(articles) {
        const tickerContent = document.getElementById('ticker-content');
        if (!tickerContent || !articles.length) return;
        const tickerArticles = articles.slice(0, 8);
        tickerContent.innerHTML = tickerArticles.map(a => {
            const safeTitle = DOMPurify.sanitize(a.title);
            return `<a href="?id=${a.id}" class="ticker-item" data-action="navigate" data-id="${a.id}">${safeTitle}</a><span class="ticker-divider">|</span>`;
        }).join('');
        // Duplicate for seamless loop
        tickerContent.innerHTML += tickerContent.innerHTML;
    },

    // --- Featured Grid ---
    featured(articles) {
        const grid = document.getElementById('featured-grid');
        if (!grid || !articles.length) return;

        const featuredArticles = articles.filter(a => a.featured);
        const heroArticle = featuredArticles.length ? featuredArticles[0] : articles[0];
        const sideArticles = (featuredArticles.length > 1 ? featuredArticles.slice(1, 4) : articles.slice(1, 4));

        const heroImage = URLUtils.getSafeImageUrl(heroArticle.imageUrl);
        const heroTitle = DOMPurify.sanitize(heroArticle.title);
        const heroDesc = DOMPurify.sanitize(heroArticle.description);
        const bookmarked = App.isBookmarked(heroArticle.id);

        grid.innerHTML = `
            <div class="featured-hero" data-action="navigate" data-id="${heroArticle.id}" role="link" tabindex="0">
                <div class="featured-image-wrapper">
                    <img src="${heroImage}" alt="${heroTitle}" class="featured-image" fetchpriority="high" loading="eager" width="800" height="500">
                </div>
                <div class="featured-content">
                    <span class="featured-badge ${this.getCategoryClass(heroArticle.category)}">${heroArticle.category}</span>
                    <h2 class="featured-title">${heroTitle}</h2>
                    <p class="featured-description">${heroDesc}</p>
                    <div class="featured-meta">
                        <span class="featured-author">${DOMPurify.sanitize(heroArticle.author)}</span>
                        <span class="featured-time">${this.timeAgo(heroArticle.timestamp)}</span>
                        <span class="featured-read-time">${heroArticle.readTime} मिनट</span>
                    </div>
                </div>
                <button class="bookmark-btn ${bookmarked ? 'bookmarked' : ''}" data-action="bookmark" data-id="${heroArticle.id}" aria-label="बुकमार्क">
                    <svg fill="${bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                </button>
            </div>
            <div class="featured-sidebar">
                ${sideArticles.map(a => {
                    const img = URLUtils.getSafeImageUrl(a.imageUrl);
                    const t = DOMPurify.sanitize(a.title);
                    return `
                    <div class="featured-card" data-action="navigate" data-id="${a.id}" role="link" tabindex="0">
                        <div class="featured-card-image-wrapper">
                            <img src="${img}" alt="${t}" class="featured-card-image" loading="lazy" width="120" height="90">
                        </div>
                        <div class="featured-card-content">
                            <span class="featured-card-category ${this.getCategoryClass(a.category)}">${a.category}</span>
                            <h3 class="featured-card-title">${t}</h3>
                            <span class="featured-card-meta">${this.timeAgo(a.timestamp)}</span>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        `;
    },

    // --- News Grid ---
    newsFeed(articles) {
        const grid = document.getElementById('news-grid');
        if (!grid) return;
        if (!articles.length) {
            grid.innerHTML = '<div class="empty-state">कोई लेख उपलब्ध नहीं है।</div>';
            return;
        }

        grid.innerHTML = articles.map((a, i) => {
            const img = URLUtils.getSafeImageUrl(a.imageUrl);
            const t = DOMPurify.sanitize(a.title);
            const desc = DOMPurify.sanitize(a.description);
            const bookmarked = App.isBookmarked(a.id);

            // Insert ad placeholder every 4th card
            const adSlot = (i > 0 && i % 4 === 0) ? `
                <div class="ad-container ad-infeed-rect" aria-label="विज्ञापन">
                    <div class="ad-placeholder" data-ad-slot="infeed-grid-${i}"><span class="ad-label">विज्ञापन</span></div>
                </div>` : '';

            return `${adSlot}
            <article class="news-card" data-action="navigate" data-id="${a.id}" role="link" tabindex="0">
                <div class="card-image-wrapper">
                    <img src="${img}" alt="${t}" class="card-image" loading="lazy" width="300" height="200">
                </div>
                <div class="card-content">
                    <span class="card-category ${this.getCategoryClass(a.category)}">${a.category}</span>
                    <h3 class="card-title">${t}</h3>
                    <p class="card-desc">${desc}</p>
                    <div class="card-source">
                        <span>${DOMPurify.sanitize(a.author)} &middot; ${this.timeAgo(a.timestamp)}</span>
                        <span class="read-time">${a.readTime} मिनट</span>
                    </div>
                </div>
                <button class="bookmark-btn card-bookmark ${bookmarked ? 'bookmarked' : ''}" data-action="bookmark" data-id="${a.id}" aria-label="बुकमार्क">
                    <svg fill="${bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                </button>
            </article>`;
        }).join('');
    },

    // --- Sidebar Sections ---
    trending(articles) {
        const list = document.getElementById('trending-list');
        if (!list) return;
        const trendingArticles = articles.filter(a => a.trending).slice(0, 5);
        const display = trendingArticles.length ? trendingArticles : articles.slice(0, 5);

        list.innerHTML = display.map(a => {
            const img = URLUtils.getSafeImageUrl(a.imageUrl);
            const t = DOMPurify.sanitize(a.title);
            return `
            <div class="top-story-card" data-action="navigate" data-id="${a.id}" role="link" tabindex="0">
                <img src="${img}" alt="${t}" loading="lazy" width="300" height="120">
                <div class="top-story-info">
                    <span class="top-story-category ${this.getCategoryClass(a.category)}">${a.category}</span>
                    <h3>${t}</h3>
                    <time>${this.timeAgo(a.timestamp)}</time>
                </div>
            </div>`;
        }).join('');
    },

    mostRead(articles) {
        const list = document.getElementById('most-read-list');
        if (!list) return;
        const sorted = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
        list.innerHTML = sorted.map((a, i) => {
            const t = DOMPurify.sanitize(a.title);
            return `
            <li class="most-read-item" data-action="navigate" data-id="${a.id}" role="link" tabindex="0">
                <span class="most-read-rank">${i + 1}</span>
                <div class="most-read-info">
                    <h4 class="most-read-title">${t}</h4>
                    <span class="most-read-meta">${a.category} &middot; ${a.views.toLocaleString('hi-IN')} views</span>
                </div>
            </li>`;
        }).join('');
    },

    // --- Full Home Page ---
    home(articles) {
        if (!this.primaryContent || !articles.length) return;

        // Show main layout
        document.getElementById('content-wrapper').classList.remove('single-article-mode');
        if (this.sidebar) this.sidebar.style.display = '';

        this.ticker(articles);
        this.featured(articles);
        const nonFeatured = articles.filter(a => !a.featured);
        this.newsFeed(nonFeatured.length ? nonFeatured : articles.slice(3));
        this.trending(articles);
        this.mostRead(articles);

        // Show ticker
        const ticker = document.getElementById('breaking-ticker');
        if (ticker) ticker.style.display = '';

        App.restoreScrollPosition('home');
        SEO.resetHome();
    },

    // --- Single Article View ---
    article(article) {
        if (!this.primaryContent || !article) return;

        // Hide sidebar, show article layout
        document.getElementById('content-wrapper').classList.add('single-article-mode');
        if (this.sidebar) this.sidebar.style.display = 'none';

        const ticker = document.getElementById('breaking-ticker');
        if (ticker) ticker.style.display = 'none';

        const safeTitle = DOMPurify.sanitize(article.title);
        const safeContent = DOMPurify.sanitize(article.content, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'a', 'h2', 'h3', 'h4', 'figure', 'figcaption', 'img']
        });
        const imageUrl = URLUtils.getSafeImageUrl(article.imageUrl);
        const formattedDate = this.formatDate(article.timestamp);
        const bookmarked = App.isBookmarked(article.id);
        const shareUrl = encodeURIComponent(`${location.origin}?id=${article.id}`);
        const shareTitle = encodeURIComponent(article.title);

        // Related articles
        const related = App.state.allArticles
            .filter(a => a.id !== article.id && a.category === article.category)
            .slice(0, 4);

        this.primaryContent.innerHTML = `
            <article class="article-wrapper fade-in" role="article" itemscope itemtype="https://schema.org/NewsArticle">
                <div class="article-container">
                    <!-- Breadcrumb -->
                    <nav class="breadcrumb" aria-label="ब्रेडक्रम्ब">
                        <a href="/" class="breadcrumb-link">होम</a>
                        <span class="breadcrumb-sep">/</span>
                        <a href="/?cat=${encodeURIComponent(article.category)}" class="breadcrumb-link">${article.category}</a>
                        <span class="breadcrumb-sep">/</span>
                        <span class="breadcrumb-current">${safeTitle.substring(0, 40)}...</span>
                    </nav>

                    <header class="article-header">
                        <span class="article-category">${article.category}</span>
                        <h1 class="article-headline" itemprop="headline">${safeTitle}</h1>
                        <p class="article-subheading">${DOMPurify.sanitize(article.description)}</p>
                        <div class="article-byline">
                            <div class="author-info">
                                <div class="author-avatar-placeholder">${article.author.charAt(0)}</div>
                                <div>
                                    <p class="author-name" itemprop="author">${DOMPurify.sanitize(article.author)}</p>
                                    <p class="author-title">
                                        <time datetime="${article.timestamp.toISOString()}" itemprop="datePublished">${formattedDate}</time>
                                        &middot; ${article.readTime} मिनट पढ़ने में &middot; ${article.views.toLocaleString('hi-IN')} views
                                    </p>
                                </div>
                            </div>
                            <div class="article-sharing">
                                <a href="https://wa.me/?text=${shareTitle}%20${shareUrl}" target="_blank" rel="noopener" class="share-btn" aria-label="WhatsApp पर साझा करें">
                                    <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 5.441 4.435 9.856 9.877 9.856 5.487 0 9.877-4.415 9.877-9.856 0-5.406-4.378-9.798-9.877-9.798"/></svg>
                                </a>
                                <a href="https://t.me/share/url?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener" class="share-btn" aria-label="Telegram पर साझा करें">
                                    <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zM10.297 16.793a.861.861 0 0 1-1.206-.092l-2.724-4.077-4.99 1.686a.84.84 0 0 1-.914-1.334l12.768-4.865a.84.84 0 0 1 1.26.916l-4.756 12.14a.842.842 0 0 1-1.438-.216l-2.045-6.158z"/></svg>
                                </a>
                                <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener" class="share-btn" aria-label="Twitter पर साझा करें">
                                    <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.754-5.868 6.754h-3.31l7.732-8.835L2.882 2.25h6.6l4.67 6.169L17.822 2.25h.422zm-1.06 17.02h1.414L7.772 3.684H6.3l10.884 15.586z"/></svg>
                                </a>
                                <button class="share-btn" data-action="copy-link" data-id="${article.id}" aria-label="लिंक कॉपी करें">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                </button>
                                <button class="share-btn bookmark-btn ${bookmarked ? 'bookmarked' : ''}" data-action="bookmark" data-id="${article.id}" aria-label="बुकमार्क">
                                    <svg fill="${bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                                </button>
                            </div>
                        </div>
                    </header>

                    <figure class="article-featured-image">
                        <img src="${imageUrl}" alt="${safeTitle}" width="1200" height="675" fetchpriority="high" loading="eager" itemprop="image">
                    </figure>

                    <!-- Ad: In-article top -->
                    <div class="ad-container ad-in-article" aria-label="विज्ञापन">
                        <div class="ad-placeholder" data-ad-slot="article-top"><span class="ad-label">विज्ञापन</span></div>
                    </div>

                    <div class="article-body" itemprop="articleBody">
                        ${safeContent}
                    </div>

                    <!-- Ad: In-article bottom -->
                    <div class="ad-container ad-in-article" aria-label="विज्ञापन">
                        <div class="ad-placeholder" data-ad-slot="article-bottom"><span class="ad-label">विज्ञापन</span></div>
                    </div>

                    <footer class="article-footer">
                        <div class="article-tags">
                            <a href="/?cat=${encodeURIComponent(article.category)}" class="tag">${article.category}</a>
                        </div>
                        <div class="article-sharing-bottom">
                            <p>यह खबर साझा करें:</p>
                            <div class="share-buttons">
                                <a href="https://wa.me/?text=${shareTitle}%20${shareUrl}" target="_blank" rel="noopener" class="share-btn-bottom">WhatsApp</a>
                                <a href="https://t.me/share/url?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener" class="share-btn-bottom">Telegram</a>
                                <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener" class="share-btn-bottom">Twitter</a>
                                <button class="share-btn-bottom" data-action="copy-link" data-id="${article.id}">लिंक कॉपी करें</button>
                            </div>
                        </div>
                    </footer>
                </div>
            </article>

            ${related.length ? `
            <section class="related-articles">
                <h2>संबंधित खबरें</h2>
                <div class="related-grid">
                    ${related.map(a => {
                        const ri = URLUtils.getSafeImageUrl(a.imageUrl);
                        const rt = DOMPurify.sanitize(a.title);
                        return `
                        <article class="related-card" data-action="navigate" data-id="${a.id}" role="link" tabindex="0">
                            <img src="${ri}" alt="${rt}" width="400" height="240" loading="lazy">
                            <span class="related-category">${a.category}</span>
                            <h3>${rt}</h3>
                            <p class="related-excerpt">${DOMPurify.sanitize(a.description).substring(0, 80)}...</p>
                        </article>`;
                    }).join('')}
                </div>
            </section>` : ''}
        `;

        window.scrollTo({ top: 0, behavior: 'auto' });
    },

    // --- Search Results ---
    searchResults(articles, term) {
        if (!this.primaryContent) return;
        document.getElementById('content-wrapper').classList.add('single-article-mode');
        if (this.sidebar) this.sidebar.style.display = 'none';

        const ticker = document.getElementById('breaking-ticker');
        if (ticker) ticker.style.display = 'none';

        const sectionTitle = document.querySelector('.news-feed-section .section-title');
        if (sectionTitle) sectionTitle.textContent = `"${DOMPurify.sanitize(term)}" के लिए खोज परिणाम (${articles.length})`;

        this.primaryContent.innerHTML = `
            <section class="search-results-section">
                <h2 class="section-title">"${DOMPurify.sanitize(term)}" के लिए खोज परिणाम (${articles.length})</h2>
                <div class="news-grid">
                    ${articles.length ? articles.map(a => {
                        const img = URLUtils.getSafeImageUrl(a.imageUrl);
                        const t = DOMPurify.sanitize(a.title);
                        return `
                        <article class="news-card" data-action="navigate" data-id="${a.id}" role="link" tabindex="0">
                            <div class="card-image-wrapper">
                                <img src="${img}" alt="${t}" class="card-image" loading="lazy" width="300" height="200">
                            </div>
                            <div class="card-content">
                                <span class="card-category ${this.getCategoryClass(a.category)}">${a.category}</span>
                                <h3 class="card-title">${t}</h3>
                                <div class="card-source">
                                    <span>${this.timeAgo(a.timestamp)}</span>
                                    <span class="read-time">${a.readTime} मिनट</span>
                                </div>
                            </div>
                        </article>`;
                    }).join('') : '<div class="empty-state">कोई परिणाम नहीं मिला।</div>'}
                </div>
            </section>`;

        window.scrollTo({ top: 0, behavior: 'auto' });
    },

    // --- Error States ---
    notFound() {
        if (!this.primaryContent) return;
        document.getElementById('content-wrapper').classList.add('single-article-mode');
        if (this.sidebar) this.sidebar.style.display = 'none';
        this.primaryContent.innerHTML = `
            <div class="error-container">
                <div class="error-content">
                    <h1 class="error-code">404</h1>
                    <p class="error-message">लेख नहीं मिला। यह हटा दिया गया हो सकता है या लिंक गलत हो सकता है।</p>
                    <a href="/" class="error-btn">होम पर लौटें</a>
                </div>
            </div>`;
        window.scrollTo({ top: 0, behavior: 'auto' });
    },

    offline() {
        if (!this.primaryContent) return;
        this.primaryContent.innerHTML = `
            <div class="error-container">
                <div class="error-content">
                    <h1 class="error-code">ऑफलाइन</h1>
                    <p class="error-message">इंटरनेट कनेक्शन की जांच करें और फिर से कोशिश करें।</p>
                    <button class="error-btn" data-action="reload">फिर से लोड करें</button>
                </div>
            </div>`;
        window.scrollTo({ top: 0, behavior: 'auto' });
    }
};

// ============================================================================
// 8. ROUTER
// ============================================================================

const Router = async () => {
    if (!navigator.onLine) {
        App.state.isOnline = false;
        Renderer.offline();
        return;
    }
    App.state.isOnline = true;

    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    const category = params.get('cat');
    const searchTerm = params.get('search');

    Analytics.track('page_view', { route: articleId ? 'article' : category ? 'category' : searchTerm ? 'search' : 'home' });

    try {
        if (articleId) {
            const article = await App.guard(() => NewsService.fetchById(articleId));
            if (article) {
                SEO.update(article);
                SEO.updateMetaTags(article);
                Renderer.article(article);
            } else {
                Renderer.notFound();
            }
        } else if (searchTerm) {
            const results = await App.guard(() => NewsService.search(searchTerm));
            if (results) Renderer.searchResults(results, searchTerm);
        } else if (category) {
            const articles = await App.guard(() => NewsService.fetchByCategory(category));
            if (articles) {
                document.title = `${category} - Latest Khabar`;
                Renderer.home(articles);
                // Update section title
                const title = document.querySelector('.news-feed-section .section-title');
                if (title) title.textContent = `${category} की खबरें`;
            }
        } else {
            const articles = await App.guard(() => NewsService.fetchLatest());
            if (articles) Renderer.home(articles);
        }
    } catch (err) {
        Analytics.trackError(err.message);
        Renderer.offline();
    }
};

// ============================================================================
// 9. EVENT DELEGATION
// ============================================================================

const handleEvents = (event) => {
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;

    const { action, id, title } = actionElement.dataset;

    switch (action) {
        case 'navigate':
            event.preventDefault();
            App.saveScrollPosition(window.location.search || 'home');
            window.history.pushState(null, '', `?id=${id}`);
            Router();
            break;

        case 'share':
            event.stopPropagation();
            if (navigator.share) {
                navigator.share({
                    title: DOMPurify.sanitize(title || ''),
                    url: `${location.origin}?id=${id}`,
                    text: title || ''
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(`${location.origin}?id=${id}`)
                    .then(() => showToast('लिंक कॉपी किया गया'))
                    .catch(() => {});
            }
            break;

        case 'copy-link':
            event.stopPropagation();
            event.preventDefault();
            navigator.clipboard.writeText(`${location.origin}?id=${id}`)
                .then(() => showToast('लिंक कॉपी किया गया'))
                .catch(() => {});
            break;

        case 'bookmark':
            event.stopPropagation();
            event.preventDefault();
            const added = App.toggleBookmark(id);
            const svg = actionElement.querySelector('svg');
            if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');
            actionElement.classList.toggle('bookmarked', added);
            showToast(added ? 'बुकमार्क में जोड़ा गया' : 'बुकमार्क हटाया गया');
            break;

        case 'reload':
            window.location.reload();
            break;
    }
};

// ============================================================================
// 10. TOAST NOTIFICATION
// ============================================================================

function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ============================================================================
// 11. INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    Renderer.init();

    // Router listeners
    window.addEventListener('popstate', Router, { passive: true });
    window.addEventListener('online', Router, { passive: true });
    window.addEventListener('offline', () => { App.state.isOnline = false; }, { passive: true });

    // Global event delegation
    document.body.addEventListener('click', handleEvents, { passive: false });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            document.documentElement.classList.toggle('light', !isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Search toggle
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchClose = document.getElementById('search-close');

    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.toggle('active');
            if (searchOverlay.classList.contains('active')) {
                searchInput.focus();
            }
        });
        searchClose.addEventListener('click', () => searchOverlay.classList.remove('active'));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                searchOverlay.classList.remove('active');
                window.history.pushState(null, '', `?search=${encodeURIComponent(searchInput.value.trim())}`);
                Router();
                searchInput.value = '';
            }
        });
    }

    // Mobile sidebar
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarClose = document.getElementById('sidebar-close');

    const openSidebar = () => {
        mobileSidebar.classList.add('open');
        sidebarOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    const closeSidebar = () => {
        mobileSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    // Category nav links
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = link.dataset.category;
            if (cat === 'all') {
                window.history.pushState(null, '', '/');
            } else {
                window.history.pushState(null, '', `?cat=${encodeURIComponent(cat)}`);
            }
            Router();
            closeSidebar();
        });
    });

    // Sidebar nav links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href === '/') {
                window.history.pushState(null, '', '/');
            } else {
                const url = new URL(href, location.origin);
                window.history.pushState(null, '', url.pathname + url.search);
            }
            Router();
            closeSidebar();
        });
    });

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('सदस्यता सफल! धन्यवाद।');
            newsletterForm.reset();
        });
    }

    // Back to top
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.style.opacity = '1';
                backToTop.style.pointerEvents = 'auto';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.pointerEvents = 'none';
            }
        }, { passive: true });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Header scroll effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // Logo click routes to home
    const headerLogo = document.getElementById('header-logo-link');
    if (headerLogo) {
        headerLogo.addEventListener('click', (e) => {
            e.preventDefault();
            App.saveScrollPosition(window.location.search || 'home');
            window.history.pushState(null, '', '/');
            Router();
        });
    }

    // Dynamic footer year
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // Initial route
    Router();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
});
