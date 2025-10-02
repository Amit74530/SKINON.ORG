// Mobile menu toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('active');
});

// Fade-in animation on scroll
const fadeElements = document.querySelectorAll('.fade-in');
const fadeInOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeInOnScroll.observe(el));

// Testimonial slider
const testimonialDots = document.querySelectorAll('.testimonials .slider-dot');
const testimonialTrack = document.querySelector('.testimonial-track');

testimonialDots.forEach(dot => {
    dot.addEventListener('click', function() {
        const slideIndex = this.getAttribute('data-slide');
        testimonialTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        testimonialDots.forEach(d => d.classList.remove('active'));
        this.classList.add('active');
    });
});

// Product category filtering
const categoryBtns = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');

// Mobile scroll indicator functionality
function initMobileScrollIndicator() {
    if (window.innerWidth > 768) return;
    
    const productGrid = document.querySelector('.product-grid');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    
    if (!productGrid || !scrollDots.length) return;
    
    function updateScrollIndicator() {
        const scrollPosition = productGrid.scrollLeft;
        const cards = productGrid.querySelectorAll('.product-card');
        
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth + 20; // width + gap
        const activeIndex = Math.round(scrollPosition / cardWidth);
        
        scrollDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }
    
    // Add click functionality to scroll dots
    scrollDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            const cards = productGrid.querySelectorAll('.product-card');
            if (cards.length > 0) {
                const cardWidth = cards[0].offsetWidth + 20;
                productGrid.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    productGrid.addEventListener('scroll', updateScrollIndicator);
    productGrid.hasScrollListener = true;
}

// Main product category filtering
categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        
        // Update active button
        categoryBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Filter products
        productCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Reinitialize mobile scroll indicator after filtering
        if (window.innerWidth <= 768) {
            setTimeout(initMobileScrollIndicator, 100);
        }
    });
});

// Initialize sliders
function initSlider(track, cards, dots, prevBtn, nextBtn) {
    if (!track || cards.length === 0) return;

    let currentSlide = 0;
    const cardWidth = cards[0].offsetWidth + 30; // width + gap
    const visibleCards = Math.floor(track.offsetWidth / cardWidth);
    const totalSlides = Math.ceil(cards.length / visibleCards);

    function updateSlider() {
        const translateX = -currentSlide * cardWidth * visibleCards;
        track.style.transform = `translateX(${translateX}px)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Next button
    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });

    // Previous button
    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });

    updateSlider();
}

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Ingredients slider
    initSlider(
        document.querySelector('.ingredients-track'),
        document.querySelectorAll('.ingredient-card'),
        document.querySelectorAll('.ingredients-slider .slider-dot'),
        document.querySelector('.ingredients-slider .prev-btn'),
        document.querySelector('.ingredients-slider .next-btn')
    );

    // Benefits slider
    initSlider(
        document.querySelector('.benefits-track'),
        document.querySelectorAll('.benefit-card'),
        document.querySelectorAll('.benefits-slider .slider-dot'),
        document.querySelector('.benefits-slider .prev-btn'),
        document.querySelector('.benefits-slider .next-btn')
    );

    // Why Choose slider
    initSlider(
        document.querySelector('.why-choose-track'),
        document.querySelectorAll('.feature-card'),
        document.querySelectorAll('.why-choose-slider .slider-dot'),
        document.querySelector('.why-choose-slider .prev-btn'),
        document.querySelector('.why-choose-slider .next-btn')
    );

    // Mobile scroll indicator
    if (window.innerWidth <= 768) {
        initMobileScrollIndicator();
    }
});



// Simple scroll functionality
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.querySelector('.certifications-horizontal-container');
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            const dots = document.querySelectorAll('.dot');
            
            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    container.scrollBy({ left: 300, behavior: 'smooth' });
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    container.scrollBy({ left: -300, behavior: 'smooth' });
                });
            }
            
            // Update dots based on scroll position
            if (container) {
                container.addEventListener('scroll', function() {
                    const scrollPos = container.scrollLeft;
                    const scrollWidth = container.scrollWidth - container.clientWidth;
                    const dotIndex = Math.floor((scrollPos / scrollWidth) * dots.length);
                    
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === dotIndex);
                    });
                });
            }
            
            // Click on dots to scroll to position
            dots.forEach((dot, index) => {
                dot.addEventListener('click', function() {
                    const containerWidth = container.clientWidth;
                    container.scrollTo({ left: index * containerWidth, behavior: 'smooth' });
                });
            });
        });