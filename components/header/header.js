function initHeader(data) {
  const headerNav = document.getElementById('headerNav');
  const navList = headerNav.querySelector('.nav-list');
  const menuToggle = document.getElementById('menuToggle');

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
      navList.querySelectorAll('.has-submenu').forEach(li => {
        li.classList.remove('submenu-open');
        const trigger = li.querySelector('.submenu-trigger');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  document.addEventListener('click', (event) => {
    if (!headerNav.contains(event.target) && !menuToggle.contains(event.target)) {
      navList.querySelectorAll('.has-submenu').forEach(li => {
        li.classList.remove('submenu-open');
        const trigger = li.querySelector('.submenu-trigger');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
}
