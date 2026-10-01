

const EMAILJS_PUBLIC_KEY  = "Be5tIswEgxw2MnEjI";    
const EMAILJS_SERVICE_ID  = "service_n242d98";    
const EMAILJS_TEMPLATE_ID = "template_3z95yif";  

// ── Init 
(function () {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
})();

// ── Helpers 
function showStatus(message, type) {
  
  let el = document.getElementById("form-status");
  if (!el) {
    el = document.createElement("div");
    el.id = "form-status";
    const form = document.getElementById("contact-form");
    if (form) form.appendChild(el);
  }
  el.textContent = message;
  el.className = "form-status " + type; 
  el.style.display = "block";

  if (type !== "loading") {
    setTimeout(() => {
      el.style.display = "none";
    }, 5000);
  }
}

function validateForm(name, email, message) {
  if (!name.trim()) return "Please enter your name.";
  if (!email.trim()) return "Please enter your email address.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Please enter a valid email address.";
  if (!message.trim()) return "Please enter a message.";
  if (message.trim().length < 10) return "Message is too short (minimum 10 characters).";
  return null; 
}


function isSpam() {
  const hp = document.getElementById("hp-field");
  return hp && hp.value !== "";
}

// ── Main send handler 
async function sendEmail(e) {
  e.preventDefault();

  // Spam guard
  if (isSpam()) {
    console.warn("Spam submission blocked.");
    return;
  }


  const nameEl    = document.getElementById("name")    || document.querySelector('[name="name"]');
  const emailEl   = document.getElementById("email")   || document.querySelector('[name="email"]');
  const messageEl = document.getElementById("message") || document.querySelector('[name="message"]');
  const submitBtn = document.querySelector('#contact-form [type="submit"]');

  if (!nameEl || !emailEl || !messageEl) {
    console.error("Contact form fields not found. Check your HTML IDs.");
    return;
  }

  const name    = nameEl.value;
  const email   = emailEl.value;
  const message = messageEl.value;

  // Validate
  const error = validateForm(name, email, message);
  if (error) {
    showStatus(error, "error");
    return;
  }

  // Disable button & show loading
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
  }
  showStatus("Sending your message…", "loading");

  // Template parameters 
  const templateParams = {
    from_name:    name.trim(),
    from_email:   email.trim(),
    message:      message.trim(),
    reply_to:     email.trim(),
    to_name:      "Mubashir Khan",
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

    showStatus("Message sent! I'll get back to you soon.", "success");

    // Reset form
    document.getElementById("contact-form").reset();

  } catch (err) {
    console.error("EmailJS error:", err);
    showStatus("Oops! Something went wrong. Please try again or email me directly.", "error");

  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
  }
}

// ── Attach listener ──────
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", sendEmail);
  } else {
    console.warn('No element with id="contact-form" found. Update the selector if yours differs.');
  }
});