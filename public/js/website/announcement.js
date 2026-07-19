let lastScroll = 0;

const navbar = document.querySelector(".site-header");
const announcement = document.querySelector(".announcement-bar");

if(navbar && announcement){

    const announcementVisible =
        announcement.offsetHeight > 0 &&
        window.getComputedStyle(announcement).display !== "none";

    if(announcementVisible){
        navbar.style.top = "52px";
    }else{
        navbar.style.top = "0";
    }

    window.addEventListener("scroll",()=>{

        const current = window.pageYOffset;

        if(!announcementVisible){
            navbar.style.top = "0";
            navbar.style.transform = "translateY(0)";
            return;
        }

        if(current <= 10){

            announcement.style.transform = "translateY(0)";
            navbar.style.transform = "translateY(0)";
            navbar.style.top = "68px";

            lastScroll = current;
            return;

        }

        if(current > lastScroll){

            announcement.style.transform = "translateY(-100%)";
            navbar.style.top = "0";

        }else{

            announcement.style.transform = "translateY(0)";
            navbar.style.top = "68px";

        }

        lastScroll = current;

    });

}