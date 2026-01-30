// Upload Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const videoPreview = document.getElementById('video-preview');
    const previewVideo = document.getElementById('preview-video');
    const uploadForm = document.getElementById('upload-form');
    const changeVideoBtn = document.getElementById('change-video-btn');
    const captionTextarea = document.getElementById('caption');
    const charCount = document.getElementById('char-count');
    const coverUpload = document.getElementById('cover-upload');
    const coverInput = document.getElementById('cover-input');
    const coverPreview = document.getElementById('cover-preview');
    const cancelBtn = document.getElementById('cancel-btn');
    const postBtn = document.getElementById('post-btn');
    const uploadProgress = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    const progressSize = document.getElementById('progress-size');
    const progressStatus = document.getElementById('progress-status');
    const successModal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');
    const viewProfileBtn = document.getElementById('view-profile-btn');
    const uploadAnotherBtn = document.getElementById('upload-another-btn');
    
    // More popup elements
    const moreBtn = document.getElementById('more-btn');
    const morePopup = document.getElementById('more-popup');
    const closePopup = document.getElementById('close-popup');
    
    // State
    let selectedVideo = null;
    let selectedCover = null;
    let isUploading = false;
    
    // Initialize
    initializeUpload();
    
    function initializeUpload() {
        setupEventListeners();
        setupMorePopup();
        loadDarkMode();
    }
    
    function setupEventListeners() {
        // File upload events
        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);
        
        // Drag and drop events
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // Video preview events
        changeVideoBtn.addEventListener('click', () => fileInput.click());
        
        // Form events
        captionTextarea.addEventListener('input', updateCharCount);
        coverUpload.addEventListener('click', () => coverInput.click());
        coverInput.addEventListener('change', handleCoverSelect);
        
        // Action buttons
        cancelBtn.addEventListener('click', resetUpload);
        postBtn.addEventListener('click', handleUpload);
        
        // Modal events
        modalClose.addEventListener('click', closeModal);
        viewProfileBtn.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
        uploadAnotherBtn.addEventListener('click', resetUpload);
        
        // Close modal on outside click
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
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
                showNotification('Opening settings...');
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
    
    // File handling functions
    function handleDragOver(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    }
    
    function handleDragLeave(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    }
    
    function handleFile(file) {
        // Validate file type
        if (!file.type.startsWith('video/')) {
            showNotification('Please select a valid video file', 'error');
            return;
        }
        
        // Validate file size (2GB limit)
        const maxSize = 2 * 1024 * 1024 * 1024; // 2GB in bytes
        if (file.size > maxSize) {
            showNotification('File size must be less than 2GB', 'error');
            return;
        }
        
        selectedVideo = file;
        showVideoPreview(file);
    }
    
    function showVideoPreview(file) {
        const url = URL.createObjectURL(file);
        previewVideo.src = url;
        
        previewVideo.addEventListener('loadedmetadata', () => {
            uploadArea.style.display = 'none';
            videoPreview.style.display = 'block';
            uploadForm.style.display = 'block';
        });
    }
    
    function handleCoverSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            selectedCover = file;
            const url = URL.createObjectURL(file);
            coverPreview.src = url;
            coverPreview.style.display = 'block';
            coverUpload.querySelector('.cover-placeholder').style.display = 'none';
        }
    }
    
    function updateCharCount() {
        const count = captionTextarea.value.length;
        charCount.textContent = count;
        
        if (count > 2000) {
            charCount.style.color = 'var(--error-color)';
        } else if (count > 1800) {
            charCount.style.color = 'var(--warning-color)';
        } else {
            charCount.style.color = 'var(--text-muted)';
        }
    }
    
    function handleUpload() {
        if (!selectedVideo) {
            showNotification('Please select a video to upload', 'error');
            return;
        }
        
        if (captionTextarea.value.length > 2200) {
            showNotification('Caption is too long (max 2200 characters)', 'error');
            return;
        }
        
        startUpload();
    }
    
    function startUpload() {
        isUploading = true;
        uploadForm.style.display = 'none';
        videoPreview.style.display = 'none';
        uploadProgress.style.display = 'flex';
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            updateProgress(progress);
            
            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    uploadComplete();
                }, 1000);
            }
        }, 500);
    }
    
    function updateProgress(progress) {
        progressFill.style.width = `${progress}%`;
        progressPercent.textContent = `${Math.round(progress)}%`;
        
        const uploadedSize = (selectedVideo.size * progress / 100 / 1024 / 1024).toFixed(1);
        const totalSize = (selectedVideo.size / 1024 / 1024).toFixed(1);
        progressSize.textContent = `${uploadedSize} MB / ${totalSize} MB`;
        
        if (progress < 30) {
            progressStatus.textContent = 'Preparing upload...';
        } else if (progress < 60) {
            progressStatus.textContent = 'Uploading video...';
        } else if (progress < 90) {
            progressStatus.textContent = 'Processing video...';
        } else {
            progressStatus.textContent = 'Finalizing...';
        }
    }
    
    function uploadComplete() {
        uploadProgress.style.display = 'none';
        successModal.style.display = 'flex';
        
        // Reset form
        selectedVideo = null;
        selectedCover = null;
        isUploading = false;
    }
    
    function closeModal() {
        successModal.style.display = 'none';
    }
    
    function resetUpload() {
        // Reset all states
        selectedVideo = null;
        selectedCover = null;
        isUploading = false;
        
        // Reset UI
        uploadArea.style.display = 'block';
        videoPreview.style.display = 'none';
        uploadForm.style.display = 'none';
        uploadProgress.style.display = 'none';
        successModal.style.display = 'none';
        
        // Reset form fields
        captionTextarea.value = '';
        updateCharCount();
        fileInput.value = '';
        coverInput.value = '';
        coverPreview.style.display = 'none';
        coverPreview.src = '';
        coverUpload.querySelector('.cover-placeholder').style.display = 'block';
        
        // Reset privacy options
        document.querySelector('input[name="privacy"][value="public"]').checked = true;
        document.getElementById('allow-comments').checked = true;
        document.getElementById('allow-duet').checked = true;
        document.getElementById('allow-stitch').checked = true;
        
        // Reset video preview
        previewVideo.src = '';
    }
    
    function loadDarkMode() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
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
