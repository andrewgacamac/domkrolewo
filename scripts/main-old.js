// Main JavaScript for Dom Królewo
(function() {
    'use strict';
    
    // DOM Elements
    const langButtons = document.querySelectorAll('.lang-btn');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Current language state
    let currentLang = localStorage.getItem('preferredLanguage') || 'pl';
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        initLanguage();
        initMobileMenu();
        initSmoothScroll();
        initScrollEffects();
    });
    
    // Language Switching
    function initLanguage() {
        // Set initial language
        translatePage(currentLang);
        updateLanguageButtons(currentLang);
        
        // Add click handlers to language buttons
        langButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                switchLanguage(lang);
            });
        });
    }
    
    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        translatePage(lang);
        updateLanguageButtons(lang);
        updatePageLanguage(lang);
    }
    
    function translatePage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }
    
    function updateLanguageButtons(lang) {
        langButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    function updatePageLanguage(lang) {
        document.documentElement.lang = lang;
        
        // Update meta description based on language
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptions = {
            pl: 'Odkryj swoją autentyczną leśną ucieczkę w Królewie. Rodzinny domek z urokiem z 1994 roku, zaledwie 1 godzinę od Warszawy. Idealna europejska inwestycja z 10%+ rocznym wzrostem.',
            en: 'Discover your authentic forest escape in Królewo, Poland. Family-friendly cottage with 1994 charm, just 1 hour from Warsaw. Perfect European investment with 10%+ annual growth.',
            fr: 'Découvrez votre authentique refuge forestier à Królewo, Pologne. Cottage familial avec le charme de 1994, à seulement 1 heure de Varsovie. Parfait investissement européen avec 10%+ de croissance annuelle.',
            de: 'Entdecken Sie Ihren authentischen Waldrückzugsort in Królewo, Polen. Familienfreundliches Ferienhaus mit dem Charme von 1994, nur 1 Stunde von Warschau. Perfekte europäische Investition mit 10%+ jährlichem Wachstum.'
        };
        
        if (metaDescription && descriptions[lang]) {
            metaDescription.content = descriptions[lang];
        }
    }
    
    // Mobile Menu
    function initMobileMenu() {
        if (!mobileMenuToggle || !navMenu) return;
        
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger menu
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
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // Smooth Scrolling
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offset = 80; // Account for fixed header
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Scroll Effects
    function initScrollEffects() {
        const header = document.querySelector('.main-nav');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            // Add shadow to header when scrolled
            if (currentScroll > 50) {
                header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = '';
            }
            
            // Hide scroll indicator when scrolled
            if (scrollIndicator && currentScroll > 100) {
                scrollIndicator.style.opacity = '0';
            } else if (scrollIndicator) {
                scrollIndicator.style.opacity = '1';
            }
            
            lastScroll = currentScroll;
        });
        
        // Reveal elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe elements
        const elementsToObserve = document.querySelectorAll('.prop-card, .stat, .content-section');
        elementsToObserve.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
})();