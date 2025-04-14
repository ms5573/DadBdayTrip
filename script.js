// Initialize the website functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Robert\'s Japan Trip website loaded');
    
    // Initialize all components
    initCollapsible();
    initDayCards();
    initBackToTop();
    initNavLinks();
    initMap(); // Initialize the Japan trip map
    
    // Make all content visible with animations
    document.querySelectorAll('.fade-in, .slide-in').forEach(element => {
        element.classList.add('visible');
    });

    // Initialize smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Remove any code that might be duplicate or conflicting
    // with our initialization functions
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

// Initialize the map with trip locations
function initMap() {
    // Create map centered on Japan
    const map = L.map('japan-trip-map').setView([36.2048, 138.2529], 5);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Custom icons for different types of locations
    const icons = {
        start: L.divIcon({
            className: 'custom-marker start-marker',
            html: '<div class="marker-dot"></div><div class="pulse"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        }),
        destination: L.divIcon({
            className: 'custom-marker destination-marker',
            html: '<div class="marker-dot"></div><div class="pulse"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        }),
        dayTrip: L.divIcon({
            className: 'custom-marker day-trip-marker',
            html: '<div class="marker-dot"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        }),
        end: L.divIcon({
            className: 'custom-marker end-marker',
            html: '<div class="marker-dot"></div><div class="pulse"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    };
    
    // Define locations
    const locations = [
        {
            name: "Tokyo (Arrival)",
            coords: [35.6762, 139.6503],
            days: [1, 2, 3, 17, 18],
            type: "start",
            description: "Starting point of our journey. We'll explore different areas of Tokyo, from traditional Asakusa to modern Shibuya."
        },
        {
            name: "Hakone",
            coords: [35.2323, 139.1071],
            days: [4, 5],
            type: "destination",
            description: "Relaxing in hot springs (onsen) with views of Mt. Fuji and Lake Ashi."
        },
        {
            name: "Kyoto",
            coords: [35.0116, 135.7681],
            days: [6, 7, 8, 9],
            type: "destination",
            description: "Exploring Japan's ancient capital with its numerous temples, shrines, and traditional gardens."
        },
        {
            name: "Nara",
            coords: [34.6851, 135.8048],
            days: [8],
            type: "dayTrip",
            description: "Day trip to see the famous deer park and Todai-ji Temple with its giant Buddha statue."
        },
        {
            name: "Hiroshima",
            coords: [34.3853, 132.4553],
            days: [10, 11],
            type: "destination",
            description: "Visiting the Peace Memorial Park and Museum, and experiencing the city's rebirth and resilience."
        },
        {
            name: "Miyajima",
            coords: [34.2962, 132.3194],
            days: [11],
            type: "dayTrip",
            description: "Day trip to see the famous floating torii gate and beautiful island scenery."
        },
        {
            name: "Himeji",
            coords: [34.8397, 134.6937],
            days: [12],
            type: "destination",
            description: "Visiting Japan's most spectacular feudal castle, known as the White Heron Castle."
        },
        {
            name: "Kanazawa",
            coords: [36.5626, 136.6562],
            days: [13, 14],
            type: "destination",
            description: "Exploring the well-preserved Edo-era districts, beautiful Kenroku-en Garden, and the 21st Century Museum."
        },
        {
            name: "Takayama",
            coords: [36.1417, 137.2520],
            days: [15, 16],
            type: "destination",
            description: "Experiencing traditional rural Japan in this well-preserved mountain town."
        },
        {
            name: "Shirakawa-go",
            coords: [36.2568, 136.9042],
            days: [15],
            type: "dayTrip",
            description: "Day trip to see the historic thatched-roof houses in this UNESCO World Heritage village."
        },
        {
            name: "Tokyo (Departure)",
            coords: [35.6762, 139.6503],
            days: [17, 18],
            type: "end",
            description: "Final days in Tokyo for last-minute shopping, experiences, and preparing for departure."
        }
    ];
    
    // Add markers and popups for each location
    const markers = {};
    locations.forEach(location => {
        const icon = icons[location.type];
        const marker = L.marker(location.coords, { icon: icon }).addTo(map);
        
        // Create popup content
        const dayLabels = location.days.map(day => `<span class="day-label">Day ${day}</span>`).join(' ');
        const popupContent = `
            <div class="map-popup">
                <h3>${location.name}</h3>
                <p>${dayLabels}</p>
                <p>${location.description}</p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers[location.name] = marker;
    });
    
    // Draw route lines between destinations
    const destinationCoords = locations.filter(loc => 
        loc.type === "start" || loc.type === "destination" || loc.type === "end"
    ).map(loc => loc.coords);
    
    const mainRoute = L.polyline(destinationCoords, {
        color: '#e91e63',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10',
        lineCap: 'round'
    }).addTo(map);
    
    // Draw lines for day trips
    const dayTrips = locations.filter(loc => loc.type === "dayTrip");
    dayTrips.forEach(dayTrip => {
        // Find the main destination this day trip is from
        const dayTripDay = dayTrip.days[0];
        const fromDestination = locations.find(loc => 
            loc.type === "destination" && 
            loc.days.includes(dayTripDay) &&
            loc.name !== dayTrip.name
        );
        
        if (fromDestination) {
            const dayTripRoute = L.polyline([fromDestination.coords, dayTrip.coords], {
                color: '#2196F3',
                weight: 2,
                opacity: 0.6,
                dashArray: '5, 5',
                lineCap: 'round'
            }).addTo(map);
        }
    });
}

// Connect all the initialization code in one function that runs when the page loads
function initializeWebsite() {
    document.addEventListener('DOMContentLoaded', () => {
        setupNavigation();
        setupDaySelectors();
        setupCollapsibleSections();
        setupSectionAnimations();
        setupBackToTopButton();
        initMap(); // Initialize the map
    });
}

// Call the main initialization function
initializeWebsite();

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

    // Hide all collapsible content initially
    document.querySelectorAll('.collapsible-content').forEach(content => {
        content.style.display = 'none';
    });
}

function initDayCards() {
    const dayButtons = document.querySelectorAll('.day-buttons button');
    const dayCards = document.querySelectorAll('.day-card');
    
    // Set first day as active, hide others
    if (dayCards.length > 0 && dayButtons.length > 0) {
        dayCards.forEach((card, index) => {
            if (index === 0) {
                card.style.display = 'flex';
                dayButtons[0].classList.add('active');
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Add click event to each day button
    dayButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            dayButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all day cards
            dayCards.forEach(card => {
                card.style.display = 'none';
            });
            
            // Show the corresponding day card
            if (dayCards[index]) {
                dayCards[index].style.display = 'flex';
                
                // Scroll to day card for better user experience
                dayCards[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
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