const slides =
    document.querySelectorAll(".slide");

const dots =
    document.querySelectorAll(".dot");

/* Navbar remains visible; only its active section changes. */
const navSectionLinks = document.querySelectorAll(".nav-links a");

function updateActiveNav(index) {
    navSectionLinks.forEach(link => link.classList.remove("active-nav"));
    const targets = ["#home", "#idea", "#work", "#about", "#future", "#contact"];
    const target = targets[index];
    if (!target) return;
    const activeLink = document.querySelector(`.nav-links a[href="${target}"]`);
    if (activeLink) activeLink.classList.add("active-nav");
}


/*
=========================================
SLIDE OBSERVER
=========================================
*/

const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const index =
                        Array.from(slides)
                        .indexOf(entry.target);


                    /*
                    Activate current slide
                    */

                    slides.forEach(slide => {

                        slide.classList.remove(
                            "active"
                        );

                    });

                    entry.target.classList.add(
                        "active"
                    );


                    /*
                    Update dots
                    */

                    dots.forEach(dot => {

                        dot.classList.remove(
                            "active"
                        );

                    });

                    if (dots[index]) {

                        dots[index]
                        .classList.add(
                            "active"
                        );

                    }

                    updateActiveNav(index);

                }

            });

        },

        {
            threshold: 0.6
        }

    );


slides.forEach(slide => {

    observer.observe(slide);

});


/*
=========================================
DOT NAVIGATION
=========================================
*/

dots.forEach((dot, index) => {

    dot.addEventListener(
        "click",
        () => {

            slides[index]
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

});


/*
=========================================
KEYBOARD NAVIGATION
=========================================
*/

document.addEventListener(
    "keydown",
    (event) => {

        const current =
            [...slides].findIndex(
                slide =>
                    slide.classList
                    .contains("active")
            );


        /*
        Arrow Down
        */

        if (
            event.key === "ArrowDown" &&
            current < slides.length - 1
        ) {

            slides[current + 1]
                .scrollIntoView({
                    behavior: "smooth"
                });

        }


        /*
        Arrow Up
        */

        if (
            event.key === "ArrowUp" &&
            current > 0
        ) {

            slides[current - 1]
                .scrollIntoView({
                    behavior: "smooth"
                });

        }

    }
);

/*
=========================================
IGNITE PLANS - IMAGE / CONTENT SWITCHER
=========================================
*/

const planCards = document.querySelectorAll(".ignite-card");
const workPreview = document.getElementById("workPreview");
const imageNumber = document.getElementById("imageNumber");
const imageTitle = document.getElementById("imageTitle");
const imageSubtitle = document.getElementById("imageSubtitle");
const workDescription = document.getElementById("workDescription");
const imageTransition = document.getElementById("imageTransition");

let selectedPlan = document.querySelector(".ignite-card.active") || planCards[0];
let switchTimer;

function setPlan(card, persist = false) {
    if (!card || !workPreview) return;

    if (persist) {
        selectedPlan = card;
        planCards.forEach(item => item.classList.remove("active"));
        card.classList.add("active");
    }

    const image = card.dataset.image;
    const number = card.dataset.number;
    const title = card.dataset.title;
    const subtitle = card.dataset.subtitle;
    const description = card.dataset.description;

    clearTimeout(switchTimer);

    const workImage = workPreview.closest(".work-image");

    if (workImage) {
        workImage.classList.remove("is-changing");
        // Restart the CSS transition cleanly when the user moves
        // between plan cards quickly.
        void workImage.offsetWidth;
        workImage.classList.add("is-changing");
    }

    switchTimer = setTimeout(() => {
        const nextImage = new Image();

        nextImage.onload = () => {
            workPreview.src = image;
            imageNumber.textContent = number;
            imageTitle.textContent = title;
            imageSubtitle.textContent = subtitle;
            workDescription.textContent = description;

            requestAnimationFrame(() => {
                if (workImage) {
                    workImage.classList.remove("is-changing");
                }
            });
        };

        nextImage.onerror = () => {
            if (workImage) {
                workImage.classList.remove("is-changing");
            }
        };

        nextImage.src = image;
    }, 190);
}

planCards.forEach(card => {
    // Desktop: preview immediately on hover.
    card.addEventListener("mouseenter", () => {
        setPlan(card, false);
    });

    // When leaving, restore whichever plan the user selected.
    card.addEventListener("mouseleave", () => {
        if (selectedPlan && selectedPlan !== card) {
            setPlan(selectedPlan, false);
        }
    });

    // Click/tap locks the selected plan.
    card.addEventListener("click", () => {
        setPlan(card, true);
    });

    // Keyboard accessibility: focus behaves like hover.
    card.addEventListener("focus", () => {
        setPlan(card, false);
    });

    card.addEventListener("blur", () => {
        if (selectedPlan && selectedPlan !== card) {
            setPlan(selectedPlan, false);
        }
    });
});

// Make sure the default preview is populated from the active card once the page loads.
if (selectedPlan) {
    // Show the active plan immediately so the visual, title and description
    // always match the selected plan from the moment the section loads.
    imageNumber.textContent = selectedPlan.dataset.number || "01";
    imageTitle.textContent = selectedPlan.dataset.title || "Plan 1200 — Up to 50 Mbps";
    imageSubtitle.textContent = selectedPlan.dataset.subtitle || "EVERYDAY CONNECTION";
    workDescription.textContent = selectedPlan.dataset.description || "Best for everyday browsing, streaming, video conferencing and multiple devices for an individual or a small family.";
    workPreview.src = selectedPlan.dataset.image || "assets/images/pricing-image1-new.png";
}


/*
=========================================
FAQ ACCORDION
=========================================
*/

const faqItems = document.querySelectorAll(".faq-item");

function closeFaq(item) {
    if (!item) return;
    item.classList.remove("active");
    const button = item.querySelector(".faq-question");
    if (button) button.setAttribute("aria-expanded", "false");
}

function openFaq(item) {
    if (!item) return;
    item.classList.add("active");
    const button = item.querySelector(".faq-question");
    if (button) button.setAttribute("aria-expanded", "true");
}

faqItems.forEach(item => {
    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {
        const wasActive = item.classList.contains("active");

        faqItems.forEach(closeFaq);

        // Keep one answer open at a time. Clicking the open item closes it.
        if (!wasActive) {
            openFaq(item);
        }
    });
});


/*
=========================================
CONTACT FORM
=========================================
The static website has no backend, so the
form opens the user's email client with
the entered details.
=========================================
*/

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        const subject = encodeURIComponent(
            `Ignite Website Inquiry from ${name || "Website Visitor"}`
        );

        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        window.location.href =
            `mailto:sales@ignitetelecoms.com?subject=${subject}&body=${body}`;
    });
}

/* =========================================================
   FULL-PAGE WHEEL NAVIGATION
   Restores the original one-slide-per-scroll behavior on desktop.
========================================================= */

let wheelLocked = false;
let wheelUnlockTimer;

function getCurrentSlideIndex() {
    const activeIndex = [...slides].findIndex(slide =>
        slide.classList.contains("active")
    );

    if (activeIndex >= 0) return activeIndex;

    const scrollTop = window.scrollY;
    let closest = 0;
    let distance = Infinity;

    slides.forEach((slide, index) => {
        const d = Math.abs(slide.offsetTop - scrollTop);
        if (d < distance) {
            distance = d;
            closest = index;
        }
    });

    return closest;
}

function moveToSlide(index) {
    if (index < 0 || index >= slides.length) return;

    slides[index].scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

window.addEventListener("wheel", event => {
    if (window.innerWidth <= 900) return;

    // Ignore tiny trackpad noise.
    if (Math.abs(event.deltaY) < 18) return;

    // One wheel gesture = one slide.
    if (wheelLocked) {
        event.preventDefault();
        return;
    }

    const current = getCurrentSlideIndex();
    const direction = event.deltaY > 0 ? 1 : -1;
    const next = current + direction;

    if (next < 0 || next >= slides.length) return;

    event.preventDefault();
    wheelLocked = true;
    moveToSlide(next);

    clearTimeout(wheelUnlockTimer);
    wheelUnlockTimer = setTimeout(() => {
        wheelLocked = false;
    }, 750);
}, { passive: false });


/*
=========================================
MOBILE NAVIGATION
=========================================
*/
const mobileNav = document.querySelector("nav");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileNavPanel = document.querySelector(".mobile-nav-panel");

if (mobileNav && mobileMenuToggle && mobileNavPanel) {
    const mobileLinks = mobileNavPanel.querySelectorAll("a");

    function closeMobileMenu() {
        mobileNav.classList.remove("mobile-menu-open");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        mobileNavPanel.setAttribute("aria-hidden", "true");
    }

    mobileMenuToggle.addEventListener("click", () => {
        const isOpen = mobileNav.classList.toggle("mobile-menu-open");
        mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
        mobileNavPanel.setAttribute("aria-hidden", String(!isOpen));
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", event => {
        if (!mobileNav.contains(event.target)) {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeMobileMenu();
        }
    });
}

/*
=========================================
PRELOAD PLAN IMAGES
=========================================
*/
[
    "assets/images/pricing-image1-new.png",
    "assets/images/pricing-image2.png",
    "assets/images/pricing-image3.png"
].forEach(src => {
    const img = new Image();
    img.src = src;
});
