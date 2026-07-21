document.addEventListener("DOMContentLoaded", () => {

    const slider = document.querySelector(".promo-slider");
    const track = document.querySelector(".promo-track");
    const slides = document.querySelectorAll(".promo-slide");
    const prevBtn = document.querySelector(".promo-prev");
    const nextBtn = document.querySelector(".promo-next");
    const pagination = document.querySelector(".promo-pagination");

    if (!slider || !track || slides.length === 0) return;

    let current = 0;
    let autoPlay;
    const delay = 5000;

    /*============================
            CREATE DOTS
    ============================*/

    slides.forEach((_, index) => {

        const dot = document.createElement("button");

        dot.className = "promo-dot";

        if (index === 0) dot.classList.add("active");

        dot.addEventListener("click", () => {

            current = index;

            updateSlider();

            restartAuto();

        });

        pagination.appendChild(dot);

    });

    const dots = document.querySelectorAll(".promo-dot");

    /*============================
            UPDATE
    ============================*/

    function updateSlider() {

        track.style.transform = `translateX(-${current * 100}%)`;

        dots.forEach(dot => dot.classList.remove("active"));

        dots[current].classList.add("active");

    }

    /*============================
            NEXT / PREV
    ============================*/

    function nextSlide() {

        current = (current + 1) % slides.length;

        updateSlider();

    }

    function prevSlide() {

        current = (current - 1 + slides.length) % slides.length;

        updateSlider();

    }

    nextBtn.addEventListener("click", () => {

        nextSlide();

        restartAuto();

    });

    prevBtn.addEventListener("click", () => {

        prevSlide();

        restartAuto();

    });

    /*============================
            AUTOPLAY
    ============================*/

    function startAuto() {

        autoPlay = setInterval(nextSlide, delay);

    }

    function stopAuto() {

        clearInterval(autoPlay);

    }

    function restartAuto() {

        stopAuto();

        startAuto();

    }

    startAuto();

    slider.addEventListener("mouseenter", stopAuto);

    slider.addEventListener("mouseleave", startAuto);

    /*============================
            SWIPE
    ============================*/

    let startX = 0;

    slider.addEventListener("touchstart", e => {

        startX = e.touches[0].clientX;

    }, { passive: true });

    slider.addEventListener("touchend", e => {

        const endX = e.changedTouches[0].clientX;

        if (startX - endX > 60) {

            nextSlide();

        } else if (endX - startX > 60) {

            prevSlide();

        }

        restartAuto();

    }, { passive: true });

});