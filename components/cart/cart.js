(function () {
  const storageKey = 'athletikdept.cart';

  function parseStoredCart(raw) {
    try {
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.warn('Warenkorb: Ungültige gespeicherte Daten', error);
      return [];
    }
  }

  function readCartItems() {
    try {
      const rawLocal = localStorage.getItem(storageKey);
      if (rawLocal) {
        return parseStoredCart(rawLocal);
      }
    } catch (error) {
      console.warn('Warenkorb: localStorage ist nicht verfügbar', error);
    }

    try {
      const rawName = window.name ? window.name : null;
      return parseStoredCart(rawName);
    } catch (error) {
      console.warn('Warenkorb: Fehler beim Lesen von window.name', error);
      return [];
    }
  }

  function saveCartItems(items) {
    try {
      const raw = JSON.stringify(items);
      try {
        localStorage.setItem(storageKey, raw);
      } catch (error) {
        console.warn('Warenkorb: localStorage konnte nicht geschrieben werden', error);
      }

      window.name = raw;
      dispatchCartUpdated(items);
    } catch (error) {
      console.error('Warenkorb: Fehler beim Speichern des Warenkorbs', error);
    }
  }

  function dispatchCartUpdated(items) {
    window.dispatchEvent(new CustomEvent('cartupdated', { detail: { items } }));
  }

  function formatPrice(amount) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  function getTotalCount() {
    return readCartItems().reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  function getTotalAmount() {
    return readCartItems().reduce((sum, item) => sum + (Number(item.price || 0) * (item.quantity || 1)), 0);
  }

  function addItem(cartItem) {
    if (!cartItem || !cartItem.id) {
      return;
    }

    const items = readCartItems();
    const existing = items.find(entry => entry.id === cartItem.id);

    if (existing) {
      return;
    }

    items.push({
      id: cartItem.id,
      title: cartItem.title || 'Unbenanntes Produkt',
      price: Number(cartItem.price || 0),
      quantity: 1
    });

    saveCartItems(items);
  }

  function removeItem(itemId) {
    const items = readCartItems().filter(item => item.id !== itemId);
    saveCartItems(items);
  }

  function clearCart() {
    saveCartItems([]);
  }

  function onCartUpdated(callback) {
    window.addEventListener('cartupdated', () => callback(readCartItems()));
  }

  function renderCartPage() {
    const container = document.getElementById('cartPageContainer');
    if (!container) {
      return;
    }

    const items = readCartItems();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <p>Dein Warenkorb ist leer. Wähle jetzt ein Trainingspaket oder Bundle aus.</p>
          <a href="./components/trainingsplan/trainingsplan.html" class="cart-button cart-button-primary">Zu den Trainingsplänen</a>
        </div>
      `;
      return;
    }

    const subtotal = getTotalAmount();
    const tax = Number((subtotal * 0.19).toFixed(2));
    const total = subtotal + tax;

    container.innerHTML = `
      <div class="cart-content">
        <div class="cart-table-wrapper">
          <table class="cart-table">
            <thead>
              <tr>
                <th>Produkt</th>
                <th>Preis</th>
                <th>Anzahl</th>
                <th>Zwischensumme</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr class="cart-item" data-item-id="${item.id}">
                  <td>${item.title}</td>
                  <td>${formatPrice(item.price)}</td>
                  <td>${item.quantity}</td>
                  <td>${formatPrice(Number(item.price) * item.quantity)}</td>
                  <td>
                    <button type="button" class="cart-remove-button" data-item-id="${item.id}">Löschen</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <aside class="cart-summary">
          <div class="cart-summary-card">
            <h2>Preise</h2>
            <dl>
              <div class="summary-row">
                <dt>Zwischensumme</dt>
                <dd>${formatPrice(subtotal)}</dd>
              </div>
              <div class="summary-row">
                <dt>Umsatzsteuer (19 %)</dt>
                <dd>${formatPrice(tax)}</dd>
              </div>
              <div class="summary-row summary-total">
                <dt>Gesamt</dt>
                <dd>${formatPrice(total)}</dd>
              </div>
            </dl>
            <div class="cart-summary-note">Der Warenkorb wird lokal im Browser gespeichert und bleibt erhalten, solange der Cache nicht geleert wird.</div>
            <div class="cart-actions">
              <a href="./components/trainingsplan/trainingsplan.html" class="cart-button">Weiter einkaufen</a>
              <button type="button" class="cart-button cart-button-secondary" id="clearCartButton">Warenkorb leeren</button>
            </div>
          </div>
        </aside>
      </div>
    `;

    container.querySelectorAll('.cart-remove-button').forEach(button => {
      button.addEventListener('click', () => {
        const itemId = button.dataset.itemId;
        removeItem(itemId);
        renderCartPage();
      });
    });

    const clearButton = container.querySelector('#clearCartButton');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        clearCart();
        renderCartPage();
      });
    }
  }

  function initCartPage() {
    renderCartPage();
    onCartUpdated(renderCartPage);
  }

  window.cart = {
    getItems: readCartItems,
    addItem,
    removeItem,
    clearCart,
    getTotalCount,
    getTotalAmount,
    formatPrice,
    initCartPage
  };

  window.initCartPage = initCartPage;
  window.cart.initCartPage = initCartPage;
  dispatchCartUpdated(readCartItems());
})();
