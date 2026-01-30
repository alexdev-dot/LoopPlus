// Index Page JavaScript - LoopPlus Mobile
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
    const mobileVideoItems = document.querySelectorAll('.mobile-video-item');
    const mobileVideoElements = document.querySelectorAll('.mobile-video-element');
    const mobileMuteButtons = document.querySelectorAll('.mobile-mute-button');
    const mobileActionButtons = document.querySelectorAll('.mobile-action-btn');
    const mobileFollowButtons = document.querySelectorAll('.mobile-follow-btn');
    const swipeDots = document.querySelectorAll('.dot');
    const mobileCreateBtn = document.querySelector('.mobile-create-btn');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const navTabs = document.querySelectorAll('.nav-tab');
    const enableSwipeNavigation = true;
    const enableAutoPlayOnScroll = mobileVideoElements.length > 1;
    
    let currentVideoIndex = 0;
    let isMuted = false;
    let touchStartY = 0;
    let touchEndY = 0;
    let isVideoPlaying = false;
    
    // Initialize mobile videos
    initializeMobileVideos();
    
    function initializeMobileVideos() {
        // Set up mobile video elements
        mobileVideoElements.forEach((video, index) => {
            // Set video attributes - DISABLE AUTOPLAY
            video.muted = true;
            video.loop = true;
            video.playsinline = true;
            video.preload = 'metadata'; // Changed from 'auto' to 'metadata' for performance
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('x5-playsinline', 'true');
            
            // Ensure videos don't autoplay
            video.autoplay = false;
            video.pause();
            
            // Mobile video event listeners
            video.addEventListener('loadedmetadata', () => {
                console.log(`Video ${index + 1} metadata loaded`);
                // Mark video item as loaded
                if (mobileVideoItems[index]) {
                    mobileVideoItems[index].classList.add('loaded');
                }
                
                // DISABLE AUTOPLAY - Only load poster/thumbnail
                console.log(`Video ${index + 1} ready for manual play`);
            });
            
            video.addEventListener('canplay', () => {
                console.log(`Video ${index + 1} can play`);
                // Update video item background when video can play
                if (mobileVideoItems[index]) {
                    mobileVideoItems[index].classList.add('can-play');
                }
            });
            
            video.addEventListener('play', () => {
                console.log(`Video ${index + 1} started playing`);
                isVideoPlaying = true;
                // Hide play indicator
                const playIndicator = document.querySelector('.mobile-play-indicator');
                if (playIndicator) {
                    playIndicator.classList.remove('show');
                }
            });
            
            video.addEventListener('pause', () => {
                console.log(`Video ${index + 1} paused`);
                isVideoPlaying = false;
            });
            
            video.addEventListener('ended', () => {
                console.log(`Video ${index + 1} ended`);
                // Video will loop automatically due to loop attribute
            });
            
            video.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMobileVideoPlayPause(index);
            });
            
            video.addEventListener('error', (e) => {
                console.error(`Video ${index + 1} failed to load:`, e);
                handleVideoError(index, e);
            });
            
            video.addEventListener('stalled', () => {
                console.log(`Video ${index + 1} stalled`);
            });
            
            video.addEventListener('waiting', () => {
                console.log(`Video ${index + 1} waiting for data`);
            });
        });
        
        // Set up touch events for swipe navigation
        if (enableSwipeNavigation) {
            setupTouchEvents();
        }
        
        // Set up mobile button events
        setupMobileButtonEvents();
        
        // Set up navigation tabs
        setupNavigationTabs();
        
        // Set up bottom navigation
        setupBottomNavigation();
        
        // Set up swipe dots
        if (enableSwipeNavigation && swipeDots.length) {
            setupSwipeDots();
        }
        
        // Set up intersection observer for MANUAL play only (no autoplay)
        // DISABLE AUTOPLAY ON SCROLL - Only for performance monitoring
        if (enableAutoPlayOnScroll) {
            setupIntersectionObserver();
        }
        
        // DISABLE AUTOPLAY INITIALIZATION
        // Videos will only play when user explicitly clicks them
    }
    
    function playMobileVideo(index) {
        if (mobileVideoElements[index]) {
            const video = mobileVideoElements[index];
            
            // Pause all videos first
            mobileVideoElements.forEach(v => v.pause());
            
            // Update active states before playing
            updateActiveStates(index);
            
            // Try to play the video with retry logic
            attemptVideoPlay(video, index, 3);
        }
    }
    
    function attemptVideoPlay(video, index, retries) {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log(`Video ${index + 1} playing successfully`);
                isVideoPlaying = true;
                currentVideoIndex = index;
                
                // Update video item state
                if (mobileVideoItems[index]) {
                    mobileVideoItems[index].classList.add('playing');
                }
            }).catch(error => {
                console.error(`Video ${index + 1} play failed:`, error);
                
                if (retries > 0) {
                    // Retry with user interaction simulation
                    setTimeout(() => {
                        console.log(`Retrying video ${index + 1} play, attempts left: ${retries}`);
                        attemptVideoPlay(video, index, retries - 1);
                    }, 500);
                } else {
                    // Final retry failed, show error state
                    handleVideoError(index, error);
                }
            });
        } else {
            // Fallback for older browsers
            video.play();
            isVideoPlaying = true;
            currentVideoIndex = index;
        }
    }
    
    function handleVideoError(index, error) {
        console.error(`Video ${index + 1} error:`, error);
        
        // Mark video item as error
        if (mobileVideoItems[index]) {
            mobileVideoItems[index].classList.add('error');
        }
        
        // Try to reload the video
        if (mobileVideoElements[index]) {
            const video = mobileVideoElements[index];
            video.load();
            
            // Try to play again after reload
            setTimeout(() => {
                attemptVideoPlay(video, index, 2);
            }, 1000);
        }
        
        // Show error toast
        showToast(`Video ${index + 1} loading...`);
    }
    
    function pauseMobileVideo(index) {
        if (mobileVideoElements[index]) {
            mobileVideoElements[index].pause();
            isVideoPlaying = false;
        }
    }
    
    function toggleMobileVideoPlayPause(index) {
        if (!mobileVideoElements[index]) return;
        
        const video = mobileVideoElements[index];
        const videoItem = mobileVideoItems[index];
        const playIndicator = videoItem ? videoItem.querySelector('.mobile-play-indicator') : null;
        const playIcon = playIndicator ? playIndicator.querySelector('i') : null;
        
        console.log(`Toggle play/pause for video ${index}, paused: ${video.paused}`);
        
        if (video.paused) {
            video.play().then(() => {
                isVideoPlaying = true;
                console.log(`Video ${index} started playing`);
                
                // Update icon to pause
                if (playIcon) {
                    playIcon.className = 'fas fa-pause';
                }
                
                // Show play indicator briefly
                if (playIndicator) {
                    playIndicator.classList.add('show');
                    setTimeout(() => {
                        playIndicator.classList.remove('show');
                    }, 500);
                }
            }).catch(err => {
                console.error(`Failed to play video ${index}:`, err);
            });
        } else {
            video.pause();
            isVideoPlaying = false;
            console.log(`Video ${index} paused`);
            
            // Update icon to play
            if (playIcon) {
                playIcon.className = 'fas fa-play';
            }
            
            // Show play indicator
            if (playIndicator) {
                playIndicator.classList.add('show');
                setTimeout(() => {
                    playIndicator.classList.remove('show');
                }, 1000);
            }
        }
    }
    
    function updateActiveStates(index) {
        // Update video items
        mobileVideoItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        // Update swipe dots
        swipeDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    function setupTouchEvents() {
        const container = document.querySelector('.mobile-video-container');
        if (!container) return;
        
        let touchStartY = 0;
        let touchStartX = 0;
        let touchEndY = 0;
        let touchEndX = 0;
        let isScrolling = false;
        let isVideoTouch = false;
        let touchStartTime = 0;
        
        // Touch start
        container.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            touchStartTime = Date.now();
            isScrolling = false;
            isVideoTouch = false;
        }, { passive: true });
        
        // Touch move
        container.addEventListener('touchmove', (e) => {
            touchEndY = e.touches[0].clientY;
            touchEndX = e.touches[0].clientX;
            
            const deltaY = Math.abs(touchStartY - touchEndY);
            const deltaX = Math.abs(touchStartX - touchEndX);
            
            // Determine if this is a scroll gesture
            if (deltaY > deltaX && deltaY > 10) {
                isScrolling = true;
            }
            
            // Prevent default only if not scrolling and touch is on video
            const touchTarget = e.target;
            if (touchTarget.classList.contains('mobile-video-element') && !isScrolling) {
                isVideoTouch = true;
                e.preventDefault();
            }
        }, { passive: false });
        
        // Touch end
        container.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;
            
            // Handle swipe gestures for navigation
            if (touchDuration < 300 && Math.abs(deltaY) > 50 && Math.abs(deltaX) < 50 && !isVideoTouch) {
                // Vertical swipe detected
                if (deltaY > 0 && currentVideoIndex < mobileVideoElements.length - 1) {
                    // Swipe up - next video
                    navigateToVideo(currentVideoIndex + 1);
                } else if (deltaY < 0 && currentVideoIndex > 0) {
                    // Swipe down - previous video
                    navigateToVideo(currentVideoIndex - 1);
                }
            }
            
            // Reset touch variables
            isScrolling = false;
            isVideoTouch = false;
        }, { passive: true });
        
        // Mouse wheel for desktop testing - disabled to allow native scroll-snap
        // container.addEventListener('wheel', (e) => {
        //     e.preventDefault();
        //     if (e.deltaY > 0 && currentVideoIndex < mobileVideoElements.length - 1) {
        //         navigateToVideo(currentVideoIndex + 1);
        //     } else if (e.deltaY < 0 && currentVideoIndex > 0) {
        //         navigateToVideo(currentVideoIndex - 1);
        //     }
        // }, { passive: false });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentVideoIndex < mobileVideoElements.length - 1) {
                        navigateToVideo(currentVideoIndex + 1);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentVideoIndex > 0) {
                        navigateToVideo(currentVideoIndex - 1);
                    }
                    break;
                case ' ':
                    e.preventDefault();
                    toggleMobileVideoPlayPause(currentVideoIndex);
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    toggleMute();
                    break;
            }
        });
    }
    
        
    function navigateToVideo(index) {
        if (index < 0 || index >= mobileVideoElements.length) return;
        
        // Scroll to video
        const targetVideo = mobileVideoItems[index];
        if (targetVideo) {
            targetVideo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Play video after scroll
        setTimeout(() => {
            playMobileVideo(index);
        }, 300);
    }
    
    function setupMobileButtonEvents() {
        // Mute buttons
        mobileMuteButtons.forEach(button => {
            if (button) {
                // Set initial icon to unmuted
                const icon = button.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-volume-up';
                }
                
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleMute();
                });
            }
        });
        
        // Action buttons (like, comment, save, share)
        mobileActionButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleActionClick(button);
                });
            }
        });
        
        // Follow buttons
        mobileFollowButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleFollowClick(button);
                });
            }
        });
        
        // Create button
        if (mobileCreateBtn) {
            mobileCreateBtn.addEventListener('click', () => {
                handleCreateClick();
            });
        }
    }
    
    function handleActionClick(button) {
        const icon = button.querySelector('i');
        if (!icon) return;
        
        // Handle different action types
        if (icon.classList.contains('fa-heart')) {
            // Like action
            button.classList.toggle('liked');
            const count = button.querySelector('.mobile-action-count');
            if (count) {
                const currentCount = parseFloat(count.textContent);
                const newCount = button.classList.contains('liked') ? currentCount + 0.1 : currentCount - 0.1;
                count.textContent = formatCount(newCount);
            }
            showToast(button.classList.contains('liked') ? 'Video liked!' : 'Like removed');
        } else if (icon.classList.contains('fa-comment')) {
            // Comment action
            showToast('Comments coming soon!');
        } else if (icon.classList.contains('fa-bookmark')) {
            // Save action
            button.classList.toggle('saved');
            showToast(button.classList.contains('saved') ? 'Video saved!' : 'Video removed from saved');
        } else if (icon.classList.contains('fa-share')) {
            // Share action
            handleShare();
        }
    }
    
    function handleFollowClick(button) {
        button.classList.toggle('following');
        const icon = button.querySelector('i');
        if (icon) {
            icon.className = button.classList.contains('following') ? 'fas fa-check' : 'fas fa-plus';
        }
        showToast(button.classList.contains('following') ? 'Following user!' : 'Unfollowed user');
    }
    
    function handleCreateClick() {
        showToast('Create feature coming soon!');
    }
    
    function handleShare() {
        if (navigator.share) {
            navigator.share({
                title: 'LoopPlus Video',
                text: 'Check out this amazing video!',
                url: window.location.href
            }).catch(() => {
                // User cancelled sharing
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Link copied to clipboard!');
            });
        }
    }
    
    function toggleMute() {
        const currentVideo = mobileVideoElements[currentVideoIndex];
        if (!currentVideo) return;
        
        isMuted = !isMuted;
        currentVideo.muted = isMuted;
        
        // Update mute button icons
        mobileMuteButtons.forEach(button => {
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            }
        });
        
        showToast(isMuted ? 'Video muted' : 'Video unmuted');
    }
    
    function setupNavigationTabs() {
        navTabs.forEach(tab => {
            if (tab) {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs
                    navTabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    tab.classList.add('active');
                    
                    // Handle tab switching
                    const tabName = tab.dataset.tab;
                    handleTabSwitch(tabName);
                });
            }
        });
    }
    
    function handleTabSwitch(tabName) {
        // For now, just show a toast
        showToast(`${tabName.charAt(0).toUpperCase() + tabName.slice(1)} tab selected`);
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
    
    function setupSwipeDots() {
        swipeDots.forEach((dot, index) => {
            if (dot) {
                dot.addEventListener('click', () => {
                    navigateToVideo(index);
                });
            }
        });
    }
    
    function setupIntersectionObserver() {
        if (!mobileVideoItems.length) return;
        
        const options = {
            root: document.querySelector('.mobile-video-container'),
            rootMargin: '-10% 0px -10% 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const index = Array.from(mobileVideoItems).indexOf(entry.target);
                const video = mobileVideoElements[index];
                
                if (!video) return;
                
                // PERFORMANCE OPTIMIZATION - Pause videos when not visible
                if (!entry.isIntersecting && entry.intersectionRatio < 0.1) {
                    // Video is hidden, pause it to save bandwidth
                    if (!video.paused) {
                        console.log(`Video ${index + 1} is hidden (${Math.round(entry.intersectionRatio * 100)}%), pausing for performance`);
                        video.pause();
                        isVideoPlaying = false;
                    }
                }
                
                // DISABLE AUTOPLAY - Only track visibility, don't auto-play
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    console.log(`Video ${index + 1} is visible (${Math.round(entry.intersectionRatio * 100)}%) - ready for manual play`);
                    // Update current video index for manual controls
                    if (index !== currentVideoIndex) {
                        currentVideoIndex = index;
                        updateActiveStates(index);
                    }
                }
            });
        }, options);
        
        // Observe all video items
        mobileVideoItems.forEach((item, index) => {
            if (item) {
                observer.observe(item);
                console.log(`Observing video ${index + 1} for performance optimization`);
            }
        });
        
        // Store observer for cleanup
        window.videoObserver = observer;
    }
    
    function formatCount(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
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
    
    // Initialize first video as loaded
    if (mobileVideoItems[0]) {
        mobileVideoItems[0].classList.add('loaded');
    }
    
    // Handle page visibility changes - PERFORMANCE OPTIMIZATION
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause ALL videos when page is hidden to save bandwidth
            mobileVideoElements.forEach(video => {
                if (video && !video.paused) {
                    video.pause();
                }
            });
            isVideoPlaying = false;
            console.log('Page hidden, all videos paused for performance');
        } else {
            // Keep videos paused when page becomes visible - require user interaction
            console.log('Page visible - videos remain paused until user interaction');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Debounce resize events
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            // Adjust video container if needed
            const container = document.querySelector('.mobile-video-container');
            if (container) {
                container.style.height = window.innerHeight - 75 + 'px';
            }
            
            // Reinitialize intersection observer on resize
            if (enableAutoPlayOnScroll && window.videoObserver) {
                window.videoObserver.disconnect();
                setupIntersectionObserver();
            }
        }, 250);
    });
    
    // Handle page unload - cleanup
    window.addEventListener('beforeunload', () => {
        // Pause all videos
        mobileVideoElements.forEach(video => {
            if (video) {
                video.pause();
                video.src = '';
            }
        });
        
        // Disconnect intersection observer
        if (window.videoObserver) {
            window.videoObserver.disconnect();
        }
    });
    
    // Handle orientation change for mobile devices - PERFORMANCE OPTIMIZATION
    window.addEventListener('orientationchange', () => {
        // Pause all videos during orientation change
        mobileVideoElements.forEach(video => {
            if (video && !video.paused) {
                video.pause();
            }
        });
        isVideoPlaying = false;
        
        setTimeout(() => {
            // Keep videos paused after orientation change - require user interaction
            console.log('Orientation change complete - videos remain paused for performance');
        }, 500);
    });
    
    // Add network status monitoring
    window.addEventListener('online', () => {
        console.log('Network restored');
        showToast('Network restored');
        // Retry loading failed videos
        retryFailedVideos();
    });
    
    window.addEventListener('offline', () => {
        console.log('Network lost');
        showToast('Network connection lost');
    });
    
    function retryFailedVideos() {
        mobileVideoElements.forEach((video, index) => {
            if (video && video.error) {
                console.log(`Retrying failed video ${index + 1}`);
                video.load();
                setTimeout(() => {
                    attemptVideoPlay(video, index, 2);
                }, 1000);
            }
        });
    }
    
    // Add video quality detection
    function detectVideoQuality(video) {
        if (!video) return 'unknown';
        
        const width = video.videoWidth;
        const height = video.videoHeight;
        
        if (width >= 1920 || height >= 1080) return 'HD';
        if (width >= 1280 || height >= 720) return 'HD';
        if (width >= 854 || height >= 480) return 'SD';
        return 'Low';
    }
    
    // Monitor video performance
    function monitorVideoPerformance() {
        mobileVideoElements.forEach((video, index) => {
            if (!video) return;
            
            video.addEventListener('loadstart', () => {
                console.log(`Video ${index + 1} loading started`);
            });
            
            video.addEventListener('loadeddata', () => {
                const quality = detectVideoQuality(video);
                console.log(`Video ${index + 1} data loaded, quality: ${quality}`);
            });
            
            video.addEventListener('canplaythrough', () => {
                console.log(`Video ${index + 1} can play through`);
            });
        });
    }
    
    // Initialize performance monitoring
    monitorVideoPerformance();
    
    console.log('LoopPlus Mobile Index Page initialized - Videos optimized for manual playback');
    
    // Add initial state to show play indicators
    mobileVideoItems.forEach((item, index) => {
        const playIndicator = item.querySelector('.mobile-play-indicator');
        if (playIndicator) {
            playIndicator.classList.add('show');
        }
    });
    
    // Ensure all videos are paused on load
    setTimeout(() => {
        mobileVideoElements.forEach((video, index) => {
            if (video && !video.paused) {
                video.pause();
                console.log(`Force paused video ${index + 1} on load`);
            }
        });
        isVideoPlaying = false;
    }, 500);
});
