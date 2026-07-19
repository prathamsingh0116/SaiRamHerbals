const qtyInput = document.getElementById("qtyInput");

const minus = document.getElementById("qtyMinus");

const plus = document.getElementById("qtyPlus");

if(qtyInput){

minus.addEventListener("click",()=>{

if(Number(qtyInput.value)>1){

qtyInput.value--;

}

});

plus.addEventListener("click",()=>{

const max=Number(qtyInput.max);

if(Number(qtyInput.value)<max){

qtyInput.value++;

}

});

}

const mainImage = document.getElementById("mainProductImage");

const thumbs = document.querySelectorAll(".product-thumbnail img");

thumbs.forEach((thumb) => {

    function changeImage() {

        mainImage.classList.remove("fade-in");

        setTimeout(() => {

            mainImage.src = this.dataset.image;

            mainImage.classList.add("fade-in");

        }, 120);

        document
            .querySelectorAll(".product-thumbnail")
            .forEach(item => item.classList.remove("active-thumb"));

        this.parentElement.classList.add("active-thumb");

    }

    thumb.addEventListener("mouseenter", changeImage);

    thumb.addEventListener("click", changeImage);

});


const imageBox=document.querySelector(".product-main-image");

if(imageBox){

const image=document.getElementById("mainProductImage");

imageBox.addEventListener("mousemove",(e)=>{

const rect=imageBox.getBoundingClientRect();

const x=((e.clientX-rect.left)/rect.width)*100;

const y=((e.clientY-rect.top)/rect.height)*100;

image.style.transformOrigin=`${x}% ${y}%`;

image.style.transform="scale(2)";

});

imageBox.addEventListener("mouseleave",()=>{

image.style.transformOrigin="center";

image.style.transform="scale(1)";

});

}