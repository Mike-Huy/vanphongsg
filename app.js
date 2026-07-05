/**
 * VĂN PHÒNG SÀI GÒN - Core App Logic
 * File: app.js
 */

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initFontSizeControls();
    initGlobalToast();
});

// Toast Notifications System
let toastTimeout;
window.showToast = function(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    
    if (!toast || !toastMsg) return;

    clearTimeout(toastTimeout);
    
    // Set style based on type
    toast.className = 'toast show';
    if (type === 'error') {
        toast.style.backgroundColor = '#dc3545';
    } else if (type === 'warning') {
        toast.style.backgroundColor = '#f59e0b';
    } else {
        toast.style.backgroundColor = '#0066cc'; // Theme primary blue
    }
    
    toastMsg.textContent = message;
    
    toastTimeout = setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
};

// Sidebar Tab Switching
function initSidebar() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.content-section');
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            
            // Remove active classes
            menuItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active classes to selected
            item.classList.add('active');
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Trigger view adjustment callbacks if any
                if (target === 'e-signature') {
                    window.resizeSignatureCanvas && window.resizeSignatureCanvas();
                }
            }

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Mobile menu toggle
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== toggleBtn) {
                sidebar.classList.remove('open');
            }
        });
    }
}

// Font Size Adjuster
function initFontSizeControls() {
    const btnDec = document.getElementById('btn-dec-font');
    const btnInc = document.getElementById('btn-inc-font');
    const sizeDisplay = document.getElementById('font-size-display');
    const htmlElement = document.documentElement;

    // Load saved font size or default to 10px
    let currentSize = parseInt(localStorage.getItem('vpsg-font-size')) || 10;
    
    const updateFontSize = (size) => {
        currentSize = Math.max(8, Math.min(size, 16)); // range: 8px to 16px
        htmlElement.style.fontSize = `${currentSize}px`;
        sizeDisplay.textContent = `${currentSize}px`;
        localStorage.setItem('vpsg-font-size', currentSize);
    };

    // Apply initially
    updateFontSize(currentSize);

    btnDec.addEventListener('click', () => {
        updateFontSize(currentSize - 1);
    });

    btnInc.addEventListener('click', () => {
        updateFontSize(currentSize + 1);
    });
}

function initGlobalToast() {
    // Basic toast container setup done in HTML, functionality in showToast
}
