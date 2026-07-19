const header=document.querySelector(".site-header");
const announcement=document.querySelector(".announcement-bar");

if(announcement){

header.style.top="52px";

}else{

header.style.top="0";

}


new Swiper(".heroSwiper",{

loop:true,

autoplay:{

delay:4000,

disableOnInteraction:false

},

speed:900,

pagination:{

el:".swiper-pagination",

clickable:true

}

});

