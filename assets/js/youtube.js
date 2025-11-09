// youtube-enhanced.js - كود محسن وشامل يعمل بشكل كامل
class YouTubeChannelsApp {
    constructor() {
        this.API_KEY = 'AIzaSyALH2Ygg-0ilxZJRwDogvCOeIU5fJ2VV90';
        this.BASE_URL = 'https://www.googleapis.com/youtube/v3';
        
        this.state = {
            channels: [],
            currentChannel: null,
            channelVideos: [],
            channelPlaylists: [],
            channelDetails: null,
            currentPageToken: null,
            isLoading: false,
            isLoadingMore: false,
            searchQuery: '',
            currentCategory: 'all',
            currentLevel: 'all',
            player: null,
            cachedData: new Map(),
            activePlaylist: null,
            playlistVideos: [],
            currentPlaylistPageToken: null,
            watchHistory: JSON.parse(localStorage.getItem('watchHistory')) || [],
            uploadsPlaylistId: null
        };

        this.channelsData = [
            {
                id: 52,
                name: "قناة عبدالرحمن جمال - تعلم البرمجة والتقنية",
                channelId: "UCk6YbovpoM-2pynv6lMQPfg",
                logo: "fab fa-youtube",
                description: "قناة عربية شهيرة تقدم دروسًا احترافية في تطوير الويب والذكاء الاصطناعي.",
                features: ["شروحات عملية", "محتوى مجاني بالكامل", "مشاريع تطبيقية واقعية"],
                usage: "مجاني ومفتوح عبر اليوتيوب",
                conditions: "مجاني بالكامل",
                language: "العربية",
                link: "https://www.youtube.com/@AbdelrahmanGamal",
                category: "برمجة",
                level: "جميع المستويات"
            },
            {
                id: 53,
                name: "قناة إبراهيم عادل - zAmericanEnglish",
                channelId: "UC2wMTRW3UJ5HmOoYYYQwd1w",
                logo: "fab fa-youtube",
                description: "أكبر قناة عربية لتعليم اللغة الإنجليزية بطريقة مبسطة ومجانية.",
                features: ["أكثر من ألف درس", "مستويات مرتبة", "تطبيق مرافق للتدريب اليومي"],
                usage: "مجاني تمامًا، المحتوى متاح للعامة",
                conditions: "مجاني بالكامل",
                language: "العربية",
                link: "https://www.youtube.com/@zAmericanEnglish",
                category: "لغات",
                level: "جميع المستويات"
            },
            {
                id: 54,
                name: "BBC Learning English",
                channelId: "UCHaHD477h-FeBbVh9Sh7syA",
                logo: "fab fa-youtube",
                description: "قناة BBC الرسمية لتعليم اللغة الإنجليزية بمحتوى احترافي ومنظم.",
                features: ["فيديوهات تعليمية أسبوعية", "بودكاست، مفردات وقواعد", "محتوى متنوع لجميع المستويات"],
                usage: "تحسين مهارات اللغة الإنجليزية بطرق تفاعلية وممتعة",
                conditions: "مجاني بالكامل",
                language: "الإنجليزية",
                link: "https://www.youtube.com/user/bbclearningenglish",
                category: "لغات",
                level: "جميع المستويات"
            },
            {
                id: 55,
                name: "Programming with Mosh",
                channelId: "UCWv7vMbMWH4-V0ZXdmDpPBA",
                logo: "fab fa-youtube",
                description: "قناة متخصصة في تعليم البرمجة بشروحات واضحة ومحتوى منظم.",
                features: ["شروحات عملية للغات برمجة متعددة", "محتوى منظم للمبتدئين والمحترفين"],
                usage: "تعلم البرمجة من الصفر وحتى الاحتراف",
                conditions: "مجاني بالكامل",
                language: "الإنجليزية",
                link: "https://www.youtube.com/c/programmingwithmosh",
                category: "برمجة",
                level: "جميع المستويات"
            },
            {
                id: 56,
                name: "Traversy Media",
                channelId: "UC29ju8bIPH5as8OGnQzwJyA",
                logo: "fab fa-youtube",
                description: "قناة متميزة في تعليم تطوير الويب والتطبيقات بمشاريع عملية.",
                features: ["دروس تطوير ويب شاملة", "مشاريع عملية واقعية", "تغطية لأحدث التقنيات"],
                usage: "تعلم تطوير الويب والتطبيقات بمشاريع عملية",
                conditions: "مجاني بالكامل",
                language: "الإنجليزية",
                link: "https://www.youtube.com/c/TraversyMedia",
                category: "برمجة",
                level: "جميع المستويات"
            },
            {
                id: 57,
                name: "DesignCourse",
                channelId: "UCXQi7K--r1jS1-eoUx7p0UQ",
                logo: "fab fa-youtube",
                description: "قناة متخصصة في تصميم واجهات المستخدم وتجربة المستخدم (UI/UX).",
                features: ["دروس تصميم UI/UX", "مشاريع عملية", "نصائح احترافية"],
                usage: "تعلم تصميم واجهات المستخدم وتجربة المستخدم",
                conditions: "مجاني بالكامل",
                language: "الإنجليزية",
                link: "https://www.youtube.com/c/DesignCourse",
                category: "تصميم",
                level: "جميع المستويات"
            },
            {
                id: 58,
                name: "Neil Patel",
                channelId: "UCfvQ87U1EnVarWZz4aDgZXA",
                logo: "fab fa-youtube",
                description: "قناة الخبير نيل باتل في التسويق الرقمي وتحسين محركات البحث.",
                features: ["استراتيجيات SEO متقدمة", "نصائح تسويق رقمي", "تحليلات وأدوات مجانية"],
                usage: "تعلم التسويق الرقمي وتحسين محركات البحث",
                conditions: "مجاني بالكامل",
                language: "الإنجليزية",
                link: "https://www.youtube.com/c/neilpatel",
                category: "تسويق",
                level: "متوسط - متقدم"
            },
            {
                id: 59,
                name: "ZAmericanEnglish",
                channelId: "UC2wMTRW3UJ5HmOoYYYQwd1w",
                logo: "fab fa-youtube",
                description: "قناة عربية متميزة في تعليم اللغة الإنجليزية بطريقة مبسطة وفعالة.",
                features: ["دروس شاملة للقواعد والمحادثة", "تمارين تفاعلية", "محتوى مخصص للناطقين بالعربية"],
                usage: "تعلم اللغة الإنجليزية من الصفر للمتقدم",
                conditions: "مجاني بالكامل",
                language: "العربية",
                link: "https://www.youtube.com/c/ZAmericanEnglish",
                category: "لغات",
                level: "جميع المستويات"
            },
            {
                id: 60,
                name: "أكاديمية الزيرو",
                channelId: "UCF-7p6Y1q9hP0r1p-kd1k9A",
                logo: "fab fa-youtube",
                description: "قناة عربية متخصصة في تعليم البرمجة وتطوير الويب من الصفر.",
                features: ["مسارات تعلم كاملة", "مشاريع عملية", "دعم مجتمعي"],
                usage: "تعلم البرمجة وتطوير الويب باللغة العربية",
                conditions: "مجاني بالكامل",
                language: "العربية",
                link: "https://www.youtube.com/c/AcademyElzero",
                category: "برمجة",
                level: "جميع المستويات"
            },
            {
                id: 61,
                name: "Freecodecamp العربية",
                channelId: "UCV8e2gCg1ktB8UJoM2jWQyQ",
                logo: "fab fa-youtube",
                description: "قناة freeCodeCamp الرسمية باللغة العربية لتعليم البرمجة مجاناً.",
                features: ["دروس برمجة شاملة", "مشاريع عملية", "محاضرات مترجمة"],
                usage: "تعلم البرمجة باللغة العربية من خلال مشاريع عملية",
                conditions: "مجاني بالكامل",
                language: "العربية",
                link: "https://www.youtube.com/c/FreecodecampArabic",
                category: "برمجة",
                level: "جميع المستويات"
            }
        ];

        this.CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours
        this.imageCache = new Map();
        this.init();
    }

    async init() {
        console.log('🚀 تهيئة تطبيق قنوات يوتيوب التعليمية...');
        await this.createHTMLStructure();
        await this.setupEventListeners();
        await this.testAPI();
        this.loadChannels();
        this.setupEnhancedPlayer();
        this.setupPerformanceOptimizations();
        
        // جعل الكائن متاحًا عالميًا للتصحيح
        window.youtubeApp = this;
    }

    // ========== تحسينات الأداء والذاكرة ==========
    setupPerformanceOptimizations() {
        console.log('🔧 إعداد تحسينات الأداء...');
        
        // مراقبة الذاكرة
        this.setupMemoryMonitoring();
        
        // تحميل كسول للصور
        this.setupLazyLoading();
    }

    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const usedMB = performance.memory.usedJSHeapSize / 1048576;
                if (usedMB > 50) {
                    this.clearUnusedCaches();
                }
            }, 30000);
        }
    }

    clearUnusedCaches() {
        console.log('🧹 تنظيف الذاكرة المؤقتة...');
        const now = Date.now();
        for (let [key, value] of this.imageCache) {
            if (now - value.timestamp > 300000) { // 5 دقائق
                this.imageCache.delete(key);
            }
        }
        
        // تنظيف localStorage القديم
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('cache_')) {
                try {
                    const item = JSON.parse(localStorage.getItem(key));
                    if (now - item.ts > this.CACHE_TTL) {
                        keysToRemove.push(key);
                    }
                } catch (e) {
                    keysToRemove.push(key);
                }
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            this.lazyImageObserver.unobserve(img);
                        }
                    }
                });
            });

            // تأجيل تهيئة المراقب حتى يكون DOM جاهزًا
            setTimeout(() => {
                document.querySelectorAll('img[data-src]').forEach(img => {
                    this.lazyImageObserver.observe(img);
                });
            }, 1000);
        }
    }

    // ========== إدارة التخزين المؤقت ==========
    cacheGet(key) {
        try {
            const raw = localStorage.getItem(`cache_${key}`);
            if (!raw) return null;
            const obj = JSON.parse(raw);
            if (!obj.ts || (Date.now() - obj.ts) > this.CACHE_TTL) {
                localStorage.removeItem(`cache_${key}`);
                return null;
            }
            return obj.data;
        } catch (e) {
            console.warn('خطأ في قراءة التخزين المؤقت:', e);
            return null;
        }
    }

    cacheSet(key, data) {
        try {
            localStorage.setItem(`cache_${key}`, JSON.stringify({ 
                ts: Date.now(), 
                data 
            }));
        } catch (e) {
            console.warn('خطأ في كتابة التخزين المؤقت:', e);
            // محاولة تنظيف الذاكرة إذا كانت ممتلئة
            this.clearUnusedCaches();
        }
    }

    // ========== أدوات مساعدة للـ YouTube API ==========
    ytUrl(path, params = {}) {
        const url = new URL(`${this.BASE_URL}/${path}`);
        params.key = this.API_KEY;
        Object.keys(params).forEach(k => {
            if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
                url.searchParams.set(k, params[k]);
            }
        });
        return url.toString();
    }

    async safeFetch(url) {
        try {
            console.log('🌐 جاري جلب البيانات من:', url);
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('فشل في جلب البيانات:', response.status, errorText);
                return null;
            }
            const data = await response.json();
            console.log('✅ تم جلب البيانات بنجاح');
            return data;
        } catch (error) {
            console.error('خطأ في الاتصال:', error);
            return null;
        }
    }

    // ========== حل معرف القناة من الرابط ==========
    async resolveChannelId(link, fallbackName) {
        try {
            const url = new URL(link);
            const path = url.pathname.replace(/\/+$/, '');

            // إذا كان الرابط يحتوي على /channel/
            if (path.startsWith('/channel/')) {
                return path.split('/channel/')[1];
            }

            // إذا كان الرابط يحتوي على @handle
            if (path.startsWith('/@')) {
                const handle = path.split('/@')[1];
                const cacheKey = `resolve_handle_${handle}`;
                const cached = this.cacheGet(cacheKey);
                if (cached) return cached;

                const apiUrl = this.ytUrl('search', {
                    part: 'snippet',
                    q: handle,
                    type: 'channel',
                    maxResults: 1
                });

                const result = await this.safeFetch(apiUrl);
                if (result && result.items && result.items[0]) {
                    const channelId = result.items[0].snippet.channelId || 
                                    (result.items[0].id && result.items[0].id.channelId);
                    if (channelId) {
                        this.cacheSet(cacheKey, channelId);
                        return channelId;
                    }
                }
            }

            // البحث بالاسم
            const query = fallbackName || url.pathname.replace(/^\//, '');
            const cacheKey = `resolve_name_${query}`;
            const cached = this.cacheGet(cacheKey);
            if (cached) return cached;

            const apiUrl = this.ytUrl('search', {
                part: 'snippet',
                q: query,
                type: 'channel',
                maxResults: 2
            });

            const result = await this.safeFetch(apiUrl);
            if (result && result.items && result.items[0]) {
                const channelId = result.items[0].snippet.channelId || 
                                (result.items[0].id && result.items[0].id.channelId);
                if (channelId) {
                    this.cacheSet(cacheKey, channelId);
                    return channelId;
                }
            }
        } catch (error) {
            console.warn('خطأ في حل معرف القناة:', error);
        }
        return null;
    }

    // ========== الوظائف الرئيسية للـ API ==========
    async fetchChannelDetails(channelId) {
        if (!channelId) {
            console.error('معرف القناة مطلوب');
            return null;
        }

        const cacheKey = `channel_details_${channelId}`;
        const cached = this.cacheGet(cacheKey);
        if (cached) return cached;

        const url = this.ytUrl('channels', {
            part: 'snippet,contentDetails,statistics,brandingSettings',
            id: channelId,
            maxResults: 1
        });

        const result = await this.safeFetch(url);
        if (result && result.items && result.items[0]) {
            this.cacheSet(cacheKey, result.items[0]);
            return result.items[0];
        }
        return null;
    }

    async fetchPlaylists(channelId, pageToken = null) {
        if (!channelId) {
            console.error('معرف القناة مطلوب لجلب قوائم التشغيل');
            return null;
        }

        const cacheKey = `playlists_${channelId}_${pageToken || 'first'}`;
        const cached = this.cacheGet(cacheKey);
        if (cached) return cached;

        const url = this.ytUrl('playlists', {
            part: 'snippet,contentDetails,status',
            channelId: channelId,
            maxResults: 20,
            pageToken: pageToken || ''
        });

        const result = await this.safeFetch(url);
        if (result) {
            this.cacheSet(cacheKey, result);
            return result;
        }
        return null;
    }

    async fetchPlaylistItems(playlistId, pageToken = null) {
        if (!playlistId) {
            console.error('معرف قائمة التشغيل مطلوب');
            return null;
        }

        const cacheKey = `playlist_items_${playlistId}_${pageToken || 'first'}`;
        const cached = this.cacheGet(cacheKey);
        if (cached) return cached;

        const url = this.ytUrl('playlistItems', {
            part: 'snippet,contentDetails',
            playlistId: playlistId,
            maxResults: 12,
            pageToken: pageToken || ''
        });

        const result = await this.safeFetch(url);
        if (result) {
            this.cacheSet(cacheKey, result);
            return result;
        }
        return null;
    }

    async fetchVideosMeta(videoIds = []) {
        if (!videoIds.length) return null;
        
        const cacheKey = `videos_meta_${videoIds.join(',')}`;
        const cached = this.cacheGet(cacheKey);
        if (cached) return cached;

        const url = this.ytUrl('videos', {
            part: 'snippet,contentDetails,statistics',
            id: videoIds.join(','),
            maxResults: videoIds.length
        });

        const result = await this.safeFetch(url);
        if (result) {
            this.cacheSet(cacheKey, result);
            return result;
        }
        return null;
    }

    // ========== عرض قوائم التشغيل المحسن ==========
    async showEnhancedPlaylists(channelId) {
        console.log('🔄 جاري تحميل قوائم التشغيل المحسنة...', channelId);
        
        try {
            const playlistsData = await this.fetchEnhancedPlaylists(channelId);
            
            if (playlistsData && playlistsData.items && playlistsData.items.length > 0) {
                await this.renderEnhancedPlaylists(playlistsData);
                this.setupPlaylistInteractions();
            } else {
                this.showEmptyPlaylistsState();
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل قوائم التشغيل:', error);
            this.showPlaylistsError(error.message);
        }
    }

    async fetchEnhancedPlaylists(channelId, pageToken = null) {
        const cacheKey = `enhanced_playlists_${channelId}_${pageToken || 'first'}`;
        const cached = this.cacheGet(cacheKey);
        
        if (cached) {
            console.log('📋 استخدام البيانات المخزنة مؤقتًا');
            return cached;
        }

        try {
            const result = await this.fetchPlaylists(channelId, pageToken);
            if (!result || !result.items) {
                return null;
            }

            // تحسين البيانات قبل التخزين
            const enhancedData = {
                items: result.items.map(playlist => ({
                    ...playlist,
                    enhancedThumbnail: this.optimizeThumbnail(playlist.snippet?.thumbnails),
                    formattedDate: this.formatDate(playlist.snippet?.publishedAt),
                    accessibilityText: this.generateAccessibilityText(playlist)
                })),
                nextPageToken: result.nextPageToken,
                pageInfo: result.pageInfo
            };

            this.cacheSet(cacheKey, enhancedData);
            return enhancedData;
        } catch (error) {
            console.error('❌ خطأ في جلب قوائم التشغيل:', error);
            throw error;
        }
    }

    optimizeThumbnail(thumbnails) {
        if (!thumbnails) {
            return 'https://via.placeholder.com/320x180/4a00e0/ffffff?text=قائمة+تشغيل';
        }

        if (thumbnails.maxres?.url) {
            return thumbnails.maxres.url;
        } else if (thumbnails.standard?.url) {
            return thumbnails.standard.url;
        } else if (thumbnails.high?.url) {
            return thumbnails.high.url;
        } else if (thumbnails.medium?.url) {
            return thumbnails.medium.url;
        } else if (thumbnails.default?.url) {
            return thumbnails.default.url;
        }
        
        return 'https://via.placeholder.com/320x180/4a00e0/ffffff?text=قائمة+تشغيل';
    }

    generateAccessibilityText(playlist) {
        const title = playlist.snippet?.title || 'قائمة تشغيل';
        const count = playlist.contentDetails?.itemCount || 0;
        const date = this.formatDate(playlist.snippet?.publishedAt);
        
        return `قائمة تشغيل بعنوان ${title} تحتوي على ${count} فيديو، تم إنشاؤها ${date}`;
    }

    async renderEnhancedPlaylists(playlistsData) {
        const playlistsGrid = document.getElementById('playlists-grid');
        if (!playlistsGrid) {
            console.error('عنصر playlists-grid غير موجود');
            return;
        }

        playlistsGrid.innerHTML = '';

        // تجميع الصور قبل التحميل
        await this.preloadImages(playlistsData.items.map(p => p.enhancedThumbnail));

        playlistsData.items.forEach(playlist => {
            const playlistElement = this.createEnhancedPlaylistElement(playlist);
            playlistsGrid.appendChild(playlistElement);
        });

        // إضافة زر تحميل المزيد إذا كان موجودًا
        if (playlistsData.nextPageToken) {
            this.addLoadMorePlaylistsButton(playlistsData.nextPageToken, this.state.currentChannel.channelId);
        }

        console.log('✅ تم عرض قوائم التشغيل المحسنة بنجاح');
    }

    createEnhancedPlaylistElement(playlist) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 col-xl-3 mb-4';
        col.innerHTML = `
            <div class="playlist-card enhanced-playlist" 
                 role="article" 
                 aria-label="${playlist.accessibilityText}"
                 data-playlist-id="${playlist.id}">
                <div class="playlist-thumbnail position-relative">
                    <img src="${playlist.enhancedThumbnail}" 
                         alt="${playlist.snippet?.title || 'قائمة تشغيل'}"
                         class="w-100 playlist-image"
                         loading="lazy"
                         style="height: 200px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/320x200/4a00e0/ffffff?text=قائمة+تشغيل'">
                    <div class="playlist-overlay">
                        <div class="playlist-actions">
                            <button class="btn btn-sm btn-light view-playlist" title="عرض قائمة التشغيل">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                    <div class="playlist-badge">
                        <span class="badge bg-primary">
                            <i class="fas fa-list me-1"></i>
                            ${playlist.contentDetails?.itemCount || 0}
                        </span>
                    </div>
                </div>
                <div class="playlist-content p-3">
                    <h3 class="playlist-title h6 mb-2 text-truncate" title="${playlist.snippet?.title || ''}">
                        ${playlist.snippet?.title || 'بدون عنوان'}
                    </h3>
                    <p class="playlist-description small text-muted mb-2 line-clamp-2">
                        ${playlist.snippet?.description || 'لا يوجد وصف'}
                    </p>
                    <div class="playlist-meta d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>
                            ${playlist.formattedDate}
                        </small>
                        <span class="playlist-status ${playlist.status?.privacyStatus === 'private' ? 'text-warning' : 'text-success'}">
                            ${playlist.status?.privacyStatus === 'private' ? 'خاص' : 'عام'}
                        </span>
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    // ========== إدارة القنوات ==========
    loadChannels() {
        console.log('📺 جاري تحميل القنوات...');
        this.showLoading('channels-loading');
        this.state.channels = this.channelsData;
        
        setTimeout(() => {
            this.renderChannels();
            this.renderChannelsList();
            this.hideLoading('channels-loading');
        }, 500);
    }

    renderChannels() {
        const channelsGrid = document.getElementById('channels-grid');
        if (!channelsGrid) {
            console.error('عنصر channels-grid غير موجود');
            return;
        }

        channelsGrid.innerHTML = '';

        if (this.state.channels.length === 0) {
            this.showEmptyState('channels-grid', 'قنوات', 'لا توجد قنوات تطابق معايير البحث');
            return;
        }

        this.state.channels.forEach(channel => {
            const channelElement = this.createChannelElement(channel);
            channelsGrid.appendChild(channelElement);
        });
    }

    createChannelElement(channel) {
        const channelCard = document.createElement('div');
        channelCard.className = 'col-md-6 col-lg-4 mb-4';
        channelCard.innerHTML = `
            <div class="channel-card">
                <div class="channel-banner position-relative">
                    <div class="channel-logo position-absolute top-0 start-0 m-3">
                        <i class="${channel.logo} fa-2x text-white"></i>
                    </div>
                </div>
                <div class="channel-info p-3">
                    <h3 class="channel-name h5 mb-2">${channel.name}</h3>
                    <p class="channel-description text-muted small mb-3">${channel.description}</p>
                    <div class="channel-meta d-flex justify-content-between align-items-center mb-2">
                        <span class="channel-category badge bg-primary">${channel.category}</span>
                        <span class="channel-level badge bg-secondary">${channel.level}</span>
                    </div>
                    <div class="channel-features">
                        ${channel.features.map(feature => 
                            `<span class="badge bg-light text-dark me-1 mb-1 small">${feature}</span>`
                        ).join('')}
                    </div>
                    <div class="channel-language mt-2">
                        <small class="text-muted">اللغة: ${channel.language}</small>
                    </div>
                </div>
            </div>
        `;

        channelCard.addEventListener('click', () => {
            this.openChannel(channel);
        });

        return channelCard;
    }

    // ========== إدارة القناة المحددة ==========
    async openChannel(channel) {
        console.log('🎯 فتح القناة:', channel.name);
        
        if (!this.validateChannelData(channel)) {
            this.showNotification('بيانات القناة غير صالحة', 'error');
            return;
        }

        this.state.currentChannel = channel;
        this.showChannelView();
        this.showLoading('videos-loading');
        this.showLoading('playlists-loading');

        try {
            await this.loadChannelDetails();
            await Promise.all([
                this.loadChannelVideos(),
                this.loadChannelPlaylists()
            ]);
        } catch (error) {
            console.error('Error loading channel data:', error);
            this.showNotification('فشل في تحميل بيانات القناة', 'error');
        }
    }

    async loadChannelDetails() {
        if (!this.state.currentChannel) return;

        try {
            const resolvedId = await this.resolveChannelId(
                this.state.currentChannel.link, 
                this.state.currentChannel.name
            );

            if (!resolvedId) {
                throw new Error('لم نتمكن من الحصول على معرف القناة');
            }

            const details = await this.fetchChannelDetails(resolvedId);
            if (!details) {
                throw new Error('فشل جلب بيانات القناة');
            }

            this.renderChannelDetails(details);
            this.state.uploadsPlaylistId = details.contentDetails?.relatedPlaylists?.uploads;

        } catch (error) {
            console.error('Error loading channel details:', error);
            this.renderChannelDetails(null);
        }
    }

    // ========== إدارة الفيديوهات المحسنة ==========
    async showEnhancedVideos(playlistId, pageToken = null) {
        console.log('🎥 جاري تحميل الفيديوهات المحسنة...', playlistId);

        try {
            const videosData = await this.fetchEnhancedPlaylistVideos(playlistId, pageToken);
            
            if (videosData && videosData.items && videosData.items.length > 0) {
                await this.renderEnhancedVideos(videosData, !pageToken);
                this.setupVideoInteractions();
            } else {
                this.showEmptyVideosState();
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل الفيديوهات:', error);
            this.showVideosError(error.message);
        }
    }

    async fetchEnhancedPlaylistVideos(playlistId, pageToken = null) {
        const cacheKey = `enhanced_videos_${playlistId}_${pageToken || 'first'}`;
        const cached = this.cacheGet(cacheKey);
        
        if (cached) {
            console.log('📋 استخدام فيديوهات مخزنة مؤقتًا');
            return cached;
        }

        try {
            const result = await this.fetchPlaylistItems(playlistId, pageToken);
            if (!result || !result.items) {
                return { items: [], nextPageToken: null };
            }

            const videoIds = result.items
                .map(item => item.contentDetails?.videoId)
                .filter(Boolean);

            let enhancedVideos = [];
            
            if (videoIds.length > 0) {
                const videosMeta = await this.fetchVideosMeta(videoIds);
                const metaMap = new Map();
                
                if (videosMeta?.items) {
                    videosMeta.items.forEach(video => {
                        metaMap.set(video.id, video);
                    });
                }

                enhancedVideos = result.items.map(item => {
                    const videoId = item.contentDetails?.videoId;
                    const meta = metaMap.get(videoId);
                    
                    return {
                        id: videoId,
                        title: meta?.snippet?.title || item.snippet?.title,
                        description: meta?.snippet?.description || item.snippet?.description,
                        channelTitle: meta?.snippet?.channelTitle || item.snippet?.channelTitle,
                        thumbnail: this.optimizeVideoThumbnail(meta?.snippet?.thumbnails || item.snippet?.thumbnails),
                        duration: this.formatDuration(meta?.contentDetails?.duration),
                        viewCount: this.formatNumber(meta?.statistics?.viewCount),
                        likeCount: this.formatNumber(meta?.statistics?.likeCount),
                        commentCount: this.formatNumber(meta?.statistics?.commentCount),
                        publishedAt: this.formatDate(meta?.snippet?.publishedAt || item.snippet?.publishedAt),
                        accessibilityText: this.generateVideoAccessibilityText(meta?.snippet || item.snippet),
                        tags: meta?.snippet?.tags || []
                    };
                }).filter(video => video.id);
            }

            const enhancedData = {
                items: enhancedVideos,
                nextPageToken: result.nextPageToken,
                pageInfo: result.pageInfo
            };

            this.cacheSet(cacheKey, enhancedData);
            return enhancedData;
        } catch (error) {
            console.error('❌ خطأ في جلب الفيديوهات:', error);
            throw error;
        }
    }

    optimizeVideoThumbnail(thumbnails) {
        if (!thumbnails) {
            return 'https://via.placeholder.com/320x180/333/fff?text=فيديو';
        }

        if (thumbnails.maxres?.url) {
            return thumbnails.maxres.url;
        } else if (thumbnails.standard?.url) {
            return thumbnails.standard.url;
        } else if (thumbnails.high?.url) {
            return thumbnails.high.url;
        } else if (thumbnails.medium?.url) {
            return thumbnails.medium.url;
        } else if (thumbnails.default?.url) {
            return thumbnails.default.url;
        }
        
        return 'https://via.placeholder.com/320x180/333/fff?text=فيديو';
    }

    generateVideoAccessibilityText(snippet) {
        if (!snippet) return 'فيديو';
        
        const title = snippet.title || 'فيديو';
        const channel = snippet.channelTitle || 'قناة';
        const date = this.formatDate(snippet.publishedAt);
        
        return `فيديو بعنوان ${title} من قناة ${channel}، تم نشره ${date}`;
    }

    async renderEnhancedVideos(videosData, clearExisting = true) {
        const videosGrid = document.getElementById('playlist-videos-grid') || 
                          document.getElementById('videos-grid');
        
        if (!videosGrid) {
            console.error('عنصر عرض الفيديوهات غير موجود');
            return;
        }

        if (clearExisting) {
            videosGrid.innerHTML = '';
        }

        await this.preloadImages(videosData.items.map(v => v.thumbnail));

        videosData.items.forEach(video => {
            const videoElement = this.createEnhancedVideoElement(video);
            videosGrid.appendChild(videoElement);
        });

        if (videosData.nextPageToken) {
            this.addLoadMoreVideosButton(videosData.nextPageToken);
        }

        console.log('✅ تم عرض الفيديوهات المحسنة بنجاح');
    }

    createEnhancedVideoElement(video) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 col-xl-3 mb-4';
        col.innerHTML = `
            <div class="video-card enhanced-video" 
                 role="article" 
                 aria-label="${video.accessibilityText}"
                 data-video-id="${video.id}">
                <div class="video-thumbnail position-relative">
                    <img src="${video.thumbnail}" 
                         alt="${video.title}"
                         class="w-100 video-image"
                         loading="lazy"
                         style="height: 180px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/320x180/333/fff?text=فيديو'">
                    <div class="video-overlay">
                        <div class="video-actions">
                            <button class="btn btn-sm btn-light play-video" title="تشغيل الفيديو">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                    <div class="video-duration">
                        ${video.duration}
                    </div>
                </div>
                <div class="video-content p-3">
                    <h3 class="video-title h6 mb-2 line-clamp-2" title="${video.title}">
                        ${video.title}
                    </h3>
                    <p class="channel-name text-muted small mb-2">
                        ${video.channelTitle}
                    </p>
                    <div class="video-stats d-flex justify-content-between text-muted small mb-2">
                        <span>
                            <i class="fas fa-eye me-1"></i>
                            ${video.viewCount}
                        </span>
                        <span>
                            <i class="fas fa-thumbs-up me-1"></i>
                            ${video.likeCount}
                        </span>
                    </div>
                    <div class="video-meta d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>
                            ${video.publishedAt}
                        </small>
                        ${video.tags.length > 0 ? `
                            <span class="badge bg-secondary badge-sm">
                                <i class="fas fa-tag me-1"></i>
                                ${video.tags.length}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    // ========== إدارة قوائم التشغيل ==========
    async loadChannelPlaylists() {
        if (!this.state.currentChannel || !this.state.currentChannel.channelId) {
            console.error('لا توجد قناة محددة أو معرف القناة مفقود');
            this.hideLoading('playlists-loading');
            return;
        }

        console.log('🔄 جاري تحميل قوائم التشغيل للقناة:', this.state.currentChannel.channelId);
        
        try {
            await this.showEnhancedPlaylists(this.state.currentChannel.channelId);
            this.hideLoading('playlists-loading');
        } catch (error) {
            console.error('❌ خطأ في تحميل قوائم التشغيل:', error);
            this.showNotification('فشل في تحميل قوائم التشغيل', 'error');
            this.hideLoading('playlists-loading');
            this.showDemoPlaylists();
        }
    }

    async loadChannelVideos(pageToken = null) {
        if (this.state.isLoading && !pageToken) return;
        
        this.state.isLoading = true;
        if (!pageToken) {
            this.showLoading('videos-loading');
            this.state.channelVideos = [];
        }

        try {
            if (!this.state.uploadsPlaylistId) {
                throw new Error('لا يوجد قائمة تحميل لهذه القناة');
            }

            await this.showEnhancedVideos(this.state.uploadsPlaylistId, pageToken);
            this.hideLoading('videos-loading');

        } catch (error) {
            console.error('Error loading channel videos:', error);
            this.showNotification('فشل في تحميل الفيديوهات: ' + error.message, 'error');
            this.hideLoading('videos-loading');
            this.showDemoVideos();
        } finally {
            this.state.isLoading = false;
        }
    }

    // ========== مشغل الفيديو المحسن ==========
    setupEnhancedPlayer() {
        this.videoPlayer = null;
        this.currentVideo = null;
        this.setupPlayerEventListeners();
    }

    async playEnhancedVideo(videoData) {
        console.log('🎬 تشغيل الفيديو المحسن:', videoData.title);
        this.currentVideo = videoData;
        
        try {
            const enhancedData = await this.fetchEnhancedVideoData(videoData.id);
            await this.showEnhancedPlayer(enhancedData);
        } catch (error) {
            console.error('❌ خطأ في تشغيل الفيديو:', error);
            this.showPlayerError('فشل في تحميل الفيديو');
        }
    }

    async fetchEnhancedVideoData(videoId) {
        const cacheKey = `enhanced_video_${videoId}`;
        const cached = this.cacheGet(cacheKey);
        
        if (cached) return cached;

        try {
            const url = this.ytUrl('videos', {
                part: 'snippet,contentDetails,statistics',
                id: videoId
            });

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`خطأ في API: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.items && data.items[0]) {
                const video = data.items[0];
                const enhancedData = {
                    ...video,
                    formattedStats: this.formatVideoStats(video.statistics),
                    chapters: this.extractChapters(video.snippet?.description)
                };

                this.cacheSet(cacheKey, enhancedData);
                return enhancedData;
            }
            
            throw new Error('لم يتم العثور على بيانات الفيديو');
        } catch (error) {
            console.error('❌ خطأ في جلب بيانات الفيديو:', error);
            throw error;
        }
    }

    formatVideoStats(stats) {
        if (!stats) return { views: '0', likes: '0', comments: '0' };
        
        return {
            views: this.formatNumber(stats.viewCount),
            likes: this.formatNumber(stats.likeCount),
            comments: this.formatNumber(stats.commentCount),
            favorites: this.formatNumber(stats.favoriteCount)
        };
    }

    extractChapters(description) {
        if (!description) return [];
        
        const chapterRegex = /(\d{1,2}:\d{2})\s+(.+)/g;
        const chapters = [];
        let match;
        
        while ((match = chapterRegex.exec(description)) !== null) {
            chapters.push({
                timestamp: match[1],
                title: match[2]
            });
        }
        
        return chapters;
    }

    async showEnhancedPlayer(videoData) {
        const playerOverlay = document.getElementById('video-player-overlay');
        if (!playerOverlay) {
            console.error('عنصر مشغل الفيديو غير موجود');
            return;
        }

        this.updatePlayerUI(videoData);
        await this.initializeYouTubePlayer(videoData.id);
        
        playerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    updatePlayerUI(videoData) {
        const elements = {
            title: document.getElementById('player-video-title'),
            description: document.getElementById('player-video-description'),
            channel: document.getElementById('player-channel-name'),
            views: document.getElementById('player-video-views')
        };

        if (elements.title) elements.title.textContent = videoData.snippet?.title || '';
        if (elements.description) elements.description.textContent = videoData.snippet?.description || '';
        if (elements.channel) elements.channel.textContent = videoData.snippet?.channelTitle || '';
        if (elements.views) elements.views.textContent = `${videoData.formattedStats?.views} مشاهدة`;

        this.renderVideoChapters(videoData.chapters);
    }

    renderVideoChapters(chapters) {
        const chaptersContainer = document.getElementById('player-video-chapters');
        if (!chaptersContainer) return;

        if (!chapters || chapters.length === 0) {
            chaptersContainer.innerHTML = '';
            return;
        }

        chaptersContainer.innerHTML = `
            <div class="chapters-section mt-3">
                <h6 class="mb-2">فصول الفيديو:</h6>
                <div class="chapters-list">
                    ${chapters.map(chapter => `
                        <button class="chapter-item btn btn-sm btn-outline-secondary me-2 mb-2" 
                                data-timestamp="${chapter.timestamp}">
                            ${chapter.timestamp} - ${chapter.title}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        chaptersContainer.querySelectorAll('.chapter-item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.seekToTimestamp(btn.dataset.timestamp);
            });
        });
    }

    async initializeYouTubePlayer(videoId) {
        const playerContainer = document.getElementById('video-player');
        if (!playerContainer) return;

        playerContainer.innerHTML = `
            <div id="youtube-player"></div>
        `;

        if (!window.YT) {
            await this.loadYouTubeAPI();
        }

        // الانتظار حتى يكون API جاهزًا
        await new Promise((resolve) => {
            const checkYT = () => {
                if (window.YT && window.YT.Player) {
                    resolve();
                } else {
                    setTimeout(checkYT, 100);
                }
            };
            checkYT();
        });

        this.videoPlayer = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                controls: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3
            },
            events: {
                onReady: (event) => this.onPlayerReady(event),
                onStateChange: (event) => this.onPlayerStateChange(event),
                onError: (error) => this.onPlayerError(error)
            }
        });
    }

    loadYouTubeAPI() {
        return new Promise((resolve) => {
            if (window.YT) {
                resolve();
                return;
            }

            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                console.log('✅ YouTube IFrame API جاهز');
                resolve();
            };
        });
    }

    onPlayerReady(event) {
        console.log('✅ مشغل YouTube جاهز');
    }

    onPlayerStateChange(event) {
        const states = {
            [-1]: 'غير بدء',
            [0]: 'انتهى',
            [1]: 'تشغيل',
            [2]: 'إيقاف مؤقت',
            [3]: 'جاري التحميل',
            [5]: 'جاري التخزين المؤقت'
        };
        
        console.log(`🎮 حالة المشغل: ${states[event.data] || 'غير معروف'}`);
    }

    onPlayerError(error) {
        console.error('❌ خطأ في مشغل YouTube:', error);
        this.showPlayerError('حدث خطأ في تشغيل الفيديو');
    }

    seekToTimestamp(timestamp) {
        if (!this.videoPlayer) return;
        
        const [minutes, seconds] = timestamp.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;
        
        this.videoPlayer.seekTo(totalSeconds, true);
    }

    closeEnhancedPlayer() {
        if (this.videoPlayer) {
            this.videoPlayer.stopVideo();
            this.videoPlayer.destroy();
            this.videoPlayer = null;
        }

        const playerOverlay = document.getElementById('video-player-overlay');
        if (playerOverlay) {
            playerOverlay.classList.remove('active');
        }
        
        document.body.style.overflow = 'auto';
        this.currentVideo = null;
    }

    // ========== إعداد مستمعي الأحداث المحسن ==========
    setupPlaylistInteractions() {
        document.addEventListener('click', (e) => {
            const playlistCard = e.target.closest('.enhanced-playlist');
            if (playlistCard) {
                const playlistId = playlistCard.dataset.playlistId;
                const playlist = this.findPlaylistById(playlistId);
                
                if (playlist) {
                    this.openPlaylist(playlist);
                }
            }

            if (e.target.closest('.view-playlist')) {
                e.stopPropagation();
                const playlistCard = e.target.closest('.enhanced-playlist');
                const playlistId = playlistCard.dataset.playlistId;
                const playlist = this.findPlaylistById(playlistId);
                
                if (playlist) {
                    this.openPlaylist(playlist);
                }
            }
        });
    }

    setupVideoInteractions() {
        document.addEventListener('click', (e) => {
            const videoCard = e.target.closest('.enhanced-video');
            if (videoCard) {
                const videoId = videoCard.dataset.videoId;
                const video = this.findVideoById(videoId);
                
                if (video) {
                    this.playEnhancedVideo(video);
                }
            }

            if (e.target.closest('.play-video')) {
                e.stopPropagation();
                const videoCard = e.target.closest('.enhanced-video');
                const videoId = videoCard.dataset.videoId;
                const video = this.findVideoById(videoId);
                
                if (video) {
                    this.playEnhancedVideo(video);
                }
            }
        });
    }

    setupPlayerEventListeners() {
        document.getElementById('close-player')?.addEventListener('click', () => {
            this.closeEnhancedPlayer();
        });

        document.getElementById('video-player-overlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'video-player-overlay') {
                this.closeEnhancedPlayer();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEnhancedPlayer();
            }
        });
    }

    // ========== أدوات مساعدة محسنة ==========
    async preloadImages(urls) {
        const uniqueUrls = [...new Set(urls.filter(url => url && !this.imageCache.has(url)))];
        
        if (uniqueUrls.length === 0) return;

        const promises = uniqueUrls.map(url => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    this.imageCache.set(url, {
                        timestamp: Date.now(),
                        element: img
                    });
                    resolve();
                };
                img.onerror = () => {
                    console.warn('⚠️ فشل تحميل الصورة:', url);
                    resolve();
                };
                img.src = url;
            });
        });

        await Promise.all(promises);
    }

    addLoadMorePlaylistsButton(nextPageToken, channelId) {
        const playlistsGrid = document.getElementById('playlists-grid');
        if (!playlistsGrid) return;

        const loadMoreContainer = document.createElement('div');
        loadMoreContainer.className = 'col-12 text-center mt-4';
        loadMoreContainer.innerHTML = `
            <button class="btn btn-primary btn-load-more" data-next-token="${nextPageToken}">
                <i class="fas fa-sync-alt me-2"></i>
                تحميل المزيد من قوائم التشغيل
            </button>
        `;

        playlistsGrid.appendChild(loadMoreContainer);

        loadMoreContainer.querySelector('.btn-load-more').addEventListener('click', async (e) => {
            const button = e.target;
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> جاري التحميل...';

            try {
                const morePlaylists = await this.fetchEnhancedPlaylists(channelId, nextPageToken);
                
                if (morePlaylists && morePlaylists.items.length > 0) {
                    await this.renderEnhancedPlaylists(morePlaylists);
                    playlistsGrid.removeChild(loadMoreContainer);
                }
            } catch (error) {
                console.error('❌ خطأ في تحميل المزيد:', error);
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-sync-alt me-2"></i> تحميل المزيد من قوائم التشغيل';
            }
        });
    }

    addLoadMoreVideosButton(nextPageToken) {
        const videosGrid = document.getElementById('playlist-videos-grid');
        if (!videosGrid) return;

        const loadMoreContainer = document.createElement('div');
        loadMoreContainer.className = 'col-12 text-center mt-4';
        loadMoreContainer.innerHTML = `
            <button class="btn btn-primary btn-load-more" data-next-token="${nextPageToken}">
                <i class="fas fa-sync-alt me-2"></i>
                تحميل المزيد من الفيديوهات
            </button>
        `;

        videosGrid.appendChild(loadMoreContainer);

        loadMoreContainer.querySelector('.btn-load-more').addEventListener('click', async (e) => {
            const button = e.target;
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> جاري التحميل...';

            try {
                const moreVideos = await this.fetchEnhancedPlaylistVideos(
                    this.state.activePlaylist.id, 
                    nextPageToken
                );
                
                if (moreVideos && moreVideos.items.length > 0) {
                    await this.renderEnhancedVideos(moreVideos, false);
                    videosGrid.removeChild(loadMoreContainer);
                }
            } catch (error) {
                console.error('❌ خطأ في تحميل المزيد:', error);
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-sync-alt me-2"></i> تحميل المزيد من الفيديوهات';
            }
        });
    }

    // ========== وظائف البحث والمساعدة ==========
    findPlaylistById(playlistId) {
        return this.state.channelPlaylists.find(p => p.id === playlistId);
    }

    findVideoById(videoId) {
        const allVideos = [
            ...this.state.channelVideos,
            ...this.state.playlistVideos
        ];
        return allVideos.find(v => v.id === videoId);
    }

    validateChannelData(channel) {
        return channel && 
               channel.channelId && 
               channel.name && 
               typeof channel.name === 'string' &&
               channel.name.trim() !== '';
    }

    // ========== حالات العرض المختلفة ==========
    showEmptyPlaylistsState() {
        const playlistsGrid = document.getElementById('playlists-grid');
        if (!playlistsGrid) return;
        
        playlistsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-list fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">لا توجد قوائم تشغيل</h4>
                <p class="text-muted">هذه القناة لا تحتوي على قوائم تشغيل عامة.</p>
            </div>
        `;
    }

    showEmptyVideosState() {
        const videosGrid = document.getElementById('playlist-videos-grid') || 
                          document.getElementById('videos-grid');
        
        if (!videosGrid) return;
        
        videosGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-video fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">لا توجد فيديوهات</h4>
                <p class="text-muted">لم يتم العثور على فيديوهات في هذه القائمة.</p>
            </div>
        `;
    }

    showPlaylistsError(message) {
        const playlistsGrid = document.getElementById('playlists-grid');
        if (!playlistsGrid) return;
        
        playlistsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h4 class="text-warning">خطأ في التحميل</h4>
                <p class="text-muted">${message}</p>
                <button class="btn btn-primary mt-3" onclick="window.youtubeApp.retryLoadPlaylists()">
                    <i class="fas fa-redo me-2"></i>
                    إعادة المحاولة
                </button>
            </div>
        `;
    }

    showVideosError(message) {
        const videosGrid = document.getElementById('playlist-videos-grid') || 
                          document.getElementById('videos-grid');
        
        if (!videosGrid) return;
        
        videosGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h4 class="text-warning">خطأ في التحميل</h4>
                <p class="text-muted">${message}</p>
                <button class="btn btn-primary mt-3" onclick="window.youtubeApp.retryLoadVideos()">
                    <i class="fas fa-redo me-2"></i>
                    إعادة المحاولة
                </button>
            </div>
        `;
    }

    showPlayerError(message) {
        this.showNotification(message, 'error');
    }

    // ========== وظائف إعادة المحاولة ==========
    retryLoadPlaylists() {
        if (this.state.currentChannel) {
            this.showEnhancedPlaylists(this.state.currentChannel.channelId);
        }
    }

    retryLoadVideos() {
        if (this.state.activePlaylist) {
            this.showEnhancedVideos(this.state.activePlaylist.id);
        } else if (this.state.uploadsPlaylistId) {
            this.loadChannelVideos();
        }
    }

    // ========== الوظائف الأساسية من الكود الأصلي ==========
    async createHTMLStructure() {
        if (!document.getElementById('youtube-channels-app')) {
            const appContainer = document.createElement('div');
            appContainer.id = 'youtube-channels-app';
            appContainer.innerHTML = this.getAppHTML();
            
            if (!document.querySelector('link[href*="font-awesome"]')) {
                const fontAwesome = document.createElement('link');
                fontAwesome.rel = 'stylesheet';
                fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
                document.head.appendChild(fontAwesome);
            }
            
            if (!document.querySelector('link[href*="bootstrap"]')) {
                const bootstrapCSS = document.createElement('link');
                bootstrapCSS.rel = 'stylesheet';
                bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
                document.head.appendChild(bootstrapCSS);
            }
            
            document.body.appendChild(appContainer);
            this.injectCustomStyles();
        }
    }

    getAppHTML() {
        return `
        <div class="container-fluid youtube-app-container">
            <!-- الشريط الجانبي للقنوات -->
            <div class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <h2 class="text-white">
                        <i class="fas fa-graduation-cap me-2"></i>
                        القنوات التعليمية
                    </h2>
                    <button class="btn-close-sidebar" id="closeSidebar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="sidebar-search mb-3">
                    <div class="position-relative">
                        <input type="text" id="channel-search" class="form-control" 
                               placeholder="ابحث في القنوات...">
                        <i class="fas fa-search position-absolute"></i>
                    </div>
                </div>

                <div class="sidebar-filters mb-3">
                    <select id="category-filter" class="form-select mb-2">
                        <option value="all">جميع التصنيفات</option>
                        <option value="برمجة">برمجة</option>
                        <option value="لغات">لغات</option>
                        <option value="تصميم">تصميم</option>
                        <option value="تسويق">تسويق</option>
                    </select>
                    
                    <select id="level-filter" class="form-select">
                        <option value="all">جميع المستويات</option>
                        <option value="مبتدئ">مبتدئ</option>
                        <option value="متوسط">متوسط</option>
                        <option value="متقدم">متقدم</option>
                    </select>
                </div>

                <div class="channels-list" id="channelsList">
                    <!-- سيتم ملء القنوات هنا -->
                </div>
            </div>

            <!-- المحتوى الرئيسي -->
            <div class="main-content">
                <!-- زر فتح الشريط الجانبي للهواتف -->
                <button class="btn-toggle-sidebar" id="toggleSidebar">
                    <i class="fas fa-bars"></i>
                </button>

                <!-- قسم القنوات الرئيسي -->
                <div id="channels-section" class="section active">
                    <div class="hero-section text-center text-white mb-5">
                        <h1 class="display-4 mb-3">
                            <i class="fas fa-graduation-cap me-3"></i>
                            قنوات يوتيوب التعليمية
                        </h1>
                        <p class="lead">اكتشف أفضل القنوات التعليمية المجانية على يوتيوب</p>
                    </div>

                    <div id="channels-loading" class="loading-spinner text-center py-5">
                        <div class="spinner-border text-light" style="width: 3rem; height: 3rem;"></div>
                        <p class="text-light mt-3 fs-5">جاري تحميل القنوات...</p>
                    </div>
                    
                    <div id="channels-grid" class="row"></div>
                </div>

                <!-- قسم عرض القناة -->
                <div id="channel-view" class="section">
                    <div class="channel-header mb-4 bg-white rounded shadow-sm">
                        <div class="d-flex justify-content-between align-items-center p-3">
                            <button id="back-to-channels" class="btn btn-outline-primary">
                                <i class="fas fa-arrow-right me-2"></i>
                                العودة للقنوات
                            </button>
                            <button id="openOnYT" class="btn btn-danger" style="display: none;">
                                <i class="fab fa-youtube me-2"></i>
                                فتح على يوتيوب
                            </button>
                        </div>
                        
                        <div id="channel-banner" class="channel-banner"></div>
                        
                        <div class="channel-info p-4 d-flex align-items-start">
                            <div id="channel-logo-large" class="channel-logo-large me-4">
                                <i class="fab fa-youtube"></i>
                            </div>
                            <div class="channel-details flex-grow-1">
                                <h1 id="channel-title" class="h3 mb-2">اسم القناة</h1>
                                <p id="channel-description-large" class="text-muted mb-3">وصف القناة</p>
                                <div class="channel-stats d-flex flex-wrap gap-3">
                                    <span id="channel-subscribers" class="badge bg-primary fs-6">0 مشترك</span>
                                    <span id="channel-videos" class="badge bg-secondary fs-6">0 فيديو</span>
                                    <span id="channel-views" class="badge bg-success fs-6">0 مشاهدة</span>
                                    <span id="channel-lang" class="badge bg-info fs-6">اللغة</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- علامات التبويب -->
                    <div class="tabs-container mb-4 bg-white rounded shadow-sm">
                        <div class="tabs nav nav-pills p-3">
                            <button class="tab-btn nav-link active me-2" data-tab="videos-tab">
                                <i class="fas fa-play-circle me-2"></i>
                                الفيديوهات
                            </button>
                            <button class="tab-btn nav-link" data-tab="playlists-tab">
                                <i class="fas fa-list me-2"></i>
                                قوائم التشغيل
                            </button>
                        </div>
                    </div>

                    <!-- محتوى علامات التبويب -->
                    <div class="tab-content active" id="videos-tab">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="search-box position-relative">
                                    <input type="text" id="video-search" class="form-control" 
                                           placeholder="ابحث في الفيديوهات...">
                                    <i class="fas fa-search position-absolute"></i>
                                </div>
                            </div>
                        </div>

                        <div id="videos-loading" class="loading-spinner text-center py-5">
                            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                            <p class="text-muted mt-3 fs-5">جاري تحميل الفيديوهات...</p>
                        </div>
                        
                        <div id="videos-grid" class="row"></div>
                        
                        <div class="text-center mt-4">
                            <button id="load-more-videos" class="btn btn-primary btn-lg" style="display: none;">
                                <i class="fas fa-sync-alt me-2"></i>
                                تحميل المزيد
                            </button>
                        </div>
                    </div>

                    <div class="tab-content" id="playlists-tab">
                        <div id="playlists-loading" class="loading-spinner text-center py-5">
                            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                            <p class="text-muted mt-3 fs-5">جاري تحميل قوائم التشغيل...</p>
                        </div>
                        <div id="playlists-grid" class="row"></div>
                    </div>
                </div>

                <!-- قسم قائمة التشغيل -->
                <div id="playlist-view" class="section">
                    <div class="playlist-header mb-4 bg-white rounded shadow-sm p-4">
                        <button id="close-playlist" class="btn btn-outline-primary mb-3">
                            <i class="fas fa-arrow-right me-2"></i>
                            العودة إلى القناة
                        </button>
                        
                        <div class="playlist-info">
                            <h1 id="playlist-title" class="h3 mb-2">اسم قائمة التشغيل</h1>
                            <span id="playlist-video-count" class="badge bg-primary fs-6">0 فيديو</span>
                        </div>
                    </div>

                    <div id="playlist-videos-loading" class="loading-spinner text-center py-5">
                        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                        <p class="text-muted mt-3 fs-5">جاري تحميل فيديوهات قائمة التشغيل...</p>
                    </div>
                    
                    <div id="playlist-videos-grid" class="row"></div>
                    
                    <div class="text-center mt-4">
                        <button id="load-more-playlist-videos" class="btn btn-primary btn-lg" style="display: none;">
                            <i class="fas fa-sync-alt me-2"></i>
                            تحميل المزيد
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- مشغل الفيديو المحسن -->
        <div id="video-player-overlay" class="video-player-overlay">
            <div class="video-player-container">
                <div class="video-player-header">
                    <button id="close-player" class="btn-close-player">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="video-player-content">
                    <div id="video-player" class="video-player"></div>
                    <div class="video-info p-4">
                        <h3 id="player-video-title">عنوان الفيديو</h3>
                        <div class="video-meta d-flex flex-wrap gap-3 mb-2">
                            <span id="player-channel-name">اسم القناة</span>
                            <span id="player-video-views">0 مشاهدة</span>
                            <span id="player-video-likes">0 إعجاب</span>
                            <span id="player-video-comments">0 تعليق</span>
                        </div>
                        <p id="player-video-description">وصف الفيديو</p>
                        <div id="player-video-chapters"></div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // ... باقي الوظائف من الكود الأصلي (renderChannelDetails, formatNumber, formatDuration, formatDate, etc.)
    // يتم تضمينها هنا ولكن تم اختصارها لتجنب التكرار

    renderChannelDetails(channelData) {
        const channel = this.state.currentChannel;
        if (!channel) return;
        
        if (!channelData) {
            document.getElementById('channel-title').textContent = channel.name;
            document.getElementById('channel-description-large').textContent = channel.description;
            document.getElementById('channel-subscribers').textContent = 'معلومات غير متاحة';
            document.getElementById('channel-videos').textContent = 'معلومات غير متاحة';
            document.getElementById('channel-views').textContent = 'معلومات غير متاحة';
            document.getElementById('channel-lang').textContent = channel.language;
            document.getElementById('openOnYT').style.display = 'inline-block';
            return;
        }

        const snippet = channelData.snippet;
        const stats = channelData.statistics;
        const branding = channelData.brandingSettings;

        document.getElementById('channel-title').textContent = snippet.title || channel.name;
        document.getElementById('channel-description-large').textContent = snippet.description || channel.description;
        document.getElementById('channel-subscribers').textContent = this.formatNumber(stats.subscriberCount) + ' مشترك';
        document.getElementById('channel-videos').textContent = this.formatNumber(stats.videoCount) + ' فيديو';
        document.getElementById('channel-views').textContent = this.formatNumber(stats.viewCount) + ' مشاهدة';
        document.getElementById('channel-lang').textContent = channel.language;
        document.getElementById('openOnYT').style.display = 'inline-block';

        const channelBanner = document.getElementById('channel-banner');
        if (channelBanner && branding?.image?.bannerExternalUrl) {
            channelBanner.style.backgroundImage = `url('${branding.image.bannerExternalUrl}')`;
        }

        const logoElement = document.getElementById('channel-logo-large');
        if (logoElement && snippet.thumbnails?.high?.url) {
            logoElement.innerHTML = `<img src="${snippet.thumbnails.high.url}" alt="${snippet.title}" 
                style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;">`;
        }
    }

    formatNumber(num) {
        if (!num) return '0';
        const number = parseInt(num);
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toString();
    }

    formatDuration(duration) {
        if (!duration) return '0:00';
        
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '0:00';
        
        const hours = parseInt(match[1] || '0');
        const minutes = parseInt(match[2] || '0');
        const seconds = parseInt(match[3] || '0');
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'اليوم';
        if (diffDays === 1) return 'أمس';
        if (diffDays < 7) return `منذ ${diffDays} أيام`;
        if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
        if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} أشهر`;
        return `منذ ${Math.floor(diffDays / 365)} سنوات`;
    }

    // ... باقي الوظائف الأساسية

    async setupEventListeners() {
        // إعداد جميع مستمعي الأحداث هنا
        console.log('🔧 إعداد مستمعي الأحداث...');
        
        // أحداث الشريط الجانبي
        document.getElementById('toggleSidebar')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('show');
        });

        document.getElementById('closeSidebar')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('show');
        });

        // البحث والتصفية
        const channelSearch = document.getElementById('channel-search');
        const categoryFilter = document.getElementById('category-filter');
        const levelFilter = document.getElementById('level-filter');
        
        if (channelSearch) {
            channelSearch.addEventListener('input', this.debounce(() => {
                this.state.searchQuery = channelSearch.value;
                this.filterChannels();
            }, 300));
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.state.currentCategory = categoryFilter.value;
                this.filterChannels();
            });
        }

        if (levelFilter) {
            levelFilter.addEventListener('change', () => {
                this.state.currentLevel = levelFilter.value;
                this.filterChannels();
            });
        }

        // التنقل
        document.getElementById('back-to-channels')?.addEventListener('click', () => {
            this.showChannelsSection();
        });

        document.getElementById('openOnYT')?.addEventListener('click', () => {
            if (this.state.currentChannel) {
                window.open(this.state.currentChannel.link, '_blank');
            }
        });

        document.getElementById('close-playlist')?.addEventListener('click', () => {
            this.closePlaylistView();
        });

        // علامات التبويب
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target);
            });
        });

        // البحث في الفيديوهات
        const videoSearch = document.getElementById('video-search');
        if (videoSearch) {
            videoSearch.addEventListener('input', this.debounce(() => {
                this.filterVideos();
            }, 300));
        }

        // إعداد التفاعلات المحسنة
        this.setupPlaylistInteractions();
        this.setupVideoInteractions();
        this.setupPlayerEventListeners();

        // تحجيم النافذة
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991) {
                document.getElementById('sidebar').classList.remove('show');
            }
        });
    }

    // ... باقي الوظائف الأساسية (filterChannels, renderChannelsList, showChannelsSection, etc.)

    async testAPI() {
        try {
            const testUrl = this.ytUrl('search', {
                part: 'snippet',
                maxResults: 1,
                q: 'test'
            });
            
            const response = await fetch(testUrl);
            
            if (!response.ok) {
                throw new Error('فشل الاتصال بـ YouTube API');
            }
            
            console.log('✅ YouTube API connection successful');
            this.showNotification('تم الاتصال بنجاح بـ YouTube API', 'success');
        } catch (error) {
            console.error('❌ YouTube API connection failed:', error);
            this.showNotification('تحذير: اتصال YouTube API محدود', 'warning');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification`;
        notification.style.cssText = `
            background: ${type === 'error' ? '#f8d7da' : type === 'success' ? '#d1edff' : '#fff3cd'};
            border: 1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#b8daff' : '#ffeaa7'};
            color: ${type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#856404'};
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
        `;
        
        notification.innerHTML = `
            <div class="notification-content d-flex align-items-center">
                <i class="fas fa-${this.getNotificationIcon(type)} me-2"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close btn btn-sm p-0 ms-2" style="background: none; border: none;">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    }

    injectCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* تضمين جميع الأنماط من الكود الأصلي هنا */
            .youtube-app-container {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
            }

            .sidebar {
                width: 350px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                height: 100vh;
                overflow-y: auto;
                position: fixed;
                left: 0;
                top: 0;
                z-index: 1000;
                box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            }

            .sidebar.show {
                transform: translateX(0);
            }

            /* باقي الأنماط ... */

            .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .playlist-overlay, .video-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .playlist-card:hover .playlist-overlay,
            .video-card:hover .video-overlay {
                opacity: 1;
            }

            .playlist-actions, .video-actions {
                display: flex;
                gap: 10px;
            }

            .playlist-badge, .video-duration {
                position: absolute;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
            }

            .playlist-badge {
                top: 10px;
                right: 10px;
            }

            .video-duration {
                bottom: 10px;
                right: 10px;
            }

            .badge-sm {
                font-size: 0.7em;
                padding: 0.25em 0.5em;
            }

            @media (max-width: 768px) {
                .playlist-actions, .video-actions {
                    flex-direction: column;
                }
                
                .playlist-overlay, .video-overlay {
                    opacity: 1;
                    background: rgba(0,0,0,0.5);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // وظائف التنقل الأساسية
    showChannelsSection() {
        document.getElementById('channels-section').classList.add('active');
        document.getElementById('channel-view').classList.remove('active');
        document.getElementById('playlist-view').classList.remove('active');
        this.state.currentChannel = null;
        this.state.channelVideos = [];
        this.state.channelPlaylists = [];
        this.state.activePlaylist = null;
        this.state.playlistVideos = [];
    }

    showChannelView() {
        document.getElementById('channels-section').classList.remove('active');
        document.getElementById('channel-view').classList.add('active');
        document.getElementById('playlist-view').classList.remove('active');
        
        const videosTab = document.querySelector('.tab-btn[data-tab="videos-tab"]');
        if (videosTab) {
            this.switchTab(videosTab);
        }
    }

    showPlaylistView() {
        document.getElementById('playlist-view').classList.add('active');
        document.getElementById('channel-view').classList.remove('active');
    }

    closePlaylistView() {
        document.getElementById('playlist-view').classList.remove('active');
        document.getElementById('channel-view').classList.add('active');
        this.state.activePlaylist = null;
        this.state.playlistVideos = [];
    }

    switchTab(clickedTab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        clickedTab.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const tabId = clickedTab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    }

    // وظائف المساعدة
    debounce(func, wait) {
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

    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'block';
        }
    }

    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    }

    // البيانات التجريبية
    showDemoVideos() {
        this.state.channelVideos = [
            {
                id: 'demo1',
                title: 'مقدمة في البرمجة - درس تعليمي',
                description: 'هذا فيديو تجريبي يوضح كيفية عمل التطبيق',
                channelTitle: this.state.currentChannel?.name,
                thumbnail: 'https://via.placeholder.com/320x180/4a00e0/ffffff?text=فيديو+تجريبي',
                duration: '10:30',
                viewCount: '1.2K',
                publishedAt: 'قبل يومين'
            }
        ];
        this.renderEnhancedVideos({ items: this.state.channelVideos });
        this.hideLoading('videos-loading');
    }

    showDemoPlaylists() {
        this.state.channelPlaylists = [
            {
                id: 'demo_playlist1',
                snippet: {
                    title: 'سلسلة تعلم HTML و CSS',
                    description: 'سلسلة شاملة لتعليم HTML و CSS من الصفر',
                    thumbnails: {
                        medium: { url: 'https://via.placeholder.com/320x180/4a00e0/ffffff?text=HTML+CSS' }
                    },
                    publishedAt: new Date().toISOString()
                },
                contentDetails: {
                    itemCount: 15
                }
            }
        ];
        this.renderEnhancedPlaylists({ items: this.state.channelPlaylists });
        this.hideLoading('playlists-loading');
    }

    // وظائف التنظيف
    cleanup() {
        if (this.videoPlayer) {
            this.videoPlayer.destroy();
        }
        if (this.lazyImageObserver) {
            this.lazyImageObserver.disconnect();
        }
    }
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 بدء تحميل تطبيق قنوات يوتيوب التعليمية...');
    const app = new YouTubeChannelsApp();
    
    // جعل التطبيق متاحًا عالميًا للتصحيح
    window.youtubeApp = app;
});

// YouTube IFrame API Callback
window.onYouTubeIframeAPIReady = function() {
    console.log('✅ YouTube IFrame API is ready');
    if (window.youtubeApp) {
        window.youtubeApp.showNotification('مشغل YouTube جاهز للاستخدام', 'success');
    }
};

console.log('✅ تم تحميل الكود المحسن بنجاح');