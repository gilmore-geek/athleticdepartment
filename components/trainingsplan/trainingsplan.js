function initTrainingsplan(data) {
  const plansGrid = document.querySelector('.plans-grid');
  if (plansGrid && data.plans) {
    plansGrid.innerHTML = data.plans
      .map(plan => {
        const buttons = (plan.buttons || [])
          .map(button => `
            <button
              class="price-button"
              type="button"
              data-plan="${button.id}">
              ${button.label}
            </button>
          `)
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
          <button class="price-button" type="button" data-plan="${bundle.id}">${bundle.button}</button>
        </article>
      `)
      .join('');
  }

  const addonActions = document.querySelector('.addon-actions');
  if (addonActions && data.addon_button) {
    addonActions.innerHTML = `
      <button class="price-button" type="button" data-plan="addon-form-check">${data.addon_button}</button>
    `;
  }
}
