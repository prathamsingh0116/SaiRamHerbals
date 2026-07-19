function initProfileImageCropper(){


const imageInput = document.querySelector('input[name="profileImage"]');

const modal = document.getElementById("cropperModal");

const cropImage = document.getElementById("cropperImage");

let cropper;



imageInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    cropImage.src = imageURL;

    modal.classList.add("active");

    cropImage.onload = () => {

        if (cropper) {

            cropper.destroy();

        }

        cropper = new Cropper(cropImage, {

            aspectRatio: 1,

            viewMode: 1,

            dragMode: "move",

            autoCropArea: 1,

            responsive: true,

            background: false,

            movable: true,

            zoomable: true,

            scalable: false,

            rotatable: true

        });

    };

});


document.getElementById("zoomIn").onclick = () => {

    if(cropper){

        cropper.zoom(0.1);

    }

};

document.getElementById("zoomOut").onclick = () => {

    if(cropper){

        cropper.zoom(-0.1);

    }

};

document.getElementById("rotateLeft").onclick = () => {

    if(cropper){

        cropper.rotate(-90);

    }

};

document.getElementById("rotateRight").onclick = () => {

    if(cropper){

        cropper.rotate(90);

    }

};

document.getElementById("resetCrop").onclick = () => {

    if(cropper){

        cropper.reset();

    }

};



document.getElementById("closeCropper").addEventListener("click", closeCropper);

document.getElementById("cancelCrop").addEventListener("click", closeCropper);

function closeCropper() {

    modal.classList.remove("active");

    if (cropper) {

        cropper.destroy();

        cropper = null;

    }

}

const cropButton = document.getElementById("cropImageBtn");

cropButton.addEventListener("click", () => {

    const originalFile = imageInput.files[0];

if (!originalFile) return;

    if (!cropper) return;

    // Crop Image
    const canvas = cropper.getCroppedCanvas({

        width: 400,

        height: 400,

        imageSmoothingQuality: "high"

    });

    // Convert canvas to blob
    canvas.toBlob((blob) => {

        // Blob -> File
        const croppedFile = new File(

            [blob],

            originalFile.name,

            {

                type: "image/jpeg"

            }

        );

        // Create new FileList
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(croppedFile);

        // Replace original image
        imageInput.files = dataTransfer.files;

        // Live Preview

const preview = document.getElementById("editProfilePreview");

if (preview) {

    const reader = new FileReader();

    reader.onload = function (e) {

        preview.src = e.target.result;

    };

    reader.readAsDataURL(croppedFile);

}

        // Close Modal
        closeCropper();

    }, "image/jpeg", 0.95);

});

}