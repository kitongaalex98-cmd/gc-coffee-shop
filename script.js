const cart = [];
const cartItems = document.querySelector('#cart-items');
const totalElement = document.querySelector('#total');
const form = document.querySelector('#order-form');
const message = document.querySelector('#form-message');

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your basket is empty.<br>Tap “Add to order” above.</p>';
    totalElement.textContent = 'KSh 0';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-line"><span>${item.name} <button type="button" class="remove-item" data-index="${index}" aria-label="Remove ${item.name}">×</button></span><strong>KSh ${item.price}</strong></div>
  `).join('');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalElement.textContent = `KSh ${total.toLocaleString()}`;
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => { cart.splice(Number(button.dataset.index), 1); renderCart(); });
  });
}

document.querySelectorAll('.add-button').forEach(button => {
  button.addEventListener('click', () => {
    cart.push({ name: button.dataset.item, price: Number(button.dataset.price) });
    renderCart();
    document.querySelector('#order').scrollIntoView({ behavior: 'smooth' });
  });
});

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!cart.length) {
    message.textContent = 'Please add a drink to your order first.';
    document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const phone = document.querySelector('#phone').value.replace(/\s/g, '');
  const pochi = document.querySelector('#pochi').value.replace(/\s/g, '');
  if (!/^\+?254\d{9}$/.test(phone) && !/^0\d{9}$/.test(phone)) {
    message.textContent = 'Please enter a valid Kenyan phone number.';
    return;
  }
  if (!/^\d{9,12}$/.test(pochi)) {
    message.textContent = 'Please enter a valid Pochi number.';
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  message.textContent = `Order received! We’ll send an M-Pesa prompt for KSh ${total.toLocaleString()} to ${phone}.`;
  form.reset();
});

renderCart();
