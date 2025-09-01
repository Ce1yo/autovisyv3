document.addEventListener('DOMContentLoaded', () => {
    // Form handling
    const form = document.getElementById('estimationForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            const requiredFields = ['marque', 'modele', 'annee', 'kilometrage', 'etat', 'email'];
            const missingFields = requiredFields.filter(field => !data[field]);
            
            if (missingFields.length > 0) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            form.innerHTML = `
                <div class="success-message">
                    <h3>Merci pour votre demande !</h3>
                    <p>Nous avons bien reçu vos informations. Notre équipe d'experts vous contactera sous 24h avec une estimation détaillée de votre véhicule.</p>
                </div>
            `;

            console.log('Form data:', data);
        });
    }

    // Stats animation
    const animateNumber = (element, targetValue) => {
        let startTime = null;
        const duration = 2000;

        const updateNumber = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(targetValue * progress);
            
            if (targetValue >= 1000) {
                element.textContent = Math.floor(current / 1000) + 'K+';
            } else if (targetValue === 24) {
                element.textContent = current + 'H';
            } else {
                element.textContent = current + (targetValue === 98 ? '%' : '+');
            }

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };

        requestAnimationFrame(updateNumber);
    };

    // Animation observer setup
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats')) {
                    entry.target.querySelectorAll('.stat-number').forEach(num => {
                        const target = parseInt(num.dataset.target);
                        animateNumber(num, target);
                    });
                } else if (entry.target.classList.contains('step-card') || 
                         entry.target.classList.contains('testimonial-card')) {
                    entry.target.classList.add('animate');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Start observing elements
    const statsSection = document.querySelector('.stats');
    if (statsSection) observer.observe(statsSection);

    document.querySelectorAll('.step-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });

    // FAQ accordion avec fermeture automatique
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    const closeFaqAnswer = (question) => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');
        answer.style.maxHeight = null;
        icon.style.transform = 'rotate(0deg)';
        answer.style.marginTop = '0';
        answer.style.marginBottom = '0';
    };

    const openFaqAnswer = (question) => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
        answer.style.marginTop = '1rem';
        answer.style.marginBottom = '1rem';
    };

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            
            // Fermer toutes les autres réponses
            faqQuestions.forEach(q => {
                if (q !== question && q.nextElementSibling.style.maxHeight) {
                    closeFaqAnswer(q);
                }
            });

            // Basculer la réponse actuelle
            if (answer.style.maxHeight) {
                closeFaqAnswer(question);
            } else {
                openFaqAnswer(question);
            }
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});
