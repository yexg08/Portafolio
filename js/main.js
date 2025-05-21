document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const cursor = document.querySelector('.cursor');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    (function() {
        emailjs.init("n_6kBRmjGujXpQE5d");
    })();

    // Cursor personalizado
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-item, .social-icon');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'rgba(108, 92, 231, 0.2)';
            cursor.style.mixBlendMode = 'normal';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'rgba(108, 92, 231, 0.5)';
            cursor.style.mixBlendMode = 'difference';
        });
    });

    // Navegación móvil - Menú hamburguesa
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    // Cerrar menú al hacer clic en un enlace (mobile)
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    });

    // Efecto de desplazamiento suave al hacer clic en los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cambiar estilo del header al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Actualizar la clase activa en la navegación según la sección visible
        updateActiveNavLink();
    });

    // Función para actualizar el enlace activo en la navegación
    function updateActiveNavLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }

    // Animación de entrada para elementos cuando son visibles
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    document.querySelectorAll('.project-card, .skill-item, .section-header, .about-content, .contact-container').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Manejar envío del formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Desactivar botón y mostrar estado de envío
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';
            
            // Obtener los datos del formulario
            const formData = {
                user_name: this.querySelector('#name').value,
                user_email: this.querySelector('#email').value,
                subject: this.querySelector('#subject').value,
                message: this.querySelector('#message').value,
                to_email: 'santimolinarag@gmail.com',
                from_name: 'DevPortfolio'
            };
            
            try {
                emailjs.send('service_06vj9xf', 'template_c50pz0n', formData)
                    .then(function(response) {
                        // Éxito
                        formStatus.textContent = '¡Mensaje enviado con éxito! Gracias por contactarme.';
                        formStatus.className = 'form-status success';
                        formStatus.style.display = 'block';
                        
                        // Restablecer formulario
                        contactForm.reset();
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }, function(error) {
                        formStatus.textContent = 'Error: ' + (error.text || JSON.stringify(error));
                        formStatus.className = 'form-status error';
                        formStatus.style.display = 'block';
                        
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    });
            } catch (e) {
                formStatus.textContent = 'Error en la aplicación: ' + e.message;
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    } else {
        // console.error('Formulario de contacto no encontrado');
    }

    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);

    // Iniciar animación de textos con efecto de escritura
    const typewriterElements = document.querySelectorAll('.animate-text');
    typewriterElements.forEach(element => {
        element.style.opacity = '1';
    });
});

// estilos CSS adicionales para animaciones
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate-on-scroll.in-view {
        opacity: 1;
        transform: translateY(0);
    }
    
    body.nav-open {
        overflow: hidden;
    }
    
    body.loaded .geometric-bg {
        animation-play-state: running;
    }
    
    .geometric-bg {
        animation-play-state: paused;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

document.head.appendChild(style); 