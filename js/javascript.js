if (window.location.pathname.includes("checkout")) {
  console.log("Checkout page - quantity buttons disabled");
} else {
document.addEventListener("DOMContentLoaded", () => {

  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("active");
      burger.classList.toggle("active");
    });
  }

  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  const revealElements = document.querySelectorAll(".reveal, .menu-block");
  function revealOnScroll() {
    revealElements.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100)
        el.classList.add("active");
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  document.querySelectorAll(".toggle-products").forEach(button => {
    button.addEventListener("click", () => {
      const products = button.nextElementSibling;
      const isActive = products.classList.contains("active");

      document.querySelectorAll(".products").forEach(p => p.classList.remove("active"));
      document.querySelectorAll(".toggle-products").forEach(b => {
        b.classList.remove("active");
        b.innerHTML = 'Vezi Produsele <span class="arrow">▼</span>';
      });

      if (!isActive) {
        products.classList.add("active");
        button.classList.add("active");
        button.innerHTML = 'Închide Produsele <span class="arrow">▼</span>';
      }
    });
  });

  const productsData = {
    sandwich: [
      { name: "Sandwich in asortiment", price: 35 },
      { name: "Toast Sandwich", price: 30 },
      { name: "Panini Pizza", price: 22 },
      { name: "Hot Dog", price: 28 },
      { name: "Croisant cu curcan", price: 38 },
      { name: "Pitta cu pui crispy", price: 40 }
    ],
    wrap: [
      { name: "Placinta cu carne", price: 22 },
      { name: "Placinta cu branza", price: 20 },
      { name: "Placinta cu varza", price: 17 },
      { name: "Wrap de Pui", price: 37 }
    ],
    salate: [
      { name: "Salata Caesar", price: 35 },
      { name: "Salata Greceasca", price: 35 },
      { name: "Salata cu sunca vita", price: 35 }
    ],
    burger: [
      { name: "Cheeseburger", price: 35 },
      { name: "Burger vita/porc", price: 35 }
    ],
    reci: [
      { name: "Coca cola", price: 20 },
      { name: "Sprite", price: 20 },
      { name: "Fanta", price: 20 },
      { name: "Apa", price: 15 },
      { name: "Fuze Tea", price: 23 }
    ],
    calde: [
      { name: "Espresso", price: 20 },
      { name: "Americano", price: 20 },
      { name: "Cappuccino", price: 24 },
      { name: "Latte", price: 25 },
      { name: "Ciocolata Fierbinte", price: 20 },
      { name: "Ceai", price: 15 }
    ]
  };

  const cartSidebar = document.getElementById("cart-sidebar");
  const cartList = document.getElementById("cart-list");
  const cartCount = document.getElementById("cart-count");
  const totalEl = document.getElementById("total");

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function groupCart(cart) {
    const grouped = {};
    cart.forEach(item => {
      if (!grouped[item.name]) {
        grouped[item.name] = { ...item, qty: 1 };
      } else {
        grouped[item.name].qty++;
      }
    });
    return Object.values(grouped);
  }

  function updateCart() {
    const cart = getCart();
    const grouped = groupCart(cart);

    cartList.innerHTML = "";
    let total = 0;

    grouped.forEach(item => {
      const li = document.createElement("li");

      li.innerHTML = `
        ${item.name}
        <div class="qty-box">
          <button onclick="changeQty('${item.name}', -1)">➖</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.name}', 1)">➕</button>
        </div>
        ${item.price * item.qty} MDL
      `;

      cartList.appendChild(li);
      total += item.price * item.qty;
    });

    cartCount.innerText = cart.length;
    totalEl.innerText = `Total: ${total} MDL`;
  }

  window.changeQty = function(name, change) {
    let cart = getCart();

    if (change > 0) {
      const item = cart.find(i => i.name === name);
      if (item) cart.push(item);
    } else {
      const index = cart.findIndex(i => i.name === name);
      if (index !== -1) cart.splice(index, 1);
    }

    saveCart(cart);
    updateCart();
  };

  window.toggleCart = function() {
    cartSidebar.classList.toggle("active");
    updateCart();
  };

  function showNotification(message, color = "#316c42") {
    const notif = document.createElement("div");
    notif.classList.add("notification");
    notif.style.background = color;
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add("show"), 10);
    setTimeout(() => {
      notif.classList.remove("show");
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }

  document.querySelectorAll(".add-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      const index = button.dataset.index;
      const item = productsData[category][index];

      const cart = getCart();
      cart.push(item);
      saveCart(cart);

      updateCart();
      showNotification("Produs adăugat în coș");
    });
  });

  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutModal = document.getElementById("checkout-modal");
  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");
  const closeCheckout = document.querySelector(".close-checkout");

  checkoutBtn.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return showNotification("Coșul este gol!", "#c0392b");

    const grouped = groupCart(cart);

    checkoutItems.innerHTML = "";
    let total = 0;

    grouped.forEach(item => {
      const li = document.createElement("li");

      li.innerHTML = `
        ${item.name}
        <div class="qty-box">
          <button onclick="changeQty('${item.name}', -1)">➖</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.name}', 1)">➕</button>
        </div>
        ${item.price * item.qty} MDL
      `;

      checkoutItems.appendChild(li);
      total += item.price * item.qty;
    });

    checkoutTotal.textContent = `Total: ${total} MDL`;
    checkoutModal.style.display = "flex";
  });

  closeCheckout?.addEventListener("click", () => checkoutModal.style.display = "none");

  window.addEventListener("click", e => {
    if (e.target === checkoutModal) checkoutModal.style.display = "none";
  });

  const confirmCheckout = document.getElementById("confirm-checkout");

  confirmCheckout?.addEventListener("click", () => {
    const email = document.getElementById("checkout-email").value.trim();
    if (!email) return showNotification("Te rog introdu email-ul!", "#c0392b");

    const cart = getCart();
    if (!cart.length) return showNotification("Coșul este gol!", "#c0392b");

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const templateParams = {
      to_email: email,
      to_name: email.split("@")[0],
      order_items: cart.map(i => `${i.name} - ${i.price} MDL`).join("\n"),
      order_total: total
    };

    emailjs.send("service_gmxfrk6", "template_4npizju", templateParams, "euwpozbIhFNJwaNTd")
      .then(() => {
        showNotification("Comanda a fost trimisă!");
        localStorage.removeItem("cart");
        cartSidebar.classList.remove("active");
        checkoutModal.style.display = "none";
        cartCount.textContent = "0";
        updateCart();
      })
      .catch(() => {
        showNotification("Eroare la trimiterea comenzii", "#c0392b");
      });
  });

  updateCart();
});
}
