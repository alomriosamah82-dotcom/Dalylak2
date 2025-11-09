// ===== المتغيرات العامة =====
let currentTheme = localStorage.getItem('theme') || 'light';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentSection = 'learning';
let searchTimeout = null;

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تحميل تطبيق دليلك التعليمي والعملي...');
    initializeApp();
});

function initializeApp() {
    try {
        // تهيئة الوضع اللوني
        setTheme(currentTheme);
        
        // إعداد المستمعين للأحداث
        setupEventListeners();
        
        // تحميل البيانات وعرض المحتوى
        loadContent();
        
        // تحديث عداد المفضلة
        updateFavoritesCount();
        
        // إعداد البحث العالمي
        setupGlobalSearch();
        
        console.log('✅ تم تهيئة التطبيق بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error);
        showToast('حدث خطأ في تحميل التطبيق', 'danger');
    }
}

// ===== إعداد مستمعي الأحداث =====
function setupEventListeners() {
    try {
        // زر الوضع الداكن العائم
        const themeBtn = document.getElementById('theme-toggle-floating');
        if (themeBtn) {
            themeBtn.addEventListener('click', toggleTheme);
        }
        
        // البحث العالمي
        const searchInput = document.getElementById('global-search-input');
        const searchBtn = document.getElementById('global-search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', handleGlobalSearch);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performGlobalSearch();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', performGlobalSearch);
        }
        
        // إعداد التنقل للجوال
        setupMobileNavigation();
        
        // إعداد تفاعلات البطاقات
        setupCardInteractions();
        
        console.log('✅ تم إعداد مستمعي الأحداث بنجاح');
    } catch (error) {
        console.error('❌ خطأ في إعداد مستمعي الأحداث:', error);
    }
}

// ===== إدارة الوضع الداكن/الفاتح =====
function toggleTheme() {
    try {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
        
        // تحديث أي عناصر تتأثر بتغيير الوضع
        updateThemeDependentElements();
    } catch (error) {
        console.error('❌ خطأ في تبديل الوضع:', error);
    }
}

function setTheme(theme) {
    try {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.querySelector('#theme-toggle-floating i');
        
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                showToast('تم تفعيل الوضع الداكن', 'info');
            } else {
                icon.className = 'fas fa-moon';
                showToast('تم تفعيل الوضع الفاتح', 'info');
            }
        }
    } catch (error) {
        console.error('❌ خطأ في تعيين الوضع:', error);
    }
}

function updateThemeDependentElements() {
    // تحديث أي عناصر خاصة تحتاج إلى تعديل مع تغيير الوضع
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
    });
}

// ===== نظام البحث العالمي =====
function setupGlobalSearch() {
    try {
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
            // إضافة تأثيرات بصرية للبحث
            searchInput.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            searchInput.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        }
    } catch (error) {
        console.error('❌ خطأ في إعداد البحث العالمي:', error);
    }
}

function handleGlobalSearch() {
    try {
        // إلغاء البحث السابق إذا كان موجوداً
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // البحث بعد تأخير 500 مللي ثانية
        searchTimeout = setTimeout(() => {
            performGlobalSearch();
        }, 500);
    } catch (error) {
        console.error('❌ خطأ في معالجة البحث:', error);
    }
}

function performGlobalSearch() {
    try {
        const searchTerm = document.getElementById('global-search-input').value.trim().toLowerCase();
        
        if (!searchTerm) {
            // إذا كان البحث فارغاً، إعادة تحميل المحتوى العادي
            loadContent();
            return;
        }
        
        // البحث في جميع الأقسام
        const allData = getAllPlatformData();
        const filteredData = allData.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.features.some(feature => feature.toLowerCase().includes(searchTerm)) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.language.toLowerCase().includes(searchTerm)
        );
        
        // عرض نتائج البحث
        displaySearchResults(filteredData, searchTerm);
        
    } catch (error) {
        console.error('❌ خطأ في البحث:', error);
        showToast('حدث خطأ في البحث', 'danger');
    }
}

function getAllPlatformData() {
    // جمع البيانات من جميع الأقسام
    // في التطبيق الحقيقي، سيتم جلب هذه البيانات من ملف data.js
    return [
        ...(window.platformData?.learning || []),
        ...(window.platformData?.tools || []),
        ...(window.platformData?.tests || []),
        ...(window.platformData?.work || []),
        ...(window.platformData?.youtube || [])
    ];
}

function displaySearchResults(results, searchTerm) {
    try {
        const currentPage = getCurrentPage();
        
        if (currentPage === 'dashboard') {
            displayDashboardSearchResults(results);
        } else if (currentPage === 'favorites') {
            displayFavoritesSearchResults(results);
        } else {
            displaySectionSearchResults(results, currentPage);
        }
        
        // إظهار إشعار بنتائج البحث
        if (results.length === 0) {
            showToast(`لا توجد نتائج للبحث عن: "${searchTerm}"`, 'warning');
        } else {
            showToast(`تم العثور على ${results.length} نتيجة للبحث عن: "${searchTerm}"`, 'success');
        }
        
    } catch (error) {
        console.error('❌ خطأ في عرض نتائج البحث:', error);
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('favorites')) return 'favorites';
    if (path.includes('learning')) return 'learning';
    if (path.includes('tools')) return 'tools';
    if (path.includes('tests')) return 'tests';
    if (path.includes('work')) return 'work';
    if (path.includes('youtube')) return 'youtube';
    if (path.includes('blog')) return 'blog';
    if (path.includes('about')) return 'about';
    return 'index';
}

// ===== تحميل المحتوى وعرضه =====
function loadContent() {
    try {
        const currentPage = getCurrentPage();
        
        switch (currentPage) {
            case 'dashboard':
                loadDashboardContent();
                break;
            case 'learning':
                loadSectionContent('learning');
                break;
            case 'tools':
                loadSectionContent('tools');
                break;
            case 'tests':
                loadSectionContent('tests');
                break;
            case 'work':
                loadSectionContent('work');
                break;
            case 'youtube':
                loadSectionContent('youtube');
                break;
            case 'favorites':
                loadFavoritesContent();
                break;
            case 'blog':
                loadBlogContent();
                break;
            case 'about':
                loadAboutContent();
                break;
            default:
                // الصفحة الرئيسية لا تحتاج تحميل محتوى إضافي
                break;
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل المحتوى:', error);
        showToast('حدث خطأ في تحميل المحتوى', 'danger');
    }
}

function loadDashboardContent() {
    try {
        // تحميل الإحصائيات
        updateDashboardStats();
        
        // تحميل وعرض جميع البطاقات
        const allData = getAllPlatformData();
        displayDashboardCards(allData);
        
        // إعداد الفلاتر
        setupDashboardFilters();
        
    } catch (error) {
        console.error('❌ خطأ في تحميل لوحة التحكم:', error);
    }
}

function updateDashboardStats() {
    try {
        const allData = getAllPlatformData();
        
        document.getElementById('learning-count').textContent = 
            window.platformData?.learning?.length || 0;
        document.getElementById('tools-count').textContent = 
            window.platformData?.tools?.length || 0;
        document.getElementById('tests-count').textContent = 
            window.platformData?.tests?.length || 0;
        document.getElementById('favorites-count').textContent = 
            favorites.length;
            
    } catch (error) {
        console.error('❌ خطأ في تحديث الإحصائيات:', error);
    }
}

function displayDashboardCards(data) {
    try {
        const container = document.getElementById('dashboard-results');
        if (!container) return;
        
        if (data.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">لا توجد بيانات متاحة</h5>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        data.forEach(item => {
            const card = createDashboardCard(item);
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('❌ خطأ في عرض بطاقات لوحة التحكم:', error);
    }
}

function createDashboardCard(item) {
    try {
        const isFavorite = favorites.some(fav => fav.id === item.id);
        const section = getItemSection(item.id);
        
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 mb-4';
        card.innerHTML = `
            <div class="card dashboard-card ${section}-card h-100">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="${item.logo} me-2"></i>
                        ${item.name}
                    </h5>
                </div>
                <div class="card-body">
                    <p class="card-text">${item.description}</p>
                    <div class="mb-3">
                        <span class="category-badge">${item.category}</span>
                        <span class="language-badge">${item.language}</span>
                        <span class="badge bg-secondary">${section}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-details" onclick="showItemDetails(${item.id}, '${section}')">
                        <i class="fas fa-info-circle me-1"></i> التفاصيل
                    </button>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="toggleFavorite(${item.id}, '${section}')">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    } catch (error) {
        console.error('❌ خطأ في إنشاء بطاقة لوحة التحكم:', error);
        return null;
    }
}

function getItemSection(id) {
    if (window.platformData?.learning?.some(item => item.id === id)) return 'learning';
    if (window.platformData?.tools?.some(item => item.id === id)) return 'tools';
    if (window.platformData?.tests?.some(item => item.id === id)) return 'tests';
    if (window.platformData?.work?.some(item => item.id === id)) return 'work';
    if (window.platformData?.youtube?.some(item => item.id === id)) return 'youtube';
    return 'general';
}

function setupDashboardFilters() {
    try {
        const categoryFilter = document.getElementById('category-filter');
        const languageFilter = document.getElementById('language-filter');
        const levelFilter = document.getElementById('level-filter');
        const gridViewBtn = document.getElementById('grid-view');
        const listViewBtn = document.getElementById('list-view');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', applyDashboardFilters);
        }
        
        if (languageFilter) {
            languageFilter.addEventListener('change', applyDashboardFilters);
        }
        
        if (levelFilter) {
            levelFilter.addEventListener('change', applyDashboardFilters);
        }
        
        if (gridViewBtn && listViewBtn) {
            gridViewBtn.addEventListener('click', () => switchView('grid'));
            listViewBtn.addEventListener('click', () => switchView('list'));
        }
        
    } catch (error) {
        console.error('❌ خطأ في إعداد فلاتر لوحة التحكم:', error);
    }
}

function applyDashboardFilters() {
    try {
        const category = document.getElementById('category-filter').value;
        const language = document.getElementById('language-filter').value;
        const level = document.getElementById('level-filter').value;
        
        let filteredData = getAllPlatformData();
        
        if (category) {
            filteredData = filteredData.filter(item => item.category === category);
        }
        
        if (language) {
            filteredData = filteredData.filter(item => item.language === language);
        }
        
        if (level) {
            filteredData = filteredData.filter(item => item.level === level);
        }
        
        displayDashboardCards(filteredData);
        
    } catch (error) {
        console.error('❌ خطأ في تطبيق الفلاتر:', error);
    }
}

function switchView(viewType) {
    try {
        const gridViewBtn = document.getElementById('grid-view');
        const listViewBtn = document.getElementById('list-view');
        const resultsContainer = document.getElementById('dashboard-results');
        
        if (viewType === 'grid') {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            resultsContainer.classList.remove('list-view');
            resultsContainer.classList.add('grid-view');
        } else {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            resultsContainer.classList.remove('grid-view');
            resultsContainer.classList.add('list-view');
        }
        
        // إعادة تطبيق الفلاتر الحالية مع نمط العرض الجديد
        applyDashboardFilters();
        
    } catch (error) {
        console.error('❌ خطأ في تبديل نمط العرض:', error);
    }
}

// ===== تحميل محتوى الأقسام =====
function loadSectionContent(section) {
    try {
        const data = window.platformData?.[section];
        if (!data) {
            console.error(`❌ لا توجد بيانات للقسم: ${section}`);
            return;
        }
        
        const container = document.getElementById(`${section}-cards`);
        if (!container) {
            console.error(`❌ لم يتم العثور على حاوية للقسم: ${section}`);
            return;
        }
        
        container.innerHTML = '';
        
        if (data.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">لا توجد بيانات متاحة</h5>
                </div>
            `;
            return;
        }
        
        data.forEach(item => {
            const card = createSectionCard(item, section);
            if (card) {
                container.appendChild(card);
            }
        });
        
        console.log(`✅ تم تحميل ${data.length} بطاقة في قسم: ${section}`);
        
    } catch (error) {
        console.error(`❌ خطأ في تحميل قسم ${section}:`, error);
    }
}

function createSectionCard(item, section) {
    try {
        const isFavorite = favorites.some(fav => fav.id === item.id);
        
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 mb-4';
        card.innerHTML = `
            <div class="card ${section}-card h-100">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="${item.logo} me-2"></i>
                        ${item.name}
                    </h5>
                </div>
                <div class="card-body">
                    <p class="card-text">${item.description}</p>
                    <ul class="features-list">
                        ${item.features.map(feature => `<li><i class="fas fa-check-circle"></i> ${feature}</li>`).join('')}
                    </ul>
                    <div class="mb-3">
                        <span class="category-badge">${item.category}</span>
                        <span class="language-badge">${item.language}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-details" onclick="showItemDetails(${item.id}, '${section}')">
                        <i class="fas fa-info-circle me-1"></i> التفاصيل
                    </button>
                    ${item.hasQuiz ? `
                    <button class="btn btn-test" onclick="startQuiz(${item.id})">
                        <i class="fas fa-play-circle me-1"></i> ابدأ الاختبار
                    </button>
                    ` : ''}
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="toggleFavorite(${item.id}, '${section}')">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    } catch (error) {
        console.error('❌ خطأ في إنشاء بطاقة القسم:', error);
        return null;
    }
}

// ===== إدارة المفضلة =====
function toggleFavorite(id, section) {
    try {
        const item = findItemById(id, section);
        if (!item) {
            console.error(`❌ العنصر غير موجود: ${id} في قسم ${section}`);
            return;
        }
        
        const existingIndex = favorites.findIndex(fav => fav.id === id);
        
        if (existingIndex > -1) {
            // إزالة من المفضلة
            favorites.splice(existingIndex, 1);
            showToast('تمت الإزالة من المفضلة', 'warning');
        } else {
            // إضافة إلى المفضلة
            favorites.push({...item, section});
            showToast('تمت الإضافة إلى المفضلة', 'success');
        }
        
        // حفظ في localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // تحديث العداد
        updateFavoritesCount();
        
        // تحديث الواجهة إذا لزم الأمر
        updateUIAfterFavoriteToggle(id, section);
        
    } catch (error) {
        console.error('❌ خطأ في إدارة المفضلة:', error);
        showToast('حدث خطأ في إدارة المفضلة', 'danger');
    }
}

function findItemById(id, section) {
    return window.platformData?.[section]?.find(item => item.id === id);
}

function updateFavoritesCount() {
    try {
        const countElements = document.querySelectorAll('.favorites-count');
        countElements.forEach(element => {
            element.textContent = favorites.length;
        });
    } catch (error) {
        console.error('❌ خطأ في تحديث عداد المفضلة:', error);
    }
}

function updateUIAfterFavoriteToggle(id, section) {
    try {
        // تحديث الأزرار في البطاقات
        const favoriteBtns = document.querySelectorAll(`.favorite-btn[onclick*="${id}"]`);
        favoriteBtns.forEach(btn => {
            const isFavorite = favorites.some(fav => fav.id === id);
            btn.classList.toggle('active', isFavorite);
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = isFavorite ? 'fas fa-heart' : 'far fa-heart';
            }
        });
        
        // إذا كنا في صفحة المفضلة، إعادة تحميل المحتوى
        if (getCurrentPage() === 'favorites') {
            loadFavoritesContent();
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحديث الواجهة بعد تغيير المفضلة:', error);
    }
}

function loadFavoritesContent() {
    try {
        const container = document.getElementById('favorites-list');
        if (!container) return;
        
        if (favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-favorites text-center py-5">
                    <i class="fas fa-heart-broken fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">لا توجد عناصر في المفضلة بعد</h5>
                    <p class="text-muted">يمكنك إضافة عناصر إلى المفضلة من خلال الضغط على زر القلب في أي منصة</p>
                    <a href="dashboard.html" class="btn btn-primary mt-3">
                        <i class="fas fa-rocket me-2"></i>استكشف المنصات
                    </a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = favorites.map(fav => `
            <div class="favorite-item glass-card">
                <div class="favorite-icon">
                    <i class="${fav.logo}"></i>
                </div>
                <div class="favorite-content">
                    <div class="favorite-name">${fav.name}</div>
                    <div class="favorite-category">${fav.category} - ${fav.section}</div>
                    <p class="favorite-description">${fav.description}</p>
                </div>
                <div class="favorite-actions">
                    <button class="btn btn-sm btn-details" onclick="showItemDetails(${fav.id}, '${fav.section}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="removeFavorite(${fav.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('❌ خطأ في تحميل المفضلة:', error);
    }
}

function removeFavorite(id) {
    try {
        favorites = favorites.filter(fav => fav.id !== id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesCount();
        loadFavoritesContent();
        showToast('تمت الإزالة من المفضلة', 'warning');
        
    } catch (error) {
        console.error('❌ خطأ في إزالة المفضلة:', error);
        showToast('حدث خطأ في إزالة العنصر', 'danger');
    }
}

// ===== عرض التفاصيل =====
function showItemDetails(id, section) {
    try {
        const item = findItemById(id, section);
        if (!item) {
            console.error(`❌ العنصر غير موجود: ${id} في قسم ${section}`);
            showToast('لم يتم العثور على التفاصيل', 'warning');
            return;
        }
        
        // في التطبيق الحقيقي، سيتم فتح نافذة منبثقة أو الانتقال لصفحة تفاصيل
        // هنا سنعرض تفاصيل مبسطة في console للتوضيح
        console.log('تفاصيل العنصر:', item);
        
        // يمكن فتح الرابط في نافذة جديدة
        if (item.link) {
            window.open(item.link, '_blank');
        }
        
        showToast(`جاري فتح ${item.name}`, 'info');
        
    } catch (error) {
        console.error('❌ خطأ في عرض التفاصيل:', error);
        showToast('حدث خطأ في عرض التفاصيل', 'danger');
    }
}

// ===== إدارة القائمة المنسدلة المحسنة =====
function setupMobileNavigation() {
    try {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const body = document.body;

        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    // إغلاق القائمة
                    closeMobileNavbar();
                } else {
                    // فتح القائمة
                    openMobileNavbar();
                }
            });

            // إغلاق القائمة عند النقر على رابط
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth < 992) {
                        closeMobileNavbar();
                    }
                });
            });

            // إغلاق القائمة عند النقر خارجها
            document.addEventListener('click', function(e) {
                if (window.innerWidth < 992 && 
                    navbarCollapse.classList.contains('show') && 
                    !navbarCollapse.contains(e.target) && 
                    !navbarToggler.contains(e.target)) {
                    closeMobileNavbar();
                }
            });

            // إغلاق القائمة عند التمرير
            let scrollTimer;
            window.addEventListener('scroll', function() {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    clearTimeout(scrollTimer);
                    scrollTimer = setTimeout(() => {
                        closeMobileNavbar();
                    }, 150);
                }
            });

            // إغلاق القائمة عند تغيير حجم النافذة
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 992) {
                    closeMobileNavbar();
                }
            });

            // منع إغلاق القائمة عند النقر داخلها
            navbarCollapse.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        console.log('✅ تم إعداد التنقل للجوال بنجاح');
    } catch (error) {
        console.error('❌ خطأ في إعداد التنقل للجوال:', error);
    }
}

function openMobileNavbar() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const body = document.body;

    if (navbarCollapse && navbarToggler) {
        // فتح القائمة
        navbarCollapse.classList.add('show');
        navbarToggler.setAttribute('aria-expanded', 'true');
        navbarToggler.classList.add('collapsed');
        
        // إضافة كلاس للجسم لمنع التمرير
        body.classList.add('navbar-open');
        
        // إضافة تأثير ظهور
        navbarCollapse.style.transform = 'translateY(0)';
        navbarCollapse.style.opacity = '1';
        
        console.log('📱 فتح القائمة المنسدلة');
    }
}

function closeMobileNavbar() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const body = document.body;

    if (navbarCollapse && navbarToggler) {
        // إغلاق القائمة
        navbarCollapse.classList.remove('show');
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarToggler.classList.remove('collapsed');
        
        // إزالة كلاس الجسم
        body.classList.remove('navbar-open');
        
        // إعادة تعيين الأنماط
        navbarCollapse.style.transform = '';
        navbarCollapse.style.opacity = '';
        
        console.log('📱 إغلاق القائمة المنسدلة');
    }
}

// إضافة هذه الدالة إلى قائمة الدوال المتاحة عالمياً
window.closeMobileNavbar = closeMobileNavbar;
// ===== إعداد تفاعلات البطاقات =====
function setupCardInteractions() {
    try {
        // إضافة تأثيرات hover للبطاقات
        document.addEventListener('mouseover', function(e) {
            const card = e.target.closest('.card');
            if (card && !card.classList.contains('no-hover')) {
                card.style.transition = 'all 0.3s ease';
            }
        });
        
    } catch (error) {
        console.error('❌ خطأ في إعداد تفاعلات البطاقات:', error);
    }
}

// ===== نظام الإشعارات =====
function showToast(message, type = 'info') {
    try {
        // إنشاء عنصر التوست
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0`;
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        // إضافة إلى الحاوية
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        // إظهار التوست
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 3000
        });
        
        bsToast.show();
        
        // إزالة التوست من DOM بعد الاختفاء
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
        
    } catch (error) {
        console.error('❌ خطأ في عرض الإشعار:', error);
        // طريقة بديلة بسيطة
        console.log(`إشعار: ${message}`);
    }
}

// ===== تحميل المحتوى الإضافي =====
function loadBlogContent() {
    try {
        // في التطبيق الحقيقي، سيتم جلب المحتوى من API أو ملف JSON
        console.log('✅ تحميل محتوى المدونة');
        
    } catch (error) {
        console.error('❌ خطأ في تحميل المدونة:', error);
    }
}

function loadAboutContent() {
    try {
        // في التطبيق الحقيقي، سيتم جلب المحتوى من API أو ملف JSON
        console.log('✅ تحميل محتوى صفحة من نحن');
        
    } catch (error) {
        console.error('❌ خطأ في تحميل صفحة من نحن:', error);
    }
}

// ===== وظائف مساعدة =====
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

function formatNumber(num) {
    try {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (error) {
        return num;
    }
}

// ===== التعامل مع أخطاء الشبكة =====
window.addEventListener('online', function() {
    showToast('تم استعادة الاتصال بالإنترنت', 'success');
    // إعادة تحميل البيانات إذا لزم الأمر
    loadContent();
});

window.addEventListener('offline', function() {
    showToast('فقدان الاتصال بالإنترنت', 'warning');
});

// ===== منع الإجراءات الافتراضية =====
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// ===== تحسين أداء التمرير =====
const debouncedScroll = debounce(function() {
    // يمكن إضافة تأثيرات التمرير هنا إذا لزم الأمر
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ===== تهيئة مكونات Bootstrap =====
document.addEventListener('DOMContentLoaded', function() {
    try {
        // تهيئة جميع الأدوات المنبثقة
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    } catch (error) {
        console.error('❌ خطأ في تهيئة أدوات Bootstrap:', error);
    }
});

// ===== جعل الدوال متاحة عالمياً =====
window.toggleTheme = toggleTheme;
window.toggleFavorite = toggleFavorite;
window.removeFavorite = removeFavorite;
window.showItemDetails = showItemDetails;
window.startQuiz = startQuiz;
window.performGlobalSearch = performGlobalSearch;

// ===== تسجيل معلومات التطبيق =====
console.log('✅ تم تحميل تطبيق دليلك التعليمي والعملي بنجاح');
console.log('📊 إحصائيات التهيئة:');
console.log(`   - الوضع الحالي: ${currentTheme}`);
console.log(`   - عدد المفضلة: ${favorites.length}`);
console.log(`   - الصفحة الحالية: ${getCurrentPage()}`);

// دالة بدائية للاختبارات (سيتم استبدالها لاحقاً)
function startQuiz(id) {
    showToast('نظام الاختبارات قيد التطوير', 'info');
    console.log(`بدء الاختبار للعنصر: ${id}`);
}


// ===== إضافة زر تصفح المنصة إلى البطاقات =====
function createSectionCard(item, section) {
    try {
        const isFavorite = favorites.some(fav => fav.id === item.id);
        
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 mb-4';
        card.innerHTML = `
            <div class="card ${section}-card h-100">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="${item.logo} me-2"></i>
                        ${item.name}
                    </h5>
                </div>
                <div class="card-body">
                    <p class="card-text">${item.description}</p>
                    <ul class="features-list">
                        ${item.features.map(feature => `<li><i class="fas fa-check-circle"></i> ${feature}</li>`).join('')}
                    </ul>
                    <div class="mb-3">
                        <span class="category-badge">${item.category}</span>
                        <span class="language-badge">${item.language}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-details" onclick="showItemDetails(${item.id}, '${section}')">
                        <i class="fas fa-info-circle me-1"></i> التفاصيل
                    </button>
                    ${item.link ? `
                    <button class="btn btn-browse" onclick="browsePlatform(${item.id}, '${section}')">
                        <i class="fas fa-external-link-alt me-1"></i> تصفح المنصة
                    </button>
                    ` : ''}
                    ${item.hasQuiz ? `
                    <button class="btn btn-test" onclick="startQuiz(${item.id})">
                        <i class="fas fa-play-circle me-1"></i> ابدأ الاختبار
                    </button>
                    ` : ''}
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="toggleFavorite(${item.id}, '${section}')">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    } catch (error) {
        console.error('❌ خطأ في إنشاء بطاقة القسم:', error);
        return null;
    }
}

function createDashboardCard(item) {
    try {
        const isFavorite = favorites.some(fav => fav.id === item.id);
        const section = getItemSection(item.id);
        
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 mb-4';
        card.innerHTML = `
            <div class="card dashboard-card ${section}-card h-100">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="${item.logo} me-2"></i>
                        ${item.name}
                    </h5>
                </div>
                <div class="card-body">
                    <p class="card-text">${item.description}</p>
                    <div class="mb-3">
                        <span class="category-badge">${item.category}</span>
                        <span class="language-badge">${item.language}</span>
                        <span class="badge bg-secondary">${section}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-details" onclick="showItemDetails(${item.id}, '${section}')">
                        <i class="fas fa-info-circle me-1"></i> التفاصيل
                    </button>
                    ${item.link ? `
                    <button class="btn btn-browse" onclick="browsePlatform(${item.id}, '${section}')">
                        <i class="fas fa-external-link-alt me-1"></i> تصفح المنصة
                    </button>
                    ` : ''}
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="toggleFavorite(${item.id}, '${section}')">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    } catch (error) {
        console.error('❌ خطأ في إنشاء بطاقة لوحة التحكم:', error);
        return null;
    }
}

// ===== دالة تصفح المنصة =====
function browsePlatform(id, section) {
    try {
        const item = findItemById(id, section);
        if (!item) {
            console.error(`❌ العنصر غير موجود: ${id} في قسم ${section}`);
            showToast('لم يتم العثور على رابط المنصة', 'warning');
            return;
        }
        
        if (!item.link) {
            showToast('لا يتوفر رابط للمنصة حالياً', 'warning');
            return;
        }
        
        // فتح الرابط في نافذة جديدة
        window.open(item.link, '_blank', 'noopener,noreferrer');
        
        // تسجيل الإحصائيات (اختياري)
        logPlatformVisit(id, section);
        
        showToast(`جاري فتح ${item.name}`, 'success');
        
    } catch (error) {
        console.error('❌ خطأ في تصفح المنصة:', error);
        showToast('حدث خطأ في فتح المنصة', 'danger');
    }
}

// ===== تسجيل زيارات المنصات (اختياري) =====
function logPlatformVisit(id, section) {
    try {
        // يمكنك استخدام هذه الدالة لتسجيل إحصائيات الزيارات
        const visitLog = JSON.parse(localStorage.getItem('platformVisits')) || {};
        const key = `${section}_${id}`;
        
        visitLog[key] = visitLog[key] ? visitLog[key] + 1 : 1;
        localStorage.setItem('platformVisits', JSON.stringify(visitLog));
        
        console.log(`📊 تم تسجيل زيارة للمنصة: ${section}_${id}`);
    } catch (error) {
        console.error('❌ خطأ في تسجيل الزيارة:', error);
    }
}

// ===== تحديث CSS لإضافة تنسيق زر تصفح المنصة =====
function addBrowseButtonStyles() {
    try {
        const style = document.createElement('style');
        style.textContent = `
            .btn-browse {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                border: none;
                padding: 0.375rem 0.75rem;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                transition: all 0.3s ease;
                margin: 0 0.25rem;
            }
            
            .btn-browse:hover {
                background: linear-gradient(135deg, #218838, #1e9e8a);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
            }
            
            .btn-browse:active {
                transform: translateY(0);
            }
            
            @media (max-width: 768px) {
                .card-footer {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.25rem;
                }
                
                .btn-browse {
                    flex: 1;
                    min-width: 120px;
                    margin: 0.125rem;
                }
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error('❌ خطأ في إضافة أنماط زر التصفح:', error);
    }
}

// ===== تحديث دالة التهيئة الرئيسية =====
function initializeApp() {
    try {
        // تهيئة الوضع اللوني
        setTheme(currentTheme);
        
        // إضافة أنماط زر التصفح
        addBrowseButtonStyles();
        
        // إعداد المستمعين للأحداث
        setupEventListeners();
        
        // تحميل البيانات وعرض المحتوى
        loadContent();
        
        // تحديث عداد المفضلة
        updateFavoritesCount();
        
        // إعداد البحث العالمي
        setupGlobalSearch();
        
        console.log('✅ تم تهيئة التطبيق بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error);
        showToast('حدث خطأ في تحميل التطبيق', 'danger');
    }
}

// ===== جعل الدالة متاحة عالمياً =====
window.browsePlatform = browsePlatform;
