function initHeader(data) {
  const headerNav = document.getElementById('headerNav');
  const menuToggle = document.getElementById('menuToggle');
  const headerContainer = headerNav ? headerNav.closest('.header-container') : null;

  if (!headerNav || !menuToggle || !headerContainer) {
    return;
  }

  const navList = headerNav.querySelector('.nav-list');

  if (!navList) {
    return;
  }

  let headerActions = headerContainer.querySelector('.header-actions');
  if (!headerActions) {
    headerActions = document.createElement('div');
    headerActions.className = 'header-actions';
    headerContainer.insertBefore(headerActions, menuToggle);
  }

  const cartButtonId = 'headerCartButton';
  let cartButton = headerActions.querySelector(`#${cartButtonId}`);
  if (!cartButton) {
    cartButton = document.createElement('a');
    cartButton.id = cartButtonId;
    cartButton.className = 'header-cart-button';
    cartButton.href = './cart.html';
    cartButton.setAttribute('aria-label', 'Warenkorb');
    cartButton.innerHTML = `
      <span class="cart-icon" aria-hidden="true">🛒</span>
      <span class="cart-count" aria-live="polite" aria-atomic="true">0</span>
    `;
    headerActions.appendChild(cartButton);
  }

  const closeAllSubmenus = () => {
    navList.querySelectorAll('.has-submenu').forEach(li => {
      li.classList.remove('submenu-open');
      const trigger = li.querySelector('.submenu-trigger');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const getCartCountFromStorage = () => {
    const parseItems = raw => {
      try {
        const items = JSON.parse(raw);
        return Array.isArray(items) ? items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
      } catch (error) {
        return 0;
      }
    };

    try {
      const stored = localStorage.getItem('athletikdept.cart');
      if (stored) {
        return parseItems(stored);
      }
    } catch (error) {
      // ignore localStorage errors
    }

    try {
      return parseItems(window.name || '');
    } catch (error) {
      return 0;
    }
  };

  const getCartCount = () => {
    if (window.cart && typeof window.cart.getTotalCount === 'function') {
      return window.cart.getTotalCount();
    }
    return getCartCountFromStorage();
  };

  const updateCartCount = () => {
    const cartCountElement = cartButton.querySelector('.cart-count');
    if (!cartCountElement) {
      return;
    }
    const count = getCartCount();
    cartCountElement.textContent = count;
    cartCountElement.style.opacity = count > 0 ? '1' : '0.6';
  };

  const ensureCartModule = () => {
    return new Promise(resolve => {
      if (window.cart) {
        resolve();
        return;
      }

      const existingScript = document.querySelector('script[src="./components/cart/cart.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => resolve());
        return;
      }

      const script = document.createElement('script');
      script.src = './components/cart/cart.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
  };

  ensureCartModule().then(() => {
    updateCartCount();
  });

  window.addEventListener('cartupdated', updateCartCount);

  // Navigation Items laden
  if (data.nav && data.nav.items) {
    navList.innerHTML = '';
    data.nav.items.forEach(item => {
      const li = document.createElement('li');
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;

      if (hasChildren) {
        li.classList.add('has-submenu');

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'submenu-trigger';
        trigger.setAttribute('aria-expanded', 'false');
        trigger.textContent = item.label;

        const submenu = document.createElement('ul');
        submenu.className = 'submenu-list';

        item.children.forEach(child => {
          const childLi = document.createElement('li');
          const childA = document.createElement('a');
          childA.href = child.href;
          childA.textContent = child.label;
          childLi.appendChild(childA);
          submenu.appendChild(childLi);

          childA.addEventListener('click', () => {
            headerNav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            li.classList.remove('submenu-open');
            trigger.setAttribute('aria-expanded', 'false');
          });
        });

        trigger.addEventListener('click', () => {
          const isOpen = li.classList.contains('submenu-open');

          navList.querySelectorAll('.has-submenu').forEach(otherLi => {
            otherLi.classList.remove('submenu-open');
            const otherTrigger = otherLi.querySelector('.submenu-trigger');
            if (otherTrigger) {
              otherTrigger.setAttribute('aria-expanded', 'false');
            }
          });

          li.classList.toggle('submenu-open', !isOpen);
          trigger.setAttribute('aria-expanded', String(!isOpen));
        });

        li.appendChild(trigger);
        li.appendChild(submenu);
      } else {
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        li.appendChild(a);

        a.addEventListener('click', () => {
          headerNav.classList.remove('active');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      }

      navList.appendChild(li);
    });
  }

  // Hamburger Menu Toggle
  menuToggle.onclick = () => {
    headerNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
    const isOpen = headerNav.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  };

  if (headerNav.dataset.headerListenersBound === 'true') {
    return;
  }

  headerNav.dataset.headerListenersBound = 'true';

  // Menu schließen auf größeren Screens
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      headerNav.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      closeAllSubmenus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!headerNav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeAllSubmenus();
    }
  });
}
