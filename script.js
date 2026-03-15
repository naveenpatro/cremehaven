// ===========================
// Mobile Navigation
// ===========================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===========================
// Sticky Navbar on Scroll
// ===========================

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===========================
// Smooth Scroll with Offset
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Scroll to Top Button
// ===========================

const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===========================
// Scroll Animations
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all section elements
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Observe menu cards
document.querySelectorAll('.menu-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe review cards
document.querySelectorAll('.review-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
    observer.observe(card);
});

// ===========================
// Order Form Handling
// ===========================

const orderForm = document.getElementById('orderForm');

// Set minimum date to tomorrow
const deliveryDateInput = document.getElementById('deliveryDate');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 2); // Minimum 2 days notice
deliveryDateInput.min = tomorrow.toISOString().split('T')[0];

// Form submission
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        deliveryDate: document.getElementById('deliveryDate').value,
        orderDetails: document.getElementById('orderDetails').value,
        message: document.getElementById('message').value
    };
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Send via WhatsApp
    sendWhatsAppOrder(formData);
});

// Form validation
function validateForm(data) {
    if (!data.name.trim()) {
        alert('Please enter your name');
        return false;
    }
    
    if (!data.phone.trim()) {
        alert('Please enter your phone number');
        return false;
    }
    
    // Basic phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = data.phone.replace(/\s+/g, '').replace(/[-()]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        alert('Please enter a valid 10-digit phone number');
        return false;
    }
    
    if (!data.deliveryDate) {
        alert('Please select a delivery date');
        return false;
    }
    
    if (!data.orderDetails.trim()) {
        alert('Please provide order details');
        return false;
    }
    
    return true;
}

// ===========================
// WhatsApp Integration
// ===========================

function sendWhatsAppOrder(data) {
    const phoneNumber = '918327760349'; // Replace with actual WhatsApp number
    
    // Format the message
    let message = `*New Order from Crème Haven Artisanal Bakery Website*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${data.name}\n`;
    message += `Phone: ${data.phone}\n`;
    if (data.email) message += `Email: ${data.email}\n`;
    message += `\n*Delivery Date:* ${formatDate(data.deliveryDate)}\n\n`;
    message += `*Order Details:*\n${data.orderDetails}\n`;
    if (data.message) message += `\n*Additional Notes:*\n${data.message}`;
    
    // Encode the message
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Show success message
    showNotification('Order details sent to WhatsApp! We\'ll confirm your order shortly.');
    
    // Reset form
    orderForm.reset();
}

// Direct WhatsApp order button (from form)
const whatsappOrderBtn = document.getElementById('whatsappOrder');
whatsappOrderBtn.addEventListener('click', () => {
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        deliveryDate: document.getElementById('deliveryDate').value,
        orderDetails: document.getElementById('orderDetails').value,
        message: document.getElementById('message').value
    };
    
    // If form is filled, send via WhatsApp
    if (formData.name && formData.phone && formData.deliveryDate && formData.orderDetails) {
        if (validateForm(formData)) {
            sendWhatsAppOrder(formData);
        }
    } else {
        // Open WhatsApp with basic message
        const phoneNumber = '918327760349';
        const message = encodeURIComponent('Hi! I would like to place an order at Crème Haven Bakery.');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
});

// ===========================
// Quick Order Buttons (Menu Items)
// ===========================

document.querySelectorAll('.btn-order').forEach(button => {
    button.addEventListener('click', (e) => {
        const itemName = e.target.getAttribute('data-item');
        const itemPrice = e.target.getAttribute('data-price');
        
        // Pre-fill order form
        document.getElementById('orderDetails').value = `I would like to order: ${itemName} (₹${itemPrice})`;
        
        // Scroll to order form
        const orderSection = document.getElementById('order');
        const navHeight = navbar.offsetHeight;
        const targetPosition = orderSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Focus on name field
        setTimeout(() => {
            document.getElementById('name').focus();
        }, 1000);
    });
});

// ===========================
// Newsletter Form
// ===========================

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            showNotification('Thank you for subscribing! You\'ll receive our latest updates and special offers.');
            newsletterForm.reset();
        }
    });
}

// ===========================
// Utility Functions
// ===========================

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', options);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #8FB996;
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(44, 36, 22, 0.16);
        z-index: 10000;
        max-width: 400px;
        font-family: 'Quicksand', sans-serif;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===========================
// Active Nav Link on Scroll
// ===========================

const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.style.color = '');
            if (navLink) {
                navLink.style.color = '#D4A574';
            }
        }
    });
}

window.addEventListener('scroll', highlightNavOnScroll);

// ===========================
// Gallery Image Click (Optional Enhancement)
// ===========================

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        // Could implement a lightbox modal here
        showNotification('Image gallery feature - Replace images with your actual bakery photos!');
    });
});

// ===========================
// Instagram Feed (Mock Data)
// ===========================

// In a real implementation, you would fetch from Instagram API
// For now, this is static with placeholder functionality

document.querySelectorAll('.instagram-item').forEach(item => {
    item.addEventListener('click', () => {
        // Open Instagram profile in new tab
        window.open('https://www.instagram.com/_cremehaven_', '_blank');
    });
});

// ===========================
// Loading Animation (On Page Load)
// ===========================

window.addEventListener('load', () => {
    // Remove any loading screen if present
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    // Trigger initial animations
    document.body.style.opacity = '1';
});

// ===========================
// Image Lazy Loading Enhancement
// ===========================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const placeholder = entry.target;
                // Could load actual images here
                observer.unobserve(placeholder);
            }
        });
    });
    
    document.querySelectorAll('.image-placeholder').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===========================
// Performance: Debounce Scroll Events
// ===========================

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

// Apply debouncing to scroll handlers
const debouncedScrollHandler = debounce(() => {
    highlightNavOnScroll();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// ===========================
// Accessibility Enhancements
// ===========================

// Keyboard navigation for mobile menu
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
    }
});

// Trap focus in mobile menu when open
navMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.focus();
    }
});

// ===========================
// Console Welcome Message
// ===========================

console.log('%c🍰 Crème Haven Artisanal Bakery Website', 'font-size: 20px; font-weight: bold; color: #D4A574;');
console.log('%cMade with ❤️ and lots of butter', 'font-size: 12px; color: #8B7E74;');
console.log('%c\nTo customize this website:', 'font-weight: bold;');
console.log('1. Replace placeholder images with your bakery photos');
console.log('2. Update the WhatsApp number in script.js (search for "918327760349")');
console.log('3. Update contact information in index.html');
console.log('4. Connect to Instagram API for live feed');
console.log('5. Customize colors in styles.css CSS variables');

// ===========================
// Development Helper
// ===========================

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('%c\n🔧 Development Mode', 'color: #E8947C; font-weight: bold;');
    console.log('The website is running in development mode.');
}
