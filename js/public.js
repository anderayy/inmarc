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
                window.scrollTo({
                    top: target.offsetTop - 90,
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
        const projects = allProjects.filter(p => p.status === 'Published');
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(p => p.category === filter);

        portfolioGrid.innerHTML = filteredProjects.map(project => `
            <div class="project-card" data-category="${project.category}">
                <img src="${project.featuredImage}" alt="${project.title}" class="project-img">
                <div class="project-overlay">
                    <span class="project-cat">${project.category}</span>
                    <h3 class="project-title">${project.title}</h3>
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
    
    if (btn) {
        btn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = 'var(--shadow-md)';
            }
        });
    }
}
