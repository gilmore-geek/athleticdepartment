async function initFooter(data) {
  await renderFooter();

  const footerCompany = document.querySelector('[data-field="footer.companyName"]');
  const footerDescription = document.querySelector('[data-field="footer.description"]');
  const footerContactSocial = document.querySelector('[data-field="footer.contact.social"]');
  const footerContactCity = document.querySelector('[data-field="footer.contact.city"]');
  const footerCopyright = document.querySelector('[data-field="footer.copyright"]');

  if (footerCompany && data.footer && data.footer.companyName) {
    footerCompany.textContent = data.footer.companyName;
  }

  if (footerDescription && data.footer && data.footer.description) {
    footerDescription.textContent = data.footer.description;
  }

  if (footerContactSocial && data.footer && data.footer.contact && data.footer.contact.social) {
    footerContactSocial.textContent = data.footer.contact.social;
  }

  if (footerContactCity && data.footer && data.footer.contact && data.footer.contact.city) {
    footerContactCity.textContent = data.footer.contact.city;
  }

  if (footerCopyright && data.footer && data.footer.copyright) {
    footerCopyright.textContent = data.footer.copyright;
  }

  populateFooterLinks(data);
  initFooterContactForm();
}

function populateFooterLinks(data) {
  const legalLinksContainer = document.querySelector('.footer-links[data-field="footer.links.legal"]');
  if (!legalLinksContainer || !data.footer || !data.footer.links || !Array.isArray(data.footer.links.legal)) {
    return;
  }

  legalLinksContainer.innerHTML = data.footer.links.legal
    .map(link => `<li><a href="${link.href}">${link.label}</a></li>`)
    .join('');
}

async function renderFooter() {
  const placeholder = document.getElementById('footerComponent');
  if (!placeholder) {
    return;
  }

  if (placeholder.innerHTML.trim().length > 0) {
    return;
  }

  const footerUrl = './components/footer/footer.html';
  const response = await fetch(footerUrl);
  if (!response.ok) {
    throw new Error(`Footer konnte nicht geladen werden: ${response.status}`);
  }

  placeholder.innerHTML = await response.text();
}

function initFooterContactForm() {
  const contactContainer = document.getElementById('footerContactFormContainer');
  if (!contactContainer) {
    return;
  }

  const contactHtmlUrl = './components/contact/contact.html';
  const contactJsUrl = './components/contact/contact.js';

  fetch(contactHtmlUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Kontakt HTML konnte nicht geladen werden: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      contactContainer.innerHTML = html;
      return loadScript(contactJsUrl);
    })
    .then(() => {
      if (typeof initContactForm === 'function') {
        initContactForm();
      }
    })
    .catch(error => {
      console.error('Kontaktformular konnte nicht geladen werden:', error);
    });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Laden des Skripts fehlgeschlagen: ${src}`));
    document.body.appendChild(script);
  });
}
