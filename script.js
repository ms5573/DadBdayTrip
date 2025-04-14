// Initialize the website functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Robert\'s Japan Trip website loaded');
    
    // Single initialization of all components
    initializeWebsite();
    
    // Initialize the map separately after other components
    initMap();
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
    const nav = document.querySelector('nav');
    
    // Create mobile menu button
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-button';
    menuButton.innerHTML = '☰';
    nav.insertBefore(menuButton, nav.firstChild);

    // Toggle mobile menu
    menuButton.addEventListener('click', () => {
        nav.classList.toggle('mobile-menu-open');
        menuButton.innerHTML = nav.classList.contains('mobile-menu-open') ? '✕' : '☰';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && nav.classList.contains('mobile-menu-open')) {
            nav.classList.remove('mobile-menu-open');
            menuButton.innerHTML = '☰';
        }
    });

    // Add touch events for smoother scrolling
    let touchStartY = 0;
    let touchStartTime = 0;

    document.addEventListener('touchstart', function(e) {
        // Skip if the touch is within the map container
        if (e.target.closest('#japan-trip-map')) return;
        
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, false);

    document.addEventListener('touchend', function(e) {
        // Skip if the touch is within the map container
        if (e.target.closest('#japan-trip-map')) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        const distance = touchEndY - touchStartY;
        const duration = touchEndTime - touchStartTime;
        const velocity = Math.abs(distance / duration);

        if (velocity > 0.5) {
            const scrollAmount = distance * 2;
            window.scrollBy({
                top: -scrollAmount,
                behavior: 'smooth'
            });
        }
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
let japanMap; // Global variable to track if map is initialized
function initMap() {
    // Check if map is already initialized
    if (japanMap) {
        console.log('Map already initialized, skipping...');
        return;
    }
    
    const mapContainer = document.getElementById('japan-trip-map');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }
    
    // Create map centered on Japan with adjusted zoom level for better overview
    japanMap = L.map('japan-trip-map').setView([36.2048, 138.2529], 6);
    
    // Add a cleaner tile layer with less detail
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 18
    }).addTo(japanMap);
    
    // Simplified custom icons for different types of locations
    const icons = {
        start: L.divIcon({
            className: 'custom-marker start-marker',
            html: '<div class="marker-dot"></div><div class="pulse"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        }),
        destination: L.divIcon({
            className: 'custom-marker destination-marker',
            html: '<div class="marker-dot"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        }),
        dayTrip: L.divIcon({
            className: 'custom-marker day-trip-marker',
            html: '<div class="marker-dot"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        }),
        end: L.divIcon({
            className: 'custom-marker end-marker',
            html: '<div class="marker-dot"></div><div class="pulse"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        })
    };
    
    // Define key locations from the itinerary with clear English names
    const locations = [
        {
            name: "Tokyo (Start)",
            coords: [35.6762, 139.6503],
            days: [1, 2, 3],
            type: "start",
            description: "Days 1-3: Exploring Asakusa, Ginza, Meiji Shrine, Harajuku and Shibuya"
        },
        {
            name: "Yokohama",
            coords: [35.4437, 139.6380],
            days: [4, 5],
            type: "destination",
            description: "Days 4-5: Visiting Kamakura and celebrating Robert's 70th birthday"
        },
        {
            name: "Hakone",
            coords: [35.2323, 139.1071],
            days: [6, 7],
            type: "destination",
            description: "Days 6-7: Hot springs (onsen), Lake Ashi cruise and Mt. Fuji views"
        },
        {
            name: "Kyoto",
            coords: [35.0116, 135.7681],
            days: [8, 9, 10, 11],
            type: "destination",
            description: "Days 8-11: Historic temples, bamboo grove, and traditional culture"
        },
        {
            name: "Himeji",
            coords: [34.8397, 134.6937],
            days: [12],
            type: "destination",
            description: "Day 12: Visit to Japan's most spectacular feudal castle"
        },
        {
            name: "Hiroshima",
            coords: [34.3853, 132.4553],
            days: [12, 13],
            type: "destination",
            description: "Days 12-13: Peace Memorial Park and Museum"
        },
        {
            name: "Kanazawa",
            coords: [36.5626, 136.6562],
            days: [14, 15],
            type: "destination",
            description: "Days 14-15: Kenroku-en Garden, samurai district, and traditional crafts"
        },
        {
            name: "Tokyo (End)",
            coords: [35.6762, 139.6503],
            days: [16, 17, 18],
            type: "end",
            description: "Days 16-18: Final shopping, farewell dinner, and departure"
        }
    ];
    
    // Only include the most significant day trips
    const dayTrips = [
        {
            name: "Nara",
            coords: [34.6851, 135.8048],
            days: [11],
            type: "dayTrip",
            fromLocation: "Kyoto",
            description: "Day 11: Famous deer park and Todai-ji Temple with giant Buddha"
        },
        {
            name: "Miyajima",
            coords: [34.2962, 132.3194],
            days: [13],
            type: "dayTrip",
            fromLocation: "Hiroshima",
            description: "Day 13: Island with iconic floating torii gate"
        }
    ];
    
    // Combine all locations for display
    const allLocations = [...locations, ...dayTrips];
    
    // Add markers and popups for each location
    const markers = {};
    allLocations.forEach(location => {
        const icon = icons[location.type];
        const marker = L.marker(location.coords, { icon: icon }).addTo(japanMap);
        
        // Add text label for main destinations
        if (location.type !== "dayTrip") {
            L.marker(location.coords, {
                icon: L.divIcon({
                    className: 'map-label',
                    html: `<div>${location.name}</div>`,
                    iconSize: [100, 20],
                    iconAnchor: [50, -10]
                })
            }).addTo(japanMap);
        }
        
        // Create simplified popup content
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
    
    // Draw simplified main route line with more subtle styling
    const mainRouteCoords = locations.map(loc => loc.coords);
    
    const mainRoute = L.polyline(mainRouteCoords, {
        color: '#e91e63',
        weight: 2,
        opacity: 0.5,
        dashArray: '5, 10',
        lineCap: 'round'
    }).addTo(japanMap);
    
    // Draw selected day trip routes with even more subtle styling
    dayTrips.forEach(dayTrip => {
        const fromDestination = locations.find(loc => loc.name === dayTrip.fromLocation);
        
        if (fromDestination) {
            L.polyline([fromDestination.coords, dayTrip.coords], {
                color: '#2196F3',
                weight: 1.5,
                opacity: 0.4,
                dashArray: '3, 6',
                lineCap: 'round'
            }).addTo(japanMap);
        }
    });
    
    // Ensure map fits all locations
    const bounds = L.latLngBounds(allLocations.map(loc => loc.coords));
    japanMap.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 7
    });
}

// Add the missing setupNavigation function
function setupNavigation() {
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
    
    // Update active link on scroll
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    
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

// Connect all the initialization code in one function
function initializeWebsite() {
    setupNavigation();
    setupDaySelectors();
    setupCollapsibleSections();
    setupSectionAnimations();
    setupBackToTopButton();
    setupMobileNav(); // Add mobile navigation setup
}

// Add setupDaySelectors function
function setupDaySelectors() {
    const dayButtons = document.querySelectorAll('.day-buttons button');
    const dayCards = document.querySelectorAll('.day-card');
    
    // Create mobile-specific navigation for itinerary
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        createMobileItineraryNav(dayButtons, dayCards);
    }
    
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
    dayButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the day number from data attribute
            const dayNumber = this.getAttribute('data-day');
            
            // Remove active class from all buttons
            dayButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all day cards
            dayCards.forEach(card => {
                card.style.display = 'none';
            });
            
            // Show the corresponding day card
            const targetCard = document.querySelector(`.day-card[data-day="${dayNumber}"]`);
            if (targetCard) {
                targetCard.style.display = 'flex';
                
                // Scroll to day card for better user experience
                const headerOffset = 70; // Account for fixed header
                const elementPosition = targetCard.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update mobile day selector if it exists
                const mobileDaySelector = document.getElementById('mobile-day-selector');
                if (mobileDaySelector) {
                    mobileDaySelector.value = dayNumber;
                }
            }
        });
    });
    
    // Add swipe gesture support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 80; // Minimum swipe distance in pixels
    
    document.addEventListener('touchstart', function(e) {
        // Skip if the touch is within the map container
        if (e.target.closest('#japan-trip-map')) return;
        
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        // Skip if the touch is within the map container
        if (e.target.closest('#japan-trip-map')) return;
        
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        // Only process swipe if we're viewing a day card
        const currentDay = document.querySelector('.day-buttons button.active');
        if (!currentDay) return;
        
        const dayNumber = parseInt(currentDay.getAttribute('data-day'));
        if (isNaN(dayNumber)) return;
        
        // Calculate swipe distance
        const swipeDistance = touchEndX - touchStartX;
        
        // Determine swipe direction and navigate
        if (swipeDistance > swipeThreshold) {
            // Swipe right -> go to previous day
            if (dayNumber > 1) {
                const prevButton = document.querySelector(`.day-buttons button[data-day="${dayNumber - 1}"]`);
                if (prevButton) prevButton.click();
            }
        } else if (swipeDistance < -swipeThreshold) {
            // Swipe left -> go to next day
            if (dayNumber < 18) {
                const nextButton = document.querySelector(`.day-buttons button[data-day="${dayNumber + 1}"]`);
                if (nextButton) nextButton.click();
            }
        }
    }
    
    // Auto-scroll day selector to show active day
    function scrollDayButtonIntoView(dayNumber) {
        const dayButton = document.querySelector(`.day-buttons button[data-day="${dayNumber}"]`);
        if (dayButton) {
            const buttonContainer = document.querySelector('.day-buttons');
            const buttonRect = dayButton.getBoundingClientRect();
            const containerRect = buttonContainer.getBoundingClientRect();
            
            // Calculate position to center the button
            const scrollLeft = buttonContainer.scrollLeft + 
                               buttonRect.left - 
                               containerRect.left - 
                               containerRect.width / 2 + 
                               buttonRect.width / 2;
            
            buttonContainer.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }
    
    // Center active day button when page loads (desktop only)
    if (!isMobile) {
        const activeButton = document.querySelector('.day-buttons button.active');
        if (activeButton) {
            const dayNumber = activeButton.getAttribute('data-day');
            scrollDayButtonIntoView(dayNumber);
        }
    }
    
    // Modify the createMobileItineraryNav function to improve the layout
    function createMobileItineraryNav(dayButtons, dayCards) {
        // Hide the original day buttons on mobile
        const dayButtonsContainer = document.querySelector('.day-buttons');
        if (dayButtonsContainer) {
            dayButtonsContainer.classList.add('desktop-only');
        }
        
        // Create mobile navigation container
        const mobileNavContainer = document.createElement('div');
        mobileNavContainer.className = 'mobile-itinerary-nav';
        
        // Create day dropdown
        const daySelector = document.createElement('select');
        daySelector.id = 'mobile-day-selector';
        
        // Create prev/next buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'mobile-nav-btn prev-day';
        prevButton.innerHTML = '&larr;';
        prevButton.setAttribute('aria-label', 'Previous Day');
        
        const nextButton = document.createElement('button');
        nextButton.className = 'mobile-nav-btn next-day';
        nextButton.innerHTML = '&rarr;';
        nextButton.setAttribute('aria-label', 'Next Day');
        
        // Add options to day selector
        dayButtons.forEach(button => {
            const dayNum = button.getAttribute('data-day');
            const option = document.createElement('option');
            option.value = dayNum;
            option.textContent = `Day ${dayNum}`;
            daySelector.appendChild(option);
        });
        
        // Add event listener to day selector
        daySelector.addEventListener('change', function() {
            const selectedDay = this.value;
            const dayButton = document.querySelector(`.day-buttons button[data-day="${selectedDay}"]`);
            if (dayButton) {
                dayButton.click();
            }
        });
        
        // Add event listeners to prev/next buttons
        prevButton.addEventListener('click', function() {
            const currentDay = document.querySelector('.day-buttons button.active');
            if (!currentDay) return;
            
            const dayNumber = parseInt(currentDay.getAttribute('data-day'));
            if (dayNumber > 1) {
                const prevButton = document.querySelector(`.day-buttons button[data-day="${dayNumber - 1}"]`);
                if (prevButton) prevButton.click();
            }
        });
        
        nextButton.addEventListener('click', function() {
            const currentDay = document.querySelector('.day-buttons button.active');
            if (!currentDay) return;
            
            const dayNumber = parseInt(currentDay.getAttribute('data-day'));
            if (dayNumber < dayButtons.length) {
                const nextButton = document.querySelector(`.day-buttons button[data-day="${dayNumber + 1}"]`);
                if (nextButton) nextButton.click();
            }
        });
        
        // Create a navigation row for buttons and selector
        const navRow = document.createElement('div');
        navRow.className = 'mobile-nav-row';
        
        // Add elements to container - no label to save space on mobile
        navRow.appendChild(prevButton);
        navRow.appendChild(daySelector);
        navRow.appendChild(nextButton);
        mobileNavContainer.appendChild(navRow);
        
        // Add current day info display
        const currentDayInfo = document.createElement('div');
        currentDayInfo.className = 'current-day-info';
        currentDayInfo.textContent = 'Day 1';
        mobileNavContainer.appendChild(currentDayInfo);
        
        // Insert mobile nav before the first day card
        const firstDayCard = document.querySelector('.day-card[data-day="1"]');
        if (firstDayCard && firstDayCard.parentNode) {
            firstDayCard.parentNode.insertBefore(mobileNavContainer, firstDayCard);
        }
        
        // Update current day info when changing days
        function updateCurrentDayInfo(dayNumber) {
            const dayCard = document.querySelector(`.day-card[data-day="${dayNumber}"]`);
            if (dayCard && currentDayInfo) {
                const dayTitle = dayCard.querySelector('h3').textContent;
                const daySubtitle = dayCard.querySelector('h4').textContent;
                currentDayInfo.innerHTML = `<strong>${dayTitle}</strong><span>${daySubtitle}</span>`;
            }
        }
        
        // Initialize with day 1
        updateCurrentDayInfo(1);
        
        // Update current day info when day changes
        dayButtons.forEach(button => {
            button.addEventListener('click', function() {
                const dayNumber = this.getAttribute('data-day');
                updateCurrentDayInfo(dayNumber);
            });
        });
    }
    
    // Handle window resize to recreate mobile nav if needed
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 768;
        const mobileNavExists = document.querySelector('.mobile-itinerary-nav');
        
        if (isMobile && !mobileNavExists) {
            createMobileItineraryNav(dayButtons, dayCards);
        } else if (!isMobile && mobileNavExists) {
            mobileNavExists.remove();
            const dayButtonsContainer = document.querySelector('.day-buttons');
            if (dayButtonsContainer) {
                dayButtonsContainer.classList.remove('desktop-only');
            }
        }
    });
}

// Add setupCollapsibleSections function
function setupCollapsibleSections() {
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

// Add setupBackToTopButton function
function setupBackToTopButton() {
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