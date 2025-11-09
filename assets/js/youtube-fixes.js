// youtube-fixes.js - إصلاحات إضافية لمشاكل التجميد وعرض قوائم التشغيل
class YouTubeFixes {
    constructor(app) {
        this.app = app;
        this.initFixes();
    }

    initFixes() {
        console.log('🔧 تهيئة إصلاحات التجميد وعرض قوائم التشغيل...');
        this.applyNavigationFixes();
        this.applyPlaylistsFixes();
        this.applyPerformanceFixes();
        this.applyErrorHandlingFixes();
    }

    // ========== إصلاحات التنقل والتجميد ==========
    applyNavigationFixes() {
        console.log('🔄 تطبيق إصلاحات التنقل...');

        // إصلاح زر العودة إلى القنوات
        this.fixBackButton();
        
        // إصلاح تجميد الواجهة
        this.preventUIFreeze();
        
        // إصلاح التنقل بين التبويبات
        this.fixTabsNavigation();
    }

    fixBackButton() {
        const originalShowChannelsSection = this.app.showChannelsSection.bind(this.app);
        
        this.app.showChannelsSection = () => {
            console.log('🔙 العودة إلى القنوات...');
            
            // إعادة تعيين حالة التحميل
            this.app.state.isLoading = false;
            this.app.state.isLoadingMore = false;
            
            // إخفاء جميع شاشات التحميل
            this.hideAllLoaders();
            
            // إلغاء أي طلبات pending
            this.cancelPendingRequests();
            
            // استدعاء الوظيفة الأصلية
            originalShowChannelsSection();
            
            // إعادة تمكين الأزرار
            this.enableAllButtons();
            
            console.log('✅ تم العودة إلى القنوات بنجاح');
        };
    }

    hideAllLoaders() {
        const loaderIds = [
            'videos-loading',
            'playlists-loading', 
            'playlist-videos-loading',
            'channels-loading'
        ];
        
        loaderIds.forEach(id => {
            const loader = document.getElementById(id);
            if (loader) {
                loader.style.display = 'none';
            }
        });
    }

    cancelPendingRequests() {
        // يمكن إضافة إلغاء طلبات fetch هنا إذا كان ذلك ممكناً
        console.log('🚫 إلغاء أي طلبات معلقة...');
    }

    enableAllButtons() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = false;
        });
    }

    preventUIFreeze() {
        // منع التجميد خلال العمليات الثقيلة
        const originalOpenChannel = this.app.openChannel.bind(this.app);
        
        this.app.openChannel = async (channel) => {
            console.log('🎯 فتح القناة مع منع التجميد...');
            
            // تمكين زر العودة فوراً
            this.enableBackButton();
            
            // إظهار واجهة القناة فوراً
            this.app.showChannelView();
            
            // إعادة تعيين الحالة
            this.app.state.channelVideos = [];
            this.app.state.channelPlaylists = [];
            
            try {
                await originalOpenChannel(channel);
            } catch (error) {
                console.error('❌ خطأ في فتح القناة:', error);
                this.app.showNotification('فشل في تحميل بيانات القناة', 'error');
            }
        };
    }

    enableBackButton() {
        const backButton = document.getElementById('back-to-channels');
        if (backButton) {
            backButton.disabled = false;
            backButton.innerHTML = '<i class="fas fa-arrow-right me-2"></i> العودة للقنوات';
        }
    }

    fixTabsNavigation() {
        // إصلاح التنقل بين التبويبات
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn') || e.target.closest('.tab-btn')) {
                const tabBtn = e.target.matches('.tab-btn') ? e.target : e.target.closest('.tab-btn');
                setTimeout(() => {
                    this.app.switchTab(tabBtn);
                }, 50);
            }
        });
    }

    // ========== إصلاحات قوائم التشغيل ==========
    applyPlaylistsFixes() {
        console.log('📋 تطبيق إصلاحات قوائم التشغيل...');

        // إصلاح تحميل قوائم التشغيل
        this.fixPlaylistsLoading();
        
        // إصلاح عرض قوائم التشغيل
        this.fixPlaylistsRendering();
        
        // إصلاح البيانات التجريبية
        this.fixDemoPlaylists();
    }

    fixPlaylistsLoading() {
        const originalLoadChannelPlaylists = this.app.loadChannelPlaylists.bind(this.app);
        
        this.app.loadChannelPlaylists = async () => {
            console.log('🔄 تحميل قوائم التشغيل مع الإصلاحات...');
            
            if (!this.app.state.currentChannel || !this.app.state.currentChannel.channelId) {
                console.error('❌ لا توجد قناة محددة');
                this.app.hideLoading('playlists-loading');
                this.showPlaylistsError('لا توجد قناة محددة');
                return;
            }

            this.app.showLoading('playlists-loading');
            
            try {
                // محاولة التحقق من صحة معرف القناة أولاً
                const channelId = this.app.state.currentChannel.channelId;
                console.log('🔍 التحقق من معرف القناة:', channelId);
                
                if (!this.isValidChannelId(channelId)) {
                    throw new Error('معرف القناة غير صالح');
                }

                // استخدام طريقة محسنة لجلب البيانات
                const playlistsData = await this.fetchPlaylistsWithFallback(channelId);
                
                if (playlistsData && playlistsData.items && playlistsData.items.length > 0) {
                    console.log('✅ تم تحميل قوائم التشغيل:', playlistsData.items.length);
                    this.app.state.channelPlaylists = playlistsData.items;
                    await this.renderPlaylistsWithRetry();
                } else {
                    console.warn('⚠️ لا توجد قوائم تشغيل');
                    this.showNoPlaylistsMessage();
                }
                
                this.app.hideLoading('playlists-loading');
                
            } catch (error) {
                console.error('❌ خطأ في تحميل قوائم التشغيل:', error);
                this.app.hideLoading('playlists-loading');
                this.showPlaylistsError(error.message);
                this.showEnhancedDemoPlaylists();
            }
        };
    }

    isValidChannelId(channelId) {
        return channelId && channelId.startsWith('UC') && channelId.length >= 24;
    }

    async fetchPlaylistsWithFallback(channelId) {
        console.log('🌐 محاولة جلب قوائم التشغيل...');
        
        try {
            // المحاولة الأولى: استخدام API مباشرة
            const result = await this.app.fetchPlaylists(channelId);
            
            if (result && result.items) {
                return result;
            }
            
            // المحاولة الثانية: استخدام طريقة بديلة
            console.log('🔄 تجربة طريقة بديلة...');
            const alternativeResult = await this.fetchPlaylistsAlternative(channelId);
            
            if (alternativeResult) {
                return alternativeResult;
            }
            
            throw new Error('فشل في جلب قوائم التشغيل');
            
        } catch (error) {
            console.error('❌ فشل في جلب قوائم التشغيل:', error);
            throw error;
        }
    }

    async fetchPlaylistsAlternative(channelId) {
        try {
            // طريقة بديلة للبحث عن قوائم التشغيل
            const searchUrl = this.app.ytUrl('search', {
                part: 'snippet',
                channelId: channelId,
                type: 'playlist',
                maxResults: 20,
                order: 'date'
            });

            const response = await fetch(searchUrl);
            
            if (!response.ok) {
                throw new Error(`خطأ في البحث: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                // تحويل نتائج البحث إلى تنسيق قوائم التشغيل
                const playlists = data.items.map(item => ({
                    id: item.id.playlistId,
                    snippet: item.snippet,
                    contentDetails: { itemCount: 0 } // معلومات افتراضية
                }));

                return { items: playlists };
            }
            
            return null;
        } catch (error) {
            console.error('❌ فشل في الطريقة البديلة:', error);
            return null;
        }
    }

    async renderPlaylistsWithRetry() {
        const playlistsGrid = document.getElementById('playlists-grid');
        if (!playlistsGrid) {
            console.error('❌ عنصر قوائم التشغيل غير موجود');
            return;
        }

        let retryCount = 0;
        const maxRetries = 2;

        while (retryCount < maxRetries) {
            try {
                console.log(`🎨 محاولة عرض قوائم التشغيل (المحاولة ${retryCount + 1})...`);
                await this.renderPlaylistsSafely();
                console.log('✅ تم عرض قوائم التشغيل بنجاح');
                return;
            } catch (error) {
                retryCount++;
                console.error(`❌ فشل في عرض قوائم التشغيل (المحاولة ${retryCount}):`, error);
                
                if (retryCount >= maxRetries) {
                    throw error;
                }
                
                // الانتظار قبل إعادة المحاولة
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    async renderPlaylistsSafely() {
        const playlistsGrid = document.getElementById('playlists-grid');
        if (!playlistsGrid) return;

        // تنظيف الشبكة أولاً
        playlistsGrid.innerHTML = '';

        if (!this.app.state.channelPlaylists || this.app.state.channelPlaylists.length === 0) {
            this.showNoPlaylistsMessage();
            return;
        }

        // تجميع الصور قبل التحميل
        await this.preloadPlaylistThumbnails();

        // عرض قوائم التشغيل واحدة تلو الأخرى لمنع التجميد
        for (let i = 0; i < this.app.state.channelPlaylists.length; i++) {
            const playlist = this.app.state.channelPlaylists[i];
            const playlistElement = this.createStablePlaylistElement(playlist);
            
            if (playlistElement) {
                playlistsGrid.appendChild(playlistElement);
            }
            
            // إعطاء فرصة للمتصفح لمعالجة الواجهة
            if (i % 3 === 0) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }

        // إضافة التفاعلات بعد الانتهاء من العرض
        this.setupStablePlaylistInteractions();
    }

    async preloadPlaylistThumbnails() {
        const thumbnails = this.app.state.channelPlaylists
            .map(playlist => this.getPlaylistThumbnail(playlist))
            .filter(url => url);

        if (thumbnails.length > 0) {
            await this.app.preloadImages(thumbnails);
        }
    }

    getPlaylistThumbnail(playlist) {
        const thumbnails = playlist.snippet?.thumbnails;
        return thumbnails?.medium?.url || 
               thumbnails?.default?.url || 
               'https://via.placeholder.com/320x180/4a00e0/ffffff?text=قائمة+تشغيل';
    }

    createStablePlaylistElement(playlist) {
        try {
            if (!playlist || !playlist.snippet) {
                console.warn('⚠️ بيانات قائمة التشغيل غير كاملة:', playlist);
                return null;
            }

            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 col-xl-3 mb-4';
            
            const title = playlist.snippet.title || 'بدون عنوان';
            const thumbnail = this.getPlaylistThumbnail(playlist);
            const videoCount = playlist.contentDetails?.itemCount || 0;
            const publishedAt = this.app.formatDate(playlist.snippet.publishedAt);
            const isPrivate = playlist.status?.privacyStatus === 'private';

            col.innerHTML = `
                <div class="playlist-card stable-playlist" 
                     data-playlist-id="${playlist.id}"
                     data-playlist-title="${this.escapeHtml(title)}">
                    <div class="playlist-thumbnail position-relative">
                        <img src="${thumbnail}" 
                             alt="${this.escapeHtml(title)}"
                             class="w-100 playlist-thumb-img"
                             loading="lazy"
                             style="height: 180px; object-fit: cover;"
                             onerror="this.src='https://via.placeholder.com/320x180/4a00e0/ffffff?text=قائمة+تشغيل'">
                        <div class="playlist-overlay">
                            <div class="playlist-actions">
                                <button class="btn btn-sm btn-light view-playlist-btn" 
                                        title="عرض قائمة التشغيل"
                                        ${isPrivate ? 'disabled' : ''}>
                                    <i class="fas fa-play"></i>
                                </button>
                            </div>
                        </div>
                        <div class="playlist-badge">
                            <span class="badge bg-primary">
                                <i class="fas fa-list me-1"></i>
                                ${videoCount}
                            </span>
                        </div>
                        ${isPrivate ? `
                            <div class="private-badge">
                                <span class="badge bg-warning">
                                    <i class="fas fa-lock me-1"></i>
                                    خاص
                                </span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="playlist-content p-3">
                        <h3 class="playlist-title h6 mb-2" title="${this.escapeHtml(title)}">
                            ${this.truncateText(title, 60)}
                        </h3>
                        <div class="playlist-meta d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="fas fa-calendar me-1"></i>
                                ${publishedAt}
                            </small>
                            <span class="playlist-status ${isPrivate ? 'text-warning' : 'text-success'}">
                                ${isPrivate ? 'خاص' : 'عام'}
                            </span>
                        </div>
                    </div>
                </div>
            `;

            return col;
        } catch (error) {
            console.error('❌ خطأ في إنشاء عنصر قائمة التشغيل:', error);
            return null;
        }
    }

    setupStablePlaylistInteractions() {
        // استخدام event delegation للتفاعلات
        document.addEventListener('click', (e) => {
            const playlistCard = e.target.closest('.stable-playlist');
            if (playlistCard) {
                this.handlePlaylistClick(playlistCard, e);
            }
        });
    }

    handlePlaylistClick(playlistCard, event) {
        const playlistId = playlistCard.dataset.playlistId;
        const playlistTitle = playlistCard.dataset.playlistTitle;
        
        console.log('🎯 النقر على قائمة التشغيل:', playlistTitle);

        // منع السلوك الافتراضي إذا كان زرًا
        if (event.target.tagName === 'BUTTON') {
            event.stopPropagation();
        }

        // البحث عن قائمة التشغيل في البيانات
        const playlist = this.app.state.channelPlaylists.find(p => p.id === playlistId);
        
        if (playlist) {
            if (event.target.closest('.view-playlist-btn')) {
                this.openPlaylistSafely(playlist);
            } else {
                // النقر على البطاقة نفسها
                this.openPlaylistSafely(playlist);
            }
        } else {
            console.error('❌ لم يتم العثور على قائمة التشغيل:', playlistId);
            this.app.showNotification('خطأ في فتح قائمة التشغيل', 'error');
        }
    }

    async openPlaylistSafely(playlist) {
        console.log('🔓 فتح قائمة التشغيل بشكل آمن:', playlist.snippet?.title);
        
        try {
            // التحقق من أن القائمة ليست خاصة
            if (playlist.status?.privacyStatus === 'private') {
                this.app.showNotification('قائمة التشغيل هذه خاصة ولا يمكن عرضها', 'warning');
                return;
            }

            // تعيين القائمة النشطة
            this.app.state.activePlaylist = playlist;
            this.app.state.playlistVideos = [];
            
            // الانتقال إلى عرض قائمة التشغيل
            this.app.showPlaylistView();
            
            // تحديث العنوان
            this.updatePlaylistHeader(playlist);
            
            // تحميل الفيديوهات
            await this.loadPlaylistVideosSafely(playlist.id);
            
        } catch (error) {
            console.error('❌ خطأ في فتح قائمة التشغيل:', error);
            this.app.showNotification('فشل في فتح قائمة التشغيل', 'error');
        }
    }

    updatePlaylistHeader(playlist) {
        const titleElement = document.getElementById('playlist-title');
        const countElement = document.getElementById('playlist-video-count');
        
        if (titleElement) {
            titleElement.textContent = playlist.snippet?.title || 'قائمة تشغيل';
        }
        
        if (countElement) {
            const count = playlist.contentDetails?.itemCount || 0;
            countElement.textContent = `${count} فيديو`;
        }
    }

    async loadPlaylistVideosSafely(playlistId) {
        console.log('🎥 تحميل فيديوهات قائمة التشغيل بشكل آمن...');
        
        this.app.showLoading('playlist-videos-loading');
        
        try {
            const videosData = await this.app.fetchEnhancedPlaylistVideos(playlistId);
            
            if (videosData && videosData.items && videosData.items.length > 0) {
                this.app.state.playlistVideos = videosData.items;
                await this.renderPlaylistVideosSafely();
            } else {
                this.showNoVideosInPlaylist();
            }
            
            this.app.hideLoading('playlist-videos-loading');
            
        } catch (error) {
            console.error('❌ خطأ في تحميل فيديوهات القائمة:', error);
            this.app.hideLoading('playlist-videos-loading');
            this.showPlaylistVideosError(error.message);
        }
    }

    async renderPlaylistVideosSafely() {
        const videosGrid = document.getElementById('playlist-videos-grid');
        if (!videosGrid) return;

        videosGrid.innerHTML = '';

        if (!this.app.state.playlistVideos || this.app.state.playlistVideos.length === 0) {
            this.showNoVideosInPlaylist();
            return;
        }

        // عرض الفيديوهات بشكل تدريجي
        for (let i = 0; i < this.app.state.playlistVideos.length; i++) {
            const video = this.app.state.playlistVideos[i];
            const videoElement = this.createStableVideoElement(video);
            
            if (videoElement) {
                videosGrid.appendChild(videoElement);
            }
            
            // إعطاء فرصة للمتصفح لمعالجة الواجهة
            if (i % 4 === 0) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
    }

    createStableVideoElement(video) {
        try {
            if (!video || !video.id) {
                return null;
            }

            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 col-xl-3 mb-4';
            
            col.innerHTML = `
                <div class="video-card stable-video" data-video-id="${video.id}">
                    <div class="video-thumbnail position-relative">
                        <img src="${video.thumbnail}" 
                             alt="${this.escapeHtml(video.title)}"
                             class="w-100 video-thumb-img"
                             loading="lazy"
                             style="height: 180px; object-fit: cover;"
                             onerror="this.src='https://via.placeholder.com/320x180/333/fff?text=فيديو'">
                        <div class="video-overlay">
                            <div class="video-actions">
                                <button class="btn btn-sm btn-light play-video-btn" title="تشغيل الفيديو">
                                    <i class="fas fa-play"></i>
                                </button>
                            </div>
                        </div>
                        <div class="video-duration">
                            ${video.duration || '0:00'}
                        </div>
                    </div>
                    <div class="video-content p-3">
                        <h3 class="video-title h6 mb-2 line-clamp-2" title="${this.escapeHtml(video.title)}">
                            ${this.truncateText(video.title, 70)}
                        </h3>
                        <p class="channel-name text-muted small mb-2">
                            ${video.channelTitle || 'قناة غير معروفة'}
                        </p>
                        <div class="video-stats d-flex justify-content-between text-muted small">
                            <span>${video.viewCount || '0'} مشاهدة</span>
                            <span>${video.publishedAt || ''}</span>
                        </div>
                    </div>
                </div>
            `;

            return col;
        } catch (error) {
            console.error('❌ خطأ في إنشاء عنصر الفيديو:', error);
            return null;
        }
    }

    // ========== إصلاحات البيانات التجريبية ==========
    fixDemoPlaylists() {
        const originalShowDemoPlaylists = this.app.showDemoPlaylists.bind(this.app);
        
        this.app.showDemoPlaylists = () => {
            console.log('🔄 تحميل بيانات قوائم التشغيل التجريبية المحسنة...');
            this.showEnhancedDemoPlaylists();
        };
    }

    showEnhancedDemoPlaylists() {
        const demoPlaylists = [
            {
                id: 'demo_playlist_1',
                snippet: {
                    title: 'سلسلة تعلم البرمجة للمبتدئين',
                    description: 'سلسلة شاملة لتعلم أساسيات البرمجة من الصفر',
                    thumbnails: {
                        medium: { 
                            url: 'https://via.placeholder.com/320x180/4a00e0/ffffff?text=برمجة+للمبتدئين' 
                        }
                    },
                    publishedAt: new Date().toISOString()
                },
                contentDetails: {
                    itemCount: 12
                },
                status: {
                    privacyStatus: 'public'
                }
            },
            {
                id: 'demo_playlist_2',
                snippet: {
                    title: 'مشاريع ويب عملية',
                    description: 'مجموعة من المشاريع العملية لتطوير الويب',
                    thumbnails: {
                        medium: { 
                            url: 'https://via.placeholder.com/320x180/8e2de2/ffffff?text=مشاريع+ويب' 
                        }
                    },
                    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                contentDetails: {
                    itemCount: 8
                },
                status: {
                    privacyStatus: 'public'
                }
            },
            {
                id: 'demo_playlist_3',
                snippet: {
                    title: 'دروس JavaScript متقدمة',
                    description: 'دروس متقدمة في لغة JavaScript والمفاهيم الحديثة',
                    thumbnails: {
                        medium: { 
                            url: 'https://via.placeholder.com/320x180/00b4d8/ffffff?text=JavaScript' 
                        }
                    },
                    publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                },
                contentDetails: {
                    itemCount: 15
                },
                status: {
                    privacyStatus: 'public'
                }
            }
        ];

        this.app.state.channelPlaylists = demoPlaylists;
        this.renderPlaylistsSafely();
        this.app.hideLoading('playlists-loading');
        
        this.app.showNotification('تم تحميل بيانات تجريبية لقوائم التشغيل', 'info');
    }

    // ========== إصلاحات الأداء ==========
    applyPerformanceFixes() {
        console.log('⚡ تطبيق إصلاحات الأداء...');

        // تحسين استخدام الذاكرة
        this.optimizeMemoryUsage();
        
        // منع التحميل الزائد
        this.preventOverloading();
        
        // تحسين استجابة الواجهة
        this.improveUIResponsiveness();
    }

    optimizeMemoryUsage() {
        // تنظيف الذاكرة المؤقتة بانتظام
        setInterval(() => {
            this.cleanupMemory();
        }, 30000); // كل 30 ثانية
    }

    cleanupMemory() {
        console.log('🧹 تنظيف الذاكرة...');
        
        // تنظيف الصور المخزنة مؤقتاً
        const now = Date.now();
        for (let [url, data] of this.app.imageCache) {
            if (now - data.timestamp > 300000) { // 5 دقائق
                this.app.imageCache.delete(url);
            }
        }
        
        // إعادة تعيين المتغيرات المؤقتة
        if (this.app.state.channelPlaylists.length > 50) {
            this.app.state.channelPlaylists = this.app.state.channelPlaylists.slice(0, 50);
        }
        
        if (this.app.state.channelVideos.length > 100) {
            this.app.state.channelVideos = this.app.state.channelVideos.slice(0, 100);
        }
    }

    preventOverloading() {
        // الحد من عدد الطلبات المتزامنة
        let activeRequests = 0;
        const maxConcurrentRequests = 3;
        
        const originalSafeFetch = this.app.safeFetch.bind(this.app);
        
        this.app.safeFetch = async (url) => {
            while (activeRequests >= maxConcurrentRequests) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            activeRequests++;
            try {
                return await originalSafeFetch(url);
            } finally {
                activeRequests--;
            }
        };
    }

    improveUIResponsiveness() {
        // استخدام requestAnimationFrame للعمليات الثقيلة
        const heavyOperations = ['renderEnhancedPlaylists', 'renderEnhancedVideos'];
        
        heavyOperations.forEach(method => {
            if (this.app[method]) {
                const originalMethod = this.app[method].bind(this.app);
                this.app[method] = async (...args) => {
                    return new Promise(resolve => {
                        requestAnimationFrame(async () => {
                            const result = await originalMethod(...args);
                            resolve(result);
                        });
                    });
                };
            }
        });
    }

    // ========== إصلاحات معالجة الأخطاء ==========
    applyErrorHandlingFixes() {
        console.log('🚨 تطبيق إصلاحات معالجة الأخطاء...');

        this.enhanceErrorHandling();
        this.addRetryMechanisms();
        this.improveErrorMessages();
    }

    enhanceErrorHandling() {
        // تغليف الوظائف الحرجة بمعالجة الأخطاء
        const criticalMethods = [
            'loadChannelDetails',
            'loadChannelVideos', 
            'loadChannelPlaylists',
            'openPlaylist'
        ];

        criticalMethods.forEach(methodName => {
            if (this.app[methodName]) {
                const originalMethod = this.app[methodName].bind(this.app);
                this.app[methodName] = async (...args) => {
                    try {
                        return await originalMethod(...args);
                    } catch (error) {
                        console.error(`❌ خطأ في ${methodName}:`, error);
                        this.handleErrorGracefully(methodName, error);
                        throw error;
                    }
                };
            }
        });
    }

    handleErrorGracefully(methodName, error) {
        const errorMessages = {
            'loadChannelDetails': 'فشل في تحميل تفاصيل القناة',
            'loadChannelVideos': 'فشل في تحميل الفيديوهات',
            'loadChannelPlaylists': 'فشل في تحميل قوائم التشغيل',
            'openPlaylist': 'فشل في فتح قائمة التشغيل'
        };

        const message = errorMessages[methodName] || 'حدث خطأ غير متوقع';
        this.app.showNotification(`${message}: ${error.message}`, 'error');
    }

    addRetryMechanisms() {
        // إضافة آلية إعادة المحاولة للعمليات الفاشلة
        window.retryPlaylistsLoad = () => {
            console.log('🔄 إعادة محاولة تحميل قوائم التشغيل...');
            this.app.loadChannelPlaylists();
        };

        window.retryVideosLoad = () => {
            console.log('🔄 إعادة محاولة تحميل الفيديوهات...');
            this.app.loadChannelVideos();
        };
    }

    improveErrorMessages() {
        // تحسين رسائل الخطأ لعرضها بشكل أفضل
        this.showPlaylistsError = (message) => {
            const playlistsGrid = document.getElementById('playlists-grid');
            if (!playlistsGrid) return;
            
            playlistsGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4 class="text-warning mb-3">عذراً، حدث خطأ</h4>
                    <p class="text-muted mb-3">${message || 'فشل في تحميل قوائم التشغيل'}</p>
                    <div class="d-flex gap-2 justify-content-center">
                        <button class="btn btn-primary" onclick="window.retryPlaylistsLoad()">
                            <i class="fas fa-redo me-2"></i>
                            إعادة المحاولة
                        </button>
                        <button class="btn btn-outline-secondary" onclick="window.youtubeApp.showDemoPlaylists()">
                            <i class="fas fa-eye me-2"></i>
                            عرض بيانات تجريبية
                        </button>
                    </div>
                    <p class="text-muted mt-3 small">
                        إذا استمرت المشكلة، قد يكون السبب قيود في واجهة YouTube API
                    </p>
                </div>
            `;
        };

        this.showNoPlaylistsMessage = () => {
            const playlistsGrid = document.getElementById('playlists-grid');
            if (!playlistsGrid) return;
            
            playlistsGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-list fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">لا توجد قوائم تشغيل</h4>
                    <p class="text-muted">هذه القناة لا تحتوي على قوائم تشغيل عامة.</p>
                    <button class="btn btn-outline-primary mt-2" onclick="window.youtubeApp.showDemoPlaylists()">
                        <i class="fas fa-eye me-2"></i>
                        عرض أمثلة تجريبية
                    </button>
                </div>
            `;
        };

        this.showNoVideosInPlaylist = () => {
            const videosGrid = document.getElementById('playlist-videos-grid');
            if (!videosGrid) return;
            
            videosGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-video-slash fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">لا توجد فيديوهات</h4>
                    <p class="text-muted">قائمة التشغيل هذه لا تحتوي على فيديوهات.</p>
                </div>
            `;
        };

        this.showPlaylistVideosError = (message) => {
            const videosGrid = document.getElementById('playlist-videos-grid');
            if (!videosGrid) return;
            
            videosGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4 class="text-warning mb-3">عذراً، حدث خطأ</h4>
                    <p class="text-muted mb-3">${message || 'فشل في تحميل فيديوهات القائمة'}</p>
                    <button class="btn btn-primary" onclick="window.retryVideosLoad()">
                        <i class="fas fa-redo me-2"></i>
                        إعادة المحاولة
                    </button>
                </div>
            `;
        };
    }

    // ========== أدوات مساعدة ==========
    escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;', 
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
}

// تهيئة الإصلاحات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 تحميل إصلاحات YouTube...');
    
    // الانتظار حتى يكون التطبيق الرئيسي جاهزاً
    const initFixes = () => {
        if (window.youtubeApp) {
            window.youtubeFixes = new YouTubeFixes(window.youtubeApp);
            console.log('✅ تم تحميل إصلاحات YouTube بنجاح');
        } else {
            setTimeout(initFixes, 100);
        }
    };
    
    initFixes();
});

// وظائف مساعدة عالمية للتصحيح
window.debugYouTubeApp = () => {
    console.log('🐛 تصحيح تطبيق YouTube:');
    console.log('- الحالة الحالية:', window.youtubeApp?.state);
    console.log('- القناة النشطة:', window.youtubeApp?.state.currentChannel);
    console.log('- قوائم التشغيل:', window.youtubeApp?.state.channelPlaylists?.length);
    console.log('- الفيديوهات:', window.youtubeApp?.state.channelVideos?.length);
};

window.resetYouTubeApp = () => {
    if (window.youtubeApp) {
        window.youtubeApp.showChannelsSection();
        console.log('🔄 إعادة تعيين التطبيق');
    }
};

console.log('✅ تم تحميل كود الإصلاحات الإضافية');


// ========== إصلاحات مشغل الفيديو ==========
applyVideoPlayerFixes() {
    console.log('🎬 تطبيق إصلاحات مشغل الفيديو...');
    
    this.fixVideoPlayerInitialization();
    this.fixPlayerEventListeners();
    this.fixPlayerUI();
    this.fixPlayerPerformance();
}

fixVideoPlayerInitialization() {
    console.log('🔧 إصلاح تهيئة مشغل الفيديو...');

    // حفظ المرجع الأصلي
    const originalPlayEnhancedVideo = this.app.playEnhancedVideo?.bind(this.app);
    const originalInitializeYouTubePlayer = this.app.initializeYouTubePlayer?.bind(this.app);
    const originalCloseEnhancedPlayer = this.app.closeEnhancedPlayer?.bind(this.app);

    // إصلاح تشغيل الفيديو المحسن
    this.app.playEnhancedVideo = async (videoData) => {
        console.log('🎬 تشغيل الفيديو مع الإصلاحات:', videoData?.title);
        
        if (!videoData || !videoData.id) {
            console.error('❌ بيانات الفيديو غير صالحة');
            this.app.showNotification('بيانات الفيديو غير صالحة', 'error');
            return;
        }

        try {
            // إغلاق أي مشغل مفتوح حالياً
            this.forceClosePlayer();
            
            // إعطاء وقت للمتصفح لمعالجة DOM
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // جلب البيانات المحسنة للفيديو
            const enhancedData = await this.fetchStableVideoData(videoData.id);
            await this.showStablePlayer(enhancedData);
            
        } catch (error) {
            console.error('❌ خطأ في تشغيل الفيديو:', error);
            this.showPlayerError('فشل في تشغيل الفيديو');
        }
    };

    // إصلاح تهيئة مشغل YouTube
    this.app.initializeYouTubePlayer = async (videoId) => {
        console.log('🔧 تهيئة مشغل YouTube مع الإصلاحات:', videoId);
        
        const playerContainer = document.getElementById('video-player');
        if (!playerContainer) {
            console.error('❌ حاوية المشغل غير موجودة');
            throw new Error('حاوية المشغل غير موجودة');
        }

        try {
            // تنظيف الحاوية أولاً
            playerContainer.innerHTML = '';
            
            // إنشاء عنصر المشغل الجديد
            const playerDiv = document.createElement('div');
            playerDiv.id = 'youtube-player-' + Date.now();
            playerContainer.appendChild(playerDiv);

            // التأكد من تحميل YouTube API
            await this.ensureYouTubeAPI();
            
            // تهيئة المشغل مع معالجة الأخطاء
            return await this.initializeStablePlayer(playerDiv.id, videoId);
            
        } catch (error) {
            console.error('❌ خطأ في تهيئة المشغل:', error);
            throw error;
        }
    };

    // إصلاح إغلاق المشغل
    this.app.closeEnhancedPlayer = () => {
        console.log('🔒 إغلاق المشغل مع الإصلاحات');
        this.forceClosePlayer();
    };
}

async ensureYouTubeAPI() {
    if (window.YT && window.YT.Player) {
        console.log('✅ YouTube API جاهز');
        return true;
    }

    console.log('🔄 جاري تحميل YouTube API...');
    
    return new Promise((resolve, reject) => {
        // التحقق مما إذا كان API قيد التحميل بالفعل
        if (window.YouTubeAPILoading) {
            const checkInterval = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    clearInterval(checkInterval);
                    resolve(true);
                }
            }, 100);
            return;
        }

        window.YouTubeAPILoading = true;

        // إنشاء عنصر السكريبت
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        
        // تعيين callback للتهيئة
        const originalOnYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            console.log('✅ YouTube IFrame API جاهز');
            window.YouTubeAPILoading = false;
            if (originalOnYouTubeIframeAPIReady) {
                originalOnYouTubeIframeAPIReady();
            }
            resolve(true);
        };

        script.onerror = (error) => {
            console.error('❌ فشل تحميل YouTube API:', error);
            window.YouTubeAPILoading = false;
            reject(new Error('فشل تحميل YouTube API'));
        };

        // إضافة السكريبت إلى المستند
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(script, firstScript);

        // timeout احتياطي
        setTimeout(() => {
            if (window.YT && window.YT.Player) {
                resolve(true);
            } else {
                reject(new Error('انتهت مهلة تحميل YouTube API'));
            }
        }, 10000);
    });
}

async initializeStablePlayer(playerId, videoId) {
    return new Promise((resolve, reject) => {
        let playerInitialized = false;
        let timeoutId;

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (window.YT && window.YT.Player && this.app.videoPlayer) {
                try {
                    this.app.videoPlayer.destroy();
                } catch (e) {
                    console.warn('⚠️ خطأ أثناء تدمير المشغل القديم:', e);
                }
            }
        };

        timeoutId = setTimeout(() => {
            if (!playerInitialized) {
                cleanup();
                reject(new Error('انتهت مهلة تهيئة مشغل الفيديو'));
            }
        }, 10000);

        try {
            this.app.videoPlayer = new YT.Player(playerId, {
                width: '100%',
                height: '100%',
                videoId: videoId,
                playerVars: {
                    'autoplay': 1,
                    'controls': 1,
                    'modestbranding': 1,
                    'rel': 0,
                    'showinfo': 0,
                    'iv_load_policy': 3,
                    'playsinline': 1
                },
                events: {
                    'onReady': (event) => {
                        console.log('✅ مشغل الفيديو جاهز');
                        playerInitialized = true;
                        cleanup();
                        this.onPlayerReady(event);
                        resolve(event.target);
                    },
                    'onStateChange': (event) => {
                        this.onPlayerStateChange(event);
                    },
                    'onError': (error) => {
                        console.error('❌ خطأ في مشغل الفيديو:', error);
                        playerInitialized = true;
                        cleanup();
                        this.onPlayerError(error);
                        reject(new Error('خطأ في مشغل الفيديو: ' + error.data));
                    },
                    'onApiChange': (event) => {
                        console.log('🔄 تغيير في YouTube API');
                    }
                }
            });
        } catch (error) {
            cleanup();
            reject(error);
        }
    });
}

onPlayerReady(event) {
    console.log('🎮 مشغل الفيديو جاهز للتشغيل');
    // يمكن إضافة أي إعدادات إضافية هنا
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
    
    const state = states[event.data] || 'غير معروف';
    console.log(`📊 حالة المشغل: ${state}`);
    
    // تحديث واجهة المستخدم بناءً على الحالة إذا لزم الأمر
    this.updatePlayerUIState(state);
}

onPlayerError(error) {
    console.error('❌ خطأ في مشغل YouTube:', error);
    
    const errorMessages = {
        2: 'معرف الفيديو غير صالح',
        5: 'خطأ في HTML5 player',
        100: 'الفيديو غير موجود',
        101: 'لا يسمح بتشغيل الفيديو',
        150: 'نفس القيود مثل الخطأ 101'
    };
    
    const message = errorMessages[error.data] || 'حدث خطأ غير معروف';
    this.showPlayerError(`خطأ في التشغيل: ${message}`);
}

updatePlayerUIState(state) {
    // تحديث واجهة المستخدم بناءً على حالة المشغل
    // يمكن إضافة مؤشرات تحميل أو تغييرات في الواجهة هنا
}

async fetchStableVideoData(videoId) {
    console.log('📥 جلب بيانات الفيديو بشكل مستقر:', videoId);
    
    try {
        // المحاولة الأولى: استخدام التخزين المؤقت
        const cacheKey = `video_data_${videoId}`;
        const cached = this.app.cacheGet(cacheKey);
        if (cached) {
            console.log('📋 استخدام البيانات المخزنة مؤقتاً');
            return cached;
        }

        // جلب البيانات من API
        const url = this.app.ytUrl('videos', {
            part: 'snippet,contentDetails,statistics',
            id: videoId
        });

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`خطأ في API: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.items || !data.items[0]) {
            throw new Error('لم يتم العثور على بيانات الفيديو');
        }

        const video = data.items[0];
        const enhancedData = {
            ...video,
            formattedStats: this.formatVideoStats(video.statistics),
            chapters: this.extractChapters(video.snippet?.description),
            safeTitle: this.escapeHtml(video.snippet?.title || ''),
            safeDescription: this.escapeHtml(video.snippet?.description || '')
        };

        // تخزين البيانات مؤقتاً
        this.app.cacheSet(cacheKey, enhancedData);
        return enhancedData;
        
    } catch (error) {
        console.error('❌ خطأ في جلب بيانات الفيديو:', error);
        
        // إرجاع بيانات افتراضية في حالة الخطأ
        return this.createFallbackVideoData(videoId);
    }
}

createFallbackVideoData(videoId) {
    console.log('🔄 استخدام بيانات الفيديو الافتراضية');
    
    return {
        id: videoId,
        snippet: {
            title: 'فيديو',
            description: 'تعذر تحميل معلومات الفيديو',
            channelTitle: 'قناة',
            publishedAt: new Date().toISOString()
        },
        statistics: {
            viewCount: '0',
            likeCount: '0',
            commentCount: '0'
        },
        formattedStats: {
            views: '0',
            likes: '0', 
            comments: '0'
        },
        chapters: [],
        safeTitle: 'فيديو',
        safeDescription: 'تعذر تحميل معلومات الفيديو'
    };
}

async showStablePlayer(videoData) {
    console.log('🎪 عرض مشغل الفيديو بشكل مستقر');
    
    const playerOverlay = document.getElementById('video-player-overlay');
    if (!playerOverlay) {
        console.error('❌ عنصر overlay المشغل غير موجود');
        this.showPlayerError('عنصر المشغل غير موجود');
        return;
    }

    try {
        // تحديث واجهة المستخدم أولاً
        this.updatePlayerUI(videoData);
        
        // إظهار الـ overlay
        playerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // إعطاء وقت للمتصفح لمعالجة التغييرات
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // تهيئة المشغل
        await this.app.initializeYouTubePlayer(videoData.id);
        
        console.log('✅ تم تشغيل الفيديو بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في عرض المشغل:', error);
        this.showPlayerError('فشل في تشغيل الفيديو');
        this.forceClosePlayer();
    }
}

updatePlayerUI(videoData) {
    console.log('🎨 تحديث واجهة المشغل');
    
    try {
        const elements = {
            title: document.getElementById('player-video-title'),
            description: document.getElementById('player-video-description'),
            channel: document.getElementById('player-channel-name'),
            views: document.getElementById('player-video-views'),
            likes: document.getElementById('player-video-likes'),
            comments: document.getElementById('player-video-comments')
        };

        // تحديث النصوص مع التعامل الآمن
        if (elements.title) {
            elements.title.textContent = videoData.safeTitle || videoData.snippet?.title || 'فيديو';
        }
        
        if (elements.description) {
            elements.description.textContent = videoData.safeDescription || videoData.snippet?.description || 'لا يوجد وصف';
        }
        
        if (elements.channel) {
            elements.channel.textContent = videoData.snippet?.channelTitle || 'قناة غير معروفة';
        }
        
        if (elements.views) {
            elements.views.textContent = `${videoData.formattedStats?.views || '0'} مشاهدة`;
        }
        
        if (elements.likes) {
            elements.likes.textContent = `${videoData.formattedStats?.likes || '0'} إعجاب`;
        }
        
        if (elements.comments) {
            elements.comments.textContent = `${videoData.formattedStats?.comments || '0'} تعليق`;
        }

        // تحديث الفصول
        this.renderVideoChapters(videoData.chapters);
        
    } catch (error) {
        console.error('❌ خطأ في تحديث واجهة المشغل:', error);
    }
}

renderVideoChapters(chapters) {
    const chaptersContainer = document.getElementById('player-video-chapters');
    if (!chaptersContainer) return;

    try {
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
                                data-timestamp="${this.escapeHtml(chapter.timestamp)}"
                                title="${this.escapeHtml(chapter.title)}">
                            ${this.escapeHtml(chapter.timestamp)} - ${this.truncateText(this.escapeHtml(chapter.title), 30)}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // إضافة مستمعي الأحداث للفصول
        chaptersContainer.querySelectorAll('.chapter-item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.seekToTimestamp(btn.dataset.timestamp);
            });
        });
        
    } catch (error) {
        console.error('❌ خطأ في عرض فصول الفيديو:', error);
        chaptersContainer.innerHTML = '';
    }
}

seekToTimestamp(timestamp) {
    if (!this.app.videoPlayer || typeof this.app.videoPlayer.seekTo !== 'function') {
        console.error('❌ المشغل غير جاهز للتنقل');
        return;
    }

    try {
        const [minutes, seconds] = timestamp.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;
        
        console.log(`⏩ التنقل إلى: ${timestamp} (${totalSeconds} ثانية)`);
        this.app.videoPlayer.seekTo(totalSeconds, true);
        
    } catch (error) {
        console.error('❌ خطأ في التنقل إلى الوقت المحدد:', error);
    }
}

forceClosePlayer() {
    console.log('🛑 إغلاق إجباري للمشغل');
    
    try {
        // إيقاف وتدمير المشغل إذا كان موجوداً
        if (this.app.videoPlayer) {
            try {
                if (typeof this.app.videoPlayer.stopVideo === 'function') {
                    this.app.videoPlayer.stopVideo();
                }
                if (typeof this.app.videoPlayer.destroy === 'function') {
                    this.app.videoPlayer.destroy();
                }
            } catch (e) {
                console.warn('⚠️ خطأ أثناء تدمير المشغل:', e);
            }
            this.app.videoPlayer = null;
        }

        // إخفاء الـ overlay
        const playerOverlay = document.getElementById('video-player-overlay');
        if (playerOverlay) {
            playerOverlay.classList.remove('active');
        }

        // تنظيف حاوية المشغل
        const playerContainer = document.getElementById('video-player');
        if (playerContainer) {
            playerContainer.innerHTML = '';
        }

        // إعادة تمكين التمرير
        document.body.style.overflow = 'auto';
        
        // تنظيف البيانات
        this.app.currentVideo = null;
        
        console.log('✅ تم إغلاق المشغل بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في الإغلاق الإجباري:', error);
    }
}

fixPlayerEventListeners() {
    console.log('🎯 إصلاح مستمعي أحداث المشغل');
    
    // إزالة أي مستمعي أحداث موجودين مسبقاً
    this.removeExistingPlayerListeners();
    
    // إضافة مستمعي أحداث جديدين
    this.addStablePlayerListeners();
}

removeExistingPlayerListeners() {
    const closeButton = document.getElementById('close-player');
    if (closeButton) {
        closeButton.replaceWith(closeButton.cloneNode(true));
    }
}

addStablePlayerListeners() {
    // زر الإغلاق
    const closeButton = document.getElementById('close-player');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            console.log('❌ النقر على زر الإغلاق');
            this.forceClosePlayer();
        });
    }

    // النقر خارج المشغل
    const playerOverlay = document.getElementById('video-player-overlay');
    if (playerOverlay) {
        playerOverlay.addEventListener('click', (e) => {
            if (e.target === playerOverlay) {
                console.log('🎯 النقر خارج المشغل');
                this.forceClosePlayer();
            }
        });
    }

    // زر Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const playerOverlay = document.getElementById('video-player-overlay');
            if (playerOverlay && playerOverlay.classList.contains('active')) {
                console.log('⌨️ الضغط على زر Escape');
                e.preventDefault();
                this.forceClosePlayer();
            }
        }
    });

    // منع انتشار الأحداث داخل المشغل
    const playerContainer = document.querySelector('.video-player-container');
    if (playerContainer) {
        playerContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

fixPlayerUI() {
    console.log('🎨 إصلاح واجهة مشغل الفيديو');
    
    // إضافة أنماط إضافية للمشغل
    this.injectPlayerStyles();
    
    // تحسين تجربة المستخدم على الأجهزة المحمولة
    this.enhanceMobileExperience();
}

injectPlayerStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* تحسينات مشغل الفيديو */
        .video-player-overlay {
            z-index: 10000;
            background: rgba(0, 0, 0, 0.95) !important;
            backdrop-filter: blur(10px);
        }
        
        .video-player-container {
            max-width: 95vw;
            max-height: 95vh;
            margin: 20px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        .video-player {
            background: #000;
            min-height: 400px;
            position: relative;
        }
        
        .video-player iframe,
        #youtube-player {
            width: 100% !important;
            height: 100% !important;
            border: none;
        }
        
        .video-player-header {
            background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
            border-bottom: none;
        }
        
        .btn-close-player {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .btn-close-player:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }
        
        .video-info {
            background: #fff;
            max-height: 40vh;
            overflow-y: auto;
        }
        
        .chapters-section {
            border-top: 1px solid #e9ecef;
            padding-top: 15px;
        }
        
        .chapters-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .chapter-item {
            white-space: nowrap;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        /* تحسينات للهواتف */
        @media (max-width: 768px) {
            .video-player-container {
                margin: 10px;
                max-width: 100vw;
                max-height: 100vh;
                border-radius: 0;
            }
            
            .video-player {
                min-height: 300px;
            }
            
            .video-info {
                max-height: 50vh;
            }
            
            .chapters-list {
                justify-content: center;
            }
            
            .chapter-item {
                flex: 1;
                min-width: 120px;
                max-width: none;
            }
        }
        
        /* تحسينات للشاشات الكبيرة */
        @media (min-width: 1200px) {
            .video-player-container {
                max-width: 1200px;
            }
        }
        
        /* تحسينات إمكانية الوصول */
        .btn-close-player:focus {
            outline: 2px solid #4a00e0;
            outline-offset: 2px;
        }
        
        .chapter-item:focus {
            outline: 2px solid #4a00e0;
            outline-offset: 1px;
        }
    `;
    
    document.head.appendChild(style);
}

enhanceMobileExperience() {
    // تحسينات خاصة بالأجهزة المحمولة
    if ('ontouchstart' in window) {
        console.log('📱 تحسين تجربة الأجهزة المحمولة');
        
        // منع zoom مزدوج اللمس في المشغل
        const playerOverlay = document.getElementById('video-player-overlay');
        if (playerOverlay) {
            playerOverlay.addEventListener('touchmove', (e) => {
                if (e.scale !== 1) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
    }
}

fixPlayerPerformance() {
    console.log('⚡ تحسين أداء المشغل');
    
    // إدارة ذاكرة المشغل
    this.managePlayerMemory();
    
    // تحسين كفاءة الشبكة
    this.optimizePlayerNetwork();
}

managePlayerMemory() {
    // تنظيف ذاكرة المشغل بانتظام
    setInterval(() => {
        if (!this.isPlayerVisible()) {
            this.cleanupPlayerMemory();
        }
    }, 30000);
}

isPlayerVisible() {
    const playerOverlay = document.getElementById('video-player-overlay');
    return playerOverlay && playerOverlay.classList.contains('active');
}

cleanupPlayerMemory() {
    if (this.app.videoPlayer && !this.isPlayerVisible()) {
        console.log('🧹 تنظيف ذاكرة المشغل');
        try {
            this.app.videoPlayer.destroy();
            this.app.videoPlayer = null;
        } catch (error) {
            console.warn('⚠️ خطأ أثناء تنظيف ذاكرة المشغل:', error);
        }
    }
}

optimizePlayerNetwork() {
    // تأخير تحميل YouTube API حتى الحاجة الفعلية
    let apiLoaded = false;
    
    const loadYouTubeAPIOnDemand = () => {
        if (!apiLoaded && window.youtubeApp) {
            // تحميل API مسبقاً ولكن غير مرئي
            this.ensureYouTubeAPI().then(() => {
                apiLoaded = true;
                console.log('✅ تم تحميل YouTube API مسبقاً');
            }).catch(error => {
                console.warn('⚠️ فشل التحميل المسبق لـ YouTube API:', error);
            });
        }
    };
    
    // بدء التحميل المسبق عند التفاعل مع التطبيق
    document.addEventListener('click', loadYouTubeAPIOnDemand, { once: true });
}

showPlayerError(message) {
    console.error('❌ خطأ في المشغل:', message);
    
    // إظهار رسالة خطأ للمستخدم
    this.app.showNotification(message, 'error');
    
    // إغلاق المشغل
    this.forceClosePlayer();
}

// تحديث دالة initFixes لتشمل إصلاحات المشغل
initFixes() {
    console.log('🔧 تهيئة إصلاحات التجميد وعرض قوائم التشغيل والمشغل...');
    this.applyNavigationFixes();
    this.applyPlaylistsFixes();
    this.applyPerformanceFixes();
    this.applyErrorHandlingFixes();
    this.applyVideoPlayerFixes(); // ← إضافة هذا السطر
}