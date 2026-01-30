// Settings Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navBtns = document.querySelectorAll('.nav-btn');
    const settingsSections = document.querySelectorAll('.settings-section');
    const saveAllBtn = document.getElementById('save-all-btn');
    const successModal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOk = document.getElementById('modal-ok');
    
    // More popup elements
    const moreBtn = document.getElementById('more-btn');
    const morePopup = document.getElementById('more-popup');
    const closePopup = document.getElementById('close-popup');
    
    // Form elements
    const bioTextarea = document.getElementById('bio');
    const bioCount = document.getElementById('bio-count');
    const darkModeToggle = document.getElementById('dark-mode');
    
    // Initialize
    initializeSettings();
    
    function initializeSettings() {
        setupNavigation();
        setupMorePopup();
        setupFormHandlers();
        loadSettings();
        loadDarkMode();
    }
    
    function setupNavigation() {
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;
                switchSection(targetSection);
            });
        });
    }
    
    function switchSection(sectionId) {
        // Update nav buttons
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionId) {
                btn.classList.add('active');
            }
        });
        
        // Update sections
        settingsSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
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
                // Already on settings page
                break;
            case 'Privacy':
                switchSection('privacy');
                break;
            case 'Help Center':
                switchSection('about');
                setTimeout(() => {
                    document.getElementById('help-center')?.click();
                }, 100);
                break;
            case 'About':
                switchSection('about');
                break;
            case 'Business':
                showNotification('Business portal coming soon!');
                break;
            case 'Creator Portal':
                showNotification('Creator portal coming soon!');
                break;
            case 'Analytics':
                showNotification('Analytics dashboard coming soon!');
                break;
            case 'Language':
                switchSection('appearance');
                break;
            case 'Dark Mode':
                toggleDarkMode();
                break;
            case 'Notifications':
                switchSection('notifications');
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
    
    function setupFormHandlers() {
        // Bio character counter
        if (bioTextarea && bioCount) {
            bioTextarea.addEventListener('input', updateBioCount);
        }
        
        // Save all changes
        if (saveAllBtn) {
            saveAllBtn.addEventListener('click', saveAllSettings);
        }
        
        // Modal handlers
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        if (modalOk) {
            modalOk.addEventListener('click', closeModal);
        }
        
        // Close modal on outside click
        if (successModal) {
            successModal.addEventListener('click', (e) => {
                if (e.target === successModal) {
                    closeModal();
                }
            });
        }
        
        // Dark mode toggle
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', toggleDarkMode);
        }
        
        // Account type change
        const accountType = document.getElementById('account-type');
        if (accountType) {
            accountType.addEventListener('change', (e) => {
                showNotification(`Account type changed to ${e.target.value}`);
            });
        }
        
        // Privacy settings
        setupPrivacyToggles();
        
        // Notification settings
        setupNotificationToggles();
        
        // Appearance settings
        setupAppearanceSettings();
        
        // Content settings
        setupContentSettings();
        
        // Security settings
        setupSecuritySettings();
        
        // About section buttons
        setupAboutButtons();
    }
    
    function updateBioCount() {
        const count = bioTextarea.value.length;
        bioCount.textContent = count;
        
        if (count > 70) {
            bioCount.style.color = 'var(--error-color)';
        } else if (count > 60) {
            bioCount.style.color = 'var(--warning-color)';
        } else {
            bioCount.style.color = 'var(--text-muted)';
        }
    }
    
    function setupPrivacyToggles() {
        const toggles = ['private-account', 'show-activity', 'profile-discovery', 'allow-comments', 'allow-duet', 'allow-stitch'];
        
        toggles.forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    const setting = toggleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const status = e.target.checked ? 'enabled' : 'disabled';
                    showNotification(`${setting} ${status}`);
                });
            }
        });
        
        // Default privacy change
        const defaultPrivacy = document.getElementById('default-privacy');
        if (defaultPrivacy) {
            defaultPrivacy.addEventListener('change', (e) => {
                showNotification(`Default video privacy set to ${e.target.value}`);
            });
        }
    }
    
    function setupNotificationToggles() {
        const toggles = ['notify-likes', 'notify-comments', 'notify-followers', 'notify-mentions', 'notify-messages', 'email-summary', 'email-security'];
        
        toggles.forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    const setting = toggleId.replace('notify-', '').replace('email-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const status = e.target.checked ? 'enabled' : 'disabled';
                    showNotification(`${setting} notifications ${status}`);
                });
            }
        });
    }
    
    function setupAppearanceSettings() {
        // Compact view toggle
        const compactView = document.getElementById('compact-view');
        if (compactView) {
            compactView.addEventListener('change', (e) => {
                const status = e.target.checked ? 'enabled' : 'disabled';
                showNotification(`Compact view ${status}`);
                // Apply compact view class
                document.body.classList.toggle('compact-view', e.target.checked);
            });
        }
        
        // Reduce animations toggle
        const reduceAnimations = document.getElementById('reduce-animations');
        if (reduceAnimations) {
            reduceAnimations.addEventListener('change', (e) => {
                const status = e.target.checked ? 'enabled' : 'disabled';
                showNotification(`Reduced animations ${status}`);
                // Apply reduced animations class
                document.body.classList.toggle('reduce-animations', e.target.checked);
            });
        }
        
        // Language change
        const language = document.getElementById('language');
        if (language) {
            language.addEventListener('change', (e) => {
                showNotification(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
            });
        }
        
        // Auto-translate toggle
        const autoTranslate = document.getElementById('auto-translate');
        if (autoTranslate) {
            autoTranslate.addEventListener('change', (e) => {
                const status = e.target.checked ? 'enabled' : 'disabled';
                showNotification(`Auto-translate ${status}`);
            });
        }
    }
    
    function setupContentSettings() {
        // Video playback toggles
        const playbackToggles = ['autoplay', 'data-saver', 'show-captions'];
        
        playbackToggles.forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    const setting = toggleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const status = e.target.checked ? 'enabled' : 'disabled';
                    showNotification(`${setting} ${status}`);
                });
            }
        });
        
        // Video quality change
        const videoQuality = document.getElementById('video-quality');
        if (videoQuality) {
            videoQuality.addEventListener('change', (e) => {
                showNotification(`Video quality set to ${e.target.value}`);
            });
        }
        
        // Content filter change
        const contentFilter = document.getElementById('content-filter');
        if (contentFilter) {
            contentFilter.addEventListener('change', (e) => {
                const filterText = e.target.options[e.target.selectedIndex].text;
                showNotification(`Content filter set to ${filterText}`);
            });
        }
        
        // Mature content toggle
        const matureContent = document.getElementById('mature-content');
        if (matureContent) {
            matureContent.addEventListener('change', (e) => {
                const status = e.target.checked ? 'enabled' : 'disabled';
                showNotification(`Mature content ${status}`);
            });
        }
    }
    
    function setupSecuritySettings() {
        // Security toggles
        const securityToggles = ['two-factor', 'login-alerts'];
        
        securityToggles.forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    const setting = toggleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const status = e.target.checked ? 'enabled' : 'disabled';
                    showNotification(`${setting} ${status}`);
                    
                    // Special handling for 2FA
                    if (toggleId === 'two-factor' && e.target.checked) {
                        setTimeout(() => {
                            showNotification('Two-factor authentication setup instructions sent to your email');
                        }, 1000);
                    }
                });
            }
        });
        
        // Disconnect account buttons
        const disconnectBtns = document.querySelectorAll('.btn-disconnect');
        disconnectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const accountName = e.target.closest('.account-item').querySelector('span').textContent;
                if (confirm(`Are you sure you want to disconnect ${accountName}?`)) {
                    e.target.closest('.account-item').remove();
                    showNotification(`${accountName} disconnected`);
                }
            });
        });
        
        // Download data button
        const downloadData = document.getElementById('download-data');
        if (downloadData) {
            downloadData.addEventListener('click', () => {
                showNotification('Data download request sent. You will receive an email when ready.');
            });
        }
        
        // Delete account button
        const deleteAccount = document.getElementById('delete-account');
        if (deleteAccount) {
            deleteAccount.addEventListener('click', () => {
                const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
                if (confirmation) {
                    const secondConfirmation = confirm('This will permanently delete all your data. Are you absolutely sure?');
                    if (secondConfirmation) {
                        showNotification('Account deletion request submitted. You will receive a confirmation email.');
                    }
                }
            });
        }
    }
    
    function setupAboutButtons() {
        // Check updates button
        const checkUpdates = document.getElementById('check-updates');
        if (checkUpdates) {
            checkUpdates.addEventListener('click', () => {
                showNotification('Checking for updates...');
                setTimeout(() => {
                    showNotification('You are using the latest version of LoopPlus');
                }, 2000);
            });
        }
        
        // Legal buttons
        const legalButtons = ['terms-service', 'privacy-policy', 'cookie-policy'];
        legalButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    const documentName = btnId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    showNotification(`Opening ${documentName}...`);
                    // In a real app, this would open the legal document
                });
            }
        });
        
        // Support buttons
        const supportButtons = ['help-center', 'contact-support', 'report-problem'];
        supportButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    const actionName = btnId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    showNotification(`Opening ${actionName}...`);
                    // In a real app, this would open the support page or contact form
                });
            }
        });
    }
    
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // Update toggle state
        if (darkModeToggle) {
            darkModeToggle.checked = isDarkMode;
        }
        
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
    
    function saveAllSettings() {
        // Collect all settings
        const settings = {
            account: {
                username: document.getElementById('username')?.value,
                email: document.getElementById('email')?.value,
                displayName: document.getElementById('display-name')?.value,
                bio: document.getElementById('bio')?.value,
                accountType: document.getElementById('account-type')?.value
            },
            privacy: {
                privateAccount: document.getElementById('private-account')?.checked,
                showActivity: document.getElementById('show-activity')?.checked,
                profileDiscovery: document.getElementById('profile-discovery')?.checked,
                defaultPrivacy: document.getElementById('default-privacy')?.value,
                allowComments: document.getElementById('allow-comments')?.checked,
                allowDuet: document.getElementById('allow-duet')?.checked,
                allowStitch: document.getElementById('allow-stitch')?.checked
            },
            notifications: {
                likes: document.getElementById('notify-likes')?.checked,
                comments: document.getElementById('notify-comments')?.checked,
                followers: document.getElementById('notify-followers')?.checked,
                mentions: document.getElementById('notify-mentions')?.checked,
                messages: document.getElementById('notify-messages')?.checked,
                emailSummary: document.getElementById('email-summary')?.checked,
                emailSecurity: document.getElementById('email-security')?.checked
            },
            appearance: {
                darkMode: document.getElementById('dark-mode')?.checked,
                compactView: document.getElementById('compact-view')?.checked,
                reduceAnimations: document.getElementById('reduce-animations')?.checked,
                language: document.getElementById('language')?.value,
                autoTranslate: document.getElementById('auto-translate')?.checked
            },
            content: {
                autoplay: document.getElementById('autoplay')?.checked,
                dataSaver: document.getElementById('data-saver')?.checked,
                videoQuality: document.getElementById('video-quality')?.value,
                showCaptions: document.getElementById('show-captions')?.checked,
                contentFilter: document.getElementById('content-filter')?.value,
                matureContent: document.getElementById('mature-content')?.checked
            },
            security: {
                twoFactor: document.getElementById('two-factor')?.checked,
                loginAlerts: document.getElementById('login-alerts')?.checked
            }
        };
        
        // Save to localStorage
        localStorage.setItem('loopplus-settings', JSON.stringify(settings));
        
        // Show success modal
        showSuccessModal();
    }
    
    function loadSettings() {
        const savedSettings = localStorage.getItem('loopplus-settings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                
                // Apply account settings
                if (settings.account) {
                    if (settings.account.username && document.getElementById('username')) {
                        document.getElementById('username').value = settings.account.username;
                    }
                    if (settings.account.email && document.getElementById('email')) {
                        document.getElementById('email').value = settings.account.email;
                    }
                    if (settings.account.displayName && document.getElementById('display-name')) {
                        document.getElementById('display-name').value = settings.account.displayName;
                    }
                    if (settings.account.bio && document.getElementById('bio')) {
                        document.getElementById('bio').value = settings.account.bio;
                        updateBioCount();
                    }
                    if (settings.account.accountType && document.getElementById('account-type')) {
                        document.getElementById('account-type').value = settings.account.accountType;
                    }
                }
                
                // Apply other settings...
                // (In a real implementation, all settings would be restored)
                
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }
    
    function loadDarkMode() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.checked = true;
            }
        }
    }
    
    function showSuccessModal() {
        if (successModal) {
            successModal.style.display = 'flex';
        }
    }
    
    function closeModal() {
        if (successModal) {
            successModal.style.display = 'none';
        }
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
    
    function getNotificationColor(type) {
        switch(type) {
            case 'success': return 'var(--success-color)';
            case 'error': return 'var(--error-color)';
            case 'warning': return 'var(--warning-color)';
            default: return 'var(--primary-color)';
        }
    }
});
