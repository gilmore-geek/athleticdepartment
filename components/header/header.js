function initHeader(data) {
  const headerNav = document.getElementById('headerNav');
  const navList = headerNav.querySelector('.nav-list');
  const menuToggle = document.getElementById('menuToggle');

  // Navigation Items laden
  if (data.nav && data.nav.items) {
    navList.innerHTML = '';
    data.nav.items.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      li.appendChild(a);
      navList.appendChild(li);

      // Mobile Menu schließen beim Klick
      a.addEventListener('click', () => {
        headerNav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Hamburger Menu Toggle
  menuToggle.addEventListener('click', () => {
    headerNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
    const isOpen = headerNav.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Menu schließen auf größeren Screens
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      headerNav.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
