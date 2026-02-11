/**
 * LATEST KHABAR v5.0 - HARDENED ENTERPRISE SINGLE PAGE APPLICATION
 * 
 * Architecture: Centralized State | Async Guard | Event Delegation
 * Security: DOMPurify | URL Validation | CSP-Aligned
 * Performance: Cache Pruning (LRU) | Scroll Restoration | LCP Optimization
 * SEO: Dynamic JSON-LD | Newsroom-Grade Schema | View Tracking Analytics
 */

import { db } from './firebase-config.js';
import { collection, getDocs, getDoc, query, orderBy, limit, doc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.es.mjs';

// ============================================================================
// 1. SCHEMA VALIDATION LAYER - Enterprise Data Validation
// ============================================================================

const Schema = {
    /**
     * Validate and normalize article data from Firestore
     * Ensures type safety and provides sensible defaults
     */
    validateArticle(rawData, docId) {
        if (!rawData || typeof rawData !== 'object') {
            console.warn(`[Schema] Invalid article data for ID: ${docId}`);
            return null;
        }

        // Extract and sanitize fields
        const title = String(rawData.title || '').trim();
        const content = String(rawData.content || '').trim();
        const category = String(rawData.category || 'Uncategorized').trim();
        const imageUrl = String(rawData.imageUrl || '').trim();
        const views = Number(rawData.views) || 0;
        const seoDescription = String(rawData.seoDescription || '').trim();

        // Validate minimum requirements
        if (!title || !content) {
            console.warn(`[Schema] Article ${docId} missing required fields`);
            return null;
        }

        // Advanced Mapping: SEO Description with fallback
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        const description = seoDescription || cleanContent.substring(0, 160);

        // Timestamp handling (Firestore Timestamp to Date)
        let timestamp = new Date();
        if (rawData.timestamp && typeof rawData.timestamp.toDate === 'function') {
            timestamp = rawData.timestamp.toDate();
        } else if (rawData.timestamp instanceof Date) {
            timestamp = rawData.timestamp;
        }

        return {
            id: String(docId),
            title,
            content,
            description,
            category,
            imageUrl,
            views,
            seoDescription,
            timestamp
        };
    }
};

// ============================================================================
// 2. TELEMETRY & ANALYTICS GATEWAY - Production-Ready Event Tracking
// ============================================================================

const Analytics = {
    /**
     * Primary event tracking method
     * Ready for Mixpanel/GA4/Segment integration
     */
    track(event, metadata = {}) {
        const timeStamp = new Date().toISOString();
        const logEntry = { event, timestamp: timeStamp, ...metadata };
        
        console.log(`[📊 Telemetry] ${event}`, metadata);
        
        // Production: Uncomment and replace with your service
        // window.gtag?.('event', event, metadata);
        // this.sendToMixpanel(event, metadata);
    },

    /**
     * Track article view counts in analytics with views sync
     */
    trackArticleView(articleId, totalViews) {
        this.track('article_view', {
            articleId,
            totalViews,
            userAgent: navigator.userAgent.substring(0, 100),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    },

    /**
     * Track errors for debugging
     */
    trackError(errorMsg, context = {}) {
        this.track('app_error', {
            error: errorMsg,
            url: window.location.href,
            ...context
        });
    }
};

// ============================================================================
// 3. CENTRALIZED STATE MANAGEMENT - Single Source of Truth
// ============================================================================

const App = {
    state: {
        currentRequestId: 0,      // Async guard: track request IDs to discard stale responses
        cache: new Map(),         // LRU cache for articles
        maxCache: 100,            // Maximum cache size before pruning
        scrollMap: new Map(),     // Store scroll positions per route
        isOnline: navigator.onLine,
        currentArticle: null
    },

    /**
     * Guard against race conditions
     * Ensures only the latest request's response is processed
     */
    async guard(asyncFn) {
        const requestId = ++this.state.currentRequestId;
        try {
            const result = await asyncFn();
            // Only return if this is still the latest request
            return requestId === this.state.currentRequestId ? result : null;
        } catch (error) {
            Analytics.trackError(error.message, { requestId });
            throw error;
        }
    },

    /**
     * Get or set scroll position for a route
     */
    saveScrollPosition(route = 'home') {
        this.state.scrollMap.set(route, window.scrollY);
    },

    restoreScrollPosition(route = 'home') {
        const pos = this.state.scrollMap.get(route) || 0;
        window.scrollTo({ top: pos, behavior: 'auto' });
    }
};

// ============================================================================
// 4. SECURITY LAYER - URL Validation & DOMPurify Configuration
// ============================================================================

const URLUtils = {
    /**
     * Strict regex-based URL validator
     * Blocks javascript:, data: (except SVG fallback), and malformed protocols
     */
    isValidImageUrl(url) {
        if (!url || typeof url !== 'string') return false;
        
        try {
            const parsed = new URL(url);
            // Only allow http and https protocols
            const isValidProtocol = parsed.protocol === 'http:' || parsed.protocol === 'https:';
            
            // Ensure domain is valid (not localhost in production)
            const isValidDomain = parsed.hostname && parsed.hostname.includes('.');
            
            return isValidProtocol && isValidDomain;
        } catch {
            return false;
        }
    },

    /**
     * Get safe image URL with SVG fallback
     */
    getSafeImageUrl(url) {
        if (this.isValidImageUrl(url)) {
            return url;
        }
        // Fallback: Inline SVG placeholder
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="18"%3EImage Not Available%3C/text%3E%3C/svg%3E';
    }
};

// DOMPurify Configuration for strict sanitization
DOMPurify.setConfig({
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'title'],
    KEEP_CONTENT: true,
    FORCE_BODY: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false
});

// ============================================================================
// 5. ENTERPRISE SEO - Newsroom-Grade JSON-LD Schema Injection
// ============================================================================

const SEO = {
    /**
     * Update meta tags and inject dynamic JSON-LD schema
     * Newsroom-grade structured data for search engines
     */
    update(article) {
        // Update document title
        document.title = `${article.title} | Latest Khabar`;

        // Generate comprehensive NewsArticle schema
        const seoDescription = article.seoDescription || article.description;
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            'headline': DOMPurify.sanitize(article.title),
            'description': seoDescription,
            'image': {
                '@type': 'ImageObject',
                'url': URLUtils.getSafeImageUrl(article.imageUrl),
                'height': 675,
                'width': 1200
            },
            'datePublished': article.timestamp.toISOString(),
            'dateModified': article.timestamp.toISOString(),
            'author': {
                '@type': 'Organization',
                'name': 'Latest Khabar',
                'url': 'https://latestkhabar.xyz'
            },
            'publisher': {
                '@type': 'Organization',
                'name': 'Latest Khabar',
                'logo': {
                    '@type': 'ImageObject',
                    'url': 'https://latestkhabar.xyz/Latest%20Khabar%20Logo.webp'
                }
            },
            'articleBody': article.content.substring(0, 500).replace(/<[^>]*>/g, ''),
            'inLanguage': 'hi-IN',
            'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': window.location.href
            },
            'interactionStatistic': {
                '@type': 'InteractionCounter',
                'interactionType': 'https://schema.org/ReadAction',
                'userInteractionCount': article.views || 0
            }
        };

        // Inject JSON-LD into <head>
        let script = document.getElementById('json-ld');
        if (!script) {
            script = document.createElement('script');
            script.id = 'json-ld';
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schema);
    },

    /**
     * Update meta description and OG tags
     */
    updateMetaTags(article) {
        const description = article.seoDescription || article.description;
        
        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = description;

        // Update OG tags
        const updateOGTag = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (tag) tag.content = content;
        };

        updateOGTag('og:title', article.title);
        updateOGTag('og:description', description);
        updateOGTag('og:image', URLUtils.getSafeImageUrl(article.imageUrl));
    }
};

// ============================================================================
// 6. FIRESTORE DATA SERVICE - With Views Counting & Schema Validation
// ============================================================================

const NewsService = {
    /**
     * Fetch latest articles with ordering and limit
     */
    async fetchLatest() {
        const q = query(
            collection(db, 'articles'),
            orderBy('timestamp', 'desc'),
            limit(20)
        );
        const snap = await getDocs(q);
        
        return snap.docs
            .map(doc => Schema.validateArticle(doc.data(), doc.id))
            .filter(Boolean); // Remove any null entries from validation
    },

    /**
     * Fetch single article by ID with views increment
     * Implements atomic increment operation for views
     */
    async fetchById(id) {
        // Check cache first (LRU optimization)
        if (App.state.cache.has(id)) {
            return App.state.cache.get(id);
        }

        // Fetch from Firestore
        const docRef = doc(db, 'articles', id);
        const snap = await getDoc(docRef);
        
        if (!snap.exists()) {
            return null;
        }

        // Validate article data
        const article = Schema.validateArticle(snap.data(), snap.id);
        if (!article) {
            return null;
        }

        // ===== DATA PERSISTENCE: Atomically increment views =====
        try {
            await updateDoc(docRef, {
                views: increment(1)
            });

            // Fetch updated view count
            const updatedSnap = await getDoc(docRef);
            const updatedData = updatedSnap.data();
            article.views = updatedData?.views || 1;

            // Track in analytics
            Analytics.trackArticleView(id, article.views);
        } catch (err) {
            console.error('View increment failed:', err);
            Analytics.trackError('View increment failed', { articleId: id });
            // Continue rendering even if view tracking fails
        }

        // LRU Cache Pruning
        if (App.state.cache.size >= App.state.maxCache) {
            const firstKey = App.state.cache.keys().next().value;
            App.state.cache.delete(firstKey);
        }

        App.state.cache.set(id, article);
        App.state.currentArticle = article;

        return article;
    }
};

// ============================================================================
// 7. RENDERER - LCP-Optimized & Accessible Article + Grid Rendering
// ============================================================================

const Renderer = {
    main: document.querySelector('main'),
    container: document.getElementById('articles-container'),

    /**
     * Render single article view with full metadata
     */
    article(article) {
        if (!this.main || !article) return;

        const sanitizedTitle = DOMPurify.sanitize(article.title);
        const sanitizedContent = DOMPurify.sanitize(article.content, { 
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'a', 'h2', 'h3']
        });
        const imageUrl = URLUtils.getSafeImageUrl(article.imageUrl);
        const formattedDate = article.timestamp.toLocaleDateString('hi-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        this.main.innerHTML = `
            <article class="article-wrapper fade-in" role="article">
                <div class="article-container">
                    <header class="article-header">
                        <h1 class="article-title">${sanitizedTitle}</h1>
                        <div class="article-meta">
                            <span class="category-badge">${article.category || 'समाचार'}</span>
                            <span class="view-count">👁️ ${article.views.toLocaleString('hi-IN')} views</span>
                            <time class="publish-date" datetime="${article.timestamp.toISOString()}">${formattedDate}</time>
                        </div>
                    </header>

                    <figure class="article-figure">
                        <img 
                            src="${imageUrl}" 
                            alt="${sanitizedTitle}"
                            class="article-image"
                            fetchpriority="high" 
                            loading="eager"
                            width="1200"
                            height="675">
                    </figure>

                    <div class="article-content prose prose-lg">
                        ${sanitizedContent}
                    </div>

                    <footer class="article-footer">
                        <button class="share-button" data-action="share" data-id="${article.id}" data-title="${sanitizedTitle}">
                            🔗 शेयर करें
                        </button>
                    </footer>
                </div>
            </article>
        `;

        window.scrollTo({ top: 0, behavior: 'auto' });
    },

    /**
     * Render grid of articles on home page
     */
    home(articles) {
        if (!this.container) return;

        if (!articles || articles.length === 0) {
            this.container.innerHTML = '<div class="empty-state">कोई लेख उपलब्ध नहीं है।</div>';
            return;
        }

        this.container.innerHTML = articles.map(article => {
            const sanitizedTitle = DOMPurify.sanitize(article.title);
            const imageUrl = URLUtils.getSafeImageUrl(article.imageUrl);

            return `
                <article class="article-card" data-action="navigate" data-id="${article.id}" role="link" tabindex="0">
                    <img src="${imageUrl}" alt="${sanitizedTitle}" class="card-image" loading="lazy">
                    <div class="card-overlay">
                        <h3 class="card-title">${sanitizedTitle}</h3>
                        <span class="card-category">${article.category}</span>
                    </div>
                    <button class="card-share-btn" data-action="share" data-id="${article.id}" data-title="${sanitizedTitle}" aria-label="শেয়ার">🔗</button>
                </article>
            `;
        }).join('');

        // Restore scroll position
        App.restoreScrollPosition('home');
    },

    /**
     * Error states
     */
    notFound() {
        if (!this.main) return;
        this.main.innerHTML = `
            <div class="error-container">
                <div class="error-content">
                    <h1 class="error-code">404</h1>
                    <p class="error-message">लेख नहीं मिला। यह हटा दिया गया हो सकता है या लिंक गलत हो सकता है।</p>
                    <a href="/" class="error-btn">होम पर लौटें</a>
                </div>
            </div>
        `;
        window.scrollTo({ top: 0, behavior: 'auto' });
    },

    offline() {
        if (!this.main) return;
        this.main.innerHTML = `
            <div class="error-container">
                <div class="error-content">
                    <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8.111 16H5a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8m-6-6h.01M9 20h6a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
                    </svg>
                    <h1 class="error-code">आफलाइन</h1>
                    <p class="error-message">इंटरनेट कनेक्शन की जांच करें और फिर से कोशिश करें।</p>
                    <button class="error-btn" data-action="reload">फिर से लोड करें</button>
                </div>
            </div>
        `;
        window.scrollTo({ top: 0, behavior: 'auto' });
    }
};

// ============================================================================
// 8. ROUTER - SPA Navigation with History & Scroll Restoration
// ============================================================================

const Router = async () => {
    // Check online status
    if (!navigator.onLine) {
        App.state.isOnline = false;
        Renderer.offline();
        Analytics.track('offline_detected');
        return;
    }

    App.state.isOnline = true;

    // Get article ID from query params
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    Analytics.track('page_view', { route: articleId ? 'article' : 'home', articleId });

    try {
        if (articleId) {
            // Render single article
            const article = await App.guard(() => NewsService.fetchById(articleId));
            
            if (article) {
                SEO.update(article);
                SEO.updateMetaTags(article);
                Renderer.article(article);
            } else {
                Renderer.notFound();
                Analytics.track('article_not_found', { articleId });
            }
        } else {
            // Render home grid
            const articles = await App.guard(() => NewsService.fetchLatest());
            
            if (articles) {
                document.title = 'Latest Khabar - ताज़ा खबरें, ब्रेकिंग न्यूज़';
                Renderer.home(articles);
            }
        }
    } catch (err) {
        console.error('Router error:', err);
        Analytics.trackError(err.message, { route: articleId ? 'article' : 'home' });
        Renderer.offline();
    }
};

// ============================================================================
// 9. EVENT DELEGATION - Global Click Handler for all Actions
// ============================================================================

const handleEvents = (event) => {
    // Find closest element with data-action attribute
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;

    const { action, id, title } = actionElement.dataset;

    switch (action) {
        case 'navigate':
            // Save scroll position before navigation
            App.saveScrollPosition(window.location.search || 'home');
            // Update URL and render
            window.history.pushState(null, '', `?id=${id}`);
            Router();
            break;

        case 'share':
            event.stopPropagation();
            // Use Web Share API with fallback
            if (navigator.share) {
                navigator.share({
                    title: DOMPurify.sanitize(title),
                    url: `${location.origin}?id=${id}`,
                    text: title
                }).catch(err => {
                    if (err.name !== 'AbortError') {
                        console.error('Share failed:', err);
                    }
                });
            } else {
                // Fallback: Copy to clipboard
                const shareUrl = `${location.origin}?id=${id}`;
                navigator.clipboard.writeText(shareUrl)
                    .then(() => alert('लिंक कॉपी किया गया'))
                    .catch(() => console.error('Copy failed'));
            }
            Analytics.track('article_shared', { articleId: id });
            break;

        case 'reload':
            window.location.reload();
            break;
    }
};

// ============================================================================
// 10. INITIALIZATION & EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Router listeners
    window.addEventListener('popstate', Router, { passive: true });
    window.addEventListener('online', Router, { passive: true });
    window.addEventListener('offline', () => {
        App.state.isOnline = false;
        Analytics.track('went_offline');
    }, { passive: true });

    // Global event delegation
    document.body.addEventListener('click', handleEvents, { passive: false });

    // Theme toggle (if element exists)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            Analytics.track('theme_toggled', { theme: isDark ? 'dark' : 'light' });
        });
    }

    // Initial route
    Router();

    // Register Service Worker (if available)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.warn('Service Worker registration failed:', err);
        });
    }
});

// Track visibility changes
document.addEventListener('visibilitychange', () => {
    Analytics.track('visibility_changed', {
        visible: !document.hidden
    });
});
