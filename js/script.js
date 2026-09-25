document.addEventListener("DOMContentLoaded", function () {

    const revealElements = document.querySelectorAll(".reveal");

    function revealOnScroll() {

        revealElements.forEach(function (element) {

            const elementPosition = element.getBoundingClientRect().top;

            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 80) {

                element.classList.add("active");

            }

        });

    }


    // Run once when the page loads
    revealOnScroll();


    // Run whenever the user scrolls
    window.addEventListener("scroll", revealOnScroll);

});