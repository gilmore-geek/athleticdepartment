function initTrainingsplan(data) {
  const cartItemMap = {};

  const parseCartItems = (raw) => {
    try {
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  };

  const getStoredCartItems = () => {
    try {
      const stored = localStorage.getItem('athletikdept.cart');
      if (stored) {
        return parseCartItems(stored);
      }
    } catch (error) {
      // ignore localStorage errors
    }

    try {
      return window.name ? parseCartItems(window.name) : [];
    } catch (error) {
      return [];
    }
  };

  const isPlanInCart = (planId) => {
    return getStoredCartItems().some(item => item.id === planId);
  };

  const renderInCartStatus = () => {
    return `<span class="plan-in-cart">Paket liegt im Warenkorb</span>`;
  };

  if (Array.isArray(data.plans)) {
    data.plans.forEach(plan => {
      (plan.buttons || []).forEach(button => {
        cartItemMap[button.id] = {
          id: button.id,
          title: `${plan.level} – ${button.label.replace(/^\d+\s*EUR\s*\|\s*/, '')}`,
          price: Number(button.price || 0)
        };
      });
    });
  }

  if (Array.isArray(data.bundles)) {
    data.bundles.forEach(bundle => {
      cartItemMap[bundle.id] = {
        id: bundle.id,
        title: bundle.title,
        price: Number(bundle.price || 0)
      };
    });
  }

  if (data.addon && data.addon.id) {
    cartItemMap[data.addon.id] = {
      id: data.addon.id,
      title: data.addon.title || 'Form-Check-Service',
      price: Number(data.addon.price || 0)
    };
  }

  const renderActionButton = (planId, label) => {
    return isPlanInCart(planId)
      ? renderInCartStatus()
      : `
          <button
            class="price-button"
            type="button"
            data-plan="${planId}">
            ${label}
          </button>
        `;
  };

  const addToCart = (planId) => {
    const item = cartItemMap[planId];
    if (!item) {
      console.warn(`Warenkorb: Kein Item mit id ${planId} gefunden.`);
      return;
    }

    const isAlreadyInCart = isPlanInCart(planId);
    if (isAlreadyInCart) {
      return;
    }

    if (window.cart && typeof window.cart.addItem === 'function') {
      window.cart.addItem(item);
      updatePlanButtonsState();
      return;
    }

    const loadFallbackCart = () => {
      try {
        const stored = localStorage.getItem('athletikdept.cart');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        // ignore localStorage read errors
      }

      try {
        return window.name ? JSON.parse(window.name) : [];
      } catch (error) {
        return [];
      }
    };

    const saveFallbackCart = (items) => {
      const raw = JSON.stringify(items);
      try {
        localStorage.setItem('athletikdept.cart', raw);
      } catch (error) {
        // ignore localStorage write errors
      }
      window.name = raw;
    };

    const fallbackItems = loadFallbackCart();
    const existing = fallbackItems.find(entry => entry.id === item.id);
    if (!existing) {
      fallbackItems.push({ ...item, quantity: 1 });
    }
    saveFallbackCart(fallbackItems);
    window.dispatchEvent(new CustomEvent('cartupdated', { detail: { items: fallbackItems } }));
    updatePlanButtonsState();
  };

  const updatePlanButtonsState = () => {
    document.querySelectorAll('[data-plan]').forEach(button => {
      const planId = button.dataset.plan;
      if (!planId || !isPlanInCart(planId)) {
        return;
      }

      const status = document.createElement('span');
      status.className = 'plan-in-cart';
      status.textContent = 'Paket liegt im Warenkorb';
      button.replaceWith(status);
    });
  };

  const attachCartListeners = () => {
    document.querySelectorAll('[data-plan]').forEach(button => {
      button.addEventListener('click', () => {
        addToCart(button.dataset.plan);
      });
    });
  };

  const plansGrid = document.querySelector('.plans-grid');
  if (plansGrid && data.plans) {
    plansGrid.innerHTML = data.plans
      .map(plan => {
        const buttons = (plan.buttons || [])
          .map(button => renderActionButton(button.id, button.label))
          .join('');

        return `
          <article class="plan-card">
            <header>
              <h3 class="plan-level">${plan.level}</h3>
              <p class="plan-target">${plan.target}</p>
            </header>
            <ul class="plan-details">
              <li><strong>Dauer:</strong> ${plan.duration}</li>
              <li><strong>Frequenz:</strong> ${plan.frequency}</li>
              <li><strong>Trainingsformat:</strong> ${plan.format}</li>
              <li><strong>Periodisierung:</strong> ${plan.periodization}</li>
              <li><strong>Progression:</strong> ${plan.progression}</li>
              <li><strong>Basis-Tipps:</strong> ${plan.baseTips}</li>
              <li><strong>Trainingsplan-Format:</strong> ${plan.planFormat}</li>
            </ul>
            <div class="plan-actions">${buttons}</div>
          </article>
        `;
      })
      .join('');
  }

  const bundleGrid = document.querySelector('.bundle-grid');
  if (bundleGrid && data.bundles) {
    bundleGrid.innerHTML = data.bundles
      .map(bundle => `
        <article class="bundle-card">
          <p class="bundle-title">${bundle.title}</p>
          ${renderActionButton(bundle.id, bundle.button)}
        </article>
      `)
      .join('');
  }

  const addonActions = document.querySelector('.addon-actions');
  if (addonActions && data.addon && data.addon_button) {
    addonActions.innerHTML = renderActionButton(data.addon.id, data.addon_button);
  }

  attachCartListeners();
  updatePlanButtonsState();
}
