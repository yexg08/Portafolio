const { createApp, ref, computed, watch } = Vue;

createApp({
    setup() {
        // Estado
        const mobileMenuOpen = ref(false);
        const cartOpen = ref(false);
        const searchQuery = ref('');
        const filter = ref('all');
        const cart = ref([]);
        
        // Datos de categorías
        const categories = ref([
            { id: 1, name: 'Ropa', icon: 'fas fa-tshirt' },
            { id: 2, name: 'Zapatos', icon: 'fas fa-shoe-prints' },
            { id: 3, name: 'Accesorios', icon: 'fas fa-gem' },
            { id: 4, name: 'Deportes', icon: 'fas fa-running' },
            { id: 5, name: 'Belleza', icon: 'fas fa-spa' },
            { id: 6, name: 'Electrónica', icon: 'fas fa-laptop' }
        ]);
        
        // Datos de productos
        const products = ref([
            {
                id: 1,
                name: 'Camiseta básica',
                description: 'Camiseta de algodón 100% de corte regular, perfecta para uso diario.',
                price: 19.99,
                originalPrice: 29.99,
                discount: 33,
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 4,
                reviews: 120,
                isFavorite: false,
                tags: ['popular', 'new']
            },
            {
                id: 2,
                name: 'Jeans slim fit',
                description: 'Jeans ajustados con elasticidad para mayor comodidad.',
                price: 49.99,
                originalPrice: 49.99,
                discount: 0,
                image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 4,
                reviews: 86,
                isFavorite: false,
                tags: ['popular']
            },
            {
                id: 3,
                name: 'Zapatillas urbanas',
                description: 'Zapatillas modernas para el día a día con suela de goma antideslizante.',
                price: 79.99,
                originalPrice: 99.99,
                discount: 20,
                image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 5,
                reviews: 210,
                isFavorite: false,
                tags: ['popular']
            },
            {
                id: 4,
                name: 'Chaqueta vaquera',
                description: 'Chaqueta de mezclilla clásica, perfecta para todas las estaciones.',
                price: 89.99,
                originalPrice: 89.99,
                discount: 0,
                image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 4,
                reviews: 65,
                isFavorite: false,
                tags: ['new']
            },
            {
                id: 5,
                name: 'Vestido floral',
                description: 'Vestido ligero con estampado floral, ideal para primavera y verano.',
                price: 59.99,
                originalPrice: 79.99,
                discount: 25,
                image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 5,
                reviews: 42,
                isFavorite: false,
                tags: ['new']
            },
            {
                id: 6,
                name: 'Reloj minimalista',
                description: 'Reloj de pulsera con diseño minimalista y correa de cuero genuino.',
                price: 129.99,
                originalPrice: 159.99,
                discount: 19,
                image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 5,
                reviews: 158,
                isFavorite: false,
                tags: ['popular', 'new']
            },
            {
                id: 7,
                name: 'Bolso de cuero',
                description: 'Bolso de mano hecho con cuero premium, espacioso y elegante.',
                price: 149.99,
                originalPrice: 149.99,
                discount: 0,
                image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 4,
                reviews: 93,
                isFavorite: false,
                tags: ['new']
            },
            {
                id: 8,
                name: 'Gafas de sol',
                description: 'Gafas de sol con protección UV y montura ligera de acetato.',
                price: 89.99,
                originalPrice: 119.99,
                discount: 25,
                image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                rating: 4,
                reviews: 76,
                isFavorite: false,
                tags: ['popular']
            }
        ]);
        
        // Productos filtrados por categoría y búsqueda
        const filteredProducts = computed(() => {
            let result = products.value;
            
            // Filtrar por categoría
            if (filter.value !== 'all') {
                result = result.filter(product => product.tags.includes(filter.value));
            }
            
            // Filtrar por búsqueda
            if (searchQuery.value.trim() !== '') {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(product => 
                    product.name.toLowerCase().includes(query) || 
                    product.description.toLowerCase().includes(query)
                );
            }
            
            return result;
        });
        
        // Conteo de productos en el carrito
        const cartCount = computed(() => {
            return cart.value.reduce((total, item) => total + item.quantity, 0);
        });
        
        // Subtotal del carrito
        const subtotal = computed(() => {
            return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
        });
        
        // Costos de envío
        const shipping = computed(() => {
            return subtotal.value > 100 ? 0 : 10;
        });
        
        // Total a pagar
        const total = computed(() => {
            return subtotal.value + shipping.value;
        });
        
        // Cargar carrito desde localStorage
        const loadCart = () => {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart.value = JSON.parse(savedCart);
            }
        };
        
        // Guardar carrito en localStorage
        watch(cart, (newCart) => {
            localStorage.setItem('cart', JSON.stringify(newCart));
        }, { deep: true });
        
        // Métodos
        const toggleFavorite = (productId) => {
            const product = products.value.find(p => p.id === productId);
            if (product) {
                product.isFavorite = !product.isFavorite;
            }
        };
        
        const addToCart = (product) => {
            // Verificar si el producto ya está en el carrito
            const existingItem = cart.value.find(item => item.id === product.id);
            
            if (existingItem) {
                // Incrementar cantidad si ya existe
                existingItem.quantity++;
            } else {
                // Añadir nuevo producto al carrito
                cart.value.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            // Mostrar carrito
            cartOpen.value = true;
        };
        
        const removeFromCart = (productId) => {
            const index = cart.value.findIndex(item => item.id === productId);
            if (index !== -1) {
                cart.value.splice(index, 1);
            }
        };
        
        const updateQuantity = (productId, newQuantity) => {
            if (newQuantity < 1) return;
            
            const item = cart.value.find(item => item.id === productId);
            if (item) {
                item.quantity = newQuantity;
            }
        };
        
        // Inicializar carrito desde localStorage
        loadCart();
        
        return {
            mobileMenuOpen,
            cartOpen,
            searchQuery,
            filter,
            cart,
            categories,
            products,
            filteredProducts,
            cartCount,
            subtotal,
            shipping,
            total,
            toggleFavorite,
            addToCart,
            removeFromCart,
            updateQuantity
        };
    }
}).mount('#app'); 