
/* ============================================
   GROW GENIX - Main JavaScript
   Common functionality for all pages
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initCustomCursor();
    // Navbar, mobile menu, theme switcher, icons, year are now initialized by component-loader.js
    initInteractiveGrid();
});

/* ==================== Preloader ==================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    window.addEventListener('load', () => {
        // A small delay to prevent jarring transitions, but not a long fixed wait.
        setTimeout(() => {
            preloader.classList.add('fade-out');
            // The preloader will be hidden by the CSS animation's end state.
            // But we can also set display: none after the animation for safety.
            setTimeout(() => preloader.style.display = 'none', 500); // 500ms matches transition duration
        }, 100);
    });
}

/* ==================== Custom Cursor ==================== */
function initCustomCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorFollower = document.getElementById('cursor-follower');
    if (!cursorDot || !cursorFollower || window.innerWidth < 768) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    const animateCursor = () => {
        dotX += (mouseX - dotX) * 0.5;
        dotY += (mouseY - dotY) * 0.5;
        cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        cursorFollower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px)`;
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll('a, button, [onclick]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px) scale(1.5)`;
            cursorFollower.style.borderColor = 'var(--secondary-brand)';
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px) scale(1)`;
            cursorFollower.style.borderColor = 'var(--primary-brand)';
        });
    });
}

/* ==================== Navbar ==================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
    });
    highlightActiveNavLink();
}

function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.classList.remove('active'); // Ensure no links are active initially
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

/* ==================== Mobile Menu ==================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
            initLucideIcons();
        }
    });

    mobileMenu.querySelectorAll('a, button').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                initLucideIcons();
            }
        });
    });
}

/* ==================== Theme Switcher ==================== */
function initThemeSwitcher() {
    const themeToggleBtns = document.querySelectorAll('#theme-toggle-btn, #mobile-theme-toggle-btn');
    const currentTheme = localStorage.getItem('theme');

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggleBtns.forEach(btn => btn.innerHTML = '<i data-lucide="moon" class="w-5 h-5"></i>');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggleBtns.forEach(btn => btn.innerHTML = '<i data-lucide="sun" class="w-5 h-5"></i>');
        }
        initLucideIcons();
    };

    if (currentTheme) {
        applyTheme(currentTheme);
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            applyTheme(theme);
        });
    });
}

/* ==================== Lucide Icons ==================== */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/* ==================== Interactive Grid for Light Theme ==================== */
function initInteractiveGrid() {
    document.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });
}

/* ==================== Dynamic Copyright Year ==================== */
function initDynamicYear() {
    document.querySelectorAll('.dynamic-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
}
