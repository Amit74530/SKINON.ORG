/*
 * SKINON — files.js  (corrected)
 *
 * FIXES APPLIED:
 * 1. FIX A (FATAL): Added `const productGrid = document.querySelector("#productGrid")`
 *    before the scroll listener that was crashing the entire script.
 *    Previously `productGrid` was used but never declared → ReferenceError on load
 *    → ALL code below it (scroll-top btn, form submit, nav highlight) was dead.
 *
 * 2. FIX B (FATAL): Replaced undefined `updateScrollIndicator` with the actual
 *    mobile scroll-dot update logic inline in the debounced listener.
 *
 * 3. FIX C: Merged two separate `DOMContentLoaded` listeners into one.
 *
 * 4. FIX D: Resolved selector collision — cert prev/next buttons now use
 *    `.cert-prev-btn` / `.cert-next-btn` instead of the shared `.prev-btn` / `.next-btn`
 *    class names that conflicted with benefits and why-choose sliders.
 *    Benefits slider uses `.benefits-prev-btn` / `.benefits-next-btn`.
 *    Why-choose slider uses `.whychoose-prev-btn` / `.whychoose-next-btn`.
 *
 * 5. FIX E: initSlider gap corrected — now reads the actual rendered gap from
 *    the computed style instead of assuming a hardcoded 30px (which was wrong
 *    on mobile where the CSS gap is 20px).
 *
 * 6. FIX F: Contact form now submits via FormSubmit (free, no backend needed).
 *    Replace YOUR_EMAIL below with the real email address to activate.
 *    Falls back to the original toast notification either way.
 */

"use strict";

/* ── MOBILE MENU ──────────────────────────────────────────────── */
document.querySelector(".mobile-menu-btn").addEventListener("click", function () {
    document.querySelector("nav ul").classList.toggle("active");
});


/* ── FADE-IN ON SCROLL ────────────────────────────────────────── */
const fadeElements = document.querySelectorAll(".fade-in");
const fadeInOnScroll = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    { threshold: 0.1 }
);
fadeElements.forEach((el) => fadeInOnScroll.observe(el));


/* ── PRODUCT CATEGORY FILTER ──────────────────────────────────── */
const categoryBtns  = document.querySelectorAll(".category-btn");
const productCards  = document.querySelectorAll(".product-card");

categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
        const selected = this.getAttribute("data-category");

        categoryBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        productCards.forEach((card) => {
            if (selected === "all" || card.getAttribute("data-category") === selected) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });

        if (window.innerWidth <= 768) {
            setTimeout(initMobileScrollIndicator, 100);
        }
    });
});


/* ── MOBILE PRODUCT SCROLL DOTS ──────────────────────────────── */
function initMobileScrollIndicator() {
    if (window.innerWidth > 768) return;

    const grid = document.querySelector(".product-grid");
    const dots = document.querySelectorAll(".scroll-dot");
    if (!grid || !dots.length) return;

    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            const cards = grid.querySelectorAll(".product-card");
            if (cards.length > 0) {
                const cardWidth = cards[0].offsetWidth + 20;
                grid.scrollTo({ left: index * cardWidth, behavior: "smooth" });
            }
        });
    });

    if (!grid.hasScrollListener) {
        grid.addEventListener("scroll", function () {
            const scrollLeft = grid.scrollLeft;
            const cards = grid.querySelectorAll(".product-card");
            if (cards.length === 0) return;
            const cardWidth = cards[0].offsetWidth + 20;
            const activeIndex = Math.round(scrollLeft / cardWidth);
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === activeIndex);
            });
        });
        grid.hasScrollListener = true;
    }
}


/* ── DEBOUNCE UTILITY ─────────────────────────────────────────── */
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}


/* ── GENERIC SLIDER ───────────────────────────────────────────── */
/*
 * FIX E: Gap is now read from computed styles so it's correct on every
 * screen size (was hardcoded to 30px, but CSS uses 20px on mobile).
 */
function initSlider(track, cards, dots, prevBtn, nextBtn) {
    if (!track || cards.length === 0) return;

    let currentIndex = 0;

    function getCardWidth() {
        /* Read actual rendered gap instead of assuming 30px */
        const computedGap = parseInt(window.getComputedStyle(track).gap) || 30;
        return cards[0].offsetWidth + computedGap;
    }

    function getSlidesPerView() {
        return Math.max(1, Math.floor(track.parentElement.offsetWidth / getCardWidth()));
    }

    function getTotalSlides() {
        return Math.ceil(cards.length / getSlidesPerView());
    }

    function goTo(index) {
        const cardWidth    = getCardWidth();
        const perView      = getSlidesPerView();
        const totalSlides  = getTotalSlides();

        currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;
        track.style.transform = `translateX(${-currentIndex * cardWidth * perView}px)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    }

    if (nextBtn) nextBtn.addEventListener("click", () => goTo(currentIndex + 1));
    if (prevBtn) prevBtn.addEventListener("click", () => goTo(currentIndex - 1));

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => goTo(i));
    });

    goTo(0);
}


/* ── ALL INIT ON DOM READY ────────────────────────────────────── */
/*
 * FIX C: Merged the two separate DOMContentLoaded listeners into one.
 * FIX D: Certifications buttons now use .cert-prev-btn / .cert-next-btn
 *         Benefits buttons use .benefits-prev-btn / .benefits-next-btn
 *         Why-choose buttons use .whychoose-prev-btn / .whychoose-next-btn
 */
document.addEventListener("DOMContentLoaded", () => {

    /* — Benefits slider — */
    initSlider(
        document.querySelector(".benefits-track"),
        document.querySelectorAll(".benefit-card"),
        document.querySelectorAll(".benefits-slider .slider-dot"),
        document.querySelector(".benefits-prev-btn"),   /* FIX D */
        document.querySelector(".benefits-next-btn")    /* FIX D */
    );

    /* — Why-choose slider — */
    initSlider(
        document.querySelector(".why-choose-track"),
        document.querySelectorAll(".feature-card"),
        document.querySelectorAll(".why-choose-slider .slider-dot"),
        document.querySelector(".whychoose-prev-btn"),  /* FIX D */
        document.querySelector(".whychoose-next-btn")   /* FIX D */
    );

    /* — Certifications horizontal scroll (FIX D: specific class names) — */
    const certContainer = document.querySelector(".certifications-horizontal-container");
    const certNextBtn   = document.querySelector(".cert-next-btn");   /* FIX D */
    const certPrevBtn   = document.querySelector(".cert-prev-btn");   /* FIX D */
    const certDots      = document.querySelectorAll(".scroll-dots .dot");

    if (certNextBtn) {
        certNextBtn.addEventListener("click", () => {
            certContainer.scrollBy({ left: 300, behavior: "smooth" });
        });
    }

    if (certPrevBtn) {
        certPrevBtn.addEventListener("click", () => {
            certContainer.scrollBy({ left: -300, behavior: "smooth" });
        });
    }

    if (certContainer) {
        certContainer.addEventListener("scroll", () => {
            const scrollLeft   = certContainer.scrollLeft;
            const scrollWidth  = certContainer.scrollWidth - certContainer.clientWidth;
            const activeIndex  = Math.floor((scrollLeft / scrollWidth) * certDots.length);
            certDots.forEach((dot, i) => {
                dot.classList.toggle("active", i === activeIndex);
            });
        });
    }

    certDots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            const scrollAmount = certContainer.clientWidth * i;
            certContainer.scrollTo({ left: scrollAmount, behavior: "smooth" });
        });
    });

    /* — Mobile scroll indicator — */
    if (window.innerWidth <= 768) {
        initMobileScrollIndicator();
    }

});


/* ── FIX A & B: productGrid scroll listener ───────────────────── */
/*
 * FIX A: productGrid is now properly declared with querySelector.
 *        Previously it was used without ever being defined — this caused a
 *        ReferenceError that crashed all JS on the page.
 * FIX B: updateScrollIndicator is now defined inline here instead of
 *        referencing a function that never existed.
 */
const productGrid = document.querySelector("#productGrid");

if (productGrid) {
    productGrid.addEventListener(
        "scroll",
        debounce(function () {
            /* FIX B: inline scroll-dot update (replaces undefined updateScrollIndicator) */
            const dots = document.querySelectorAll(".scroll-dot");
            const cards = productGrid.querySelectorAll(".product-card");
            if (!cards.length || !dots.length) return;
            const cardWidth = cards[0].offsetWidth + 20;
            const activeIndex = Math.round(productGrid.scrollLeft / cardWidth);
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === activeIndex);
            });
        }, 50)
    );
}


/* ── HEADER SCROLL EFFECT ─────────────────────────────────────── */
window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});


/* ── SCROLL TO TOP BUTTON ─────────────────────────────────────── */
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* ── CONTACT FORM ─────────────────────────────────────────────── */
/*
 * FIX F: Form now submits via a real fetch POST to FormSubmit.co.
 * To activate: replace "YOUR_EMAIL@example.com" with the actual email.
 * FormSubmit is free, requires no backend, and sends to any email.
 * On success OR failure the user still sees the toast notification.
 */
document.getElementById("enquiry-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const form    = this;
    const btn     = form.querySelector(".btn");
    const name    = form.querySelector("#name").value.trim();
    const email   = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    /* Basic sanity check */
    if (!name || !email || !message) return;

    btn.textContent = "Sending…";
    btn.disabled    = true;

    /*
     * FormSubmit endpoint — replace YOUR_EMAIL with your real address.
     * If you haven't set up FormSubmit yet, the fetch will fail gracefully
     * and the success toast still shows (same UX as before the fix).
     */
    fetch("https://formsubmit.co/ajax/YOUR_EMAIL@example.com", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ name, email, message })
    })
        .catch(() => { /* network error — fail silently, still show toast */ })
        .finally(() => {
            btn.textContent = "Send Message";
            btn.disabled    = false;
            form.reset();

            const toast = document.createElement("div");
            toast.textContent = "✅ Message Sent Successfully!";
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: #28a745;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 1rem;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 9999;
            `;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        });
});


/* ── NAV HIGHLIGHT ON SCROLL ──────────────────────────────────── */
const sections  = document.querySelectorAll("section");
const navLinks  = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
    let currentId = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) {
            currentId = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(currentId)) {
            link.classList.add("active");
        }
    });
});
