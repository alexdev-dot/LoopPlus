// TikTok-style video functionality for index page
document.addEventListener('DOMContentLoaded', () => {
    const videoItems = document.querySelectorAll('.video-item');
    const videoElements = document.querySelectorAll('.video-element');
    const scrollUpBtn = document.querySelector('.scroll-btn.up');
    const scrollDownBtn = document.querySelector('.scroll-btn.down');
    const muteButtons = document.querySelectorAll('.mute-button');
    const actionButtons = document.querySelectorAll('.action-btn');
    const followButtons = document.querySelectorAll('.follow-btn');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    // More popup functionality
    const moreBtn = document.getElementById('more-btn');
    const morePopup = document.getElementById('more-popup');
    const closePopup = document.getElementById('close-popup');
    
    // Open popup when More button is clicked
    if (moreBtn) {
        moreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            morePopup.classList.add('active');
            addRippleEffect(e.currentTarget, e);
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
    
    // Setup popup item clicks
    const popupItems = morePopup?.querySelectorAll('.popup-item');
    popupItems?.forEach(item => {
        item.addEventListener('click', () => {
            const itemText = item.querySelector('span')?.textContent;
            handlePopupItemClick(itemText);
            morePopup.classList.remove('active');
        });
    });
    
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
    
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        showNotification(`Dark mode ${isDarkMode ? 'enabled' : 'disabled'}`);
        localStorage.setItem('darkMode', isDarkMode);
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
    
    function handleLogout() {
        if (confirm('Are you sure you want to log out?')) {
            showNotification('Logging out...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }
    
    let currentVideoIndex = 0;
    let isMuted = true;
    
    // Initialize first video
    initializeVideos();
    
    function initializeVideos() {
        // Set up video elements
        videoElements.forEach((video, index) => {
            video.muted = true;
            video.loop = true;
            video.playsinline = true;
            
            // Add loading state
            video.addEventListener('loadstart', () => {
                showVideoLoading(video);
            });
            
            video.addEventListener('canplay', () => {
                hideVideoLoading(video);
            });
            
            // Add click to play/pause
            video.addEventListener('click', (e) => {
                togglePlayPause(video);
                addRippleEffect(video, e);
            });
            
            // Add ended event
            video.addEventListener('ended', () => {
                nextVideo();
            });
        });
        
        // Play first video
        playVideo(currentVideoIndex);
        
        // Set up scroll navigation
        setupScrollNavigation();
        
        // Set up mute buttons
        setupMuteButtons();
        
        // Set up action buttons
        setupActionButtons();
        
        // Set up keyboard navigation
        setupKeyboardNavigation();
        
        // Set up touch/swipe navigation
        setupTouchNavigation();
    }
    
    function showVideoLoading(video) {
        const player = video.closest('.video-player');
        if (player && !player.querySelector('.video-loading')) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'video-loading';
            loadingDiv.innerHTML = '<div class="loading-spinner"></div>';
            player.appendChild(loadingDiv);
        }
    }
    
    function hideVideoLoading(video) {
        const player = video.closest('.video-player');
        const loading = player.querySelector('.video-loading');
        if (loading) {
            loading.remove();
        }
    }
    
    function playVideo(index) {
        if (index < 0 || index >= videoElements.length) return;
        
        // Pause all videos
        videoElements.forEach(video => {
            video.pause();
        });
        
        // Play current video
        const currentVideo = videoElements[index];
        if (currentVideo) {
            currentVideo.play().catch(error => {
                console.log('Video play failed:', error);
            });
            currentVideoIndex = index;
            
            // Update progress bar
            updateProgressBar(currentVideo);
            
            // Scroll to video
            scrollToVideo(index);
        }
    }
    
    function scrollToVideo(index) {
        const videoContainer = document.querySelector('.video-container');
        const targetVideo = videoItems[index];
        
        if (videoContainer && targetVideo) {
            targetVideo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function togglePlayPause(video) {
        if (video.paused) {
            video.play().catch(error => {
                console.log('Video play failed:', error);
            });
        } else {
            video.pause();
        }
    }
    
    function nextVideo() {
        const nextIndex = (currentVideoIndex + 1) % videoElements.length;
        playVideo(nextIndex);
    }
    
    function previousVideo() {
        const prevIndex = (currentVideoIndex - 1 + videoElements.length) % videoElements.length;
        playVideo(prevIndex);
    }
    
    function setupScrollNavigation() {
        if (scrollUpBtn) {
            scrollUpBtn.addEventListener('click', () => {
                previousVideo();
            });
        }
        
        if (scrollDownBtn) {
            scrollDownBtn.addEventListener('click', () => {
                nextVideo();
            });
        }
        
        // Intersection Observer for automatic video switching
        const observerOptions = {
            root: document.querySelector('.video-container'),
            rootMargin: '0px',
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(videoItems).indexOf(entry.target);
                    if (index !== currentVideoIndex) {
                        playVideo(index);
                    }
                }
            });
        }, observerOptions);
        
        videoItems.forEach(item => observer.observe(item));
    }
    
    function setupMuteButtons() {
        muteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const video = button.closest('.video-item').querySelector('.video-element');
                if (video) {
                    video.muted = !video.muted;
                    isMuted = video.muted;
                    
                    // Update button icon
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
                    }
                    
                    addRippleEffect(button, e);
                }
            });
        });
    }
    
    function setupActionButtons() {
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = button.dataset.action;
                const videoItem = button.closest('.video-item');
                
                switch(action) {
                    case 'like':
                        toggleLike(button);
                        break;
                    case 'comment':
                        openComments(videoItem);
                        break;
                    case 'bookmark':
                        toggleBookmark(button);
                        break;
                    case 'share':
                        shareVideo(videoItem);
                        break;
                }
                
                addRippleEffect(button, e);
            });
        });
    }
    
    function toggleLike(button) {
        const icon = button.querySelector('i');
        const count = button.querySelector('.action-count');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#ef4444';
            
            if (count) {
                const currentCount = parseInt(count.textContent) || 0;
                count.textContent = currentCount + 1;
            }
            
            // Add floating hearts animation
            createFloatingHearts(button);
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
            
            if (count) {
                const currentCount = parseInt(count.textContent) || 0;
                count.textContent = Math.max(0, currentCount - 1);
            }
        }
    }
    
    function toggleBookmark(button) {
        const icon = button.querySelector('i');
        const count = button.querySelector('.action-count');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#f59e0b';
            
            if (count) {
                const currentCount = parseInt(count.textContent) || 0;
                count.textContent = currentCount + 1;
            }
            
            showNotification('Video saved to bookmarks');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
            
            if (count) {
                const currentCount = parseInt(count.textContent) || 0;
                count.textContent = Math.max(0, currentCount - 1);
            }
            
            showNotification('Video removed from bookmarks');
        }
    }
    
    function openComments(videoItem) {
        showNotification('Comments feature coming soon!');
    }
    
    function shareVideo(videoItem) {
        const videoTitle = videoItem.querySelector('.video-title')?.textContent || 'Check out this video!';
        
        if (navigator.share) {
            navigator.share({
                title: videoTitle,
                text: videoTitle,
                url: window.location.href
            }).catch(error => {
                console.log('Share failed:', error);
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('Link copied to clipboard!');
            }).catch(() => {
                showNotification('Share feature not available');
            });
        }
    }
    
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    previousVideo();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    nextVideo();
                    break;
                case ' ':
                    e.preventDefault();
                    const activeVideo = videoElements[currentVideoIndex];
                    if (activeVideo) {
                        togglePlayPause(activeVideo);
                    }
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    const mutedVideo = videoElements[currentVideoIndex];
                    if (mutedVideo) {
                        mutedVideo.muted = !mutedVideo.muted;
                        isMuted = mutedVideo.muted;
                        
                        // Update mute button icon
                        const muteBtn = mutedVideo.closest('.video-item').querySelector('.mute-button i');
                        if (muteBtn) {
                            muteBtn.className = mutedVideo.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
                        }
                    }
                    break;
            }
        });
    }
    
    function setupTouchNavigation() {
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe up - next video
                    nextVideo();
                } else {
                    // Swipe down - previous video
                    previousVideo();
                }
            }
        }
    }
    
    function updateProgressBar(video) {
        const progressBar = video.closest('.video-item')?.querySelector('.progress-fill');
        
        if (progressBar) {
            video.addEventListener('timeupdate', () => {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = progress + '%';
            });
        }
    }
    
    function addRippleEffect(element, event) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    function createFloatingHearts(button) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.innerHTML = '❤️';
                heart.style.left = Math.random() * 40 - 20 + 'px';
                heart.style.animationDelay = Math.random() * 0.5 + 's';
                
                button.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 2000);
            }, i * 100);
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
    
    // Setup follow buttons
    followButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (button.classList.contains('following')) {
                button.classList.remove('following');
                button.textContent = 'Follow';
                showNotification('Unfollowed user');
            } else {
                button.classList.add('following');
                button.textContent = 'Following';
                showNotification('Following user');
            }
            
            addRippleEffect(button, e);
        });
    });
    
    // Setup search functionality
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
    
    function performSearch(query) {
        // Mock search results
        const results = [
            { title: 'Dance Challenge', type: 'video' },
            { title: 'Cooking Tutorial', type: 'video' },
            { title: 'Travel Vlog', type: 'video' },
            { title: 'Comedy Sketch', type: 'video' },
            { title: 'Fitness Workout', type: 'video' }
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
                resultItem.innerHTML = `
                    <i class="fas fa-${result.type === 'video' ? 'video' : 'user'}"></i>
                    <span>${result.title}</span>
                `;
                
                resultItem.addEventListener('click', () => {
                    searchInput.value = result.title;
                    hideSearchResults();
                    showNotification(`Searching for: ${result.title}`);
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
});
