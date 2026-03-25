/**
 * Roshinth Electrical Works - Premium Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    // === Custom Cursor (Desktop Only) ===
    const cursor = document.querySelector('.cursor-glow');
    if (window.matchMedia("(pointer: fine)").matches && cursor) {
        cursor.style.display = 'block';
        document.addEventListener('mousemove', (e) => {
            // Smooth cursor trailing effect using requestAnimationFrame
            window.requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            });
        });

        // Expand cursor on interactive elements
        const interactives = document.querySelectorAll('a, button, .gallery-item, .bento-item, .service-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(1.5)');
            el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
        });
    }

    // === Theme Toggle (Dark/Light Luxury Mode) ===
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    const toggleThemeVisuals = (isLight) => {
        if (isLight) {
            body.classList.add("light-mode");
            body.classList.remove("dark-mode");
            themeIcon.classList.remove('fa-lightbulb');
            themeIcon.classList.add('fa-moon');
        } else {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-lightbulb');
        }
    };

    if (localStorage.getItem("theme") === "light") {
        toggleThemeVisuals(true);
    }
    
    themeToggle.addEventListener("click", () => {
        const isCurrentlyLight = body.classList.contains("light-mode");
        toggleThemeVisuals(!isCurrentlyLight);
        localStorage.setItem("theme", !isCurrentlyLight ? "light" : "dark");
    });

    // === Header Scroll Effect ===
    const header = document.querySelector('.glass-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // === Scroll Reveals ===
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-left, .reveal-right');
    const checkReveal = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Trigger on load

    // === Animated Counters (Triggered once on scroll) ===
    const counters = document.querySelectorAll('.stat-number .count');
    let countersActivated = false;
    const statsSection = document.getElementById('about');

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.parentElement.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    window.addEventListener('scroll', () => {
        if (!countersActivated && statsSection) {
            const sectionTop = statsSection.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight * 0.75) {
                animateCounters();
                countersActivated = true;
            }
        }
    });
    // Fallback if already in view on load
    if (statsSection && statsSection.getBoundingClientRect().top < window.innerHeight) {
        animateCounters();
        countersActivated = true;
    }

    // === Mobile Menu ===
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav ul li a');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.add('show');
        });
        
        const closeMenu = () => mainNav.classList.remove('show');
        
        if (menuClose) menuClose.addEventListener('click', closeMenu);
        
        // Close menu on link click
        navLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // === Gallery Load More ===
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            document.querySelectorAll('.hidden-gallery-item').forEach(el => {
                el.classList.remove('hidden-gallery-item');
            });
            loadMoreBtn.style.display = 'none';
        });
    }

    // Auto-expand if clicking 'Projects' from nav
    const galleryNavLinks = document.querySelectorAll('a[href="#gallery"]');
    galleryNavLinks.forEach(link => {
        link.addEventListener('click', () => {
             if (loadMoreBtn && loadMoreBtn.style.display !== 'none') {
                 loadMoreBtn.click();
             }
        });
    });

    // === Gallery Lightbox ===
    const galleryItems = document.querySelectorAll(".gallery-item");
    let currentIndex = 0;

    // Build Lightbox DOM dynamically
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    // Using inline style here to handle layout, CSS handles rest
    lightbox.style.position = 'fixed';
    lightbox.style.top = '0'; lightbox.style.left = '0';
    lightbox.style.width = '100%'; lightbox.style.height = '100%';
    lightbox.style.display = 'none';
    lightbox.style.justifyContent = 'center';
    lightbox.style.alignItems = 'center';
    lightbox.style.zIndex = '3000';
    lightbox.innerHTML = `
      <span class="close"><i class="fas fa-times"></i></span>
      <img class="lightbox-img" />
      <span class="prev"><i class="fas fa-chevron-left"></i></span>
      <span class="next"><i class="fas fa-chevron-right"></i></span>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector(".lightbox-img");
    const closeBtn = lightbox.querySelector(".close");
    const prevBtn = lightbox.querySelector(".prev");
    const nextBtn = lightbox.querySelector(".next");

    const showImage = (index) => {
        currentIndex = index;
        const img = galleryItems[index].querySelector('img');
        if(!img) return;
        lightboxImg.src = img.src;
        // Subtle fade effect
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            lightboxImg.style.transition = 'all 0.4s ease';
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 50);
        lightbox.style.display = "flex";
    };

    galleryItems.forEach((img, index) => {
        img.addEventListener("click", () => showImage(index));
    });

    closeBtn.addEventListener("click", () => lightbox.style.display = "none");
    prevBtn.addEventListener("click", () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
    nextBtn.addEventListener("click", () => showImage((currentIndex + 1) % galleryItems.length));

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) lightbox.style.display = "none";
    });

    // Smooth active state for navigation based on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});

// === Toast & WhatsApp Logic ===
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const title = toast.querySelector('.toast-title');
    const msg = toast.querySelector('.toast-message');

    toast.className = `premium-toast ${type} show`;
    title.innerText = type === 'success' ? 'Success' : 'Error';
    msg.innerText = message;

    setTimeout(() => {
        toast.className = "premium-toast";
    }, 4000);
}

function shareAddress() {
    const name = document.getElementById("userName").value.trim();
    const phone = document.getElementById("userPhone").value.trim();
    const address = document.getElementById("userAddress").value.trim();

    if (!name || !phone || !address) {
        showToast("Please provide your name, contact, and address to proceed.", "error");
        return;
    }
    if (!/^\d{10,12}$/.test(phone)) {
        showToast("Please enter a valid 10-12 digit phone number.", "error");
        return;
    }

    const businessNumber = "918220296610";
    const message = encodeURIComponent(
        `⚡ Premium Project Consultation Request\n\n👤 Name: ${name}\n📞 Contact: ${phone}\n📍 Location: ${address}\n\nLooking forward to discussing our project!`
    );
    window.open(`https://wa.me/${businessNumber}?text=${message}`, "_blank");

    showToast("Opening WhatsApp... We will be in touch shortly!", "success");
    
    // Clear form
    document.getElementById("userName").value = '';
    document.getElementById("userPhone").value = '';
    document.getElementById("userAddress").value = '';
}
