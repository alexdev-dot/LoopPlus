// Profile Page JavaScript - LoopPlus Mobile
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
    const mobileNavTabs = document.querySelectorAll('.mobile-nav-tab');
    const mobileTabContents = document.querySelectorAll('.mobile-tab-content');
    const mobileFilterBtns = document.querySelectorAll('.mobile-filter-btn');
    const mobileVideoCards = document.querySelectorAll('.mobile-video-card');
    const mobileFollowBtn = document.querySelector('.mobile-follow-btn');
    const mobileMessageBtn = document.querySelector('.mobile-message-btn');
    const mobileShareBtn = document.querySelector('.mobile-share-btn');
    const mobileEditAvatarBtn = document.querySelector('.mobile-edit-avatar-btn');
    const mobileCreatePlaylistBtn = document.querySelector('.mobile-create-playlist-btn');
    const mobileEmptyStateActions = document.querySelectorAll('.mobile-empty-state-action');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const mobileBackBtn = document.querySelector('.mobile-back-btn');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileProfileMain = document.querySelector('.mobile-profile-main');
    
    let currentTab = 'videos';
    let currentFilter = 'All';
    let isLoading = false;
    
    // Initialize profile page
    initializeProfilePage();
    
    function initializeProfilePage() {
        // Set up navigation tabs
        setupNavigationTabs();
        
        // Set up filter buttons
        setupFilterButtons();
        
        // Set up video cards
        setupVideoCards();
        
        // Set up action buttons
        setupActionButtons();
        
        // Set up bottom navigation
        setupBottomNavigation();
        
        // Set up header buttons
        setupHeaderButtons();
        
        // Set up empty state actions
        setupEmptyStateActions();
        
        // Set up scroll loading
        setupScrollLoading();
        
        // Load initial content
        loadTabContent(currentTab);
    }
    
    function setupNavigationTabs() {
        mobileNavTabs.forEach(tab => {
            if (tab) {
                tab.addEventListener('click', () => {
                    const tabName = tab.dataset.tab;
                    if (tabName === currentTab) return;
                    
                    // Update active states
                    mobileNavTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Switch tab content
                    switchTab(tabName);
                });
            }
        });
    }
    
    function setupFilterButtons() {
        mobileFilterBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    const filter = btn.textContent.trim();
                    if (filter === currentFilter) return;
                    
                    // Update active states
                    mobileFilterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Apply filter
                    currentFilter = filter;
                    applyFilter(filter);
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
                    card.style.transform = 'translateY(-4px)';
                }, { passive: true });
                
                card.addEventListener('touchend', () => {
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 150);
                }, { passive: true });
            }
        });
    }
    
    function setupActionButtons() {
        if (mobileFollowBtn) {
            mobileFollowBtn.addEventListener('click', () => {
                handleFollowClick();
            });
        }
        
        if (mobileMessageBtn) {
            mobileMessageBtn.addEventListener('click', () => {
                handleMessageClick();
            });
        }
        
        if (mobileShareBtn) {
            mobileShareBtn.addEventListener('click', () => {
                handleShareClick();
            });
        }
        
        if (mobileEditAvatarBtn) {
            mobileEditAvatarBtn.addEventListener('click', () => {
                handleEditAvatarClick();
            });
        }
        
        if (mobileCreatePlaylistBtn) {
            mobileCreatePlaylistBtn.addEventListener('click', () => {
                handleCreatePlaylistClick();
            });
        }
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
    
    function setupHeaderButtons() {
        if (mobileBackBtn) {
            mobileBackBtn.addEventListener('click', () => {
                history.back();
            });
        }
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                handleMenuClick();
            });
        }
    }
    
    function setupEmptyStateActions() {
        mobileEmptyStateActions.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    handleEmptyStateAction(btn);
                });
            }
        });
    }
    
    function setupScrollLoading() {
        if (!mobileProfileMain) return;
        
        mobileProfileMain.addEventListener('scroll', () => {
            if (isLoading) return;
            
            const scrollHeight = mobileProfileMain.scrollHeight;
            const scrollTop = mobileProfileMain.scrollTop;
            const clientHeight = mobileProfileMain.clientHeight;
            
            // Load more content when near bottom
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                loadMoreContent();
            }
        }, { passive: true });
    }
    
    function switchTab(tabName) {
        // Hide all tab contents
        mobileTabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab content
        const targetContent = document.getElementById(`${tabName}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        currentTab = tabName;
        loadTabContent(tabName);
    }
    
    function loadTabContent(tabName) {
        if (isLoading) return;
        
        isLoading = true;
        showLoadingState();
        
        // Simulate API call
        setTimeout(() => {
            updateTabContent(tabName);
            hideLoadingState();
            isLoading = false;
        }, 800);
    }
    
    function updateTabContent(tabName) {
        // In a real app, this would fetch data from an API
        // For now, we'll just update the UI
        
        const activeContent = document.querySelector('.mobile-tab-content.active');
        if (activeContent) {
            // Add subtle animation to show content update
            activeContent.style.opacity = '0.5';
            setTimeout(() => {
                activeContent.style.opacity = '1';
            }, 300);
        }
        
        console.log(`Loaded content for tab: ${tabName}`);
    }
    
    function applyFilter(filter) {
        const videoGrid = document.querySelector('.mobile-videos-grid');
        if (!videoGrid) return;
        
        const videos = videoGrid.querySelectorAll('.mobile-video-card');
        
        videos.forEach(video => {
            // In a real app, this would filter based on actual data
            if (filter === 'All') {
                video.style.display = 'block';
            } else {
                // Simulate filtering - randomly show/hide some videos
                video.style.display = Math.random() > 0.3 ? 'block' : 'none';
            }
        });
        
        showToast(`Filter: ${filter}`);
    }
    
    function handleVideoCardClick(card) {
        // Extract video information
        const title = card.querySelector('.mobile-video-title')?.textContent || 'Video';
        
        showToast(`Opening: ${title}`);
        
        // In a real app, this would navigate to the video player
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
    
    function handleFollowClick() {
        if (!mobileFollowBtn) return;
        
        const isFollowing = mobileFollowBtn.classList.contains('following');
        
        if (isFollowing) {
            mobileFollowBtn.classList.remove('following');
            mobileFollowBtn.innerHTML = '<i class="fas fa-user-plus"></i><span>Follow</span>';
            showToast('Unfollowed user');
        } else {
            mobileFollowBtn.classList.add('following');
            mobileFollowBtn.innerHTML = '<i class="fas fa-user-check"></i><span>Following</span>';
            showToast('Following user!');
        }
    }
    
    function handleMessageClick() {
        showToast('Messaging feature coming soon!');
    }
    
    function handleShareClick() {
        const profileUrl = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: 'LoopPlus Profile',
                text: 'Check out this amazing profile!',
                url: profileUrl
            }).catch(() => {
                // User cancelled sharing
                copyToClipboard(profileUrl);
            });
        } else {
            copyToClipboard(profileUrl);
        }
    }
    
    function handleEditAvatarClick() {
        showToast('Avatar editing coming soon!');
        
        // In a real app, this would open a file picker or camera
        // For demo purposes, we'll simulate avatar change
        setTimeout(() => {
            const avatar = document.querySelector('.mobile-profile-avatar');
            if (avatar) {
                const newSeed = 'updated' + Date.now();
                avatar.src = `https://picsum.photos/seed/${newSeed}/120/120`;
                showToast('Avatar updated!');
            }
        }, 1000);
    }
    
    function handleCreatePlaylistClick() {
        showToast('Create playlist feature coming soon!');
    }
    
    function handleMenuClick() {
        showToast('Menu options coming soon!');
    }
    
    function handleEmptyStateAction(btn) {
        const action = btn.textContent.toLowerCase();
        
        if (action.includes('explore')) {
            window.location.href = 'explore.html';
        } else if (action.includes('create')) {
            showToast('Create feature coming soon!');
        } else {
            showToast(`${action} action coming soon!`);
        }
    }
    
    function loadMoreContent() {
        if (isLoading) return;
        
        isLoading = true;
        showToast('Loading more content...');
        
        // Simulate API call for more content
        setTimeout(() => {
            // Add more video cards to the current tab
            addMoreVideoCards();
            isLoading = false;
        }, 1500);
    }
    
    function addMoreVideoCards() {
        const activeTab = document.querySelector('.mobile-tab-content.active');
        if (!activeTab) return;
        
        const videoGrid = activeTab.querySelector('.mobile-videos-grid');
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
                    <img src="https://picsum.photos/seed/profile${Date.now() + i}/200/250" alt="Video thumbnail">
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
                    <h4 class="mobile-video-title">New Video ${Date.now() + i}!</h4>
                    <p class="mobile-video-meta">Just now • ${(Math.random() * 1000).toFixed(1)} views</p>
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
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Link copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy link');
        });
    }
    
    function showLoadingState() {
        // Add loading indicators
        const activeContent = document.querySelector('.mobile-tab-content.active');
        if (activeContent) {
            activeContent.style.opacity = '0.5';
        }
    }
    
    function hideLoadingState() {
        // Remove loading indicators
        const activeContent = document.querySelector('.mobile-tab-content.active');
        if (activeContent) {
            activeContent.style.opacity = '1';
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
        const videoGrid = document.querySelector('.mobile-videos-grid');
        const profileStats = document.querySelector('.mobile-profile-stats');
        
        if (width <= 380) {
            // Very small screens
            if (videoGrid) videoGrid.style.gridTemplateColumns = '1fr';
            if (profileStats) profileStats.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (width <= 480) {
            // Small screens
            if (videoGrid) videoGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            if (profileStats) profileStats.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }
    
    // Handle profile stats animation
    function animateProfileStats() {
        const statNumbers = document.querySelectorAll('.mobile-stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const isNumeric = /^\d/.test(finalValue);
            
            if (isNumeric) {
                const num = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
                const suffix = finalValue.replace(/[0-9.]/g, '');
                animateNumber(stat, 0, num, suffix);
            }
        });
    }
    
    function animateNumber(element, start, end, suffix = '') {
        const duration = 1500;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * easeOutQuad(progress);
            
            if (end >= 1000000) {
                element.textContent = (current / 1000000).toFixed(1) + 'M';
            } else if (end >= 1000) {
                element.textContent = (current / 1000).toFixed(1) + 'K';
            } else {
                element.textContent = Math.floor(current).toString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end + suffix;
            }
        }
        
        requestAnimationFrame(update);
    }
    
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    
    // Initialize layout and animations
    adjustLayoutForScreenSize();
    
    // Animate stats on page load
    setTimeout(() => {
        animateProfileStats();
    }, 500);
    
    console.log('LoopPlus Mobile Profile Page initialized');
});
