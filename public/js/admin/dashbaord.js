document.addEventListener("DOMContentLoaded",()=>{

const sidebar=document.getElementById("adminSidebar");

const toggle=document.getElementById("adminSidebarToggle");

const overlay=document.getElementById("adminSidebarOverlay");

if(!sidebar || !toggle || !overlay) return;

toggle.addEventListener("click",()=>{

sidebar.classList.toggle("active");

overlay.classList.toggle("active");

});

overlay.addEventListener("click",()=>{

sidebar.classList.remove("active");

overlay.classList.remove("active");

});

window.addEventListener("resize",()=>{

if(window.innerWidth>992){

sidebar.classList.remove("active");

overlay.classList.remove("active");

}

});

});