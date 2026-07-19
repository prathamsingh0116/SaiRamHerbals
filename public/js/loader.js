document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("page-loader");
    const loaderText = document.getElementById("loader-text");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!loader) return;

    const forceLoader = loader.dataset.force === "true";
    const firstVisit = !sessionStorage.getItem("loaderShown");

    // Set Loader Text
    if (loaderText) {

        if (forceLoader) {

            loaderText.innerText = "Welcome Back! 🌿";

        } else if (firstVisit) {

            loaderText.innerText = "Preparing Nature's Goodness...";

        }

    }

    // Show Loader
    if (forceLoader || firstVisit) {

        document.body.style.overflow = "hidden";

        if (firstVisit) {
            sessionStorage.setItem("loaderShown", "true");
        }

        setTimeout(() => {

            loader.classList.add("hide");

            document.body.style.overflow = "auto";

        }, 2500);

    } else {

        loader.style.display = "none";

    }

    // Logout Animation
    if (logoutBtn) {

        logoutBtn.addEventListener("click", function (e) {

            e.preventDefault();

            loader.style.display = "flex";
            loader.classList.remove("hide");

            if (loaderText) {

                loaderText.innerText = "Thank You! Visit Again 🌿";

            }

            document.body.style.overflow = "hidden";

            setTimeout(() => {

                window.location.href = "/logout";

            }, 2500);

        });

    }

});