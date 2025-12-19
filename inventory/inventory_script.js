// inventory_script.js — idempotent and resilient to DOM replacements
console.log('inventory_script.js loaded');

// Load a subpage fragment into the inventory container
async function loadInventorySubPage(filePath) {
    try {
        const res = await fetch(filePath);
        if (!res.ok) throw new Error(`Cannot load ${filePath}: ${res.statusText}`);
        const html = await res.text();

        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const body = tmp.querySelector('body');
        const content = body ? body.innerHTML : tmp.innerHTML;

        const container = document.getElementById('inventoryMain');
        if (!container) throw new Error('inventoryMain container not found');
        container.innerHTML = content;
    } catch (err) {
        const container = document.getElementById('inventoryMain');
        if (container) container.innerHTML = `<p class="text-red-500 font-semibold">${err.message}</p>`;
        console.error(err);
    }
}

// Use event delegation so handlers survive DOM replacements.
document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (!link) return;

    // Only handle nav-links that are inside the inventory nav (to avoid intercepting other pages)
    const nav = link.closest('nav');
    if (!nav) return;

    e.preventDefault();
    const page = link.getAttribute('data-page');

    // Highlight active link within this nav
    nav.querySelectorAll('.nav-link').forEach(l => l.classList.remove('text-[#009999]', 'underline'));
    link.classList.add('text-[#009999]', 'underline');

    loadInventorySubPage(page);
});

// On script load, if an inventory nav exists, trigger the first subpage load.
(() => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const first = nav.querySelector('.nav-link');
    if (first) {
        const page = first.getAttribute('data-page');
        // don't wait for click; load default
        loadInventorySubPage(page);
        // mark first as active
        nav.querySelectorAll('.nav-link').forEach(l => l.classList.remove('text-[#009999]', 'underline'));
        first.classList.add('text-[#009999]', 'underline');
    }
})();
