function initHero(data) {
  const heroCta = document.querySelector('.hero-cta');

  if (heroCta) {
    heroCta.addEventListener('click', () => {
      // Scroll zu Services Section
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Parallax-Effekt für Hero Background (nicht für gesamtes Element)
  const heroBackground = document.querySelector('.hero-background');
  if (heroBackground) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    });
  }
}
