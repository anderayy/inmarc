import DataService from './data-service.js';

document.addEventListener('DOMContentLoaded', () => {
    initPortfolio();
    initContactForm();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
});

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        el.style.opacity = '0'; // Hide initially
        observer.observe(el);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = window.innerWidth <= 768 ? 70 : 90;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Portfolio Logic
function initPortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (!portfolioGrid) return;

    const renderProjects = async (filter = 'all') => {
        const allProjects = await DataService.getProjects();
        // Case-insensitive status check
        const projects = allProjects.filter(p => (p.status || '').toLowerCase() === 'published');
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(p => p.category === filter);

        portfolioGrid.innerHTML = filteredProjects.map(project => `
            <div class="project-card" data-category="${project.category}">
                <img src="${project.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'}" alt="${project.title}" class="project-img">
                <div class="project-overlay">
                    <span class="project-cat">${project.category}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc-mini">${project.description || ''}</p>
                    <p class="project-client">${project.clientName} • ${new Date(project.projectDate).getFullYear()}</p>
                </div>
            </div>
        `).join('');
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update UI
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter
            const filter = btn.getAttribute('data-filter');
            renderProjects(filter);
        });
    });

    // Initial render
    renderProjects();

    // Mobile Touch Reveal for Portfolio
    portfolioGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (card) {
            // If it's a mobile device (based on touch capability)
            if (window.matchMedia("(max-width: 992px)").matches) {
                const isActive = card.classList.contains('active-mobile');
                
                // Close all other cards
                document.querySelectorAll('.project-card').forEach(c => c.classList.remove('active-mobile'));
                
                // Toggle current card
                if (!isActive) {
                    card.classList.add('active-mobile');
                }
            }
        }
    });

    // Auto-reload (Real-time update) every 5 seconds
    let lastDataHash = '';
    setInterval(async () => {
        const allProjects = await DataService.getProjects();
        const currentHash = JSON.stringify(allProjects);
        
        if (currentHash !== lastDataHash) {
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            await renderProjects(activeFilter);
            lastDataHash = currentHash;
        }
    }, 5000);
}

// Contact Form Logic
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const contactData = {
            fullName: formData.get('fullName'),
            workEmail: formData.get('workEmail'),
            serviceRequired: formData.get('serviceRequired'),
            message: formData.get('message')
        };

        try {
            await DataService.saveContact(contactData);
            
            // Show success
            statusDiv.textContent = 'Thank you! Your inquiry has been sent successfully.';
            statusDiv.classList.add('success');
            form.reset();

            // Clear after 5s
            setTimeout(() => {
                statusDiv.classList.remove('success');
                statusDiv.textContent = '';
            }, 5000);
        } catch (error) {
            console.error('Error saving contact:', error);
            alert('There was an error sending your inquiry. Please try again.');
        }
    });
}

// Mobile Menu
function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    
    if (btn && navLinks) {
        btn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Toggle icon
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });

        // Close menu when window is resized to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    }
}
