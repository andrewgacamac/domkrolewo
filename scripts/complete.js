// Complete Single-Page Website JavaScript
(function() {
    'use strict';
    
    // DOM Elements
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const sections = document.querySelectorAll('section');
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initSmoothScroll();
        initScrollSpy();
        initNavScroll();
        initLazyLoading();
        initGalleryEffects();
        initAnimations();
        initCounters();
    });
    
    // Mobile Menu
    function initMobileMenu() {
        if (!mobileMenuToggle || !navMenu) return;
        
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
        
        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                resetHamburger();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                resetHamburger();
            }
        });
    }
    
    function resetHamburger() {
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }
    
    // Smooth Scrolling
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = 80; // Account for fixed nav
                        const targetPosition = target.offsetTop - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Handle CTA buttons
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            if (!link.closest('.nav-menu')) {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href.length > 1) {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            const offset = 80;
                            const targetPosition = target.offsetTop - offset;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            }
        });
    }
    
    // Scroll Spy - Highlight active section in nav
    function initScrollSpy() {
        const observerOptions = {
            rootMargin: '-25% 0px -70% 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    updateActiveNavLink(id);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            if (section.getAttribute('id')) {
                observer.observe(section);
            }
        });
    }
    
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + activeId) {
                link.classList.add('active');
            }
        });
    }
    
    // Navigation scroll effects
    function initNavScroll() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add shadow when scrolled
            if (currentScroll > 50) {
                nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
            
            // Hide/show nav on scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // Lazy Loading for Images
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src; // Trigger load
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Gallery hover effects
    function initGalleryEffects() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
            
            // Optional: Add lightbox functionality
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    openLightbox(img.src, img.alt);
                }
            });
        });
    }
    
    // Simple lightbox
    function openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${src}" alt="${alt}">
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Close lightbox
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.className === 'lightbox-close') {
                lightbox.remove();
            }
        });
        
        // Close with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.querySelector('.lightbox')) {
                document.querySelector('.lightbox').remove();
            }
        });
    }
    
    // Add animation on scroll
    function initAnimations() {
        const animateElements = document.querySelectorAll('.reason-card, .stat-card, .perspective-item, .location-card, .season, .advantage');
        
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    animateObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(el => animateObserver.observe(el));
    }
    
    // Animated counters for stats
    function initCounters() {
        const counters = document.querySelectorAll('.stat-value');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const text = counter.textContent;
                    
                    // Check if it's a number we can animate
                    if (text.includes('k') && !text.includes('€')) {
                        const finalValue = parseInt(text.replace('k', ''));
                        animateValue(counter, 0, finalValue, 2000, 'k');
                    } else if (text.includes('%')) {
                        const finalValue = parseInt(text.replace('%', ''));
                        animateValue(counter, 0, finalValue, 2000, '%');
                    }
                    
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
    
    function animateValue(element, start, end, duration, suffix) {
        const startTime = Date.now();
        const originalText = element.textContent;
        
        function update() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuad = 1 - (1 - progress) * (1 - progress);
            const currentValue = Math.floor(start + (end - start) * easeOutQuad);
            
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = originalText; // Restore original text
            }
        }
        
        update();
    }
    
    // Add lightbox styles dynamically
    const lightboxStyles = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .lightbox-content img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 3rem;
            cursor: pointer;
            transition: opacity 0.3s ease;
        }
        
        .lightbox-close:hover {
            opacity: 0.7;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = lightboxStyles;
    document.head.appendChild(styleSheet);
    
    // Preload hero image for better performance
    const heroImg = new Image();
    heroImg.src = 'assets/widok-frontowy-zewnetrzny.jpg';
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === ' ') {
            const currentSection = Array.from(sections).find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top > 100;
            });
            
            if (currentSection) {
                e.preventDefault();
                currentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
    
})();