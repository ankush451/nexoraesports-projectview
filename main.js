document.addEventListener('DOMContentLoaded', () => {
    // Sticky Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('fa-bars');
            mobileToggle.classList.toggle('fa-times');
        });
    }

    // Scroll Animations (Fade In)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Cookie Consent Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    
    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // Form Submit Auto-reply (Demo)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Thank you! Your message has been sent. Our team will get back to you within 24 hours.');
                btn.innerText = originalText;
                btn.disabled = false;
                contactForm.reset();
            }, 1500);
        });
    }

    // Pricing Toggle
    const billingToggle = document.getElementById('billing-toggle');
    const prices = document.querySelectorAll('.price-value');
    if (billingToggle) {
        billingToggle.addEventListener('change', () => {
            prices.forEach(price => {
                const monthly = price.dataset.monthly;
                const annual = price.dataset.annual;
                price.innerText = billingToggle.checked ? annual : monthly;
            });
        });
    }

    // Scroll Animation for Hero Canvas
    const canvas = document.getElementById('hero-canvas');
    let context = null;
    let frames = [];
    let currentFrame = 0;
    const totalFrames = 78; // Based on the number of ezgif-frame files
    let imagesLoaded = 0;
    const resizeObserver = new ResizeObserver(resizeCanvas);

    if (canvas) {
        context = canvas.getContext('2d');
        preloadImages();
    }

    // Preload images
    function preloadImages() {
        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            img.src = `images/scroll-frames/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === totalFrames) {
                    initAnimation();
                }
            };
            img.onerror = () => {
                console.warn(`Failed to load frame ${i}`);
                imagesLoaded++; // Still count as loaded to prevent hanging
                if (imagesLoaded === totalFrames) {
                    initAnimation();
                }
            };
            frames.push(img);
        }
    }

    function resizeCanvas() {
        if (canvas) {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            
            // Draw current frame if available
            if (frames[currentFrame] && frames[currentFrame].complete) {
                drawFrame(currentFrame);
            }
        }
    }

    function drawFrame(frameIndex) {
        if (!canvas || !frames[frameIndex]) return;
        const dpr = window.devicePixelRatio || 1;
        context.clearRect(0, 0, canvas.width, canvas.height);
        const img = frames[frameIndex];
        
        // Scale image to cover canvas while maintaining aspect ratio
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        
        context.drawImage(img, x, y, width, height);
    }

    function initAnimation() {
        resizeCanvas();
        // Initial draw
        drawFrame(0);
        // Observe scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = scrollTop / documentHeight;
            const frameIndex = Math.min(Math.floor(scrollProgress * (totalFrames - 1)), totalFrames - 1);
            if (frameIndex !== currentFrame) {
                currentFrame = frameIndex;
                drawFrame(currentFrame);
            }
        });
        // Handle resize
        resizeObserver.observe(document.body);
    }

    // Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                
                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});
