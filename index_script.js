// nav_script.js
const burgerBtn = document.getElementById("burger-btn");
const burgerMenu = document.getElementById("burger-menu");
const lines = burgerBtn.querySelectorAll("span");
const welcomeText = document.querySelector("header p"); 
const mainContent = document.querySelector("main"); 
const sidebarLinks = document.querySelectorAll("[data-page]");

let open = false;

// Toggle sidebar
burgerBtn.addEventListener("click", () => {
    open = !open;

    if (open) {
        burgerMenu.classList.remove("-translate-x-full");
        burgerMenu.classList.add("translate-x-0");
        welcomeText.classList.add("ml-80", "transition-all", "duration-300");
        mainContent.classList.add("ml-64", "transition-all", "duration-300");
    } else {
        burgerMenu.classList.add("-translate-x-full");
        burgerMenu.classList.remove("translate-x-0");
        welcomeText.classList.remove("ml-80");
        mainContent.classList.remove("ml-64");
    }

    // Animate burger to X
    lines[0].classList.toggle("rotate-45");
    lines[0].classList.toggle("translate-y-1.5");
    lines[1].classList.toggle("opacity-0");
    lines[2].classList.toggle("-rotate-45");
    lines[2].classList.toggle("-translate-y-1.5");
});

// Function to load a page into main
async function loadPage(page) {
    try {
        const res = await fetch(page);
        if (!res.ok) throw new Error("Page not found");
        const html = await res.text();
        // Parse the fetched HTML so we can insert only the intended fragment
        // and execute any <script> tags (browsers don't run scripts inserted via innerHTML).
        const tmp = document.createElement('div');
        tmp.innerHTML = html;

        // Remove previously injected dynamic scripts to avoid duplicate handlers
        document.querySelectorAll('script[data-dynamic="true"]').forEach(s => s.remove());

        // Prefer a page-local fragment (#inventoryMain) if present, otherwise the
        // fetched <main> or the whole fragment. Also include a page-local <nav>
        // when present so sub-navs (like Inventory's) are shown.
        const fragment = tmp.querySelector('#inventoryMain') || tmp.querySelector('main') || tmp;
        const pageNav = tmp.querySelector('nav');

        // If the fragment itself is the inventory wrapper (#inventoryMain), keep
        // its outerHTML so the element with that id exists in the document
        // (scripts rely on document.getElementById('inventoryMain')). Otherwise
        // insert fragment.innerHTML as before.
        let contentHTML;
        if (fragment.id === 'inventoryMain') {
            contentHTML = (pageNav ? pageNav.outerHTML : '') + fragment.outerHTML;
        } else {
            contentHTML = (pageNav ? pageNav.outerHTML : '') + fragment.innerHTML;
        }
        mainContent.innerHTML = contentHTML;

        // Execute scripts found in the fetched HTML by appending real <script> nodes.
        try {
            const scripts = tmp.querySelectorAll('script');
            const baseForResolution = window.location.origin + page;

            scripts.forEach(s => {
                const newScript = document.createElement('script');
                newScript.setAttribute('data-dynamic', 'true');
                if (s.src) {
                    // Resolve relative src against the fetched page URL.
                    const src = s.getAttribute('src');
                    try {
                        newScript.src = new URL(src, baseForResolution).href;
                    } catch (e) {
                        newScript.src = src;
                    }
                    newScript.async = false;
                } else {
                    newScript.textContent = s.textContent;
                }
                document.body.appendChild(newScript);
            });
        } catch (err) {
            console.error('Error injecting scripts from fetched page:', err);
        }
    } catch (err) {
        mainContent.innerHTML = `<p class="text-white">Failed to load page: ${err.message}</p>`;
    }
}

// Load default dashboard page on page load
window.addEventListener("DOMContentLoaded", () => {
    loadPage("/dashboard/dashboard.html");
});

// Load pages on sidebar click
sidebarLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.getAttribute("data-page");
        loadPage(page);
    });
});
