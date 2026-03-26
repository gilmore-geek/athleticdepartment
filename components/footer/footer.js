function initFooter(data) {
  // Main Links
  const mainLinks = document.querySelector('[data-field="footer.links.main"]');
  if (mainLinks && data.footer && data.footer.links && data.footer.links.main) {
    mainLinks.innerHTML = data.footer.links.main
      .map(link => `<li><a href="${link.href}">${link.label}</a></li>`)
      .join('');
  }

  // Legal Links
  const legalLinks = document.querySelector('[data-field="footer.links.legal"]');
  if (legalLinks && data.footer && data.footer.links && data.footer.links.legal) {
    legalLinks.innerHTML = data.footer.links.legal
      .map(link => `<li><a href="${link.href}">${link.label}</a></li>`)
      .join('');
  }
}
