/**
 * ComicVerse Hub - Homepage JavaScript
 * 
 * This file handles all interactive functionality for the homepage,
 * including the hero carousel, dynamic content loading, and navigation.
 */

/**
 * Initialize the homepage when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
    loadNewReleases();
    loadPopularSeries();
    loadPublisherSpotlights();
    initializeMobileMenu();
});

/**
 * Initialize the hero carousel with featured comics
 */
function initializeCarousel() {
    const carouselContainer = document.getElementById('carousel-container');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');
    
    if (!carouselContainer) return;
    
    // Get featured comics
    const featuredComics = getFeaturedComics();
    
    if (featuredComics.length === 0) {
        carouselContainer.innerHTML = '<div class="carousel-slide active"><div class="carousel-content"><h2>Welcome to ComicVerse Hub</h2><p>Your ultimate destination for comic books!</p></div></div>';
        return;
    }
    
    // Create carousel slides
    featuredComics.forEach((comic, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        slide.setAttribute('data-slide-index', index);
        
        // Create slide content
        slide.innerHTML = `
            <img src="${comic.coverImage}" alt="${comic.title}" onerror="this.style.display='none'">
            <div class="carousel-content">
                <h2>${comic.title}</h2>
                <p>${comic.synopsis.substring(0, 150)}...</p>
                <a href="comic-detail.html?id=${comic.id}" class="carousel-btn">View Details</a>
            </div>
        `;
        
        carouselContainer.appendChild(slide);
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.setAttribute('data-slide-index', index);
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    // Set up carousel controls
    let currentSlide = 0;
    const totalSlides = featuredComics.length;
    
    function goToSlide(index) {
        // Remove active class from all slides and indicators
        document.querySelectorAll('.carousel-slide').forEach(slide => {
            slide.classList.remove('active');
        });
        document.querySelectorAll('.carousel-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active class to current slide and indicator
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        if (slides[index] && indicators[index]) {
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            currentSlide = index;
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    }
    
    // Attach event listeners
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }
    
    // Auto-advance carousel every 5 seconds
    let carouselInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    const heroCarousel = document.getElementById('hero-carousel');
    if (heroCarousel) {
        heroCarousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        heroCarousel.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextSlide, 5000);
        });
    }
}

/**
 * Load and display new releases
 */
function loadNewReleases() {
    const grid = document.getElementById('new-releases-grid');
    if (!grid) return;
    
    // Get comics sorted by release date (newest first)
    const newReleases = [...COMICS_DATA]
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
        .slice(0, 6); // Show 6 newest releases
    
    if (newReleases.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--color-text-muted);">No new releases available.</p>';
        return;
    }
    
    newReleases.forEach(comic => {
        grid.appendChild(createComicCard(comic));
    });
}

/**
 * Load and display popular series
 */
function loadPopularSeries() {
    const grid = document.getElementById('popular-series-grid');
    if (!grid) return;
    
    const popularComics = getPopularComics().slice(0, 6); // Show 6 popular comics
    
    if (popularComics.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--color-text-muted);">No popular series available.</p>';
        return;
    }
    
    popularComics.forEach(comic => {
        grid.appendChild(createComicCard(comic));
    });
}

/**
 * Load and display publisher spotlights
 */
function loadPublisherSpotlights() {
    // Marvel Comics
    const marvelGrid = document.getElementById('marvel-grid');
    if (marvelGrid) {
        const marvelComics = getComicsByPublisher('Marvel').slice(0, 4);
        marvelComics.forEach(comic => {
            marvelGrid.appendChild(createComicCard(comic));
        });
    }
    
    // DC Comics
    const dcGrid = document.getElementById('dc-grid');
    if (dcGrid) {
        const dcComics = getComicsByPublisher('DC').slice(0, 4);
        dcComics.forEach(comic => {
            dcGrid.appendChild(createComicCard(comic));
        });
    }
    
    // Image Comics
    const imageGrid = document.getElementById('image-grid');
    if (imageGrid) {
        const imageComics = getComicsByPublisher('Image').slice(0, 4);
        imageComics.forEach(comic => {
            imageGrid.appendChild(createComicCard(comic));
        });
    }
}

/**
 * Create a comic card element
 * @param {Object} comic - The comic object
 * @returns {HTMLElement} - The comic card element
 */
function createComicCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card';
    card.setAttribute('data-comic-id', comic.id);
    
    const isWishlisted = isInWishlist(comic.id);
    
    card.innerHTML = `
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" 
                data-comic-id="${comic.id}" 
                aria-label="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
        </button>
        <div class="comic-card-image">
            <img src="${comic.coverImage}" alt="${comic.title}" 
                 onerror="this.parentElement.innerHTML='${comic.title.substring(0, 20)}...'"
                 style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="comic-card-content">
            <h3 class="comic-card-title">${comic.title}</h3>
            <p class="comic-card-publisher">${comic.publisher}</p>
            <p class="comic-card-price">${formatPrice(comic.price)}</p>
        </div>
    `;
    
    // Add click handlers
    const wishlistBtn = card.querySelector('.wishlist-btn');
    
    // Wishlist button handler
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWishlist(comic.id);
            updateWishlistButtons();
            // Update this button's state
            if (isInWishlist(comic.id)) {
                wishlistBtn.classList.add('active');
                wishlistBtn.setAttribute('aria-label', 'Remove from wishlist');
            } else {
                wishlistBtn.classList.remove('active');
                wishlistBtn.setAttribute('aria-label', 'Add to wishlist');
            }
        });
    }
    
    // Navigate to detail page on card click (except wishlist button)
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.wishlist-btn')) {
            window.location.href = `comic-detail.html?id=${comic.id}`;
        }
    });
    
    return card;
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    }
}

