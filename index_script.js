// nav_script.js — handles sidebar toggle, burger animation, and dynamic page loading

// Select key DOM elements
const burgerBtn = document.getElementById("burger-btn"); // The hamburger button
const burgerMenu = document.getElementById("burger-menu"); // The sidebar menu
const lines = burgerBtn.querySelectorAll("span"); // The 3 lines inside the burger button
const welcomeText = document.querySelector("header p"); // Header text to move when sidebar opens
const mainContent = document.querySelector("main"); // Main content area to inject pages
const sidebarLinks = document.querySelectorAll("[data-page]"); // All sidebar links with page references

let open = false; // Track whether the sidebar is open or closed

// Toggle sidebar when burger button is clicked
burgerBtn.addEventListener("click", () => {
    open = !open; // Switch state

    if (open) {
        // Sidebar opening: remove hidden class, add visible transform
        burgerMenu.classList.remove("-translate-x-full");
        burgerMenu.classList.add("translate-x-0");

        // Move header text and main content to the right
        welcomeText.classList.add("ml-80", "transition-all", "duration-300");
        mainContent.classList.add("ml-64", "transition-all", "duration-300");
    } else {
        // Sidebar closing: hide sidebar again
        burgerMenu.classList.add("-translate-x-full");
        burgerMenu.classList.remove("translate-x-0");

        // Reset header text and main content position
        welcomeText.classList.remove("ml-80");
        mainContent.classList.remove("ml-64");
    }

    // Animate burger lines to form an "X" when open
    lines[0].classList.toggle("rotate-55");      // Rotate first line
    lines[0].classList.toggle("translate-y-1");  // Move it down slightly
    lines[0].classList.toggle("ml-1.5");         // Adjust left margin for centering

    lines[1].classList.toggle("opacity-0");      // Hide the middle line

    lines[2].classList.toggle("-rotate-55");     // Rotate third line in opposite direction
    lines[2].classList.toggle("-translate-y-1"); // Move it up slightly
    lines[2].classList.toggle("ml-1.5");         // Adjust left margin for centering
});

// Function to load a page into the main content area
async function loadPage(page) {
    try {
        // Fetch HTML content from the page
        const res = await fetch(page);
        if (!res.ok) throw new Error("Page not found"); // Handle fetch errors
        const html = await res.text(); // Get HTML text

        // Parse the fetched HTML
        const tmp = document.createElement('div');
        tmp.innerHTML = html;

        // Remove any previously injected dynamic scripts to prevent duplicates
        document.querySelectorAll('script[data-dynamic="true"]').forEach(s => s.remove());

        // Prefer #inventoryMain if exists, otherwise use <main> or the whole fragment
        const fragment = tmp.querySelector('#inventoryMain') || tmp.querySelector('main') || tmp;
        const pageNav = tmp.querySelector('nav'); // Include page-local nav if present

        // Decide what content to inject into mainContent
        let contentHTML;
        if (fragment.id === 'inventoryMain') {
            // Keep outerHTML to preserve the #inventoryMain element
            contentHTML = (pageNav ? pageNav.outerHTML : '') + fragment.outerHTML;
        } else {
            contentHTML = (pageNav ? pageNav.outerHTML : '') + fragment.innerHTML;
        }

        mainContent.innerHTML = contentHTML; // Inject the content

        // Execute scripts found in the fetched HTML
        try {
            const scripts = tmp.querySelectorAll('script'); // All scripts in fetched page
            const baseForResolution = window.location.origin + page; // Base for relative URLs

            scripts.forEach(s => {
                const newScript = document.createElement('script');
                newScript.setAttribute('data-dynamic', 'true'); // Mark as dynamic

                if (s.src) {
                    // Resolve relative src URLs
                    const src = s.getAttribute('src');
                    try {
                        newScript.src = new URL(src, baseForResolution).href;
                    } catch (e) {
                        newScript.src = src;
                    }
                    newScript.async = false; // Execute scripts in order
                } else {
                    newScript.textContent = s.textContent; // Inline scripts
                }

                document.body.appendChild(newScript); // Append to body
            });
        } catch (err) {
            console.error('Error injecting scripts from fetched page:', err);
        }

    } catch (err) {
        // Show error in main content if fetch fails
        mainContent.innerHTML = `<p class="text-white">Failed to load page: ${err.message}</p>`;
    }
}

// Load default dashboard page when DOM content is fully loaded
window.addEventListener("DOMContentLoaded", () => {
    loadPage("/dashboard/dashboard.html");
});

// Load pages when sidebar links are clicked
sidebarLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default navigation
        const page = link.getAttribute("data-page"); // Get target page
        loadPage(page); // Load the page dynamically
    });
});
