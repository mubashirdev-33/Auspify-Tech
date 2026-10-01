// ============================================================
//  Main Portfolio JavaScript
//  Author: Mubashir Khan
//  Features: Typed text, Mobile menu, Active nav, Download CV
// ============================================================

// -------- 1. TYPED TEXT ANIMATION --------
// Hero mein text type/erase karke change hota rahe
const typedTextElement = document.getElementById("typedText");

// Yeh saare words hain jo typing mein aayenge
const wordsToType = [
    
    "React applications",
    "clean user interfaces",
      "Dynamic React Apps", 
    "Interactive User Interfaces", 
    "Mobile-First Designs"
];

let wordIndex = 0;        // Kaun sa word chal raha hai
let charIndex = 0;        // Kitne characters type ho chuke
let isDeleting = false;   // Delete mode mein hai ya nahi
const typeSpeed = 90;     // Typing ki speed (ms)
const deleteSpeed = 45;   // Deleting ki speed (ms)
const pauseBetween = 1500;// Word ke baad pause (ms)

function typeLoop() {
    if (!typedTextElement) return;

    const currentWord = wordsToType[wordIndex];

    if (isDeleting) {
        // Delete mode - ek ek character hata rahe hain
        typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Typing mode - ek ek character add kar rahe hain
        typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    // Speed decide karein
    let delay = isDeleting ? deleteSpeed : typeSpeed;

    // Agar pura word type ho gaya
    if (!isDeleting && charIndex === currentWord.length) {
        delay = pauseBetween;
        isDeleting = true;
    }
    // Agar pura word delete ho gaya
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % wordsToType.length;
        delay = 400;
    }

    setTimeout(typeLoop, delay);
}

// Animation start karein
typeLoop();


// -------- 2. MOBILE NAVBAR TOGGLE --------
// Chhoti screens par navbar open/close karne ke liye
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelector(".nav-links");

// Mobile menu button banayein (dynamically)
if (navbar && navLinks && !document.querySelector(".menu-toggle")) {
    const menuBtn = document.createElement("button");
    menuBtn.className = "menu-toggle";
    menuBtn.setAttribute("aria-label", "Toggle menu");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    navbar.querySelector(".navbar-content").appendChild(menuBtn);

    // Toggle par click
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        const icon = menuBtn.querySelector("i");
        if (navLinks.classList.contains("open")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });

    // Nav link par click hone par menu band
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuBtn.querySelector("i").className = "fa-solid fa-bars";
        });
    });
}


// -------- 3. ACTIVE NAV LINK ON SCROLL --------
// Scroll karte waqt kaunsa section view mein hai woh highlight ho
const allSections = document.querySelectorAll("section[id]");
const allNavLinks = document.querySelectorAll(".nav-links a");

function highlightActiveNav() {
    const scrollPos = window.scrollY + 150;
    let currentId = "";

    allSections.forEach((section) => {
        if (scrollPos >= section.offsetTop) {
            currentId = section.getAttribute("id");
        }
    });

    allNavLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + currentId) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", highlightActiveNav);
window.addEventListener("load", highlightActiveNav);


// -------- 4. NAVBAR SCROLL EFFECT --------
// Scroll karne par navbar thoda compact ho jaye
window.addEventListener("scroll", () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


// -------- 5. DOWNLOAD CV — VERIFY FILE --------
// CV button par click karne se pehle file check karein
const cvButtons = document.querySelectorAll(".cv-btn");
cvButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        // Optional: show mini toast
        showToast("Downloading CV...", "success");
    });
});


// -------- 6. SIMPLE TOAST NOTIFICATION --------
// Chhota popup message dikhane ke liye
function showToast(message, type = "info") {
    // Purana toast hata dein agar mojood hai
    const old = document.querySelector(".toast-notify");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.className = "toast-notify " + type;

    const icons = {
        success: "fa-circle-check",
        error: "fa-circle-xmark",
        info: "fa-circle-info",
    };
    const iconClass = icons[type] || icons.info;

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);

    // Animation ke liye show class
    setTimeout(() => toast.classList.add("show"), 10);

    // 3 second baad hata dein
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}


// -------- 7. SMOOTH SCROLL FOR NAV LINKS --------
// Purane browsers ke liye smooth scroll fallback
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#" || targetId.length < 2) return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: "smooth" });
        }
    });
});


// -------- 8. SCROLL REVEAL ANIMATION --------
// Sections aur cards fade in ho jayein jab scroll karein
const revealElements = document.querySelectorAll(
    ".skill-card, .achievement-card, .info-card, .project-card"
);

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
);

revealElements.forEach((el) => revealObserver.observe(el));


// -------- 9. PROJECT TRACK — PAUSE ON HOVER (Fallback) --------
// CSS ke saath saath JS fallback bhi, mobile ke liye
const projectRows = document.querySelectorAll(".project-row");
projectRows.forEach((row) => {
    const track = row.querySelector(".project-track");
    if (!track) return;

    row.addEventListener("mouseenter", () => {
        track.style.animationPlayState = "paused";
    });
    row.addEventListener("mouseleave", () => {
        track.style.animationPlayState = "running";
    });

    // Touch devices ke liye
    row.addEventListener("touchstart", () => {
        track.style.animationPlayState = "paused";
    });
    row.addEventListener("touchend", () => {
        setTimeout(() => {
            track.style.animationPlayState = "running";
        }, 2000);
    });
});


// -------- 10. YEAR AUTO-UPDATE IN FOOTER --------
// Footer mein current year dikhaye
const footerText = document.querySelector(".footer p");
if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.innerHTML = `© ${currentYear} MK. All rights reserved.`;
}

console.log("✅ Portfolio JS loaded successfully!");