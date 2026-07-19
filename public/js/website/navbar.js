document.addEventListener("DOMContentLoaded", () => {

    /* ===========================================
                    SELECTORS
    =========================================== */

    const header = document.querySelector(".site-header");

    const menuToggle = document.querySelector(".menu-toggle");

    const drawer = document.querySelector(".mobile-drawer");

    const overlay = document.querySelector(".mobile-overlay");

    const closeBtn = document.querySelector(".drawer-close");

    const categoryBtn = document.querySelector(".mobile-category-btn");

    const mobileCategory = document.querySelector(".mobile-category");
    
    



    /* ===========================================
                    DRAWER
    =========================================== */

    function openDrawer(){

        drawer?.classList.add("active");

        overlay?.classList.add("active");
        
        navUp?.classList.add("active");

        document.body.style.overflow = "hidden";

    }



    function closeDrawer(){

        drawer?.classList.remove("active");

        overlay?.classList.remove("active");



    }



    menuToggle?.addEventListener("click", openDrawer);

    closeBtn?.addEventListener("click", closeDrawer);

    overlay?.addEventListener("click", closeDrawer);



    /* ===========================================
                ESC CLOSE
    =========================================== */

    document.addEventListener("keydown",(e)=>{

        if(e.key==="Escape"){

            closeDrawer();

        }

    });



    /* ===========================================
            CATEGORY ACCORDION
    =========================================== */

    categoryBtn?.addEventListener("click",()=>{

        mobileCategory?.classList.toggle("open");

    });



    /* ===========================================
                STICKY NAVBAR
    =========================================== */

    window.addEventListener("scroll",()=>{

        if(window.scrollY>20){

            header?.classList.add("scrolled");

        }

        else{

            header?.classList.remove("scrolled");

        }

    });



    /* ===========================================
            AUTO CLOSE ON DESKTOP
    =========================================== */

    window.addEventListener("resize",()=>{

        if(window.innerWidth>992){

            closeDrawer();

        }

    });

});