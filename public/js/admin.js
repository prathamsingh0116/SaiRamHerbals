
document.addEventListener("DOMContentLoaded", () => {

    const skuInput = document.getElementById("sku");
    const status = document.getElementById("skuStatus");
    const form = document.getElementById("productForm");

    if (!skuInput || !status || !form) return;

    let skuAvailable = false;

    skuInput.addEventListener("input", async () => {

        const sku = skuInput.value.trim().toUpperCase();

        if (!sku) {
            status.innerHTML = "";
            skuAvailable = false;
            return;
        }

        try {

            const res = await fetch(`/admin/products/check-sku?sku=${encodeURIComponent(sku)}`);
            const data = await res.json();

            if (data.available) {

                status.innerHTML = "✅ SKU Available";
                status.style.color = "green";
                skuAvailable = true;

            } else {

                status.innerHTML = "❌ SKU Already Exists";
                status.style.color = "red";
                skuAvailable = false;

            }

        } catch (err) {

            console.log(err);

            skuAvailable = false;

        }

    });

    form.addEventListener("submit", function (e) {

    if (status.textContent.includes("Already Exists")) {

        e.preventDefault();

        showError("SKU already exists. Please choose another SKU.");

    }

});

});

document.querySelectorAll(".deleteForm").forEach(form => {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        Swal.fire({

            title: "Delete Product?",

            text: "You won't be able to recover it.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#dc2626",

            cancelButtonColor: "#16a34a",

            confirmButtonText: "Yes, Delete"

        }).then((result) => {

            if (result.isConfirmed) {

                form.submit();

            }

        });

    });

});



const adminProfile = document.getElementById("adminProfile");
const adminDropdown = document.getElementById("adminDropdownMenu");

if (adminProfile && adminDropdown) {

    adminProfile.addEventListener("click", (e) => {
        e.stopPropagation();
        adminDropdown.classList.toggle("active");
    });

    document.addEventListener("click", () => {
        adminDropdown.classList.remove("active");
    });

}





/* =======================================
            SWEET ALERT HELPERS
======================================= */

function showSuccess(message) {

    Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        confirmButtonColor: "#16A34A",
        timer: 1800,
        showConfirmButton: false
    });

}

function showError(message) {

    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
        confirmButtonColor: "#DC2626"
    });

}

function confirmDelete(form) {

    Swal.fire({

        title: "Delete Item?",

        text: "This action cannot be undone.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#DC2626",

        cancelButtonColor: "#6B7280",

        confirmButtonText: "Yes, Delete"

    }).then((result)=>{

        if(result.isConfirmed){

            form.submit();

        }

    });

}