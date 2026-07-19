/*=========================================
        IMAGE PREVIEW
=========================================*/

const productImageInput = document.getElementById("productImage");

const previewImage = document.getElementById("productPreview");

const placeholder = document.getElementById("imagePlaceholder");

if(productImageInput){

    productImageInput.addEventListener("change",function(){

        const file=this.files[0];

        if(!file){

            return;

        }

        const reader=new FileReader();

        reader.onload=function(e){

            previewImage.src=e.target.result;

            previewImage.style.display="block";

            placeholder.style.display="none";

        }

        reader.readAsDataURL(file);

    });

}

const imageInput=document.getElementById("productImage");

const preview=document.getElementById("productPreview");

if(imageInput){

imageInput.addEventListener("change",function(){

const file=this.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=e=>{

preview.src=e.target.result;

};

reader.readAsDataURL(file);

});

}