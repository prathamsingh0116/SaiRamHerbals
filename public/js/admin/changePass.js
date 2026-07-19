document.querySelectorAll(".togglePassword").forEach(icon=>{

icon.addEventListener("click",()=>{

const input=document.getElementById(icon.dataset.target);

if(input.type==="password"){

input.type="text";

icon.classList.replace("bx-hide","bx-show");

}else{

input.type="password";

icon.classList.replace("bx-show","bx-hide");

}

});

});

const password=document.getElementById("newPassword");

const fill=document.getElementById("strengthFill");

const text=document.getElementById("strengthText");

if(password){

password.addEventListener("input",()=>{

const value=password.value;

let score=0;

if(value.length>=8) score++;

if(/[A-Z]/.test(value)) score++;

if(/[0-9]/.test(value)) score++;

if(/[^A-Za-z0-9]/.test(value)) score++;

const widths=["0%","25%","50%","75%","100%"];

const colors=["#ef4444","#f97316","#eab308","#22c55e","#16a34a"];

const labels=["Very Weak","Weak","Medium","Strong","Very Strong"];

fill.style.width=widths[score];

fill.style.background=colors[score];

text.textContent=labels[score];

});

}