const images = document.querySelectorAll('.container img');
let current = 0;

setInterval(() => {
    images.forEach(img => img.classList.remove('hovered')); // reset all
    images[current].classList.add('hovered');              // auto-hover current
    current = (current + 4) % images.length;              // next image
}, 3000); // every 1 second
