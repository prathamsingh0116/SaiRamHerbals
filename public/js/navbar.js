// ======================================
// Navbar
// ======================================

const menuToggle = document.querySelector(".menu-toggle");

const mobileMenu = document.querySelector(".mobile-menu");

const closeMenu = document.querySelector(".close-menu");

const overlay = document.querySelector(".mobile-overlay");

const header = document.querySelector(".site-header");

// =========================
// Open Menu
// =========================

menuToggle?.addEventListener("click",()=>{

    mobileMenu.classList.add("active");

    overlay.classList.add("active");

});

// =========================
// Close Menu
// =========================

closeMenu?.addEventListener("click",()=>{

    mobileMenu.classList.remove("active");

    overlay.classList.remove("active");

});

overlay?.addEventListener("click",()=>{

    mobileMenu.classList.remove("active");

    overlay.classList.remove("active");

});

// =========================
// Sticky Header
// =========================

window.addEventListener("scroll",()=>{

    if(window.scrollY>20){

        header.classList.add("scrolled");

    }

    else{

        header.classList.remove("scrolled");

    }

});


function confirmLogout(event) {

    event.preventDefault();

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        window.location.href = "/logout";

    }

}