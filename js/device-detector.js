/**
 * LoopPlus Device Detection and Responsive Navigation
 * Automatically detects device type and handles responsive behavior
 */

class LoopPlusDeviceDetector {
    constructor() {
        this.deviceType = this.detectDevice();
        this.screenWidth = window.innerWidth;
        this.isMobile = this.deviceType === 'mobile';
        this.isTablet = this.deviceType === 'tablet';
        this.isDesktop = this.deviceType === 'desktop';
        
        this.init();
    }
    
    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const screenWidth = window.innerWidth;
        
        // Check for mobile devices
        if (/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || screenWidth <= 768) {
            return 'mobile';
        }
        
        // Check for tablets
        if (/ipad|android(?!.*mobile)/i.test(userAgent) || (screenWidth > 768 && screenWidth <= 1024)) {
            return 'tablet';
        }
        
        // Default to desktop
        return 'desktop';
    }
    
    init() {
        // Add device class to body for CSS targeting
        document.body.classList.add(`device-${this.deviceType}`);
        
        // Handle responsive navigation
        this.handleResponsiveNavigation();
        
        // Listen for resize events
        this.setupResizeListener();
        
        // Log device info for debugging
        console.log(`LoopPlus Device Detection:`);
        console.log(`- Device Type: ${this.deviceType}`);
        console.log(`- Screen Width: ${this.screenWidth}px`);
        console.log(`- User Agent: ${navigator.userAgent}`);
    }
    
    handleResponsiveNavigation() {
        // If current version doesn't match device type, show switch option
        const currentVersion = this.getCurrentVersion();
        
        if (currentVersion !== this.deviceType && this.shouldShowSwitchOption()) {
            this.showVersionSwitchOption();
        }
        
        // Add responsive behavior based on screen size
        if (this.isMobile) {
            this.optimizeForMobile();
        } else if (this.isTablet) {
            this.optimizeForTablet();
        } else {
            this.optimizeForDesktop();
        }
    }
    
    getCurrentVersion() {
        // Detect which version is currently loaded
        const path = window.location.pathname;
        
        if (path.includes('mobile app version')) {
            return 'mobile';
        } else if (path.includes('web app version')) {
            return 'desktop';
        }
        
        // Default detection based on layout
        return document.body.classList.contains('mobile-main-content') ? 'mobile' : 'desktop';
    }
    
    shouldShowSwitchOption() {
        // Don't show switch option on very small screens or if user recently switched
        const lastSwitch = localStorage.getItem('loopplus_version_switch');
        const now = Date.now();
        
        if (lastSwitch && (now - parseInt(lastSwitch)) < 300000) { // 5 minutes
            return false;
        }
        
        return true;
    }
    
    showVersionSwitchOption() {
        // Create version switch notification
        const switchNotification = document.createElement('div');
        switchNotification.className = 'version-switch-notification';
        switchNotification.innerHTML = `
            <div class="switch-content">
                <span class="switch-text">
                    ${this.isMobile ? 'Desktop version available' : 'Mobile version available'}
                </span>
                <button class="switch-btn" onclick="loopPlusDetector.switchVersion()">
                    Switch to ${this.isMobile ? 'Desktop' : 'Mobile'}
                </button>
                <button class="switch-dismiss" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .version-switch-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                z-index: 10000;
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
            }
            
            .switch-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .switch-text {
                flex: 1;
                font-size: 14px;
            }
            
            .switch-btn {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
            }
            
            .switch-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            
            .switch-dismiss {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                opacity: 0.7;
            }
            
            .switch-dismiss:hover {
                opacity: 1;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .version-switch-notification {
                    top: auto;
                    bottom: 80px;
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
                
                .switch-content {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(switchNotification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (switchNotification.parentElement) {
                switchNotification.remove();
            }
        }, 10000);
    }
    
    switchVersion() {
        const targetVersion = this.isMobile ? 'desktop' : 'mobile';
        const targetPath = targetVersion === 'mobile' ? 'mobile app version/index.html' : 'web app version/index.html';
        
        // Remember the switch
        localStorage.setItem('loopplus_version_switch', Date.now().toString());
        
        // Smooth transition
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            window.location.href = targetPath;
        }, 300);
    }
    
    optimizeForMobile() {
        // Add mobile-specific optimizations
        document.documentElement.style.setProperty('--mobile-optimized', '1');
        
        // Prevent zoom on input focus (common mobile issue)
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        
        const existingMeta = document.querySelector('meta[name="viewport"]');
        if (existingMeta) {
            existingMeta.replaceWith(meta);
        } else {
            document.head.appendChild(meta);
        }
        
        // Add touch optimizations
        this.addTouchOptimizations();
    }
    
    optimizeForTablet() {
        // Add tablet-specific optimizations
        document.documentElement.style.setProperty('--tablet-optimized', '1');
        
        // Tablets get hybrid experience
        this.addTouchOptimizations();
    }
    
    optimizeForDesktop() {
        // Add desktop-specific optimizations
        document.documentElement.style.setProperty('--desktop-optimized', '1');
        
        // Enable hover effects and keyboard navigation
        this.addKeyboardNavigation();
    }
    
    addTouchOptimizations() {
        // Add touch event listeners for better mobile experience
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipeGesture(touchStartY, touchEndY);
        }, { passive: true });
    }
    
    handleSwipeGesture(startY, endY) {
        const swipeThreshold = 50;
        const diff = startY - endY;
        
        if (Math.abs(diff) > swipeThreshold) {
            // Trigger swipe events for video navigation
            const swipeEvent = new CustomEvent('swipe', {
                detail: { direction: diff > 0 ? 'up' : 'down' }
            });
            document.dispatchEvent(swipeEvent);
        }
    }
    
    addKeyboardNavigation() {
        // Add keyboard shortcuts for desktop
        document.addEventListener('keydown', (e) => {
            // Arrow keys for navigation
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                const direction = e.key === 'ArrowUp' ? 'up' : 'down';
                const navigateEvent = new CustomEvent('keyboardNavigate', {
                    detail: { direction }
                });
                document.dispatchEvent(navigateEvent);
            }
            
            // Space for play/pause
            if (e.key === ' ') {
                e.preventDefault();
                const playPauseEvent = new CustomEvent('togglePlayPause');
                document.dispatchEvent(playPauseEvent);
            }
            
            // M for mute
            if (e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                const muteEvent = new CustomEvent('toggleMute');
                document.dispatchEvent(muteEvent);
            }
        });
    }
    
    setupResizeListener() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newDeviceType = this.detectDevice();
                
                if (newDeviceType !== this.deviceType) {
                    console.log(`Device type changed from ${this.deviceType} to ${newDeviceType}`);
                    
                    // Show notification for version switch
                    this.deviceType = newDeviceType;
                    this.isMobile = this.deviceType === 'mobile';
                    this.isTablet = this.deviceType === 'tablet';
                    this.isDesktop = this.deviceType === 'desktop';
                    
                    // Update body class
                    document.body.className = document.body.className.replace(/device-\w+/, `device-${this.deviceType}`);
                    
                    // Re-handle responsive navigation
                    this.handleResponsiveNavigation();
                }
            }, 500);
        });
    }
    
    // Public method to get current device info
    getDeviceInfo() {
        return {
            type: this.deviceType,
            screenWidth: this.screenWidth,
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isDesktop: this.isDesktop,
            userAgent: navigator.userAgent
        };
    }
}

// Initialize the detector when DOM is ready
let loopPlusDetector;

document.addEventListener('DOMContentLoaded', () => {
    loopPlusDetector = new LoopPlusDeviceDetector();
    
    // Make it globally available
    window.loopPlusDetector = loopPlusDetector;
    
    // Add custom CSS variables for responsive design
    const root = document.documentElement;
    root.style.setProperty('--device-width', `${window.innerWidth}px`);
    root.style.setProperty('--device-height', `${window.innerHeight}px`);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoopPlusDeviceDetector;
}
