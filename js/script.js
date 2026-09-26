/* =========================================
   HERO 3D BACKGROUND (Three.js)
   Floating wireframe shapes with subtle
   parallax that follows the cursor.
========================================= */

(function () {

    function init() {

        const canvas = document.getElementById('hero-canvas-3d');
        const hero = document.getElementById('home');

        if (!canvas || !hero || typeof THREE === 'undefined') {
            return;
        }

        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            50,
            hero.clientWidth / hero.clientHeight,
            0.1,
            100
        );
        camera.position.z = 18;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(hero.clientWidth, hero.clientHeight);

        // Lights (mostly affect any non-wireframe surfaces / subtle glow feel)
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const orangeLight = new THREE.PointLight(0xff7a00, 1.4, 60);
        orangeLight.position.set(10, 8, 14);
        scene.add(orangeLight);

        const blueLight = new THREE.PointLight(0x4f9dff, 1.0, 60);
        blueLight.position.set(-12, -6, 10);
        scene.add(blueLight);

        // Geometric "building blocks" floating in space
        const geometries = [
            new THREE.IcosahedronGeometry(2.3, 0),
            new THREE.OctahedronGeometry(1.9, 0),
            new THREE.TorusGeometry(1.6, 0.45, 8, 28),
            new THREE.IcosahedronGeometry(1.3, 0),
            new THREE.TetrahedronGeometry(2.0, 0),
            new THREE.OctahedronGeometry(1.1, 0)
        ];

        const colors = [0xff7a00, 0x4f9dff, 0xffffff, 0xff7a00, 0x4f9dff, 0xffffff];

        const shapes = [];

        geometries.forEach(function (geometry, i) {

            const material = new THREE.MeshBasicMaterial({
                color: colors[i],
                wireframe: true,
                transparent: true,
                opacity: 0.5
            });

            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(
                (Math.random() - 0.5) * 24,
                (Math.random() - 0.5) * 13,
                (Math.random() - 0.5) * 10 - 4
            );

            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                0
            );

            mesh.userData.rotSpeed = {
                x: (Math.random() - 0.5) * 0.006,
                y: (Math.random() - 0.5) * 0.009
            };

            mesh.userData.baseY = mesh.position.y;
            mesh.userData.floatOffset = Math.random() * Math.PI * 2;

            scene.add(mesh);
            shapes.push(mesh);

        });

        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        });

        function resize() {
            const w = hero.clientWidth;
            const h = hero.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }

        window.addEventListener('resize', resize);

        let frame = 0;

        function animate() {

            requestAnimationFrame(animate);
            frame += 1;

            if (!reduceMotion) {

                shapes.forEach(function (mesh) {
                    mesh.rotation.x += mesh.userData.rotSpeed.x;
                    mesh.rotation.y += mesh.userData.rotSpeed.y;
                    mesh.position.y =
                        mesh.userData.baseY +
                        Math.sin(frame * 0.01 + mesh.userData.floatOffset) * 0.6;
                });

                camera.position.x += (mouseX * 4 - camera.position.x) * 0.03;
                camera.position.y += (-mouseY * 3 - camera.position.y) * 0.03;
                camera.lookAt(scene.position);

            }

            renderer.render(scene, camera);

        }

        animate();

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

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

/* =========================================
   3D TILT INTERACTION
   Adds a perspective tilt-on-hover effect
   to project cards and the hero photo.
========================================= */

(function () {

    function applyTilt(triggerEl, options) {

        const settings = Object.assign({
            maxTilt: 8,
            scale: 1.02,
            perspective: 900,
            lift: 0,
            target: triggerEl
        }, options);

        const target = settings.target;

        triggerEl.addEventListener('mousemove', function (e) {

            const rect = triggerEl.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const rotY = x * settings.maxTilt * 2;
            const rotX = -y * settings.maxTilt * 2;

            target.style.transition = 'transform 0.05s linear';
            target.style.transform =
                'perspective(' + settings.perspective + 'px) ' +
                'translateY(' + settings.lift + 'px) ' +
                'rotateX(' + rotX + 'deg) ' +
                'rotateY(' + rotY + 'deg) ' +
                'scale(' + settings.scale + ')';

        });

        triggerEl.addEventListener('mouseleave', function () {
            target.style.transition = 'transform 0.4s ease';
            target.style.transform = '';
        });

    }

    function init() {

        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        const noHover = window.matchMedia('(hover: none)').matches;

        if (reduceMotion || noHover) {
            return;
        }

        document.querySelectorAll('.project-card').forEach(function (card) {
            applyTilt(card, { maxTilt: 6, scale: 1.02, lift: -6 });
        });

        const heroPhoto = document.querySelector('.hero-photo');

        if (heroPhoto) {
            const img = heroPhoto.querySelector('img');
            if (img) {
                applyTilt(heroPhoto, {
                    maxTilt: 8,
                    scale: 1.03,
                    perspective: 700,
                    target: img
                });
            }
        }

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

