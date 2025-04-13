// Initialize the website functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Robert\'s Japan Trip website loaded');
    
    // Make all content visible immediately
    document.querySelectorAll('.fade-in, .slide-in').forEach(element => {
        element.classList.add('visible');
    });
    
    // Initialize collapsible content
    initCollapsible();
    
    // Initialize day cards
    initDayCards();
    
    // Initialize animations
    initAnimations();
    
    // Initialize back-to-top button
    initBackToTop();
    
    // Initialize ripple effect
    initRippleEffect();
    
    // Initialize navigation menu links
    initNavLinks();

    // Handle day navigation
    const dayLinks = document.querySelectorAll('.day-links a');
    const dayCards = document.querySelectorAll('.day-card');

    dayLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            dayLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target day from the href
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all day cards
            dayCards.forEach(card => {
                card.style.display = 'none';
            });
            
            // Show the target day card
            const targetCard = document.getElementById(targetId);
            if (targetCard) {
                targetCard.style.display = 'block';
            }
        });
    });

    // Handle collapsible content
    const collapsibleTriggers = document.querySelectorAll('.collapsible-trigger');
    
    collapsibleTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });

    // Initialize collapsible content styling
    document.querySelectorAll('.collapsible-content').forEach(content => {
        content.style.maxHeight = null;
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.3s ease-out';
    });

    // Animation toggle
    const animationsToggle = document.getElementById('animations-toggle');
    const body = document.body;
    
    animationsToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('animations-enabled');
        } else {
            body.classList.remove('animations-enabled');
        }
    });

    // Ensure first day card is visible
    if (dayCards.length > 0) {
        dayCards.forEach(card => {
            card.style.display = 'none';
        });
        dayCards[0].style.display = 'block';
    }

    // Add ripple effect to elements with the 'ripple' class
    const rippleElements = document.querySelectorAll('.ripple');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Fix for day card styling
    document.querySelectorAll('.day-card').forEach(card => {
        // Ensure day cards have proper styling
        card.style.backgroundColor = 'var(--gofun)';
        card.style.marginBottom = '1.5rem';
        card.style.borderRadius = '5px';
        card.style.overflow = 'hidden';
        card.style.boxShadow = '0 2px 10px var(--shadow-light)';
    });

    // Fix for day card headers
    document.querySelectorAll('.day-header').forEach(header => {
        header.style.backgroundColor = 'var(--sumi)';
        header.style.color = 'var(--gofun)';
        header.style.padding = '1.25rem';
    });

    // Fix for day card content
    document.querySelectorAll('.day-body').forEach(body => {
        body.style.padding = '1.5rem';
        body.style.display = 'grid';
        body.style.gridTemplateColumns = '1fr 2fr';
        body.style.gap = '1.5rem';
    });

    document.querySelectorAll('.day-header h3').forEach(h3 => {
        h3.style.color = 'var(--gofun)';
        h3.style.marginBottom = '0.5rem';
    });

    document.querySelectorAll('.day-header h4').forEach(h4 => {
        h4.style.color = 'rgba(255, 255, 255, 0.85)';
        h4.style.fontWeight = '400';
        h4.style.fontSize = '1.1rem';
        h4.style.margin = '0';
    });

    // Image placeholder styling
    document.querySelectorAll('.image-placeholder').forEach(img => {
        img.style.backgroundColor = '#e9e9e9';
        img.style.height = '0';
        img.style.paddingBottom = '100%';
        img.style.position = 'relative';
        img.style.borderRadius = '5px';
    });

    // Activities list styling
    document.querySelectorAll('.activities-list li').forEach(item => {
        item.style.marginBottom = '0.5rem';
        item.style.position = 'relative';
        item.style.paddingLeft = '1rem';
    });

    document.querySelectorAll('.activities-list li').forEach(item => {
        item.style.listStyleType = 'none';
        item.style.position = 'relative';
        
        // Add custom bullet points
        const bullet = document.createElement('span');
        bullet.style.position = 'absolute';
        bullet.style.left = '0';
        bullet.style.top = '0.6rem';
        bullet.style.width = '6px';
        bullet.style.height = '6px';
        bullet.style.backgroundColor = 'var(--shu)';
        bullet.style.borderRadius = '50%';
        
        item.insertBefore(bullet, item.firstChild);
    });
    
    // Call all the initialization functions
    implementSmoothScrolling();
    setupNavHighlighting();
    setupMobileNav();
    setupSectionAnimations();
    setupParallax();
});

// Smooth scrolling implementation
function implementSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Offset for fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup navigation highlighting based on scroll position
function setupNavHighlighting() {
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', function() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 150) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    });
}

// Setup mobile navigation menu
function setupMobileNav() {
    // Add mobile menu button to the header
    const header = document.querySelector('header');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    mobileMenuBtn.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    header.appendChild(mobileMenuBtn);
    
    // Add event listener to toggle menu
    const navMenu = document.querySelector('nav ul');
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('show');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('show');
        }
    });
    
    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('show');
        });
    });
}

// Setup section animations on scroll
function setupSectionAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const slideElements = document.querySelectorAll('.slide-in');
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    slideElements.forEach(element => {
        observer.observe(element);
    });
}

// Setup parallax effect
function setupParallax() {
    const parallaxElement = document.querySelector('.header-parallax');
    
    if (!parallaxElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        if (scrollPosition < 600) { // Only apply within header view
            parallaxElement.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
    });
}

// Placeholder for future itinerary data loading
function loadItineraryData() {
    // This would fetch data from a JSON file or API
    console.log('Itinerary data would load here');
}

// Placeholder for future photo gallery functionality
function setupGallery() {
    // This would handle the photo gallery functionality
    console.log('Photo gallery would display here');
}

// Placeholder for future map functionality
function initializeMap() {
    // This would initialize an interactive map
    console.log('Map would initialize here');
}

function initNavLinks() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPos = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    });
}

function initCollapsible() {
    const triggers = document.querySelectorAll('.collapsible-trigger');
    
    triggers.forEach(trigger => {
        // Set initial state - make content visible by default
        const content = trigger.nextElementSibling;
        content.style.display = 'block';
        
        trigger.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });
}

function initDayCards() {
    const dayButtons = document.querySelectorAll('.day-buttons button');
    const dayCards = document.querySelectorAll('.day-card');
    
    // Set initial state - only show first day
    dayCards.forEach((card, index) => {
        card.style.display = index === 0 ? 'block' : 'none';
    });
    
    if (dayButtons.length > 0) {
        dayButtons[0].classList.add('active');
    }

    // Add click handlers to day buttons
    dayButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Toggle active class
            dayButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected day card, hide others
            dayCards.forEach((card, cardIndex) => {
                card.style.display = cardIndex === index ? 'block' : 'none';
            });
        });
    });
}

function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show/hide based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.style.opacity = '1';
            } else {
                backToTopButton.style.opacity = '0';
            }
        });
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function initRippleEffect() {
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.classList.contains('day-selector button') || 
            target.classList.contains('back-to-top') || 
            target.tagName === 'BUTTON') {
            
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            target.appendChild(ripple);
            
            setTimeout(function() {
                ripple.remove();
            }, 600);
        }
    });
}