/* Elements */
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryList = document.getElementById("categoryList");
const sortSelect = document.getElementById("sortSelect");
const productCount = document.getElementById("productCount");
const emptyMessage = document.getElementById("emptyMessage");

const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

/* Variables */
let products = [];
let selectedCategory = "All";
let cart = JSON.parse(localStorage.getItem("shopEaseCart")) || [];

/* Fetch Products */
async function fetchProducts() {
  productGrid.innerHTML = `<p class="loading">Loading products...</p>`;

  try {
    const response = await fetch("https://dummyjson.com/products?limit=100");

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    products = data.products;

    displayCategories();
    filterProducts();

  } catch (error) {
    productGrid.innerHTML = "";
    productCount.textContent = "Unable to load products";
    emptyMessage.hidden = false;
    emptyMessage.textContent = "Something went wrong. Please try again.";
    console.error("API Error:", error);
  }
}

/* Display Categories */
function displayCategories() {
  const categories = [...new Set(products.map(product => product.category))];

  categoryList.innerHTML = `
    <button class="category active" data-category="All">All</button>
    ${categories.map(category => `
      <button class="category" data-category="${category}">
        ${category.replaceAll("-", " ")}
      </button>
    `).join("")}
  `;
}

/* Display Products */
function displayProducts(list) {
  productGrid.innerHTML = "";

  productCount.textContent = `Showing ${list.length} products`;
  emptyMessage.hidden = list.length !== 0;

  list.forEach(product => {
    const image = product.thumbnail || product.images?.[0];

    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${image}" alt="${product.title}" loading="lazy">
        <span class="product-tag">${product.discountPercentage ? `${Math.round(product.discountPercentage)}% OFF` : "Product"}</span>
      </div>

      <div class="product-info">
        <span class="product-category">${product.category.replaceAll("-", " ")}</span>
        <h3>${product.title}</h3>

        <div class="product-bottom">
          <span class="price">$${product.price.toFixed(2)}</span>
          <button class="add-btn" data-id="${product.id}">
            + Add
          </button>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

/* Search, Filter and Sort */
function filterProducts() {
  const searchText = searchInput.value.trim().toLowerCase();

  let filtered = products.filter(product => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (sortSelect.value === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sortSelect.value === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (sortSelect.value === "name") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  displayProducts(filtered);
}

/* Search Events */
searchInput.addEventListener("input", filterProducts);
searchBtn.addEventListener("click", filterProducts);
sortSelect.addEventListener("change", filterProducts);

/* Category Events */
categoryList.addEventListener("click", event => {
  const button = event.target.closest(".category");

  if (!button) return;

  document.querySelectorAll(".category").forEach(item => {
    item.classList.remove("active");
  });

  button.classList.add("active");

  selectedCategory = button.dataset.category;

  filterProducts();
});

/* Save Cart */
function saveCart() {
  localStorage.setItem("shopEaseCart", JSON.stringify(cart));
}

/* Add to Cart */
function addToCart(id) {
  const product = products.find(item => item.id === id);

  if (!product) return;

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1
    });
  }

  saveCart();
  updateCart();
}

/* Change Quantity */
function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  saveCart();
  updateCart();
}

/* Remove Item */
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);

  saveCart();
  updateCart();
}

/* Update Cart UI */
function updateCart() {
  cartItems.innerHTML = "";

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
    return;
  }

  cart.forEach(item => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}">

      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <strong>$${(item.price * item.quantity).toFixed(2)}</strong>

        <div class="quantity">
          <button data-action="decrease" data-id="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button data-action="increase" data-id="${item.id}">+</button>
        </div>

        <button class="remove-btn" data-action="remove" data-id="${item.id}">
          Remove
        </button>
      </div>
    `;

    cartItems.appendChild(cartItem);
  });
}

/* Product Add Event */
productGrid.addEventListener("click", event => {
  const button = event.target.closest(".add-btn");

  if (!button) return;

  addToCart(Number(button.dataset.id));
});

/* Cart Events */
cartItems.addEventListener("click", event => {
  const button = event.target.closest("button");

  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") changeQuantity(id, 1);
  if (action === "decrease") changeQuantity(id, -1);
  if (action === "remove") removeFromCart(id);
});

/* Open and Close Cart */
function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
}

function hideCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
}

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
overlay.addEventListener("click", hideCart);

/* Checkout */
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Checkout demo: Payment system is not connected.");
});

/* Initial Load */
updateCart();
fetchProducts();