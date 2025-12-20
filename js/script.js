import { initDashboard, destroyDashboard } from "./dashboard.js";
import { initInventory, destroyInventory } from "./inventory.js";
import { initPOS, destroyPOS } from "./pos.js";

const mainContent = document.getElementById("mainContent");
const navButtons = document.querySelectorAll(".nav-btn");
const burgerBtn = document.getElementById("burger-btn");
const sidebar = document.getElementById("sidebar");
const lines = burgerBtn.querySelectorAll(".burger-line");

let currentPage = null;
let open = false;

burgerBtn.addEventListener("click", () => {
    open = !open;

    // Sidebar slide
    sidebar.classList.toggle("-translate-x-full", !open);
    sidebar.classList.toggle("translate-x-0", open);

    // Shift main content
    mainContent.classList.toggle("ml-64", open);

    // Burger -> X animation
    lines[0].classList.toggle("rotate-45", open);
    lines[0].classList.toggle("translate-y-1.5", open);

    lines[1].classList.toggle("opacity-0", open);

    lines[2].classList.toggle("-rotate-45", open);
    lines[2].classList.toggle("-translate-y-1.5", open);
});

const pages = {
    dashboard: {
        html: "pages/dashboard.html",
        init: initDashboard,
        destroy: destroyDashboard
    },
    inventory: {
        html: "pages/inventory.html",
        init: initInventory,
        destroy: destroyInventory
    },
    pos: {
        html: "pages/pos.html",
        init: initPOS,
        destroy: destroyPOS
    }
};

async function loadPage(pageName) {
    currentPage?.destroy?.();

    const page = pages[pageName];
    const res = await fetch(page.html);
    mainContent.innerHTML = await res.text();

    page.init();
    currentPage = page;
}

navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        loadPage(btn.dataset.page);
    });
});

loadPage("dashboard");
