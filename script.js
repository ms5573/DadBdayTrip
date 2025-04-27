// Initialize the website functionality
function initializeWebsite() {
    console.log('Robert\'s Japan Trip website loaded');
    
    // Initialize data 
    loadItineraryData().then(() => {
        // After data is loaded, set up option buttons
        setupItineraryOptions();
        setupLanguageOptions();
    }).catch(error => {
        console.error('Error during initialization:', error);
    });
    
    // Set up navigation and UI elements
    setupNavigation();
    setupMobileNav();
    setupSectionAnimations();
    setupParallax();
    setupBackToTopButton();
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeWebsite);

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

// Itinerary data store
let itineraryData = {
    option1: null,
    option2: null,
    option1_de: null,
    option2_de: null,
    activeOption: 'option1',
    activeLanguage: 'en'
};

// Fetch and initialize itinerary data
async function loadItineraryData() {
    try {
        console.log('Loading itinerary data from JSON files...');
        console.log('Fetching option1.json, option2.json, option1-de.json, and option2-de.json');

        const promises = [
            fetch('data/option1.json').then(response => {
                console.log('option1.json response status:', response.status);
                return response;
            }),
            fetch('data/option2.json').then(response => {
                console.log('option2.json response status:', response.status);
                return response;
            }),
            fetch('data/option1-de.json').then(response => {
                console.log('option1-de.json response status:', response.status);
                return response;
            }).catch(err => {
                console.warn('Error fetching option1-de.json:', err);
                return { json: () => ({ }) };
            }),
            fetch('data/option2-de.json').then(response => {
                console.log('option2-de.json response status:', response.status);
                return response;
            }).catch(err => {
                console.warn('Error fetching option2-de.json:', err);
                return { json: () => ({ }) };
            })
        ];

        const [option1Response, option2Response, option1DeResponse, option2DeResponse] = await Promise.all(promises);
        
        console.log('All JSON responses received');
        
        try {
            itineraryData.option1 = await option1Response.json();
            console.log('option1 data loaded with', itineraryData.option1.length, 'days');
        } catch (e) {
            console.error('Failed to parse option1.json:', e);
            itineraryData.option1 = [];
        }

        try {
            itineraryData.option2 = await option2Response.json();
            console.log('option2 data loaded with', itineraryData.option2.length, 'days');
        } catch (e) {
            console.error('Failed to parse option2.json:', e);
            itineraryData.option2 = [];
        }
        
        // Load German data if available
        try {
            itineraryData.option1_de = await option1DeResponse.json();
            console.log('option1_de data loaded with', itineraryData.option1_de.length, 'days');
        } catch (e) {
            console.warn('Could not load option1-de.json data:', e);
            itineraryData.option1_de = null;
        }
        
        try {
            itineraryData.option2_de = await option2DeResponse.json();
            console.log('option2_de data loaded with', itineraryData.option2_de.length, 'days');
        } catch (e) {
            console.warn('Could not load option2-de.json data:', e);
            itineraryData.option2_de = null;
        }
        
        console.log('Itinerary data loaded:', {
            option1: itineraryData.option1 ? itineraryData.option1.length : 0,
            option2: itineraryData.option2 ? itineraryData.option2.length : 0,
            option1_de: itineraryData.option1_de ? itineraryData.option1_de.length : 0,
            option2_de: itineraryData.option2_de ? itineraryData.option2_de.length : 0
        });
        
        // Initialize with first option by default
        const currentData = getCurrentItineraryData();
        console.log('Current itinerary data has', currentData.length, 'days');
        
        renderItinerary(currentData);
        
        // Initialize map with the active option data
        initMap(currentData);
        
        // Return a resolved promise to indicate success
        return Promise.resolve();
    } catch (error) {
        console.error('Error loading itinerary data:', error);
        // Return a rejected promise to indicate failure
        return Promise.reject(error);
    }
}

// Get the current itinerary data based on active option and language
function getCurrentItineraryData() {
    const { activeOption, activeLanguage } = itineraryData;
    
    if (activeLanguage === 'de') {
        const langOption = `${activeOption}_de`;
        if (itineraryData[langOption]) {
            return normalizeItineraryData(itineraryData[langOption]);
        }
    }
    
    return normalizeItineraryData(itineraryData[activeOption]);
}

// Normalize itinerary data to handle different formats
function normalizeItineraryData(data) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(day => {
        // Handle old format (with highlights as string and links in notes)
        if (typeof day.highlights === 'string') {
            const normalizedDay = {
                ...day,
                highlights: day.highlights ? day.highlights.split(';').map(h => h.trim()) : [],
                helpfulLinks: []
            };
            
            // Extract URLs from notes if present
            if (day.notes && day.notes.includes('http')) {
                normalizedDay.helpfulLinks.push(day.notes);
            }
            
            // Extract URLs from hotel if present
            if (day.hotel && day.hotel.includes('http')) {
                normalizedDay.helpfulLinks.push(day.hotel);
            }
            
            return normalizedDay;
        }
        
        // Handle new format (with highlights as array and helpfulLinks)
        return day;
    });
}

// Switch between itinerary options
function switchItineraryOption(option) {
    console.log('Switching to option:', option);
    if (option !== itineraryData.activeOption) {
        // Store the previous option before updating
        const previousOption = itineraryData.activeOption;
        
        // Update active option in our data store
        itineraryData.activeOption = option;
        
        // Get updated itinerary data with new option
        const newData = getCurrentItineraryData();
        console.log('New itinerary data has', newData.length, 'days');
        
        // Render with new data
        renderItinerary(newData);
        
        // Clear existing map and reinitialize with new data
        const mapContainer = document.getElementById('japan-trip-map');
        if (mapContainer) {
            mapContainer.innerHTML = '';
            initMap(newData);
        }
        
        // Update active button styles - first remove active class from all buttons
        document.querySelectorAll('.route-options .option-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Then add active class to the selected option button
        const activeButton = document.querySelector(`.route-options .option-button[data-option="${option}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            console.log(`Activated button for option: ${option}`);
        } else {
            console.warn(`Could not find button for option: ${option}`);
        }
        
        // Log the change for debugging
        console.log(`Switched from ${previousOption} to ${option}`);
    } else {
        console.log(`Option ${option} is already active`);
    }
}

// Switch between languages
function switchLanguage(language) {
    console.log('Switching to language:', language);
    if (language !== itineraryData.activeLanguage) {
        itineraryData.activeLanguage = language;
        
        // Get updated itinerary data with new language
        const newData = getCurrentItineraryData();
        console.log('New language data has', newData.length, 'days');
        
        // Render with new data
        renderItinerary(newData);
        
        // Update active button styles
        document.querySelectorAll('.language-options .lang-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === language);
        });
    }
}

// Setup itinerary option buttons
function setupItineraryOptions() {
    console.log('Setting up itinerary options');
    const optionButtons = document.querySelectorAll('.route-options .option-button');
    
    // First, remove any active classes that might be there
    optionButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Set active button based on current data
    const activeButton = document.querySelector(`.route-options .option-button[data-option="${itineraryData.activeOption}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Setup click handlers
    optionButtons.forEach(button => {
        // Remove any existing click listeners to avoid duplicates
        button.removeEventListener('click', handleOptionButtonClick);
        
        // Add new click listener
        button.addEventListener('click', handleOptionButtonClick);
    });
}

// Handler for option button clicks
function handleOptionButtonClick() {
    console.log('Option button clicked:', this.dataset.option);
    
    // Remove active class from all buttons first
    document.querySelectorAll('.route-options .option-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to the clicked button
    this.classList.add('active');
    
    // Switch itinerary data
    const option = this.dataset.option;
    switchItineraryOption(option);
}

// Setup language options
function setupLanguageOptions() {
    console.log('Setting up language options');
    const langButtons = document.querySelectorAll('.language-options .lang-button');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Language button clicked:', this.dataset.lang);
            const language = this.dataset.lang;
            switchLanguage(language);
        });
        
        // Set initial active state
        button.classList.toggle('active', button.dataset.lang === itineraryData.activeLanguage);
    });
}

// Convert text with format "Label – URL" into clickable links
function convertToClickableLinks(text) {
    if (!text) return '';
    
    // Match pattern: Text – https://url.com
    // This regex looks for text followed by a dash/hyphen, then a URL
    const linkPattern = /(.+?)(\s+[-–—]\s+)(https?:\/\/[^\s]+)/g;
    
    return text.replace(linkPattern, (match, label, separator, url) => {
        // Return just the label as a clickable link
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });
}

// Render the itinerary from the data
function renderItinerary(data) {
    const itinerarySection = document.querySelector('.itinerary-content');
    if (!itinerarySection || !data) return;
    
    console.log('Rendering itinerary with data:', data);
    
    // Clear existing content
    itinerarySection.innerHTML = '';
    
    // Create day selectors
    const daySelector = document.createElement('div');
    daySelector.className = 'day-selector';
    
    // Create day cards container
    const dayCards = document.createElement('div');
    dayCards.className = 'day-cards';
    
    // Populate data
    data.forEach((day, index) => {
        // Create day button
        const dayButton = document.createElement('button');
        dayButton.className = 'day-button';
        dayButton.textContent = `Day ${day.day}`;
        dayButton.dataset.day = day.day;
        daySelector.appendChild(dayButton);
        
        // Create day card
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        dayCard.dataset.day = day.day;
        dayCard.style.display = index === 0 ? 'block' : 'none';
        
        // Ensure highlights is an array and process for clickable links
        const highlights = Array.isArray(day.highlights) ? day.highlights.map(highlight => convertToClickableLinks(highlight)) : 
                          (typeof day.highlights === 'string' ? day.highlights.split(';').map(h => convertToClickableLinks(h.trim())) : []);
        
        // Process notes and helpfulInfo for clickable links
        const notes = day.notes ? convertToClickableLinks(day.notes) : '';
        const helpfulInfo = day.helpfulInfo ? convertToClickableLinks(day.helpfulInfo) : '';
        const hotel = day.hotel ? convertToClickableLinks(day.hotel) : '';
        
        // Process helpfulLinks for clickable links
        const helpfulLinks = day.helpfulLinks && day.helpfulLinks.length ? 
                             day.helpfulLinks.map(link => convertToClickableLinks(link)) : [];
        
        // Card content with improved design
        dayCard.innerHTML = `
            <div class="day-header">
                <div class="day-header-left">
                    <h3>Day ${day.day}${day.date ? `: ${day.date}` : ''}</h3>
                    <h4 class="day-title">${day.title}</h4>
                </div>
                <div class="day-header-right">
                    ${day.km ? `<span class="travel-stat"><i class="travel-icon">↔️</i>${day.km} km</span>` : ''}
                    ${day.time ? `<span class="travel-stat"><i class="travel-icon">⏱️</i>${day.time}</span>` : ''}
                </div>
            </div>
            <div class="day-content">
                <div class="day-details">
                    ${notes ? `<p class="notes">${notes}</p>` : ''}
                    
                    ${helpfulInfo ? `
                    <div class="helpful-info-section">
                        <h5>Helpful Tips</h5>
                        <p>${helpfulInfo}</p>
                    </div>
                    ` : ''}
                    
                    <div class="collapsible-section">
                        <div class="collapsible-trigger">
                            <h5>Highlights</h5>
                            <span class="toggle-icon">+</span>
                        </div>
                        <div class="collapsible-content">
                            <ul class="highlights-list">
                                ${highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    ${helpfulLinks.length ? `
                    <div class="collapsible-section">
                        <div class="collapsible-trigger">
                            <h5>Helpful Links</h5>
                            <span class="toggle-icon">+</span>
                        </div>
                        <div class="collapsible-content">
                            <ul class="links-list">
                                ${helpfulLinks.map(link => `<li>${link}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    ` : ''}
                    
                    ${hotel ? `
                    <div class="hotel-info">
                        <h5>Accommodation</h5>
                        <p>${hotel}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        dayCards.appendChild(dayCard);
    });
    
    // Add elements to the page
    itinerarySection.appendChild(daySelector);
    itinerarySection.appendChild(dayCards);
    
    // Set up event listeners for the day buttons and collapsible sections
    setupDaySelectors();
    setupCollapsibleSections();
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

// Add setupDaySelectors function
function setupDaySelectors() {
    // Fix the day button selector to match what's actually being created in renderItinerary
    const dayButtons = document.querySelectorAll('.day-selector .day-button');
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
                card.style.display = 'block';
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
            const dayNumber = this.dataset.day;
            
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
                targetCard.style.display = 'block';
                
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
        const currentDay = document.querySelector('.day-selector .day-button.active');
        if (!currentDay) return;
        
        const dayNumber = parseInt(currentDay.dataset.day);
        if (isNaN(dayNumber)) return;
        
        // Calculate swipe distance
        const swipeDistance = touchEndX - touchStartX;
        
        // Determine swipe direction and navigate
        if (swipeDistance > swipeThreshold) {
            // Swipe right -> go to previous day
            if (dayNumber > 1) {
                const prevButton = document.querySelector(`.day-selector .day-button[data-day="${dayNumber - 1}"]`);
                if (prevButton) prevButton.click();
            }
        } else if (swipeDistance < -swipeThreshold) {
            // Swipe left -> go to next day
            if (dayNumber < 18) {
                const nextButton = document.querySelector(`.day-selector .day-button[data-day="${dayNumber + 1}"]`);
                if (nextButton) nextButton.click();
            }
        }
    }
    
    // Auto-scroll day selector to show active day
    function scrollDayButtonIntoView(dayNumber) {
        const dayButton = document.querySelector(`.day-selector .day-button[data-day="${dayNumber}"]`);
        if (dayButton) {
            const buttonContainer = document.querySelector('.day-selector');
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
        const activeButton = document.querySelector('.day-selector .day-button.active');
        if (activeButton) {
            const dayNumber = activeButton.dataset.day;
            scrollDayButtonIntoView(dayNumber);
        }
    }
    
    // Modify the createMobileItineraryNav function to improve the layout
    function createMobileItineraryNav(dayButtons, dayCards) {
        // Hide the original day buttons on mobile
        const dayButtonsContainer = document.querySelector('.day-selector');
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
            const dayButton = document.querySelector(`.day-selector .day-button[data-day="${selectedDay}"]`);
            if (dayButton) {
                dayButton.click();
            }
        });
        
        // Add event listeners to prev/next buttons
        prevButton.addEventListener('click', function() {
            const currentDay = document.querySelector('.day-selector .day-button.active');
            if (!currentDay) return;
            
            const dayNumber = parseInt(currentDay.getAttribute('data-day'));
            if (dayNumber > 1) {
                const prevButton = document.querySelector(`.day-selector .day-button[data-day="${dayNumber - 1}"]`);
                if (prevButton) prevButton.click();
            }
        });
        
        nextButton.addEventListener('click', function() {
            const currentDay = document.querySelector('.day-selector .day-button.active');
            if (!currentDay) return;
            
            const dayNumber = parseInt(currentDay.getAttribute('data-day'));
            if (dayNumber < dayButtons.length) {
                const nextButton = document.querySelector(`.day-selector .day-button[data-day="${dayNumber + 1}"]`);
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
            const dayButtonsContainer = document.querySelector('.day-selector');
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
            
            if (this.classList.contains('active')) {
                // Get the scrollHeight to properly animate the max-height
                const contentHeight = content.scrollHeight;
                content.style.maxHeight = contentHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });

    // Hide all collapsible content initially
    document.querySelectorAll('.collapsible-content').forEach(content => {
        content.style.maxHeight = '0';
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

// Add the missing initMap function
function initMap(itineraryData) {
    console.log('Initializing map with data', itineraryData);
    const mapContainer = document.getElementById('japan-trip-map');
    if (!mapContainer) {
        console.warn('Map container not found');
        return;
    }
    
    if (!itineraryData || !itineraryData.length) {
        console.warn('No itinerary data available for map');
        return;
    }
    
    // Check if Leaflet is available
    if (typeof L === 'undefined') {
        console.error('Leaflet library not available');
        return;
    }
    
    // Center of Japan
    const JAPAN_CENTER = [36.2048, 138.2529];
    const JAPAN_ZOOM = 5;
    
    // Create map and set initial view
    const map = L.map(mapContainer).setView(JAPAN_CENTER, JAPAN_ZOOM);
    
    // Add tile layer (map background)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Create custom marker icons
    const createCustomIcon = (type) => {
        return L.divIcon({
            className: `custom-marker ${type}-marker`,
            html: `<div class="marker-dot"></div>${type !== 'day-trip' ? '<div class="pulse"></div>' : ''}`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    };
    
    // Icons for different types of locations
    const startIcon = createCustomIcon('start');
    const destinationIcon = createCustomIcon('destination');
    const dayTripIcon = createCustomIcon('day-trip');
    const endIcon = createCustomIcon('end');
    
    // Extract location data from itinerary
    const locations = [];
    const markers = [];
    const locationMap = {};
    
    itineraryData.forEach(day => {
        // Skip if no coordinates
        if (!day.lat || !day.lng) return;
        
        // Create a unique key for this location
        const locationKey = `${day.lat},${day.lng}`;
        
        // If we haven't seen this location before, add it
        if (!locationMap[locationKey]) {
            const locationType = day.day === 1 ? 'start' : 
                                day.day === itineraryData.length ? 'end' : 
                                'destination';
            
            locationMap[locationKey] = {
                lat: day.lat,
                lng: day.lng,
                days: [day.day],
                type: locationType,
                name: day.title.split('–').pop().trim(),
                description: day.notes
            };
            
            locations.push(locationMap[locationKey]);
        } else {
            // If we've seen this location before, just add this day to it
            locationMap[locationKey].days.push(day.day);
        }
    });
    
    // Add markers for each location
    locations.forEach(location => {
        const icon = location.type === 'start' ? startIcon :
                     location.type === 'end' ? endIcon :
                     location.type === 'day-trip' ? dayTripIcon :
                     destinationIcon;
        
        const marker = L.marker([location.lat, location.lng], { icon: icon }).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div class="map-popup">
                <h3>${location.name}</h3>
                <p>${location.description}</p>
                <p><strong>Visit:</strong> Day${location.days.length > 1 ? 's' : ''} ${location.days.join(', ')}</p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
    });
    
    // Draw route lines connecting destinations
    const mainDestinations = locations.filter(loc => loc.type !== 'day-trip');
    if (mainDestinations.length > 1) {
        const routePoints = mainDestinations.map(loc => [loc.lat, loc.lng]);
        const routeLine = L.polyline(routePoints, {
            color: '#e91e63',
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 10'
        }).addTo(map);
    }
    
    // Draw lines for day trips
    const dayTrips = locations.filter(loc => loc.type === 'day-trip');
    dayTrips.forEach(trip => {
        // Find the nearest main destination
        let nearestDest = null;
        let minDistance = Infinity;
        
        mainDestinations.forEach(dest => {
            const distance = Math.sqrt(
                Math.pow(trip.lat - dest.lat, 2) + 
                Math.pow(trip.lng - dest.lng, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestDest = dest;
            }
        });
        
        if (nearestDest) {
            const tripLine = L.polyline(
                [[trip.lat, trip.lng], [nearestDest.lat, nearestDest.lng]], 
                {
                    color: '#2196F3',
                    weight: 2,
                    opacity: 0.5,
                    dashArray: '3, 6'
                }
            ).addTo(map);
        }
    });
    
    // Fit map to show all markers if we have any
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }
}