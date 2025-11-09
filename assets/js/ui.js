// ===== ملف ui.js - إدارة واجهة المستخدم التفاعلية =====

// ===== المتغيرات العامة للواجهة =====
let currentModal = null;
let currentQuiz = null;
let currentQuestionIndex = 0;
let quizScore = 0;
let selectedAnswers = {};
let activeFilters = {
    category: '',
    language: '',
    level: '',
    search: ''
};
let currentView = 'grid'; // 'grid' or 'list'

// ===== تهيئة واجهة المستخدم =====
function initializeUI() {
    try {
        console.log('🎨 بدء تهيئة واجهة المستخدم...');
        
        // إعداد النوافذ المنبثقة
        setupModals();
        
        // إعداد نظام الفلاتر
        setupFilters();
        
        // إعداد نظام العرض
        setupViewSystem();
        
        // إعداد التفاعلات الديناميكية
        setupDynamicInteractions();
        
        // إعداد نظام الاختبارات
        setupQuizSystem();
        
        // إعداد تكامل اليوتيوب
        setupYouTubeIntegration();
        
        console.log('✅ تم تهيئة واجهة المستخدم بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تهيئة واجهة المستخدم:', error);
        showToast('حدث خطأ في تحميل الواجهة', 'danger');
    }
}

// ===== إدارة النوافذ المنبثقة =====
function setupModals() {
    try {
        // إعداد إغلاق النوافذ عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                closeCurrentModal();
            }
        });
        
        // إعداد إغلاق النوافذ بالزر ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && currentModal) {
                closeCurrentModal();
            }
        });
        
        // منع إغلاق النوافذ عند النقر داخلها
        document.querySelectorAll('.modal-content').forEach(modalContent => {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
        
        console.log('✅ تم إعداد النوافذ المنبثقة');
    } catch (error) {
        console.error('❌ خطأ في إعداد النوافذ المنبثقة:', error);
    }
}

function showModal(modalId, options = {}) {
    try {
        closeCurrentModal();
        
        const modalElement = document.getElementById(modalId);
        if (!modalElement) {
            console.error(`❌ النافذة غير موجودة: ${modalId}`);
            return;
        }
        
        // تطبيق الخيارات الإضافية
        if (options.onOpen) {
            options.onOpen();
        }
        
        // إظهار النافذة
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        currentModal = modal;
        
        // إضافة تأثيرات ظهور
        modalElement.style.opacity = '0';
        modalElement.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            modalElement.style.opacity = '1';
            modalElement.style.transform = 'scale(1)';
            modalElement.style.transition = 'all 0.3s ease';
        }, 50);
        
        // إعداد الإغلاق عند نجاح الإجراء
        if (options.onSuccess) {
            const successBtn = modalElement.querySelector('.btn-success');
            if (successBtn) {
                successBtn.addEventListener('click', options.onSuccess);
            }
        }
        
        console.log(`📁 فتح النافذة: ${modalId}`);
        
    } catch (error) {
        console.error('❌ خطأ في فتح النافذة:', error);
    }
}

function closeCurrentModal() {
    try {
        if (currentModal) {
            currentModal.hide();
            currentModal = null;
        }
        
        // إغلاق جميع النوافذ يدوياً للتأكد
        document.querySelectorAll('.modal').forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });
    } catch (error) {
        console.error('❌ خطأ في إغلاق النافذة:', error);
    }
}

// ===== نافذة التفاصيل المتقدمة =====
function showAdvancedDetails(itemId, section) {
    try {
        const item = findItemById(itemId, section);
        if (!item) {
            showToast('لم يتم العثور على العنصر', 'warning');
            return;
        }
        
        // تحضير محتوى النافذة
        const modalContent = `
            <div class="platform-details">
                <div class="detail-header">
                    <div class="detail-icon">
                        <i class="${item.logo}"></i>
                    </div>
                    <div class="detail-title">
                        <h4>${item.name}</h4>
                        <div class="detail-meta">
                            <span class="badge bg-primary">${item.category}</span>
                            <span class="badge bg-secondary">${item.language}</span>
                            <span class="badge bg-info">${item.level}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-content">
                    <div class="detail-section">
                        <h6><i class="fas fa-info-circle me-2"></i>الوصف الشامل</h6>
                        <p>${item.description}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-star me-2"></i>المميزات الرئيسية</h6>
                        <div class="features-grid">
                            ${item.features.map(feature => `
                                <div class="feature-item">
                                    <i class="fas fa-check text-success me-2"></i>
                                    <span>${feature}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-bullseye me-2"></i>طريقة الاستخدام</h6>
                        <p>${item.usage}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-file-alt me-2"></i>الشروط والمتطلبات</h6>
                        <p>${item.conditions}</p>
                    </div>
                    
                    ${item.hasQuiz ? `
                    <div class="detail-section">
                        <h6><i class="fas fa-clipboard-check me-2"></i>اختبار التقييم</h6>
                        <p>هذا العنصر يحتوي على اختبار تقييمي لمهاراتك</p>
                        <button class="btn btn-primary mt-2" onclick="startInteractiveQuiz(${itemId})">
                            <i class="fas fa-play-circle me-1"></i>بدء الاختبار
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // تحديث محتوى النافذة
        document.getElementById('modal-title').textContent = item.name;
        document.getElementById('modal-content').innerHTML = modalContent;
        document.getElementById('platform-link').href = item.link;
        
        // تحديث زر المفضلة
        const isFavorite = favorites.some(fav => fav.id === itemId);
        const favoriteBtn = document.getElementById('add-to-favorites');
        favoriteBtn.innerHTML = isFavorite ? 
            '<i class="fas fa-heart"></i> إزالة من المفضلة' : 
            '<i class="far fa-heart"></i> إضافة إلى المفضلة';
        
        favoriteBtn.onclick = function() {
            toggleFavorite(itemId, section);
            const modal = bootstrap.Modal.getInstance(document.getElementById('details-modal'));
            if (modal) modal.hide();
            showToast(isFavorite ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة إلى المفضلة', 
                     isFavorite ? 'warning' : 'success');
        };
        
        // فتح النافذة
        showModal('details-modal', {
            onOpen: () => {
                // إضافة تأثيرات إضافية عند الفتح
                animateModalElements();
            }
        });
        
    } catch (error) {
        console.error('❌ خطأ في عرض التفاصيل المتقدمة:', error);
        showToast('حدث خطأ في عرض التفاصيل', 'danger');
    }
}

function animateModalElements() {
    // إضافة تأثيرات ظهور متتالية لعناصر النافذة
    const elements = document.querySelectorAll('.detail-section');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// ===== نظام الفلاتر المتقدمة =====
function setupFilters() {
    try {
        // إعداد الفلاتر في لوحة التحكم
        setupDashboardFilters();
        
        // إعداد البحث المتقدم
        setupAdvancedSearch();
        
        // إعداد فلاتر المفضلة
        setupFavoritesFilters();
        
        console.log('✅ تم إعداد نظام الفلاتر');
    } catch (error) {
        console.error('❌ خطأ في إعداد الفلاتر:', error);
    }
}

function setupDashboardFilters() {
    try {
        const filters = ['category', 'language', 'level'];
        
        filters.forEach(filterType => {
            const filterElement = document.getElementById(`${filterType}-filter`);
            if (filterElement) {
                filterElement.addEventListener('change', function() {
                    activeFilters[filterType] = this.value;
                    applyAdvancedFilters();
                });
            }
        });
        
        // زر إعادة تعيين الفلاتر
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetFilters);
        }
        
    } catch (error) {
        console.error('❌ خطأ في إعداد فلاتر لوحة التحكم:', error);
    }
}

function setupAdvancedSearch() {
    try {
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
            // البحث أثناء الكتابة مع debounce
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    activeFilters.search = this.value.trim();
                    applyAdvancedFilters();
                }, 300);
            });
            
            // إضافة اقتراحات البحث
            searchInput.addEventListener('focus', showSearchSuggestions);
        }
    } catch (error) {
        console.error('❌ خطأ في إعداد البحث المتقدم:', error);
    }
}

function showSearchSuggestions() {
    // في التطبيق الحقيقي، سيتم جلب الاقتراحات من البيانات
    console.log('🔍 عرض اقتراحات البحث');
}

function applyAdvancedFilters() {
    try {
        let filteredData = getAllPlatformData();
        
        // تطبيق الفلاتر النشطة
        if (activeFilters.category) {
            filteredData = filteredData.filter(item => item.category === activeFilters.category);
        }
        
        if (activeFilters.language) {
            filteredData = filteredData.filter(item => item.language === activeFilters.language);
        }
        
        if (activeFilters.level) {
            filteredData = filteredData.filter(item => item.level === activeFilters.level);
        }
        
        if (activeFilters.search) {
            const searchTerm = activeFilters.search.toLowerCase();
            filteredData = filteredData.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.features.some(feature => feature.toLowerCase().includes(searchTerm)) ||
                item.category.toLowerCase().includes(searchTerm)
            );
        }
        
        // عرض البيانات المصفاة
        displayFilteredResults(filteredData);
        
        // تحديث إحصائيات الفلترة
        updateFilterStats(filteredData.length);
        
    } catch (error) {
        console.error('❌ خطأ في تطبيق الفلاتر:', error);
    }
}

function displayFilteredResults(data) {
    try {
        const currentPage = getCurrentPage();
        
        if (currentPage === 'dashboard') {
            displayDashboardCards(data);
        } else if (currentPage.includes('favorites')) {
            displayFavoritesSearchResults(data);
        } else {
            const section = currentPage;
            displaySectionSearchResults(data, section);
        }
        
    } catch (error) {
        console.error('❌ خطأ في عرض النتائج المصفاة:', error);
    }
}

function updateFilterStats(resultCount) {
    const totalCount = getAllPlatformData().length;
    const statsElement = document.getElementById('filter-stats');
    
    if (statsElement) {
        if (activeFilters.category || activeFilters.language || activeFilters.level || activeFilters.search) {
            statsElement.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-filter me-2"></i>
                    عرض ${resultCount} من أصل ${totalCount} نتيجة
                    ${activeFilters.search ? ` للبحث: "${activeFilters.search}"` : ''}
                    <button class="btn btn-sm btn-outline-info me-2" onclick="resetFilters()">
                        إعادة تعيين
                    </button>
                </div>
            `;
            statsElement.style.display = 'block';
        } else {
            statsElement.style.display = 'none';
        }
    }
}

function resetFilters() {
    try {
        // إعادة تعيين جميع الفلاتر
        activeFilters = {
            category: '',
            language: '',
            level: '',
            search: ''
        };
        
        // إعادة تعيين عناصر الواجهة
        const filters = ['category', 'language', 'level'];
        filters.forEach(filterType => {
            const filterElement = document.getElementById(`${filterType}-filter`);
            if (filterElement) {
                filterElement.value = '';
            }
        });
        
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // إعادة تحميل البيانات الأصلية
        applyAdvancedFilters();
        
        showToast('تم إعادة تعيين جميع الفلاتر', 'info');
        
    } catch (error) {
        console.error('❌ خطأ في إعادة تعيين الفلاتر:', error);
    }
}

// ===== إدارة حالات العرض =====
function setupViewSystem() {
    try {
        // أزرار تبديل طريقة العرض
        const gridViewBtn = document.getElementById('grid-view');
        const listViewBtn = document.getElementById('list-view');
        
        if (gridViewBtn && listViewBtn) {
            gridViewBtn.addEventListener('click', () => switchViewMode('grid'));
            listViewBtn.addEventListener('click', () => switchViewMode('list'));
        }
        
        // تحميل التفضيل السابق
        const savedView = localStorage.getItem('preferredView') || 'grid';
        switchViewMode(savedView, false);
        
        console.log('✅ تم إعداد نظام العرض');
    } catch (error) {
        console.error('❌ خطأ في إعداد نظام العرض:', error);
    }
}

function switchViewMode(viewType, showNotification = true) {
    try {
        currentView = viewType;
        
        // تحديث الأزرار النشطة
        const gridViewBtn = document.getElementById('grid-view');
        const listViewBtn = document.getElementById('list-view');
        
        if (gridViewBtn && listViewBtn) {
            if (viewType === 'grid') {
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
            } else {
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
            }
        }
        
        // تطبيق نمط العرض على الحاوية
        const resultsContainer = document.getElementById('dashboard-results') || 
                               document.querySelector('.row[id$="-cards"]');
        
        if (resultsContainer) {
            resultsContainer.className = viewType === 'grid' ? 
                'row grid-view' : 'row list-view';
            
            // إعادة تطبيق الفلاتر الحالية
            applyAdvancedFilters();
        }
        
        // حفظ التفضيل
        localStorage.setItem('preferredView', viewType);
        
        if (showNotification) {
            showToast(`تم التبديل إلى عرض ${viewType === 'grid' ? 'الشبكة' : 'القائمة'}`, 'info');
        }
        
    } catch (error) {
        console.error('❌ خطأ في تبديل وضع العرض:', error);
    }
}

// ===== التفاعلات الديناميكية =====
function setupDynamicInteractions() {
    try {
        // تأثيرات Hover للبطاقات
        setupCardHoverEffects();
        
        // التفاعلات مع الأزرار
        setupButtonInteractions();
        
        // نظام السحب والإفلات (للمفضلة)
        setupDragAndDrop();
        
        // التحكم في التمرير اللطيف
        setupSmoothScrolling();
        
        console.log('✅ تم إعداد التفاعلات الديناميكية');
    } catch (error) {
        console.error('❌ خطأ في إعداد التفاعلات الديناميكية:', error);
    }
}

function setupCardHoverEffects() {
    // إضافة تأثيرات hover متقدمة للبطاقات
    document.addEventListener('mouseover', function(e) {
        const card = e.target.closest('.card');
        if (card && !card.classList.contains('no-hover')) {
            card.style.transition = 'all 0.3s ease';
        }
    });
}

function setupButtonInteractions() {
    // إضافة تأثيرات الضغط على الأزرار
    document.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
            const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
            btn.style.transform = 'scale(0.95)';
        }
    });
    
    document.addEventListener('mouseup', function(e) {
        if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
            const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
            btn.style.transform = 'scale(1)';
        }
    });
}

function setupDragAndDrop() {
    // في التطبيق الحقيقي، سيتم إضافة نظام سحب وإفلات لإعادة ترتيب المفضلة
    console.log('🎯 إعداد السحب والإفلات (جاهز للتطوير)');
}

function setupSmoothScrolling() {
    // جعل التمرير أكثر سلاسة
    document.addEventListener('scroll', function() {
        // يمكن إضافة تأثيرات التمرير هنا
    });
}

// ===== نظام الاختبارات التفاعلي =====
function setupQuizSystem() {
    try {
        console.log('✅ تم إعداد نظام الاختبارات');
    } catch (error) {
        console.error('❌ خطأ في إعداد نظام الاختبارات:', error);
    }
}

function startInteractiveQuiz(quizId) {
    try {
        const quiz = quizData[quizId];
        if (!quiz) {
            showToast('لا يوجد اختبار متاح حالياً', 'info');
            return;
        }
        
        currentQuiz = quiz;
        currentQuestionIndex = 0;
        quizScore = 0;
        selectedAnswers = {};
        
        showQuizQuestion();
        
    } catch (error) {
        console.error('❌ خطأ في بدء الاختبار:', error);
        showToast('حدث خطأ في بدء الاختبار', 'danger');
    }
}

function showQuizQuestion() {
    try {
        if (!currentQuiz || currentQuestionIndex >= currentQuiz.questions.length) {
            showQuizResult();
            return;
        }
        
        const question = currentQuiz.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
        
        const quizContent = `
            <div class="quiz-progress">
                <div class="progress">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                <small>السؤال ${currentQuestionIndex + 1} من ${currentQuiz.questions.length}</small>
            </div>
            
            <div class="quiz-question">
                <h5>${question.question}</h5>
            </div>
            
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <div class="quiz-option ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}" 
                         onclick="selectQuizAnswer(${index})">
                        <div class="option-number">${index + 1}</div>
                        <div class="option-text">${option}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="quiz-actions">
                ${currentQuestionIndex > 0 ? `
                    <button class="btn btn-secondary" onclick="previousQuestion()">
                        <i class="fas fa-arrow-right me-1"></i>السابق
                    </button>
                ` : ''}
                
                <button class="btn btn-primary" onclick="nextQuestion()" 
                        ${!selectedAnswers.hasOwnProperty(currentQuestionIndex) ? 'disabled' : ''}>
                    ${currentQuestionIndex === currentQuiz.questions.length - 1 ? 
                        'إنهاء الاختبار' : 'التالي <i class="fas fa-arrow-left me-1"></i>'}
                </button>
            </div>
        `;
        
        document.getElementById('quiz-title').textContent = currentQuiz.title;
        document.getElementById('quiz-content').innerHTML = quizContent;
        
        showModal('quiz-modal');
        
    } catch (error) {
        console.error('❌ خطأ في عرض سؤال الاختبار:', error);
    }
}

function selectQuizAnswer(answerIndex) {
    try {
        // إزالة التحديد السابق
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // تحديد الإجابة الجديدة
        const options = document.querySelectorAll('.quiz-option');
        if (options[answerIndex]) {
            options[answerIndex].classList.add('selected');
        }
        
        // حفظ الإجابة المحددة
        selectedAnswers[currentQuestionIndex] = answerIndex;
        
        // تمكين زر المتابعة
        const nextBtn = document.querySelector('.quiz-actions .btn-primary');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
        
    } catch (error) {
        console.error('❌ خطأ في اختيار الإجابة:', error);
    }
}

function nextQuestion() {
    try {
        if (currentQuestionIndex < currentQuiz.questions.length - 1) {
            currentQuestionIndex++;
            showQuizQuestion();
        } else {
            showQuizResult();
        }
    } catch (error) {
        console.error('❌ خطأ في الانتقال للسؤال التالي:', error);
    }
}

function previousQuestion() {
    try {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuizQuestion();
        }
    } catch (error) {
        console.error('❌ خطأ في العودة للسؤال السابق:', error);
    }
}

function showQuizResult() {
    try {
        // حساب النتيجة
        let score = 0;
        currentQuiz.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                score++;
            }
        });
        
        const percentage = (score / currentQuiz.questions.length) * 100;
        
        let message, icon, color;
        if (percentage >= 80) {
            message = 'ممتاز! أداء رائع';
            icon = 'fas fa-trophy';
            color = 'warning';
        } else if (percentage >= 60) {
            message = 'جيد جداً! استمر في التعلم';
            icon = 'fas fa-star';
            color = 'success';
        } else {
            message = 'حاول مرة أخرى، يمكنك التحسن';
            icon = 'fas fa-redo-alt';
            color = 'info';
        }
        
        const quizContent = `
            <div class="quiz-result text-center">
                <div class="result-icon">
                    <i class="${icon} fa-4x text-${color}"></i>
                </div>
                <div class="result-score">
                    <h2>${score}/${currentQuiz.questions.length}</h2>
                    <div class="progress my-3">
                        <div class="progress-bar bg-${color}" style="width: ${percentage}%"></div>
                    </div>
                    <p>${percentage.toFixed(1)}%</p>
                </div>
                <div class="result-message">
                    <h4>${message}</h4>
                    <p class="text-muted">لقد أكملت اختبار ${currentQuiz.title} بنجاح</p>
                </div>
                <div class="result-actions mt-4">
                    <button class="btn btn-primary" onclick="startInteractiveQuiz(${Object.keys(quizData).find(key => quizData[key] === currentQuiz)})">
                        <i class="fas fa-redo me-1"></i>إعادة الاختبار
                    </button>
                    <button class="btn btn-secondary" onclick="closeCurrentModal()">
                        <i class="fas fa-times me-1"></i>إغلاق
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('quiz-content').innerHTML = quizContent;
        document.getElementById('quiz-title').textContent = 'نتيجة الاختبار';
        
    } catch (error) {
        console.error('❌ خطأ في عرض نتيجة الاختبار:', error);
    }
}

// ===== تكامل اليوتيوب =====
function setupYouTubeIntegration() {
    try {
        console.log('✅ تم إعداد تكامل اليوتيوب');
    } catch (error) {
        console.error('❌ خطأ في إعداد تكامل اليوتيوب:', error);
    }
}

function openYouTubePlayer(videoId, channelName) {
    try {
        const modalContent = `
            <div class="youtube-player">
                <div class="player-header">
                    <h5>${channelName}</h5>
                </div>
                <div class="player-container">
                    <iframe 
                        width="100%" 
                        height="400" 
                        src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="player-actions mt-3">
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="btn btn-danger">
                        <i class="fab fa-youtube me-1"></i>مشاهدة على اليوتيوب
                    </a>
                    <button class="btn btn-secondary" onclick="closeCurrentModal()">
                        إغلاق
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('modal-title').textContent = 'مشغل اليوتيوب';
        document.getElementById('modal-content').innerHTML = modalContent;
        
        showModal('details-modal');
        
    } catch (error) {
        console.error('❌ خطأ في فتح مشغل اليوتيوب:', error);
        showToast('حدث خطأ في تحميل الفيديو', 'danger');
    }
}

// ===== وظائف مساعدة للواجهة =====
function showLoadingAnimation(element) {
    if (element) {
        element.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>جاري التحميل...</span>
            </div>
        `;
    }
}

function hideLoadingAnimation(element, originalContent) {
    if (element && originalContent) {
        element.innerHTML = originalContent;
    }
}

function animateElement(element, animation) {
    element.style.animation = `${animation} 0.5s ease`;
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// ===== جعل الدوال متاحة عالمياً =====
window.initializeUI = initializeUI;
window.showAdvancedDetails = showAdvancedDetails;
window.startInteractiveQuiz = startInteractiveQuiz;
window.selectQuizAnswer = selectQuizAnswer;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.openYouTubePlayer = openYouTubePlayer;
window.switchViewMode = switchViewMode;
window.resetFilters = resetFilters;
window.closeCurrentModal = closeCurrentModal;

// ===== التهيئة التلقائية عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    // تأخير تهيئة الواجهة قليلاً لضمان تحميل جميع العناصر
    setTimeout(() => {
        initializeUI();
    }, 100);
});

console.log('🎨 تم تحميل واجهة المستخدم التفاعلية بنجاح');