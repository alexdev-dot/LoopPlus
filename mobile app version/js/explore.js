// Explore Page JavaScript - LoopPlus Mobile
document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('mobile-splash-screen');
    const hideSplash = () => {
        if (!splash) return;
        if (splash.classList.contains('hide')) return;
        splash.classList.add('hide');
    };
    window.addEventListener('load', () => {
        setTimeout(hideSplash, 300);
    });
    setTimeout(hideSplash, 1500);
    // Mobile-specific selectors
    const mobileFilterTabs = document.querySelectorAll('.mobile-filter-tab');
    const mobileVideoCards = document.querySelectorAll('.mobile-video-card');
    const mobileCreatorCards = document.querySelectorAll('.mobile-creator-card');
    const mobileFollowCreatorBtns = document.querySelectorAll('.mobile-follow-creator-btn');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const mobileCreateBtn = document.querySelector('.mobile-create-btn');
    const exploreMain = document.querySelector('.explore-main');
    
    let currentCategory = 'trending';
    let isLoading = false;
    let pullToRefreshEnabled = true;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Initialize explore page
    initializeExplorePage();
    
    function initializeExplorePage() {
        // Set up filter tabs
        setupFilterTabs();
        
        // Set up video cards
        setupVideoCards();
        
        // Set up creator cards
        setupCreatorCards();
        
        // Set up bottom navigation
        setupBottomNavigation();
        
        // Set up pull to refresh
        setupPullToRefresh();
        
        // Set up create button
        setupCreateButton();
        
        // Set up scroll loading
        setupScrollLoading();
        
        // Set up scroll behavior
        setupScrollBehavior();
        
        // Load initial content
        loadContent(currentCategory);
    }
    
    function setupFilterTabs() {
        mobileFilterTabs.forEach(tab => {
            if (tab) {
                tab.addEventListener('click', () => {
                    if (isLoading) return;
                    
                    const category = tab.dataset.category;
                    if (category === currentCategory) return;
                    
                    // Update active state
                    mobileFilterTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Load new content
                    currentCategory = category;
                    loadContent(category);
                });
            }
        });
    }
    
    function setupVideoCards() {
        mobileVideoCards.forEach(card => {
            if (card) {
                card.addEventListener('click', () => {
                    handleVideoCardClick(card);
                });
                
                // Add hover effects for touch devices
                card.addEventListener('touchstart', () => {
                    card.style.transform = 'translateY(-4px) scale(1.02)';
                }, { passive: true });
                
                card.addEventListener('touchend', () => {
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 150);
                }, { passive: true });
            }
        });
    }
    
    function setupCreatorCards() {
        mobileCreatorCards.forEach(card => {
            if (card) {
                card.addEventListener('click', () => {
                    handleCreatorCardClick(card);
                });
                
                // Add hover effects for touch devices
                card.addEventListener('touchstart', () => {
                    card.style.transform = 'translateY(-4px) scale(1.05)';
                }, { passive: true });
                
                card.addEventListener('touchend', () => {
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 150);
                }, { passive: true });
            }
        });
        
        // Setup follow buttons
        mobileFollowCreatorBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleFollowCreatorClick(btn);
                });
            }
        });
    }
    
    function setupBottomNavigation() {
        mobileNavItems.forEach(item => {
            if (item && item.href) {
                item.addEventListener('click', (e) => {
                    // Only handle if it's not the current page
                    if (!item.classList.contains('active')) {
                        // Add active state
                        mobileNavItems.forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    function setupPullToRefresh() {
        if (!exploreMain) return;
        
        let pullStartY = 0;
        let pullDistance = 0;
        let isPulling = false;
        const pullThreshold = 80;
        
        exploreMain.addEventListener('touchstart', (e) => {
            if (exploreMain.scrollTop === 0) {
                pullStartY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });
        
        exploreMain.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            
            const currentY = e.touches[0].clientY;
            pullDistance = currentY - pullStartY;
            
            if (pullDistance > 0 && pullDistance < pullThreshold * 2) {
                exploreMain.style.transform = `translateY(${pullDistance * 0.5}px)`;
                exploreMain.style.transition = 'none';
            }
        }, { passive: true });
        
        exploreMain.addEventListener('touchend', () => {
            if (!isPulling) return;
            
            exploreMain.style.transition = 'transform 0.3s ease';
            exploreMain.style.transform = '';
            
            if (pullDistance > pullThreshold) {
                handleRefresh();
            }
            
            isPulling = false;
            pullDistance = 0;
        }, { passive: true });
    }
    
    function setupCreateButton() {
        if (mobileCreateBtn) {
            mobileCreateBtn.addEventListener('click', () => {
                handleCreateClick();
            });
        }
    }
    
    function setupScrollLoading() {
        if (!exploreMain) return;
        
        exploreMain.addEventListener('scroll', () => {
            if (isLoading) return;
            
            const scrollHeight = exploreMain.scrollHeight;
            const scrollTop = exploreMain.scrollTop;
            const clientHeight = exploreMain.clientHeight;
            
            // Load more content when near bottom
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                loadMoreContent();
            }
            
            // Update scroll position for analytics
            updateScrollAnalytics(scrollTop, scrollHeight);
        }, { passive: true });
        
        // Setup touch gestures for enhanced scrolling
        setupTouchGestures();
    }
    
    function setupTouchGestures() {
        if (!exploreMain) return;
        
        let touchStartY = 0;
        let touchStartX = 0;
        let touchEndY = 0;
        let touchEndX = 0;
        let isScrolling = false;
        let scrollStartTime = 0;
        
        exploreMain.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            scrollStartTime = Date.now();
            isScrolling = false;
        }, { passive: true });
        
        exploreMain.addEventListener('touchmove', (e) => {
            touchEndY = e.touches[0].clientY;
            touchEndX = e.touches[0].clientX;
            
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;
            
            // Determine if user is scrolling vertically
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
                isScrolling = true;
            }
        }, { passive: true });
        
        exploreMain.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - scrollStartTime;
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;
            
            // Handle swipe gestures
            if (touchDuration < 300 && Math.abs(deltaY) > 50 && Math.abs(deltaX) < 50) {
                // Vertical swipe detected
                handleVerticalSwipe(deltaY > 0);
            }
            
            // Reset touch variables
            touchStartY = 0;
            touchStartX = 0;
            touchEndY = 0;
            touchEndX = 0;
            isScrolling = false;
        }, { passive: true });
    }
    
    function handleVerticalSwipe(swipeUp) {
        if (swipeUp) {
            // Swipe up - could trigger refresh or load more
            const scrollTop = exploreMain.scrollTop;
            const scrollHeight = exploreMain.scrollHeight;
            const clientHeight = exploreMain.clientHeight;
            
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                // Already at bottom, load more content
                loadMoreContent();
            }
        } else {
            // Swipe down - could trigger pull to refresh
            if (exploreMain.scrollTop <= 50) {
                handleRefresh();
            }
        }
    }
    
    function updateScrollAnalytics(scrollTop, scrollHeight) {
        // Track scroll depth for analytics
        const scrollDepth = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        // Update scroll depth milestones
        if (scrollDepth >= 25 && !this.reached25) {
            this.reached25 = true;
            console.log('User scrolled 25%');
        } else if (scrollDepth >= 50 && !this.reached50) {
            this.reached50 = true;
            console.log('User scrolled 50%');
        } else if (scrollDepth >= 75 && !this.reached75) {
            this.reached75 = true;
            console.log('User scrolled 75%');
        } else if (scrollDepth >= 90 && !this.reached90) {
            this.reached90 = true;
            console.log('User scrolled 90%');
        }
    }
    
    function handleVideoCardClick(card) {
        // Extract video information
        const title = card.querySelector('.mobile-video-title')?.textContent || 'Video';
        const creator = card.querySelector('.mobile-creator-name')?.textContent || 'Creator';
        
        showToast(`Opening: ${title} by ${creator}`);
        
        // In a real app, this would navigate to the video player
        setTimeout(() => {
            // Navigate to index page to play video
            window.location.href = 'index.html';
        }, 500);
    }
    
    function handleCreatorCardClick(card) {
        // Extract creator information
        const creatorName = card.querySelector('.mobile-creator-large-name')?.textContent || 'Creator';
        
        showToast(`Viewing profile: ${creatorName}`);
        
        // In a real app, this would navigate to the creator's profile
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 500);
    }
    
    function handleFollowCreatorClick(btn) {
        btn.classList.toggle('following');
        const icon = btn.querySelector('i');
        const text = btn.lastChild;
        
        if (btn.classList.contains('following')) {
            icon.className = 'fas fa-check';
            text.textContent = ' Following';
            showToast('Following creator!');
        } else {
            icon.className = 'fas fa-plus';
            text.textContent = ' Follow';
            showToast('Unfollowed creator');
        }
    }
    
    function handleCreateClick() {
        showToast('Create feature coming soon!');
    }
    
    function handleRefresh() {
        showToast('Refreshing content...');
        loadContent(currentCategory, true);
    }
    
    function loadContent(category, refresh = false) {
        if (isLoading) return;
        
        isLoading = true;
        showLoadingState();
        
        // Simulate API call
        setTimeout(() => {
            // Update content based on category
            updateContentForCategory(category);
            hideLoadingState();
            isLoading = false;
            
            if (refresh) {
                showToast('Content refreshed!');
            }
        }, 1000);
    }
    
    function loadMoreContent() {
        if (isLoading) return;
        
        isLoading = true;
        showToast('Loading more content...');
        
        // Simulate API call for more content
        setTimeout(() => {
            // Add more video cards
            addMoreVideoCards();
            isLoading = false;
        }, 1500);
    }
    
    function updateContentForCategory(category) {
        // In a real app, this would fetch data from an API
        // For now, we'll just update the UI to show the category change
        
        const videoGrid = document.querySelector('.mobile-video-grid');
        const creatorsGrid = document.querySelector('.mobile-creators-grid');
        
        if (videoGrid) {
            // Add subtle animation to show content update
            videoGrid.style.opacity = '0.5';
            setTimeout(() => {
                videoGrid.style.opacity = '1';
            }, 300);
        }
        
        if (creatorsGrid) {
            creatorsGrid.style.opacity = '0.5';
            setTimeout(() => {
                creatorsGrid.style.opacity = '1';
            }, 300);
        }
        
        console.log(`Loaded content for category: ${category}`);
    }
    
    function addMoreVideoCards() {
        const videoGrid = document.querySelector('.mobile-video-grid');
        if (!videoGrid) return;
        
        // Create new video cards (in a real app, this would be from API data)
        const newCards = createVideoCardSkeletons(4);
        
        newCards.forEach(card => {
            videoGrid.appendChild(card);
        });
        
        // Setup event listeners for new cards
        setupNewVideoCards();
    }
    
    function createVideoCardSkeletons(count) {
        const fragments = document.createDocumentFragment();
        
        for (let i = 0; i < count; i++) {
            const card = document.createElement('div');
            card.className = 'mobile-video-card';
            card.innerHTML = `
                <div class="mobile-video-thumbnail">
                    <img src="https://picsum.photos/seed/new${Date.now() + i}/300/400" alt="Video thumbnail">
                    <div class="mobile-video-overlay">
                        <div class="mobile-play-icon">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="mobile-video-stats">
                            <span><i class="fas fa-eye"></i> ${(Math.random() * 1000).toFixed(1)}K</span>
                            <span><i class="fas fa-heart"></i> ${(Math.random() * 100).toFixed(1)}K</span>
                        </div>
                    </div>
                </div>
                <div class="mobile-video-info">
                    <div class="mobile-creator-info">
                        <img src="https://picsum.photos/seed/creator${Date.now() + i}/40/40" alt="Creator" class="mobile-creator-avatar">
                        <div class="mobile-creator-details">
                            <h3 class="mobile-creator-name">@creator${Date.now() + i}</h3>
                            <p class="mobile-video-title">Amazing new content!</p>
                        </div>
                    </div>
                </div>
            `;
            fragments.appendChild(card);
        }
        
        return fragments.children;
    }
    
    function setupNewVideoCards() {
        const newCards = document.querySelectorAll('.mobile-video-card:not(.setup)');
        newCards.forEach(card => {
            card.classList.add('setup');
            card.addEventListener('click', () => {
                handleVideoCardClick(card);
            });
        });
    }
    
    function showLoadingState() {
        // Add loading indicators
        const videoGrid = document.querySelector('.mobile-video-grid');
        const creatorsGrid = document.querySelector('.mobile-creators-grid');
        
        if (videoGrid) {
            videoGrid.style.opacity = '0.5';
        }
        
        if (creatorsGrid) {
            creatorsGrid.style.opacity = '0.5';
        }
    }
    
    function hideLoadingState() {
        // Remove loading indicators
        const videoGrid = document.querySelector('.mobile-video-grid');
        const creatorsGrid = document.querySelector('.mobile-creators-grid');
        
        if (videoGrid) {
            videoGrid.style.opacity = '1';
        }
        
        if (creatorsGrid) {
            creatorsGrid.style.opacity = '1';
        }
    }
    
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.mobile-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'mobile-toast';
            toast.style.cssText = `
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 500;
                z-index: 2000;
                opacity: 0;
                transition: all 0.3s ease;
                pointer-events: none;
            `;
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-10px)';
        }, 2000);
    }
    
    // Handle search functionality (if search input is added later)
    function setupSearch() {
        const searchInput = document.querySelector('.search-input-mobile');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length > 2) {
                    performSearch(query);
                }
            });
        }
    }
    
    function performSearch(query) {
        showToast(`Searching for: ${query}`);
        // In a real app, this would perform an actual search
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Debounce resize events
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            // Adjust layout if needed
            adjustLayoutForScreenSize();
        }, 250);
    });
    
    function adjustLayoutForScreenSize() {
        const width = window.innerWidth;
        const videoGrid = document.querySelector('.mobile-video-grid');
        const creatorsGrid = document.querySelector('.mobile-creators-grid');
        
        if (width <= 380) {
            // Very small screens
            if (videoGrid) videoGrid.style.gridTemplateColumns = '1fr';
            if (creatorsGrid) creatorsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (width <= 480) {
            // Small screens
            if (videoGrid) videoGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            if (creatorsGrid) creatorsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
    }
    
    function setupScrollBehavior() {
        if (!exploreMain) return;
        
        let scrollTimeout;
        let isScrolling = false;
        
        // Add scroll indicator class
        exploreMain.classList.add('scroll-indicator');
        
        // Handle scroll events
        exploreMain.addEventListener('scroll', () => {
            if (!isScrolling) {
                exploreMain.classList.add('scrolling');
                isScrolling = true;
            }
            
            // Clear existing timeout
            clearTimeout(scrollTimeout);
            
            // Set timeout to remove scrolling class
            scrollTimeout = setTimeout(() => {
                exploreMain.classList.remove('scrolling');
                isScrolling = false;
            }, 150);
            
            // Update scroll progress indicator
            updateScrollProgress();
        }, { passive: true });
        
        // Handle scroll to top functionality
        setupScrollToTop();
        
        // Handle momentum scrolling for iOS
        setupMomentumScrolling();
        
        // Handle scroll snap for sections
        setupScrollSnap();
    }
    
    function updateScrollProgress() {
        if (!exploreMain) return;
        
        const scrollTop = exploreMain.scrollTop;
        const scrollHeight = exploreMain.scrollHeight - exploreMain.clientHeight;
        const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        // Update CSS variable for progress indicator
        document.documentElement.style.setProperty('--scroll-progress', scrollProgress + '%');
    }
    
    function setupScrollToTop() {
        // Create scroll to top button
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-to-top-btn';
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollTopBtn.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
            pointer-events: none;
        `;
        
        document.body.appendChild(scrollTopBtn);
        
        // Show/hide scroll to top button based on scroll position
        exploreMain.addEventListener('scroll', () => {
            if (exploreMain.scrollTop > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.transform = 'translateY(0)';
                scrollTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.transform = 'translateY(20px)';
                scrollTopBtn.style.pointerEvents = 'none';
            }
        }, { passive: true });
        
        // Scroll to top when clicked
        scrollTopBtn.addEventListener('click', () => {
            exploreMain.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    function setupMomentumScrolling() {
        // Enhance momentum scrolling for iOS devices
        if (exploreMain) {
            exploreMain.style.webkitOverflowScrolling = 'touch';
            
            // Add bounce effect for scroll boundaries
            exploreMain.addEventListener('scroll', () => {
                const scrollTop = exploreMain.scrollTop;
                const maxScroll = exploreMain.scrollHeight - exploreMain.clientHeight;
                
                // Add bounce effect at boundaries
                if (scrollTop <= 0 || scrollTop >= maxScroll) {
                    exploreMain.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                } else {
                    exploreMain.style.transition = 'none';
                }
            }, { passive: true });
        }
    }
    
    function setupScrollSnap() {
        // Add scroll snap to major sections for better UX
        const sections = document.querySelectorAll('.mobile-content-section');
        if (sections.length > 0) {
            exploreMain.style.scrollSnapType = 'y proximity';
            
            sections.forEach(section => {
                section.style.scrollSnapAlign = 'start';
                section.style.scrollSnapStop = 'always';
            });
        }
    }
    
    // Initialize layout
    adjustLayoutForScreenSize();
    
    console.log('LoopPlus Mobile Explore Page initialized');
});
