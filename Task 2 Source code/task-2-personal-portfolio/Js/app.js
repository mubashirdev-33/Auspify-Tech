

// for  text type/erase 
const typedTextElement = document.getElementById("typedText");

const wordsToType = [
 
    "Responsive Web Designs",
    "Dynamic React Applications",
    "Secure Firebase Auth Systems",
    "Custom E-Commerce Frontends",
    "Optimized Single Page Apps",
    "Clean & Scalable Codebases"
];

let wordIndex = 0;        
let charIndex = 0;        
let isDeleting = false;   
const typeSpeed = 90;     
const deleteSpeed = 45;   
const pauseBetween = 1500;

function typeLoop() {
    if (!typedTextElement) return;

    const currentWord = wordsToType[wordIndex];

    if (isDeleting) {
        // Delete mode -one by one character 
        typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Typing mode - one by one character add 
        typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    // Speed decide 
    let delay = isDeleting ? deleteSpeed : typeSpeed;

    // complete word type 
    if (!isDeleting && charIndex === currentWord.length) {
        delay = pauseBetween;
        isDeleting = true;
    }
    // complete word  delete 
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % wordsToType.length;
        delay = 400;
    }

    setTimeout(typeLoop, delay);
}

// Animation start 
typeLoop();


//   MOBILE NAVBAR TOGGLE 

const navbar = document.querySelector(".navbar");
const navLinks = document.querySelector(".nav-links");


if (navbar && navLinks && !document.querySelector(".menu-toggle")) {
    const menuBtn = document.createElement("button");
    menuBtn.className = "menu-toggle";
    menuBtn.setAttribute("type", "button");
    menuBtn.setAttribute("aria-label", "Open navigation menu");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

    const navbarContent = navbar.querySelector(".navbar-content");
    if (navbarContent) {
        navbarContent.appendChild(menuBtn);
    }

    const setMenuState = (isOpen) => {
        navLinks.classList.toggle("open", isOpen);

        const icon = menuBtn.querySelector("i");
        if (icon) {
            icon.className = isOpen
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars";
        }

        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    };


    menuBtn.addEventListener("click", () => {
        setMenuState(!navLinks.classList.contains("open"));
    });


    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            setMenuState(false);
        });
    });


    document.addEventListener("click", (event) => {
        if (!navLinks.classList.contains("open")) return;

        if (!navbar.contains(event.target)) {
            setMenuState(false);
        }
    });


    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            setMenuState(false);
        }
    });
}


//  ACTIVE NAV LINK ON SCROLL 

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


//  NAVBAR SCROLL EFFECT -

window.addEventListener("scroll", () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


//  DOWNLOAD CV — VERIFY FILE 
const cvButtons = document.querySelectorAll(".cv-btn");
cvButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        // Optional: show mini toast
        showToast("Downloading CV...", "success");
    });
});


//  SIMPLE TOAST NOTIFICATION 

function showToast(message, type = "info") {
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

    
    setTimeout(() => toast.classList.add("show"), 10);

    
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}


// SMOOTH SCROLL FOR NAV LINKS

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


// SCROLL REVEAL ANIMATION 

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


// PROJECT TRACK — PAUSE ON HOVER (Fallback) 

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

    
    row.addEventListener("touchstart", () => {
        track.style.animationPlayState = "paused";
    });
    row.addEventListener("touchend", () => {
        setTimeout(() => {
            track.style.animationPlayState = "running";
        }, 2000);
    });
});


//YEAR AUTO-UPDATE IN FOOTER

const footerText = document.querySelector(".footer p");
if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.innerHTML = `© ${currentYear} MK. All rights reserved.`;
}

console.log("✅ Portfolio JS loaded successfully!");
