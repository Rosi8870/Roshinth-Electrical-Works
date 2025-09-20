// Theme Toggle with Memory
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-mode");
  body.classList.remove("dark-mode");
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  body.classList.toggle("dark-mode");

  if (body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
});

// Fade-in Animation
const fadeElements = document.querySelectorAll(".fade-in");
function checkVisibility() {
  const triggerBottom = window.innerHeight * 0.9;
  fadeElements.forEach((el) => {
    if (el.getBoundingClientRect().top < triggerBottom) {
      el.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", checkVisibility);
window.addEventListener("load", checkVisibility);

// Animated Counters
const counters = document.querySelectorAll(".stat-number .count");
function runCounters() {
  counters.forEach(counter => {
    counter.innerText = "0";
    const target = +counter.parentElement.getAttribute("data-target");
    const updateCount = () => {
      const current = +counter.innerText;
      const increment = target / 200;
      if (current < target) {
        counter.innerText = Math.ceil(current + increment);
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
}
window.addEventListener("load", runCounters);

// Gallery Lightbox with Navigation
const galleryItems = document.querySelectorAll(".gallery-item img");
let currentIndex = 0;

const lightbox = document.createElement("div");
lightbox.id = "lightbox";
document.body.appendChild(lightbox);
lightbox.innerHTML = `
  <span class="close">&times;</span>
  <img class="lightbox-img" />
  <a class="prev">&#10094;</a>
  <a class="next">&#10095;</a>
`;
const lightboxImg = lightbox.querySelector(".lightbox-img");
const closeBtn = lightbox.querySelector(".close");
const prevBtn = lightbox.querySelector(".prev");
const nextBtn = lightbox.querySelector(".next");

function showImage(index) {
  currentIndex = index;
  lightboxImg.src = galleryItems[index].src;
  lightbox.classList.add("show");
}

galleryItems.forEach((img, index) => {
  img.addEventListener("click", () => showImage(index));
});

closeBtn.addEventListener("click", () => lightbox.classList.remove("show"));
prevBtn.addEventListener("click", () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
nextBtn.addEventListener("click", () => showImage((currentIndex + 1) % galleryItems.length));

// Toast Function
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

// WhatsApp Location Share with Validation + Toast
function shareAddress() {
  const name = document.getElementById("userName").value.trim();
  const phone = document.getElementById("userPhone").value.trim();
  const address = document.getElementById("userAddress").value.trim();

  if (!name || !phone || !address) {
    showToast("⚠️ Please enter your name, phone number, and address.", "error");
    return;
  }
  if (!/^\d{10,12}$/.test(phone)) {
    showToast("⚠️ Enter a valid phone number (10–12 digits).", "error");
    return;
  }

  const businessNumber = "918220296610";
  const message = encodeURIComponent(
    `📌 New Location Request:\n\n👤 Name: ${name}\n📞 Contact: ${phone}\n📍 Address/Map: ${address}`
  );
  window.open(`https://wa.me/${businessNumber}?text=${message}`, "_blank");

  showToast("✅ Location sent via WhatsApp", "success");
}

// Mobile Menu Toggle
document.getElementById("menu-toggle")?.addEventListener("click", function() {
  document.querySelector("header nav ul").classList.toggle("show");
});
