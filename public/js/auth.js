/*======================================================

            SAIRAM HERBALS AUTH.JS

======================================================*/

document.addEventListener("DOMContentLoaded",()=>{

/*=========================================
        PASSWORD TOGGLE
=========================================*/

document.querySelectorAll(".toggle-password").forEach(toggle=>{

toggle.addEventListener("click",()=>{

const target=document.getElementById(toggle.dataset.target);

const icon=toggle.querySelector("i");

if(target.type==="password"){

target.type="text";

icon.classList.replace("bx-show","bx-hide");

}else{

target.type="password";

icon.classList.replace("bx-hide","bx-show");

}

});

});

/*=========================================
        CAPS LOCK DETECTION
=========================================*/

const password=document.getElementById("password");

const caps=document.querySelector(".caps-lock-warning");

if(password && caps){

password.addEventListener("keyup",(e)=>{

if(e.getModifierState("CapsLock")){

caps.style.display="block";

}else{

caps.style.display="none";

}

});

}

/*=========================================
        EMAIL VALIDATION
=========================================*/

const email=document.getElementById("email");

if(email){

email.addEventListener("blur",()=>{

const value=email.value.trim();

const error=email.closest(".input-group").querySelector(".error-text");

const pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(value===""){

error.textContent="Email is required.";

email.parentElement.style.borderColor="#ef4444";

return;

}

if(!pattern.test(value)){

error.textContent="Enter a valid email address.";

email.parentElement.style.borderColor="#ef4444";

return;

}

error.textContent="";

email.parentElement.style.borderColor="#16a34a";

});

}

/*=========================================
        PASSWORD VALIDATION
=========================================*/

if(password){

password.addEventListener("blur",()=>{

const value=password.value.trim();

const error=password.closest(".input-group").querySelector(".error-text");

if(value.length < 8){

error.textContent="Password must be at least 8 characters.";

password.parentElement.style.borderColor="#ef4444";

return;

}

error.textContent="";

password.parentElement.style.borderColor="#16a34a";

});

}

/*=========================================
        LOGIN BUTTON LOADING
=========================================*/

const form=document.getElementById("loginForm");

const loginBtn=document.getElementById("loginBtn");

if(form && loginBtn){

form.addEventListener("submit",(e)=>{

const errors=document.querySelectorAll(".error-text");

let hasError=false;

errors.forEach(item=>{

if(item.textContent.trim()!==""){

hasError=true;

}

});

if(hasError){

e.preventDefault();

shake(loginBtn);

return;

}

loginBtn.disabled=true;

loginBtn.innerHTML=`

<i class='bx bx-loader-alt bx-spin'></i>

Signing In...

`;

});

}

/*=========================================
        INPUT FOCUS EFFECT
=========================================*/

document.querySelectorAll(".input-box input").forEach(input=>{

input.addEventListener("focus",()=>{

input.parentElement.style.transform="translateY(-2px)";

});

input.addEventListener("blur",()=>{

input.parentElement.style.transform="translateY(0px)";

});

});

/*=========================================
        SHAKE
=========================================*/

function shake(element){

element.animate([

{transform:"translateX(0)"},

{transform:"translateX(-8px)"},

{transform:"translateX(8px)"},

{transform:"translateX(-8px)"},

{transform:"translateX(8px)"},

{transform:"translateX(0)"}

],{

duration:400

});

}

/*=========================================
        RIPPLE BUTTON
=========================================*/

document.querySelectorAll(".login-btn,.google-btn").forEach(btn=>{

btn.addEventListener("click",(e)=>{

const ripple=document.createElement("span");

const rect=btn.getBoundingClientRect();

const size=Math.max(rect.width,rect.height);

ripple.style.width=size+"px";

ripple.style.height=size+"px";

ripple.style.left=e.clientX-rect.left-size/2+"px";

ripple.style.top=e.clientY-rect.top-size/2+"px";

ripple.className="ripple";

btn.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},600);

});

});

/*=========================================
        FLOATING CARD
=========================================*/

const card=document.querySelector(".login-card");

if(card){

window.addEventListener("mousemove",(e)=>{

const x=(window.innerWidth/2-e.clientX)/45;

const y=(window.innerHeight/2-e.clientY)/45;

card.style.transform=`rotateY(${x}deg) rotateX(${-y}deg)`;

});

window.addEventListener("mouseleave",()=>{

card.style.transform="rotateY(0) rotateX(0)";

});

}

/*=========================================
        AUTO FOCUS
=========================================*/

if(email){

email.focus();

}

});

/*==========================================================
        REGISTER PAGE JAVASCRIPT
        ADD BELOW auth.js
==========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

const registerForm=document.getElementById("registerForm");

if(!registerForm) return;

const fullName=document.getElementById("fullName");

const email=document.getElementById("email");

const phone=document.getElementById("phone");

const password=document.getElementById("password");

const confirmPassword=document.getElementById("confirmPassword");

const terms=document.getElementById("terms");

const registerBtn=document.getElementById("registerBtn");

const strengthFill=document.querySelector(".strength-fill");

const strengthText=document.querySelector(".strength-text");

const passwordMatch=document.querySelector(".password-match");

const caps=document.querySelector(".caps-lock-warning");

/*======================================
            HELPERS
======================================*/

function setError(input,message){

const group=input.closest(".input-group");

const error=group.querySelector(".error-text");

error.textContent=message;

group.querySelector(".input-box").classList.remove("success");

group.querySelector(".input-box").classList.add("error");

}

function setSuccess(input){

const group=input.closest(".input-group");

const error=group.querySelector(".error-text");

if(error) error.textContent="";

group.querySelector(".input-box").classList.remove("error");

group.querySelector(".input-box").classList.add("success");

}

/*======================================
        FULL NAME
======================================*/

fullName.addEventListener("blur",()=>{

const value=fullName.value.trim();

if(value.length<3){

setError(fullName,"Enter your full name.");

return;

}

setSuccess(fullName);

});

/*======================================
            EMAIL
======================================*/

email.addEventListener("blur",()=>{

const value=email.value.trim();

const pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!pattern.test(value)){

setError(email,"Enter a valid email.");

return;

}

setSuccess(email);

});

/*======================================
            PHONE
======================================*/

phone.addEventListener("input",()=>{

phone.value=phone.value.replace(/\D/g,"").slice(0,10);

});

phone.addEventListener("blur",()=>{

if(phone.value.length!==10){

setError(phone,"Enter valid 10 digit mobile number.");

return;

}

setSuccess(phone);

});

/*======================================
        CAPS LOCK
======================================*/

password.addEventListener("keyup",(e)=>{

caps.style.display=e.getModifierState("CapsLock")?"block":"none";

});

/*======================================
        PASSWORD STRENGTH
======================================*/

const rules={

length:document.querySelector(".rule.length"),

uppercase:document.querySelector(".rule.uppercase"),

number:document.querySelector(".rule.number"),

special:document.querySelector(".rule.special")

};

password.addEventListener("input",()=>{

const value=password.value;

let score=0;

const checks={

length:value.length>=8,

uppercase:/[A-Z]/.test(value),

number:/[0-9]/.test(value),

special:/[^A-Za-z0-9]/.test(value)

};

Object.keys(checks).forEach(key=>{

const rule=rules[key];

const icon=rule.querySelector("i");

if(checks[key]){

rule.classList.add("valid");

icon.className="bx bx-check-circle";

score++;

}else{

rule.classList.remove("valid");

icon.className="bx bx-x-circle";

}

});

let percent=score*25;

strengthFill.style.width=percent+"%";

if(score<=1){

strengthFill.style.background="#ef4444";

strengthText.textContent="Weak Password";

}

else if(score===2){

strengthFill.style.background="#f59e0b";

strengthText.textContent="Fair Password";

}

else if(score===3){

strengthFill.style.background="#84cc16";

strengthText.textContent="Good Password";

}

else{

strengthFill.style.background="#16a34a";

strengthText.textContent="Strong Password";

}

});

/*======================================
        CONFIRM PASSWORD
======================================*/

confirmPassword.addEventListener("input",()=>{

if(confirmPassword.value===""){

passwordMatch.textContent="";

passwordMatch.className="password-match";

return;

}

if(confirmPassword.value===password.value){

passwordMatch.textContent="✔ Password Matched";

passwordMatch.className="password-match success";

confirmPassword.parentElement.classList.add("success");

confirmPassword.parentElement.classList.remove("error");

}else{

passwordMatch.textContent="✖ Password Doesn't Match";

passwordMatch.className="password-match error";

confirmPassword.parentElement.classList.add("error");

confirmPassword.parentElement.classList.remove("success");

}

});

/*======================================
        TERMS
======================================*/

terms.addEventListener("change",()=>{

if(terms.checked){

terms.parentElement.style.color="#16a34a";

}else{

terms.parentElement.style.color="#475569";

}

});

/*======================================
        SUBMIT
======================================*/

registerForm.addEventListener("submit",(e)=>{

if(!terms.checked){

e.preventDefault();

alert("Please accept Terms & Conditions.");

return;

}

if(password.value!==confirmPassword.value){

e.preventDefault();

alert("Passwords do not match.");

return;

}

registerBtn.classList.add("loading");

registerBtn.disabled=true;

registerBtn.innerHTML=`

<i class='bx bx-loader-alt bx-spin'></i>

Creating Account...

`;

});

/*======================================
        RIPPLE
======================================*/

document.querySelectorAll(".login-btn,.google-btn").forEach(btn=>{

btn.addEventListener("click",function(e){

const ripple=document.createElement("span");

const rect=this.getBoundingClientRect();

const size=Math.max(rect.width,rect.height);

ripple.style.width=size+"px";

ripple.style.height=size+"px";

ripple.style.left=e.clientX-rect.left-size/2+"px";

ripple.style.top=e.clientY-rect.top-size/2+"px";

ripple.className="ripple";

this.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},600);

});

});

});

/*==================================
    PASSWORD TOGGLE
==================================*/

document.querySelectorAll(".toggle-password").forEach(toggle => {

    toggle.addEventListener("click", () => {

        const target = document.getElementById(toggle.dataset.target);

        if (!target) return;

        const icon = toggle.querySelector("i");

        if (target.type === "password") {

            target.type = "text";

            icon.classList.remove("bx-show");
            icon.classList.add("bx-hide");

        } else {

            target.type = "password";

            icon.classList.remove("bx-hide");
            icon.classList.add("bx-show");

        }

    });

});

/*==========================================================
        RESET PASSWORD PAGE
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("resetPasswordForm");

    if (!form) return;

    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const updateBtn = document.getElementById("updatePasswordBtn");

    const strengthFill = document.querySelector(".strength-fill");
    const strengthText = document.querySelector(".strength-text");
    const passwordMatch = document.querySelector(".password-match");
    const capsWarning = document.querySelector(".caps-lock-warning");

    const rules = {
        length: document.querySelector(".rule.length"),
        uppercase: document.querySelector(".rule.uppercase"),
        number: document.querySelector(".rule.number"),
        special: document.querySelector(".rule.special")
    };

    /*==================================
        SHOW / HIDE PASSWORD
    ==================================*/

    document.querySelectorAll(".toggle-password").forEach(toggle => {

        toggle.addEventListener("click", () => {

            const target = document.getElementById(toggle.dataset.target);

            const icon = toggle.querySelector("i");

            if (target.type === "password") {

                target.type = "text";

                icon.classList.replace("bx-show", "bx-hide");

            } else {

                target.type = "password";

                icon.classList.replace("bx-hide", "bx-show");

            }

        });

    });

    /*==================================
            CAPS LOCK
    ==================================*/

    password.addEventListener("keyup", (e) => {

        if (e.getModifierState("CapsLock")) {

            capsWarning.style.display = "block";

        } else {

            capsWarning.style.display = "none";

        }

    });

    /*==================================
        PASSWORD STRENGTH
    ==================================*/

    password.addEventListener("input", () => {

        const value = password.value;

        let score = 0;

        const checks = {

            length: value.length >= 8,

            uppercase: /[A-Z]/.test(value),

            number: /[0-9]/.test(value),

            special: /[^A-Za-z0-9]/.test(value)

        };

        Object.keys(checks).forEach(key => {

            const rule = rules[key];

            const icon = rule.querySelector("i");

            if (checks[key]) {

                rule.classList.add("valid");

                icon.className = "bx bx-check-circle";

                score++;

            } else {

                rule.classList.remove("valid");

                icon.className = "bx bx-x-circle";

            }

        });

        strengthFill.style.width = `${score * 25}%`;

        switch (score) {

            case 1:

                strengthFill.style.background = "#ef4444";

                strengthText.textContent = "Weak Password";

                break;

            case 2:

                strengthFill.style.background = "#f59e0b";

                strengthText.textContent = "Fair Password";

                break;

            case 3:

                strengthFill.style.background = "#84cc16";

                strengthText.textContent = "Good Password";

                break;

            case 4:

                strengthFill.style.background = "#16a34a";

                strengthText.textContent = "Strong Password";

                break;

            default:

                strengthFill.style.width = "0";

                strengthText.textContent = "Password Strength";

        }

    });

    /*==================================
        PASSWORD MATCH
    ==================================*/

    confirmPassword.addEventListener("input", () => {

        if (confirmPassword.value === "") {

            passwordMatch.textContent = "";

            passwordMatch.className = "password-match";

            return;

        }

        if (confirmPassword.value === password.value) {

            passwordMatch.textContent = "✔ Password Matched";

            passwordMatch.className = "password-match success";

            confirmPassword.parentElement.classList.add("success");

            confirmPassword.parentElement.classList.remove("error");

        } else {

            passwordMatch.textContent = "✖ Password Doesn't Match";

            passwordMatch.className = "password-match error";

            confirmPassword.parentElement.classList.add("error");

            confirmPassword.parentElement.classList.remove("success");

        }

    });

    /*==================================
        SUBMIT
    ==================================*/

    form.addEventListener("submit", (e) => {

        if (password.value.length < 8) {

            e.preventDefault();

            alert("Password must be at least 8 characters.");

            return;

        }

        if (password.value !== confirmPassword.value) {

            e.preventDefault();

            alert("Passwords do not match.");

            return;

        }

        updateBtn.disabled = true;

        updateBtn.classList.add("loading");

        updateBtn.innerHTML = `

            <i class='bx bx-loader-alt bx-spin'></i>

            Updating Password...

        `;

    });

});


document.querySelectorAll(".toggle-password").forEach(toggle => {

    toggle.addEventListener("click", function () {

        const input = document.getElementById(this.dataset.target);

        const icon = this.querySelector("i");

        if (!input) return;

        if (input.type === "password") {

            input.type = "text";

            icon.classList.remove("bx-show");
            icon.classList.add("bx-hide");

        } else {

            input.type = "password";

            icon.classList.remove("bx-hide");
            icon.classList.add("bx-show");

        }

    });

});