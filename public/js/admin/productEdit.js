// ==========================================
// Product Image Manager
// ==========================================

const fileInput = document.getElementById("productImages");
const gallery = document.getElementById("galleryGrid");
const counter = document.querySelector(".image-counter");

const dataTransfer = new DataTransfer();

let existingImages = window.currentImages || 0;

// ==============================
// Preview Images
// ==============================

function renderPreview() {

    document.querySelectorAll(".preview-card").forEach(card => card.remove());

    Array.from(dataTransfer.files).forEach((file, index) => {

        const reader = new FileReader();

        reader.onload = function (e) {

            const card = document.createElement("div");

            card.className = "gallery-card preview-card";

            card.innerHTML = `

                <img src="${e.target.result}">

                <span class="preview-badge">

                    NEW

                </span>

                <button
                    type="button"
                    class="remove-preview"
                    data-index="${index}">

                    <i class='bx bx-x'></i>

                </button>

            `;

            gallery.appendChild(card);

        }

        reader.readAsDataURL(file);

    });

    counter.innerHTML =
        `${existingImages + dataTransfer.files.length}/5 Images`;

}

// ==============================
// File Select
// ==============================

fileInput.addEventListener("change", function () {

    const files = Array.from(this.files);

    if (
        existingImages +
        dataTransfer.files.length +
        files.length > 5
    ) {

        alert("Maximum 5 images allowed.");

        fileInput.value = "";

        return;

    }

    files.forEach(file => {

        dataTransfer.items.add(file);

    });

    fileInput.files = dataTransfer.files;

    renderPreview();

});

// ==============================
// Remove Preview
// ==============================

document.querySelectorAll(".remove-preview").forEach(btn => {

    btn.onclick = function () {

        const index = Number(this.dataset.index);

        const files = Array.from(dataTransfer.files);

        files.splice(index, 1);

        const newTransfer = new DataTransfer();

        files.forEach(file => newTransfer.items.add(file));

        // Replace old DataTransfer
        while (dataTransfer.items.length > 0) {
            dataTransfer.items.remove(0);
        }

        files.forEach(file => dataTransfer.items.add(file));

        fileInput.files = dataTransfer.files;

        renderPreview();

    };

});

// ==========================================
// Delete Existing Image (AJAX)
// ==========================================

document.addEventListener("click", async (e) => {

    const btn = e.target.closest(".delete-image");

    if (!btn) return;

    if (!confirm("Delete this image?")) return;

    const productId = btn.dataset.id;

    const index = btn.dataset.index;

    try {

        const response = await fetch(

            `/admin/products/${productId}/image/${index}`,

            {

                method: "DELETE"

            }

        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        // Remove Card
        btn.closest(".gallery-card").remove();

        // Update Counter
        existingImages--;

        counter.innerHTML =
            `${existingImages + dataTransfer.files.length}/5 Images`;

    } catch (err) {

        console.log(err);

        alert("Unable to delete image.");

    }

});

const card = btn.closest(".gallery-card");

card.classList.add("removing");

setTimeout(() => {

    card.remove();

},300);

const replaceInput=document.getElementById("replaceImageInput");

let replaceIndex=null;

document.addEventListener("click",e=>{

const btn=e.target.closest(".replace-image");

if(!btn) return;

replaceIndex=btn.dataset.index;

replaceInput.click();

});

replaceInput.addEventListener("change",()=>{

alert("Next step me controller se image replace hogi.");

});