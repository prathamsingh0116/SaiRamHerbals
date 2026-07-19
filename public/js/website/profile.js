document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("editProfileForm");

    if (!form) return;

    const fields = {

        firstName: document.getElementById("firstName"),

        lastName: document.getElementById("lastName"),

        phone: document.getElementById("phone"),

        gender: document.getElementById("gender"),

        dob: document.getElementById("dob"),

    };

    /* ==========================
        Load Saved Data
    ========================== */

    const savedProfile = JSON.parse(localStorage.getItem("profileData"));

    if (savedProfile) {

        fields.firstName.value = savedProfile.firstName || "";

        fields.lastName.value = savedProfile.lastName || "";

        fields.phone.value = savedProfile.phone || "";

        fields.gender.value = savedProfile.gender || "";

        fields.dob.value = savedProfile.dob || "";

    }

    /* ==========================
        Save Profile
    ========================== */

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const profileData = {

            firstName: fields.firstName.value.trim(),

            lastName: fields.lastName.value.trim(),

            phone: fields.phone.value.trim(),

            gender: fields.gender.value,

            dob: fields.dob.value,

        };

        localStorage.setItem(

            "profileData",

            JSON.stringify(profileData)

        );

        showToast("Profile saved successfully.");

    });

    /* ==========================
        Reset Form
    ========================== */

    form.addEventListener("reset", () => {

        setTimeout(() => {

            const saved = JSON.parse(localStorage.getItem("profileData"));

            if (!saved) return;

            fields.firstName.value = saved.firstName || "";

            fields.lastName.value = saved.lastName || "";

            fields.phone.value = saved.phone || "";

            fields.gender.value = saved.gender || "";

            fields.dob.value = saved.dob || "";

        }, 0);

    });

});

/* ==========================
        Toast
========================== */

function showToast(message) {

    const oldToast = document.querySelector(".profile-toast");

    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");

    toast.className = "profile-toast";

    toast.innerHTML = `

        <i class='bx bx-check-circle'></i>

        <span>${message}</span>

    `;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}

// edit profile image preview and crop

initProfileImageCropper();



