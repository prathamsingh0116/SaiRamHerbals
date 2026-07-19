const faqItems=document.querySelectorAll(".faq-item");

faqItems.forEach(item=>{

const question=item.querySelector(".faq-question");

question.addEventListener("click",()=>{

faqItems.forEach(f=>{

if(f!==item){

f.classList.remove("active");

}

});

item.classList.toggle("active");

});

});

const search=document.getElementById("faqSearch");

if(search){

search.addEventListener("keyup",()=>{

const value=search.value.toLowerCase();

faqItems.forEach(item=>{

const text=item.innerText.toLowerCase();

item.style.display=text.includes(value)?"block":"none";

});

});

}


const progress=document.querySelector(".reading-progress");

window.addEventListener("scroll",()=>{

const total=document.documentElement.scrollHeight-window.innerHeight;

const percent=(window.scrollY/total)*100;

progress.style.width=percent+"%";

});