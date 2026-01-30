// Profile page functionality
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const shareProfileBtn = document.querySelector('.share-profile-btn');
    const videoCards = document.querySelectorAll('.video-card');
    const likedVideoCards = document.querySelectorAll('.liked-video-card');
    const settingToggles = document.querySelectorAll('.setting-toggle');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    // More popup functionality
    const moreBtn = document.getElementById('more-btn');
    const morePopup = document.getElementById('more-popup');
    const closePopup = document.getElementById('close-popup');
    
    let currentTab = 'videos';
    let isLoading = false;
    
    // Initialize profile page
    initializeProfile();
    
    function initializeProfile() {
        setupTabs();
        setupProfileActions();
        setupVideoCards();
        setupLikedVideos();
        setupSettings();
        setupSearch();
        setupMorePopup();
        loadProfileData();
    }
    
    function setupTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                switchTab(targetTab);
            });
        });
    }
    
    function switchTab(tabName) {
        // Update button states
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update content visibility
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            }
        });
        
        currentTab = tabName;
        
        // Load tab-specific content
        loadTabContent(tabName);
    }
    
    function loadTabContent(tabName) {
        switch(tabName) {
            case 'videos':
                loadUserVideos();
                break;
            case 'liked':
                loadLikedVideos();
                break;
            case 'settings':
                loadSettings();
                break;
        }
    }
    
    function setupProfileActions() {
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                openEditProfileModal();
            });
        }
        
        if (shareProfileBtn) {
            shareProfileBtn.addEventListener('click', () => {
                shareProfile();
            });
        }
    }
    
    function openEditProfileModal() {
        // Create edit profile modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Profile</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="edit-name">Name</label>
                        <input type="text" id="edit-name" value="${document.querySelector('.profile-name')?.textContent || ''}">
                    </div>
                    <div class="form-group">
                        <label for="edit-username">Username</label>
                        <input type="text" id="edit-username" value="${document.querySelector('.profile-username')?.textContent || ''}">
                    </div>
                    <div class="form-group">
                        <label for="edit-bio">Bio</label>
                        <textarea id="edit-bio" rows="4">${document.querySelector('.profile-bio')?.textContent || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit-avatar">Profile Picture</label>
                        <input type="file" id="edit-avatar" accept="image/*">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-save">Save Changes</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup modal events
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const saveBtn = modal.querySelector('.btn-save');
        
        closeBtn.addEventListener('click', () => closeModal(modal));
        cancelBtn.addEventListener('click', () => closeModal(modal));
        
        saveBtn.addEventListener('click', () => {
            saveProfileChanges(modal);
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal(modal);
            }
        });
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
    
    function saveProfileChanges(modal) {
        const name = modal.querySelector('#edit-name').value;
        const username = modal.querySelector('#edit-username').value;
        const bio = modal.querySelector('#edit-bio').value;
        const avatarFile = modal.querySelector('#edit-avatar').files[0];
        
        // Update profile display
        const nameElement = document.querySelector('.profile-name');
        const usernameElement = document.querySelector('.profile-username');
        const bioElement = document.querySelector('.profile-bio');
        
        if (nameElement) nameElement.textContent = name;
        if (usernameElement) usernameElement.textContent = username;
        if (bioElement) bioElement.textContent = bio;
        
        // Handle avatar upload
        if (avatarFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const avatarElement = document.querySelector('.profile-avatar');
                if (avatarElement) {
                    avatarElement.src = e.target.result;
                }
            };
            reader.readAsDataURL(avatarFile);
        }
        
        closeModal(modal);
        showNotification('Profile updated successfully!');
    }
    
    function shareProfile() {
        const profileUrl = window.location.href;
        const profileName = document.querySelector('.profile-name')?.textContent || 'My Profile';
        
        if (navigator.share) {
            navigator.share({
                title: `${profileName} - LoopPlus Profile`,
                text: `Check out ${profileName}'s profile on LoopPlus!`,
                url: profileUrl
            }).catch(error => {
                console.log('Share failed:', error);
                fallbackShare(profileUrl);
            });
        } else {
            fallbackShare(profileUrl);
        }
    }
    
    function fallbackShare(url) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Profile link copied to clipboard!');
            }).catch(() => {
                showNotification('Share feature not available');
            });
        } else {
            showNotification('Share feature not available');
        }
    }
    
    function setupVideoCards() {
        videoCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('.video-title')?.textContent;
                if (title) {
                    showNotification(`Opening video: ${title}`);
                    // In a real app, this would open the video
                }
            });
        });
    }
    
    function setupLikedVideos() {
        likedVideoCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('.liked-video-title')?.textContent;
                if (title) {
                    showNotification(`Opening liked video: ${title}`);
                    // In a real app, this would open the video
                }
            });
        });
    }
    
    function setupSettings() {
        settingToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                const isActive = toggle.classList.contains('active');
                const settingName = toggle.closest('.setting-item')?.querySelector('.setting-label')?.textContent;
                
                // Update setting
                updateSetting(settingName, isActive);
                
                // Add visual feedback
                toggle.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    toggle.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
    
    function updateSetting(settingName, value) {
        console.log(`Setting ${settingName} to ${value}`);
        // In a real app, this would save to backend
        
        showNotification(`${settingName} ${value ? 'enabled' : 'disabled'}`);
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
        // Mock search results for profile content
        const results = [
            { title: 'My Dance Video', type: 'video', views: '1.2M' },
            { title: 'Cooking Tutorial', type: 'video', views: '856K' },
            { title: 'Travel Vlog', type: 'video', views: '2.3M' },
            { title: 'Comedy Sketch', type: 'video', views: '5.1M' }
        ].filter(result => result.title.toLowerCase().includes(query.toLowerCase()));
        
        displaySearchResults(results);
    }
    
    function displaySearchResults(results) {
        if (!searchResults) return;
        
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No videos found</div>';
        } else {
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                
                resultItem.innerHTML = `
                    <i class="fas fa-video"></i>
                    <div class="search-result-content">
                        <span class="search-result-title">${result.title}</span>
                        <span class="search-result-meta">${result.views} views</span>
                    </div>
                `;
                
                resultItem.addEventListener('click', () => {
                    searchInput.value = result.title;
                    hideSearchResults();
                    showNotification(`Opening video: ${result.title}`);
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
    
    function loadProfileData() {
        // Simulate loading profile data
        showLoadingSpinner();
        
        setTimeout(() => {
            hideLoadingSpinner();
            loadTabContent(currentTab);
        }, 800);
    }
    
    function loadUserVideos() {
        const videosGrid = document.querySelector('#videos-tab .videos-grid');
        if (!videosGrid) return;
        
        // Check if already loaded
        if (videosGrid.children.length > 0) return;
        
        showLoadingSpinner();
        
        // Mock user videos
        const videos = [
            { title: 'My First Video', views: '1.2M', likes: '89K', date: '2 days ago' },
            { title: 'Dance Challenge', views: '856K', likes: '67K', date: '1 week ago' },
            { title: 'Cooking Tutorial', views: '2.3M', likes: '156K', date: '2 weeks ago' },
            { title: 'Travel Vlog', views: '5.1M', likes: '234K', date: '1 month ago' },
            { title: 'Comedy Sketch', views: '945K', likes: '45K', date: '1 month ago' },
            { title: 'Fitness Workout', views: '1.8M', likes: '123K', date: '2 months ago' }
        ];
        
        setTimeout(() => {
            videos.forEach(video => {
                const card = createVideoCard(video);
                videosGrid.appendChild(card);
            });
            
            hideLoadingSpinner();
            setupVideoCards();
        }, 1000);
    }
    
    function loadLikedVideos() {
        const likedVideosContainer = document.querySelector('#liked-tab .liked-videos');
        if (!likedVideosContainer) return;
        
        // Check if already loaded
        if (likedVideosContainer.children.length > 0) return;
        
        showLoadingSpinner();
        
        // Mock liked videos
        const likedVideos = [
            { title: 'Amazing Dance', creator: '@dancer123', views: '2.1M', likes: '89K' },
            { title: 'Funny Moments', creator: '@comedyking', views: '1.5M', likes: '67K' },
            { title: 'Travel Adventure', creator: '@wanderer', views: '3.2M', likes: '156K' },
            { title: 'Food Recipe', creator: '@chefmaster', views: '890K', likes: '34K' },
            { title: 'Music Cover', creator: '@musiclover', views: '1.1M', likes: '78K' }
        ];
        
        setTimeout(() => {
            likedVideos.forEach(video => {
                const card = createLikedVideoCard(video);
                likedVideosContainer.appendChild(card);
            });
            
            hideLoadingSpinner();
            setupLikedVideos();
        }, 1000);
    }
    
    function loadSettings() {
        // Settings are already in the HTML, just ensure they're visible
        const settingsSection = document.querySelector('#settings-tab .settings-section');
        if (settingsSection) {
            settingsSection.style.display = 'block';
        }
    }
    
    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        
        card.innerHTML = `
            <img src="https://picsum.photos/seed/${video.title}/200/300.jpg" alt="${video.title}" class="video-thumbnail">
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-meta">
                    <span class="video-views">
                        <i class="fas fa-eye"></i> ${video.views}
                    </span>
                    <span class="video-likes">
                        <i class="fas fa-heart"></i> ${video.likes}
                    </span>
                    <span class="video-date">
                        <i class="fas fa-clock"></i> ${video.date}
                    </span>
                </div>
            </div>
        `;
        
        return card;
    }
    
    function createLikedVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'liked-video-card';
        
        card.innerHTML = `
            <img src="https://picsum.photos/seed/${video.title}/80/80.jpg" alt="${video.title}" class="liked-video-thumbnail">
            <div class="liked-video-info">
                <h3 class="liked-video-title">${video.title}</h3>
                <p class="liked-video-creator">${video.creator}</p>
                <div class="liked-video-stats">
                    <span class="video-views">
                        <i class="fas fa-eye"></i> ${video.views}
                    </span>
                    <span class="video-likes">
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
        
        // Tab navigation with arrow keys
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const tabs = Array.from(tabButtons);
                const currentIndex = tabs.indexOf(activeTab);
                let newIndex;
                
                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                } else {
                    newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                }
                
                const newTab = tabs[newIndex];
                const targetTab = newTab.dataset.tab;
                switchTab(targetTab);
            }
        }
    });
    
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
    
    // Track tab switches
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            trackEvent('tab_switch', { tab: tabName });
        });
    });
    
    // Track video clicks
    videoCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.video-title')?.textContent;
            trackEvent('video_click', { title, position: index + 1, source: 'profile_videos' });
        });
    });
    
    likedVideoCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.liked-video-title')?.textContent;
            trackEvent('video_click', { title, position: index + 1, source: 'liked_videos' });
        });
    });
});
