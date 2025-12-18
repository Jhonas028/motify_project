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
        mainContent.innerHTML = html;
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
