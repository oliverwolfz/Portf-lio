// ===== GLOBAL VARIABLES =====
let particleSystem;
let isLoading = true;
let currentFilter = 'all';
let typingInterval;
let codeAnimationInterval;

// ===== LOADING SCREEN =====
class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressBar = document.querySelector('.loading-progress');
        this.percentage = document.querySelector('.loading-percentage');
        this.progress = 0;
    }

    start() {
        this.simulateLoading();
    }

    simulateLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hide(), 500);
            }
            
            this.updateProgress();
        }, 200);
    }

    updateProgress() {
        this.progressBar.style.width = `${this.progress}%`;
        this.percentage.textContent = `${Math.floor(this.progress)}%`;
    }

    hide() {
        this.loadingScreen.classList.add('hidden');
        isLoading = false;
        document.body.style.overflow = 'auto';
        
        // Initialize other components after loading
        setTimeout(() => {
            particleSystem.init();
            new TypingAnimation();
            new CodeAnimation();
            new ScrollAnimations();
        }, 300);
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.config = {
            particleCount: 80,
            maxDistance: 150,
            particleSpeed: 0.5,
            particleSize: 2,
            connectionOpacity: 0.3,
            mouseRadius: 200
        };
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * this.config.particleSize + 1,
                opacity: Math.random() * 0.5 + 0.3,
                color: Math.random() > 0.5 ? '#00d4ff' : '#533483'
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseRadius) {
                const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                particle.x -= dx * force * 0.01;
                particle.y -= dy * force * 0.01;
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.maxDistance) {
                    const opacity = (this.config.maxDistance - distance) / this.config.maxDistance * this.config.connectionOpacity;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    this.ctx.globalAlpha = opacity;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1;
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor() {
        this.element = document.getElementById('typing-text');
        this.texts = [
            'Desenvolvedor Front-end',
            'Designer',
            'Entusiasta de tecnologia',
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }
        
        let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            speed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        }
        
        setTimeout(() => this.type(), speed);
    }
}

// ===== CODE ANIMATION =====
class CodeAnimation {
    constructor() {
        this.element = document.getElementById('code-animation');
        this.codeLines = [
            'const developer = {',
            '  name: "Helber Oliveira",',
            '  skills: ["Python", "Html", "Css"],',
            '  passion: "Creating amazing experiences",',
            '  available: true',
            '};',
            '',
            'function buildAwesome() {',
            '  return developer.skills.map(skill => {',
            '    return `Building with ${skill}`;',
            '  });',
            '}',
            '',
            'console.log(buildAwesome());'
        ];
        this.currentLine = 0;
        this.currentChar = 0;
        this.displayedCode = '';
        
        this.start();
    }

    start() {
        this.animateCode();
    }

    animateCode() {
        if (this.currentLine < this.codeLines.length) {
            const line = this.codeLines[this.currentLine];
            
            if (this.currentChar < line.length) {
                this.displayedCode += line[this.currentChar];
                this.currentChar++;
            } else {
                this.displayedCode += '\n';
                this.currentLine++;
                this.currentChar = 0;
            }
            
            this.element.textContent = this.displayedCode;
            
            setTimeout(() => this.animateCode(), 50);
        } else {
            // Reset animation after completion
            setTimeout(() => {
                this.currentLine = 0;
                this.currentChar = 0;
                this.displayedCode = '';
                this.animateCode();
            }, 3000);
        }
    }
}

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.bindEvents();
        this.updateActiveLink();
    }

    bindEvents() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });

        // Smooth scrolling
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveLink();
        });
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos <= bottom) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.createObserver();
        this.animateStats();
        this.animateSkillBars();
    }

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, this.observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.detail-item, .certificate-item, .portfolio-item, .contact-item, .tech-item'
        );
        
        animatedElements.forEach(el => observer.observe(el));
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    this.countUp(entry.target, target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        statNumbers.forEach(stat => statsObserver.observe(stat));
    }

    countUp(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 30);
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    setTimeout(() => {
                        entry.target.style.width = `${width}%`;
                    }, 200);
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        skillBars.forEach(bar => skillsObserver.observe(bar));
    }
}

// ===== PORTFOLIO FILTER =====
class PortfolioFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        
        this.bindEvents();
    }

    bindEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.setActiveFilter(button);
                this.filterItems(filter);
            });
        });
    }

    setActiveFilter(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    filterItems(filter) {
        this.portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
}

// ===== PROJECT MODAL =====
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        this.modalClose = document.getElementById('modal-close');
        this.modalTitle = document.getElementById('modal-title');
        this.modalImage = document.getElementById('modal-image');
        this.modalDescription = document.getElementById('modal-description');
        this.modalTech = document.getElementById('modal-tech');
        this.modalGithub = document.getElementById('modal-github');
        this.modalDemo = document.getElementById('modal-demo');
        
        this.projects = {
            skillnet: {
                title: 'Platforma para troca de serviços',
                image: 'https://via.placeholder.com/600x400/1a1a2e/00d4ff?text=E-commerce+Platform',
                description: 'Projeto Tu & Eu que tem como objetivo realizar umm sistema de troca de serviços de forma colaborativa, sem a necessidade de dinheiro',
                tech: ['Python', 'Mysql', 'Html', 'Css'],
                github: 'https://github.com/clara-cecilia/TueEu',
            },
            hospitalshelton: {
                title: 'Hospital Shelton',
                image: 'https://via.placeholder.com/600x400/1a1a2e/00d4ff?text=Task+Manager+App',
                description: 'Site para gerenciamento de senhas',
                tech: ['Html', 'Css', 'Javascript'],
                github: 'https://github.com/oliverwolfz/Hospital-Shelton',
            },
            
        };
        
        this.bindEvents();
    }

    bindEvents() {
        // Open modal
        document.querySelectorAll('[data-project]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = link.getAttribute('data-project');
                this.openModal(projectId);
            });
        });

        // Close modal
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    openModal(projectId) {
        const project = this.projects[projectId];
        if (!project) return;

        this.modalTitle.textContent = project.title;
        this.modalImage.src = project.image;
        this.modalDescription.textContent = project.description;
        this.modalGithub.href = project.github;
        this.modalDemo.href = project.demo;

        // Update tech stack
        this.modalTech.innerHTML = '';
        project.tech.forEach(tech => {
            const span = document.createElement('span');
            span.textContent = tech;
            this.modalTech.appendChild(span);
        });

        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ===== CONTACT FORM =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Nome é obrigatório';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email é obrigatório';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Email inválido';
                    isValid = false;
                }
                break;
                
            case 'subject':
                if (!value) {
                    errorMessage = 'Assunto é obrigatório';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (!value) {
                    errorMessage = 'Mensagem é obrigatória';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
                    isValid = false;
                }
                break;
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
        }

        field.classList.toggle('error', !isValid);
        return isValid;
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.classList.remove('error');
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }

        this.setLoading(true);

        // Simulate form submission
        try {
            await this.simulateSubmission();
            this.showSuccess();
            this.form.reset();
        } catch (error) {
            this.showError();
        } finally {
            this.setLoading(false);
        }
    }

    simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
    }

    showSuccess() {
        this.showNotification('Mensagem enviada com sucesso!', 'success');
    }

    showError() {
        this.showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? '#00ff88' : '#ff5f57'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// ===== TECH STACK INTERACTIONS =====
class TechStackInteractions {
    constructor() {
        this.techItems = document.querySelectorAll('.tech-item');
        this.bindEvents();
    }

    bindEvents() {
        this.techItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.animateItem(item);
            });
        });
    }

    animateItem(item) {
        const icon = item.querySelector('i');
        icon.style.transform = 'scale(1.2) rotate(360deg)';
        icon.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }, 500);
    }
}

// ===== SMOOTH SCROLL =====
class SmoothScroll {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                document.getElementById('about').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduced-motion');
        }

        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                particleSystem.destroy();
            } else {
                particleSystem.animate();
            }
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    particleSystem = new ParticleSystem();
    
    // Initialize loading screen
    const loadingScreen = new LoadingScreen();
    loadingScreen.start();
    
    // Initialize other components
    new Navigation();
    new PortfolioFilter();
    new ProjectModal();
    new ContactForm();
    new TechStackInteractions();
    new SmoothScroll();
    new PerformanceOptimizer();
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== EASTER EGGS =====
class EasterEggs {
    constructor() {
        this.konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        this.userInput = [];
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.userInput.push(e.code);
            
            if (this.userInput.length > this.konamiCode.length) {
                this.userInput.shift();
            }
            
            if (this.userInput.join(',') === this.konamiCode.join(',')) {
                this.activateEasterEgg();
                this.userInput = [];
            }
        });
    }

    activateEasterEgg() {
        // Add rainbow effect to particles
        particleSystem.config.particleCount = 200;
        particleSystem.createParticles();
        
        // Show secret message
        const message = document.createElement('div');
        message.textContent = '🎉 Você encontrou o easter egg! 🎉';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
            background-size: 400% 400%;
            animation: rainbow 2s ease infinite;
            padding: 20px 40px;
            border-radius: 15px;
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }
}

// Initialize easter eggs
new EasterEggs();

// ===== CSS ANIMATIONS FOR EASTER EGG =====
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .notification {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .error {
        border-color: #ff5f57 !important;
    }
`;
document.head.appendChild(style);
