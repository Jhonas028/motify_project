// inventory_script.js — idempotent and resilient to DOM replacements
console.log('inventory_script.js loaded'); // Log to confirm script is loaded

// Function to load a subpage HTML fragment into the main container
async function loadInventorySubPage(filePath) {
    try {
        // Fetch the HTML file
        const res = await fetch(filePath);
        if (!res.ok) throw new Error(`Cannot load ${filePath}: ${res.statusText}`); // Throw error if fetch fails

        const html = await res.text(); // Get response as text

        // Create a temporary div to parse HTML
        const tmp = document.createElement('div');
        tmp.innerHTML = html;

        // Check if the fetched content has a <body>; use its content if exists
        const body = tmp.querySelector('body');
        const content = body ? body.innerHTML : tmp.innerHTML;

        // Find the main container to inject content
        const container = document.getElementById('inventoryMain');
        if (!container) throw new Error('inventoryMain container not found'); // Error if container missing

        container.innerHTML = content; // Insert the content into the page
    } catch (err) {
        // If an error occurs, display it in the main container
        const container = document.getElementById('inventoryMain');
        if (container) container.innerHTML = `<p class="text-red-500 font-semibold">${err.message}</p>`;
        console.error(err); // Log error to console for debugging
    }
}

// Event delegation: handle clicks on nav links dynamically
document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link'); // Check if the clicked element or its parent has class 'nav-link'
    if (!link) return; // Exit if click is outside nav-link

    const nav = link.closest('nav'); // Ensure the link is inside a nav container
    if (!nav) return; // Exit if not inside nav

    e.preventDefault(); // Prevent default link navigation

    const page = link.getAttribute('data-page'); // Get target page URL from data-page attribute

    // Highlight the active link: remove styles from all links first
    nav.querySelectorAll('.nav-link').forEach(l => l.classList.remove('text-[#009999]', 'underline'));
    link.classList.add('text-[#009999]', 'underline'); // Add active styles to clicked link

    loadInventorySubPage(page); // Load the selected page content
});

// Immediately invoked function: on script load, load the first subpage
(() => {
    const nav = document.querySelector('nav'); // Find the first nav element
    if (!nav) return; // Exit if no nav exists

    const first = nav.querySelector('.nav-link'); // Select first link
    if (first) {
        const page = first.getAttribute('data-page');

        loadInventorySubPage(page); // Load first page without waiting for click

        // Highlight the first link as active
        nav.querySelectorAll('.nav-link').forEach(l => l.classList.remove('text-[#009999]', 'underline'));
        first.classList.add('text-[#009999]', 'underline');
    }
})();

// Event listener to handle active styles and buttons container visibility
document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link'); // Detect click on a nav link
    if (!link) return;

    const nav = link.closest('nav'); // Ensure the link is inside nav
    if (!nav) return;

    e.preventDefault(); // Stop default link navigation
    const page = link.getAttribute('data-page'); // Get target page

    // Define all the classes to apply for an active link
    const activeClasses = [
        "text-[#009999]",
        "font-semibold",
        "underline",
        "decoration-[#FF0000]",
        "decoration-4",
        "underline-offset-8"
    ];

    // Remove active classes from all links, then add to clicked link
    nav.querySelectorAll('.nav-link').forEach(l => l.classList.remove(...activeClasses));
    link.classList.add(...activeClasses);

    // Show or hide the buttons container based on the selected page
    const buttons = document.getElementById('productButtons');
    if (buttons) {
        if (page.includes('products.html')) {
            buttons.classList.remove('hidden'); // Show buttons if on Products page
        } else {
            buttons.classList.add('hidden');    // Hide buttons for other pages
        }
    }

    loadInventorySubPage(page); // Load the selected subpage content
});
