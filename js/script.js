document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SCROLL PROGRESS BAR
       Thin orange bar at the top that fills up
       as the user scrolls down the page.
    ========================================= */

    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.appendChild(progressBar);

    function updateScrollProgress() {

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        progressBar.style.width = progress + "%";

    }


    /* =========================================
       HEADER "SCROLLED" STATE
       Adds a blurred / shadowed background to
       the nav once the user leaves the top of
       the page.
    ========================================= */

    const header = document.querySelector(".site-header");

    function updateHeaderState() {

        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }


    window.addEventListener("scroll", function () {
        updateScrollProgress();
        updateHeaderState();
    });

    updateScrollProgress();
    updateHeaderState();


    /* =========================================
       SECTION REVEAL ON SCROLL
       Same idea as before, now driven by
       IntersectionObserver instead of a scroll
       listener (smoother, cheaper, and it stops
       watching a section once it has appeared).
    ========================================= */

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target);
            }

        });

    }, { threshold: 0.15 });

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });


    /* =========================================
       STAGGERED CARD REVEAL
       Grabs every card inside the grids below
       and fades each one in slightly after the
       previous one, so groups cascade in rather
       than popping in all at once.
    ========================================= */

    const cardGroupSelectors = [
        ".skills-group",
        ".project-card",
        ".education-item",
        ".journey-item",
        ".looking-card",
        ".about-highlight",
        ".about-photo"
    ];

    cardGroupSelectors.forEach(function (selector) {

        const cards = document.querySelectorAll(selector);

        cards.forEach(function (card, index) {
            card.classList.add("card-reveal");
            card.style.transitionDelay = (index * 0.12) + "s";
        });

    });

    const cardObserver = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                cardObserver.unobserve(entry.target);
            }

        });

    }, { threshold: 0.1 });

    document.querySelectorAll(".card-reveal").forEach(function (card) {
        cardObserver.observe(card);
    });


    /* =========================================
       ACTIVE NAV LINK ON SCROLL
       Highlights whichever section is currently
       in view in the main navigation.
    ========================================= */

    const navLinks = document.querySelectorAll(".main-nav a");
    const sections = document.querySelectorAll("main section[id]");

    const navObserver = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (!entry.isIntersecting) return;

            const id = entry.target.getAttribute("id");
            const activeLink = document.querySelector('.main-nav a[href="#' + id + '"]');

            navLinks.forEach(function (link) {
                link.classList.remove("active-link");
            });

            if (activeLink) {
                activeLink.classList.add("active-link");
            }

        });

    }, { threshold: 0.5 });

    sections.forEach(function (section) {
        navObserver.observe(section);
    });


    /* =========================================
       BUTTON RIPPLE EFFECT
       Spawns a small expanding circle from the
       click point on any .btn.
    ========================================= */

    document.querySelectorAll(".btn").forEach(function (btn) {

        btn.addEventListener("click", function (event) {

            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            const ripple = document.createElement("span");
            ripple.className = "btn-ripple";
            ripple.style.width = size + "px";
            ripple.style.height = size + "px";
            ripple.style.left = (event.clientX - rect.left - size / 2) + "px";
            ripple.style.top = (event.clientY - rect.top - size / 2) + "px";

            btn.appendChild(ripple);

            setTimeout(function () {
                ripple.remove();
            }, 600);

        });

    });

});
