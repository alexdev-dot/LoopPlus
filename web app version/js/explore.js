// Explore page functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    const trendingCards = document.querySelectorAll('.trending-card');
    const categoryCards = document.querySelectorAll('.category-card');
    const discoverCards = document.querySelectorAll('.discover-card');
    const followButtons = document.querySelectorAll('.discover-follow-btn');
    
    // More popup functionality
    const moreBtn = document.getElementById('more-btn');
    const morePopup = document.getElementById('more-popup');
    const closePopup = document.getElementById('close-popup');
    
    let isLoading = false;
    
    // Initialize explore page
    initializeExplore();
    
    function initializeExplore() {
        setupSearch();
        setupTrendingCards();
        setupCategoryCards();
        setupDiscoverCards();
        setupFollowButtons();
        setupInfiniteScroll();
        setupMorePopup();
        loadInitialContent();
    }
    
    function setupSearch() {
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                
                if (query.length > 0) {
                    performSearch(query);
                } else {
                    hideSearchResults();
                }
            });
            
            searchInput.addEventListener('focus', () => {
                if (searchInput.value.trim().length > 0) {
                    performSearch(searchInput.value.trim());
                }
            });
            
            // Hide search results when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container')) {
                    hideSearchResults();
                }
            });
        }
    }
    
    function performSearch(query) {
        // Mock search results
        const results = [
            { title: 'Dance Challenge', type: 'video', views: '1.2M' },
            { title: 'Cooking Tutorial', type: 'video', views: '856K' },
            { title: 'Travel Vlog', type: 'video', views: '2.3M' },
            { title: 'Comedy Sketch', type: 'video', views: '5.1M' },
            { title: 'Fitness Workout', type: 'video', views: '945K' },
            { title: 'John Doe', type: 'user', followers: '123K' },
            { title: 'Jane Smith', type: 'user', followers: '89K' },
            { title: 'Mike Wilson', type: 'user', followers: '456K' }
        ].filter(result => result.title.toLowerCase().includes(query.toLowerCase()));
        
        displaySearchResults(results);
    }
    
    function displaySearchResults(results) {
        if (!searchResults) return;
        
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        } else {
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                
                const iconClass = result.type === 'video' ? 'fa-video' : 'fa-user';
                const extraInfo = result.type === 'video' ? result.views : `${result.followers} followers`;
                
                resultItem.innerHTML = `
                    <i class="fas ${iconClass}"></i>
                    <div class="search-result-content">
                        <span class="search-result-title">${result.title}</span>
                        <span class="search-result-meta">${extraInfo}</span>
                    </div>
                `;
                
                resultItem.addEventListener('click', () => {
                    searchInput.value = result.title;
                    hideSearchResults();
                    handleSearchResultClick(result);
                });
                
                searchResults.appendChild(resultItem);
            });
        }
        
        searchResults.classList.add('active');
    }
    
    function hideSearchResults() {
        if (searchResults) {
            searchResults.classList.remove('active');
        }
    }
    
    function handleSearchResultClick(result) {
        if (result.type === 'video') {
            showNotification(`Opening video: ${result.title}`);
            // In a real app, this would navigate to the video
        } else {
            showNotification(`Viewing profile: ${result.title}`);
            // In a real app, this would navigate to the user profile
        }
    }
    
    function setupTrendingCards() {
        trendingCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('.trending-title')?.textContent;
                if (title) {
                    showNotification(`Opening trending video: ${title}`);
                    // In a real app, this would open the video
                }
            });
            
            // Add hover effect with video preview
            card.addEventListener('mouseenter', () => {
                const thumbnail = card.querySelector('.trending-thumbnail');
                if (thumbnail && !thumbnail.dataset.previewLoaded) {
                    // Simulate video preview loading
                    thumbnail.style.opacity = '0.8';
                    thumbnail.dataset.previewLoaded = 'true';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const thumbnail = card.querySelector('.trending-thumbnail');
                if (thumbnail) {
                    thumbnail.style.opacity = '1';
                }
            });
        });
    }
    
    function setupCategoryCards() {
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const categoryName = card.querySelector('.category-name')?.textContent;
                if (categoryName) {
                    showNotification(`Exploring category: ${categoryName}`);
                    loadCategoryContent(categoryName);
                }
            });
        });
    }
    
    function setupDiscoverCards() {
        discoverCards.forEach(card => {
            card.addEventListener('click', () => {
                const userName = card.querySelector('.discover-name')?.textContent;
                if (userName) {
                    showNotification(`Viewing profile: ${userName}`);
                    // In a real app, this would navigate to the user profile
                }
            });
        });
    }
    
    function setupFollowButtons() {
        followButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const isFollowing = button.classList.contains('following');
                const userName = button.closest('.discover-card')?.querySelector('.discover-name')?.textContent;
                
                if (isFollowing) {
                    button.classList.remove('following');
                    button.textContent = 'Follow';
                    showNotification(`Unfollowed ${userName}`);
                } else {
                    button.classList.add('following');
                    button.textContent = 'Following';
                    showNotification(`Following ${userName}`);
                    
                    // Add success animation
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 150);
                }
            });
        });
    }
    
    function setupInfiniteScroll() {
        const mainContent = document.querySelector('.main-content');
        
        if (mainContent) {
            let scrollTimeout;
            
            mainContent.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (isNearBottom() && !isLoading) {
                        loadMoreContent();
                    }
                }, 100);
            });
        }
    }
    
    function isNearBottom() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return false;
        
        const scrollTop = mainContent.scrollTop;
        const scrollHeight = mainContent.scrollHeight;
        const clientHeight = mainContent.clientHeight;
        
        return scrollTop + clientHeight >= scrollHeight - 100;
    }
    
    function loadMoreContent() {
        if (isLoading) return;
        
        isLoading = true;
        showLoadingSpinner();
        
        // Simulate API call
        setTimeout(() => {
            addMoreTrendingVideos();
            hideLoadingSpinner();
            isLoading = false;
        }, 1500);
    }
    
    function loadInitialContent() {
        // Simulate initial content loading
        showLoadingSpinner();
        
        setTimeout(() => {
            hideLoadingSpinner();
            showNotification('Content loaded successfully');
        }, 1000);
    }
    
    function loadCategoryContent(categoryName) {
        showLoadingSpinner();
        
        // Simulate category-specific content loading
        setTimeout(() => {
            hideLoadingSpinner();
            showNotification(`Loaded ${categoryName} content`);
        }, 800);
    }
    
    function addMoreTrendingVideos() {
        const trendingGrid = document.querySelector('.trending-grid');
        if (!trendingGrid) return;
        
        // Mock new trending videos
        const newVideos = [
            { title: 'New Dance Trend', views: '2.1M', likes: '89K' },
            { title: 'Amazing Recipe', views: '1.5M', likes: '67K' },
            { title: 'Travel Adventure', views: '3.2M', likes: '156K' }
        ];
        
        newVideos.forEach(video => {
            const card = createTrendingCard(video);
            trendingGrid.appendChild(card);
        });
        
        // Re-setup click handlers for new cards
        const newCards = trendingGrid.querySelectorAll('.trending-card:not(.setup)');
        newCards.forEach(card => {
            card.classList.add('setup');
            card.addEventListener('click', () => {
                const title = card.querySelector('.trending-title')?.textContent;
                if (title) {
                    showNotification(`Opening trending video: ${title}`);
                }
            });
        });
        
        showNotification('Loaded more trending videos');
    }
    
    function createTrendingCard(video) {
        const card = document.createElement('div');
        card.className = 'trending-card';
        
        card.innerHTML = `
            <img src="https://picsum.photos/seed/${video.title}/300/200.jpg" alt="${video.title}" class="trending-thumbnail">
            <div class="trending-info">
                <h3 class="trending-title">${video.title}</h3>
                <div class="trending-meta">
                    <span class="trending-views">
                        <i class="fas fa-eye"></i> ${video.views}
                    </span>
                    <span class="trending-likes">
                        <i class="fas fa-heart"></i> ${video.likes}
                    </span>
                </div>
            </div>
        `;
        
        return card;
    }
    
    function showLoadingSpinner() {
        const existingSpinner = document.querySelector('.loading-spinner');
        if (existingSpinner) return;
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner"></div>';
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.appendChild(spinner);
        }
    }
    
    function hideLoadingSpinner() {
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Focus search on '/' key
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Clear search on Escape
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            hideSearchResults();
            searchInput.blur();
        }
    });
    
    // Add refresh functionality
    let pullToRefreshTimeout;
    let startY = 0;
    let isPulling = false;
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.addEventListener('touchstart', (e) => {
            if (mainContent.scrollTop === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });
        
        mainContent.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            
            const currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            
            if (diff > 100) {
                mainContent.style.transform = `translateY(${Math.min(diff, 150)}px)`;
            }
        }, { passive: true });
        
        mainContent.addEventListener('touchend', () => {
            if (isPulling) {
                mainContent.style.transform = '';
                isPulling = false;
                
                if (parseInt(mainContent.style.transform.replace(/[^\d-]/g, '')) > 100) {
                    refreshContent();
                }
            }
        }, { passive: true });
    }
    
    function refreshContent() {
        showNotification('Refreshing content...');
        
        // Simulate content refresh
        setTimeout(() => {
            // Add new content at the top
            const trendingGrid = document.querySelector('.trending-grid');
            if (trendingGrid) {
                const newVideo = createTrendingCard({
                    title: 'Fresh Content',
                    views: '999K',
                    likes: '45K'
                });
                trendingGrid.insertBefore(newVideo, trendingGrid.firstChild);
            }
            
            showNotification('Content refreshed!');
        }, 1000);
    }
    
    function setupMorePopup() {
        // Open popup when More button is clicked
        if (moreBtn) {
            moreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                morePopup.classList.add('active');
            });
        }
        
        // Close popup when close button is clicked
        if (closePopup) {
            closePopup.addEventListener('click', () => {
                morePopup.classList.remove('active');
            });
        }
        
        // Close popup when Escape key is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && morePopup && morePopup.classList.contains('active')) {
                morePopup.classList.remove('active');
            }
        });
        
        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (morePopup && morePopup.classList.contains('active') && 
                !e.target.closest('.left-sidebar') && !e.target.closest('.more-popup')) {
                morePopup.classList.remove('active');
            }
        });
        
        // Setup popup item clicks
        const popupItems = morePopup?.querySelectorAll('.popup-item');
        popupItems?.forEach(item => {
            item.addEventListener('click', () => {
                const itemText = item.querySelector('span')?.textContent;
                handlePopupItemClick(itemText);
                morePopup.classList.remove('active');
            });
        });
    }
    
    function handlePopupItemClick(itemText) {
        switch(itemText) {
            case 'Settings':
                window.location.href = 'settings.html';
                break;
            case 'Privacy':
                showNotification('Opening privacy settings...');
                break;
            case 'Help Center':
                showNotification('Opening help center...');
                break;
            case 'About':
                showNotification('LoopPlus Web v2.0 - Built with ❤️');
                break;
            case 'Business':
                showNotification('Opening business portal...');
                break;
            case 'Creator Portal':
                showNotification('Opening creator portal...');
                break;
            case 'Analytics':
                showNotification('Opening analytics dashboard...');
                break;
            case 'Language':
                showNotification('Language settings coming soon!');
                break;
            case 'Dark Mode':
                toggleDarkMode();
                break;
            case 'Notifications':
                showNotification('Opening notification settings...');
                break;
            case 'Download App':
                downloadApp();
                break;
            case 'Share LoopPlus':
                shareLoopPlus();
                break;
            case 'Log Out':
                handleLogout();
                break;
            default:
                showNotification(`${itemText} feature coming soon!`);
        }
    }
    
    function downloadApp() {
        showNotification('Redirecting to app download...');
        setTimeout(() => {
            window.open('https://apps.apple.com', '_blank');
        }, 1000);
    }
    
    function shareLoopPlus() {
        const shareUrl = window.location.origin;
        
        if (navigator.share) {
            navigator.share({
                title: 'LoopPlus - Amazing Video Platform',
                text: 'Check out LoopPlus! The best video sharing platform.',
                url: shareUrl
            }).catch(error => {
                console.log('Share failed:', error);
                fallbackShare(shareUrl);
            });
        } else {
            fallbackShare(shareUrl);
        }
    }
    
    function fallbackShare(url) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                showNotification('LoopPlus link copied to clipboard!');
            }).catch(() => {
                showNotification('Share feature not available');
            });
        } else {
            showNotification('Share feature not available');
        }
    }
    
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        showNotification(`Dark mode ${isDarkMode ? 'enabled' : 'disabled'}`);
        localStorage.setItem('darkMode', isDarkMode);
    }
    
    function handleLogout() {
        if (confirm('Are you sure you want to log out?')) {
            showNotification('Logging out...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }
    
    // Add analytics tracking (mock)
    function trackEvent(eventName, data) {
        console.log('Analytics Event:', eventName, data);
        // In a real app, this would send to analytics service
    }
    
    // Track page view
    trackEvent('page_view', { page: 'explore' });
    
    // Track interactions
    trendingCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            trackEvent('trending_click', { position: index + 1 });
        });
    });
    
    categoryCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const categoryName = card.querySelector('.category-name')?.textContent;
            trackEvent('category_click', { category: categoryName, position: index + 1 });
        });
    });
});
