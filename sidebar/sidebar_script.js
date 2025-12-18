// nav_script.js
const burgerBtn = document.getElementById("burger-btn");
const burgerMenu = document.getElementById("burger-menu");
const lines = burgerBtn.querySelectorAll("span");
const welcomeText = document.querySelector("header p"); // select the paragraph

let open = false;

burgerBtn.addEventListener("click", () => {
    open = !open;

    // Toggle sidebar
    if (open) {
        burgerMenu.classList.remove("-translate-x-full");
        burgerMenu.classList.add("translate-x-0");

        // Move welcome text to the right
        welcomeText.classList.add("ml-80"); // width of sidebar
        welcomeText.classList.add("transition-all", "duration-300");
    } else {
        burgerMenu.classList.add("-translate-x-full");
        burgerMenu.classList.remove("translate-x-0");

        // Move welcome text back
        welcomeText.classList.remove("ml-80");
    }

    // Animate burger to X
    lines[0].classList.toggle("rotate-45");
    lines[0].classList.toggle("translate-y-1.5");
    lines[1].classList.toggle("opacity-0");
    lines[2].classList.toggle("-rotate-45");
    lines[2].classList.toggle("-translate-y-1.5");
});
