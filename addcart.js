// Cart Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Cart variables
    let cart = [];
    const cartModal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartItemCount = document.getElementById('cartItemCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartIcon = document.querySelector('.cart-icon');
    
    // Checkout form variables
    const checkoutFormContainer = document.createElement('div');
    checkoutFormContainer.className = 'checkout-form-container';
    checkoutFormContainer.innerHTML = `
        <div class="checkout-form">
            <div class="checkout-form-header">
                <h3>Checkout</h3>
                <button class="close-checkout">&times;</button>
            </div>
            <form id="orderForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" required>
                </div>
                <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" id="address" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" id="city" required>
                    </div>
                    <div class="form-group">
                        <label for="zip">ZIP Code</label>
                        <input type="text" id="zip" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="country">Country</label>
                    <select id="country" required>
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="notes">Order Notes (Optional)</label>
                    <textarea id="notes" rows="3"></textarea>
                </div>
                <div class="order-summary">
                    <h4>Order Summary</h4>
                    <div id="orderSummaryItems"></div>
                    <div class="order-summary-item order-total">
                        <span>Total</span>
                        <span id="orderTotal">$0.00</span>
                    </div>
                </div>
                <button type="submit" class="submit-order">Place Order</button>
            </form>
        </div>
    `;
    document.body.appendChild(checkoutFormContainer);
    
    // Toggle cart modal
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    document.querySelector('.close-cart').addEventListener('click', () => {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === checkoutFormContainer) {
            checkoutFormContainer.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: productCard.dataset.id || Date.now().toString(),
                title: productCard.querySelector('.product-title').textContent,
                price: parseFloat(productCard.querySelector('.current-price').textContent.replace('$', '')),
                image: productCard.querySelector('.product-img img').src,
                quantity: 1
            };
            
            addToCart(product);
        });
    });
    
    // Add item to cart
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }
        
        updateCart();
        createConfetti(document.querySelector('.cart-icon'));
    }
    
    // Update cart UI
    function updateCart() {
        cartItemCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        cartTotal.textContent = `$${calculateTotal().toFixed(2)}`;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn decrease">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn increase">+</button>
                            </div>
                            <button class="remove-item">Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.decrease').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = e.target.closest('.cart-item').dataset.id;
                    updateQuantity(itemId, -1);
                });
            });
            
            document.querySelectorAll('.increase').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = e.target.closest('.cart-item').dataset.id;
                    updateQuantity(itemId, 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = e.target.closest('.cart-item').dataset.id;
                    removeFromCart(itemId);
                });
            });
        }
    }
    
    // Update item quantity
    function updateQuantity(itemId, change) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            
            if (cart[itemIndex].quantity < 1) {
                cart.splice(itemIndex, 1);
            }
            
            updateCart();
        }
    }
    
    // Remove item from cart
    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCart();
    }
    
    // Calculate cart total
    function calculateTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Checkout functionality
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        cartModal.style.display = 'none';
        checkoutFormContainer.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Update order summary
        const orderSummaryItems = document.getElementById('orderSummaryItems');
        orderSummaryItems.innerHTML = cart.map(item => `
            <div class="order-summary-item">
                <span>${item.title} × ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
        
        document.getElementById('orderTotal').textContent = `$${calculateTotal().toFixed(2)}`;
    });
    
    // Close checkout form
    document.querySelector('.close-checkout')?.addEventListener('click', () => {
        checkoutFormContainer.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Form submission
    document.getElementById('orderForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real application, you would send this data to your server
        const orderData = {
            customer: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                zip: document.getElementById('zip').value,
                country: document.getElementById('country').value,
                notes: document.getElementById('notes').value
            },
            items: cart,
            total: calculateTotal()
        };
        
        console.log('Order submitted:', orderData);
        
        // Show confirmation (in a real app, you would redirect to a confirmation page)
        alert(`Thank you for your order! Your order total is $${calculateTotal().toFixed(2)}. We'll contact you shortly with order details.`);
        
        // Reset cart and form
        cart = [];
        updateCart();
        e.target.reset();
        checkoutFormContainer.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});