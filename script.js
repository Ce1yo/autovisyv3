// Animation des chiffres
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuad = (t) => t * (2 - t);
        const current = Math.floor(easeOutQuad(progress) * (end - start) + start);
        
        // Format number with comma if over 1000
        obj.textContent = end >= 1000 ? current.toLocaleString() : 
                         end % 1 !== 0 ? current.toFixed(1) : current;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Observer pour déclencher l'animation quand la section est visible
function initCounterAnimation() {
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = parseFloat(stat.getAttribute('data-count'));
                    animateValue(stat, 0, target, 2000);
                });
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Gestion du menu burger
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;
    
    if (!menuToggle || !mainNav) return;
    
    // Créer l'overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    
    // Gestion du clic sur le bouton menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    });
    
    // Fermer le menu au clic sur un lien
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
    
    // Fermer le menu au clic sur l'overlay
    overlay.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('menu-open');
    });
}

// Fonction pour ajuster la hauteur du hero sur mobile
function adjustHeroHeight() {
    const hero = document.getElementById('hero');
    if (hero && window.innerWidth <= 768) {
        // Utilise la hauteur de la fenêtre moins la barre d'adresse du navigateur
        const windowHeight = window.innerHeight;
        hero.style.height = `${windowHeight}px`;
        
        // Ajuste le contenu pour qu'il soit bien centré
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            const contentHeight = heroContent.offsetHeight;
            const padding = Math.max(0, (windowHeight - contentHeight) / 2);
            heroContent.style.paddingTop = `${padding}px`;
            heroContent.style.paddingBottom = `${padding}px`;
        }
    }
}

// Gestion du menu qui se cache au scroll
let lastScroll = 0;
const header = document.querySelector('.main-header');
const headerHeight = header ? header.offsetHeight : 0;
const scrollThreshold = 200; // Délai avant activation en pixels
let ticking = false;

function handleScroll() {
    const currentScroll = window.pageYOffset;
    const heroSection = document.getElementById('hero');
    const logo = document.querySelector('.logo-link');
    
    if (!ticking) {
        window.requestAnimationFrame(function() {
            // Gestion de la visibilité du logo
            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                if (currentScroll >= heroBottom) {
                    // En dehors du hero, on montre le logo
                    logo.classList.remove('hidden');
                } else {
                    // Dans le hero, on cache le logo
                    logo.classList.add('hidden');
                }
            }
            
            if (currentScroll <= headerHeight) {
                // En haut de la page
                header.classList.remove('scrolled-down');
                header.classList.remove('scrolled-up');
                header.style.backgroundColor = 'transparent';
            } 
            // Ne réagir qu'après un certain défilement
            else if (currentScroll > scrollThreshold) {
                if (currentScroll > lastScroll && !header.classList.contains('scrolled-down')) {
                    // Défilement vers le bas
                    header.classList.remove('scrolled-up');
                    header.classList.add('scrolled-down');
                    header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
                } else if (currentScroll < lastScroll && (header.classList.contains('scrolled-down') || currentScroll < lastScroll - 5)) {
                    // Défilement vers le haut
                    header.classList.remove('scrolled-down');
                    header.classList.add('scrolled-up');
                    header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
                }
            }
            
            lastScroll = currentScroll;
            ticking = false;
        });

        ticking = true;
    }
}

// Écouteur d'événement pour le scroll avec debounce
if (header) {
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Fonction de défilement fluide personnalisée
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (!element) return;
    
    const headerOffset = document.querySelector('.main-header').offsetHeight;
    const startPosition = window.pageYOffset;
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset - 20;
    const distance = targetPosition - startPosition;
    const duration = 800; // Durée de l'animation en ms (0.8 secondes)
    let start = null;
    
    // Fonction d'animation
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        // Courbe d'accélération/décélération (easeInOutCubic)
        const easeInOutCubic = t => t < 0.5 
            ? 4 * t * t * t 
            : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            
        window.scrollTo(0, startPosition + distance * easeInOutCubic(percentage));
        
        if (progress < duration) {
            window.requestAnimationFrame(step);
        }
    }
    
    window.requestAnimationFrame(step);
}

// Gestion des clics sur les liens d'ancrage
document.addEventListener('click', function(e) {
    // Vérifie si le clic est sur un lien avec un hash
    if (e.target.matches('a[href^="#"]') && !e.target.matches('a[href="#"]')) {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        smoothScrollTo(target);
        
        // Fermer le menu mobile si ouvert
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle && menuToggle.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialisation du menu mobile
    initMobileMenu();
    
    // Ajustement initial de la hauteur du hero
    adjustHeroHeight();
    
    // Réajustement lors du redimensionnement de la fenêtre
    window.addEventListener('resize', adjustHeroHeight);
    
    // Réajustement après le chargement complet de la page
    window.addEventListener('load', adjustHeroHeight);
    
    // Form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            const requiredFields = ['name', 'email', 'phone', 'request-type', 'car-model', 'year', 'mileage', 'location'];
            const errors = [];

            requiredFields.forEach(field => {
                if (!data[field] || data[field].trim() === '') {
                    errors.push(`Le champ ${field} est requis`);
                }
            });

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                errors.push('Adresse email invalide');
            }

            // Phone validation (French format)
            const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
            if (!phoneRegex.test(data.phone)) {
                errors.push('Numéro de téléphone invalide');
            }

            if (errors.length > 0) {
                alert(errors.join('\n'));
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;

            try {
                // Here you would normally send the data to your server
                // For demo purposes, we'll simulate a server delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success message
                alert('Votre demande a été envoyée avec succès ! Nous vous contacterons dans les plus brefs délais.');
                contactForm.reset();
            } catch (error) {
                alert('Une erreur est survenue. Veuillez réessayer plus tard.');
            } finally {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // Initialisation de l'animation des compteurs
    initCounterAnimation();
    
    // Navigation simple vers les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView();
            }
        });
    });
});
