/* ============================================
   GROW GENIX - Component Loader
   Fetches and injects reusable HTML components.
   This script should be placed at the end of <body>, after main.js
   ============================================ */

(async function loadComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    const fetchAndInject = async (element, defaultPath) => {
        if (!element) return;

        const path = element.dataset.component || defaultPath;
        
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
            const html = await response.text();
            element.outerHTML = html; // Replace placeholder with fetched content
        } catch (error) {
            console.error(`Error loading component from ${path}:`, error);
            element.innerHTML = `<p style="color:red; text-align:center; padding: 1rem;">Error loading component.</p>`;
        }
    };

    // Define default paths for header and footer
    const defaultHeaderPath = 'includes/header.html';
    const defaultFooterPath = 'includes/footer.html';

    // Load header and footer in parallel
    await Promise.all([
        fetchAndInject(headerPlaceholder, defaultHeaderPath),
        fetchAndInject(footerPlaceholder, defaultFooterPath)
    ]);

    // IMPORTANT: Re-initialize scripts that depend on the newly added DOM elements.
    // These functions must be defined in another script loaded before this one (e.g., main.js).
    if (typeof initNavbar === 'function') initNavbar();
    if (typeof initMobileMenu === 'function') initMobileMenu();
    if (typeof initThemeSwitcher === 'function') initThemeSwitcher();
    if (typeof initLucideIcons === 'function') initLucideIcons();
    if (typeof initDynamicYear === 'function') initDynamicYear();
})();
