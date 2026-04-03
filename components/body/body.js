function initBody(data) {
  // Problems Grid
  const problemsGrid = document.querySelector('.problems-grid');
  if (problemsGrid && data.intro && data.intro.problems) {
    problemsGrid.innerHTML = data.intro.problems
      .map(problem => `<li>${problem}</li>`)
      .join('');
  }

  // Benefits Grid
  const benefitsGrid = document.querySelector('.benefits-grid');
  if (benefitsGrid && data.benefits && data.benefits.items) {
    benefitsGrid.innerHTML = data.benefits.items
      .map(benefit => `<li>${benefit}</li>`)
      .join('');
  }

  // Services Grid
  const servicesGrid = document.querySelector('.services-grid');
  if (servicesGrid && data.services && data.services.items) {
    servicesGrid.innerHTML = data.services.items
      .map(service => `
        <div class="service-card">
          <h3>${service.title}</h3>
          <p class="subtitle">${service.subtitle}</p>
          <p>${service.description}</p>
          <a href="#kontakt">${service.link} →</a>
        </div>
      `)
      .join('');
  }

  // Process Diagnostics
  const diagnosticsSteps = document.querySelector('[data-field="process.diagnostics"]');
  if (diagnosticsSteps && data.process && data.process.diagnostics) {
    diagnosticsSteps.innerHTML = data.process.diagnostics
      .map(step => `
        <div class="process-step">
          <div class="process-step-number">${step.step}</div>
          <h4>${step.title}</h4>
          <p>${step.description}</p>
        </div>
      `)
      .join('');
  }

  // Process Analysis
  const analysisSteps = document.querySelector('[data-field="process.analysis"]');
  if (analysisSteps && data.process && data.process.analysis) {
    analysisSteps.innerHTML = data.process.analysis
      .map(step => `
        <div class="process-step">
          <div class="process-step-number">${step.step}</div>
          <h4>${step.title}</h4>
          <p>${step.description}</p>
        </div>
      `)
      .join('');
  }

  // Testimonials - Interactive Display
  const quoteDisplay = document.querySelector('#testimonialQuote');
  const authorsContainer = document.querySelector('#testimonialsAuthors');

  if (quoteDisplay && authorsContainer && data.testimonials && data.testimonials.items) {
    const testimonials = data.testimonials.items;
    let currentIndex = 0;
    let autoRotateInterval = null;

    // Funktion zum Anzeigen eines Zitats
    function displayTestimonial(index) {
      const testimonial = testimonials[index];
      quoteDisplay.textContent = testimonial.quote;
      currentIndex = index;

      // Update active button
      const buttons = authorsContainer.querySelectorAll('.author-button');
      buttons.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === index);
      });

      // Reset auto-rotate timer
      resetAutoRotate();
    }

    // Auto-rotate Funktion
    function autoRotate() {
      const nextIndex = (currentIndex + 1) % testimonials.length;
      displayTestimonial(nextIndex);
    }

    // Auto-rotate Timer starten
    function resetAutoRotate() {
      // Alten Timer clearen
      if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
      }
      // Neuen Timer starten (2 Sekunden)
      autoRotateInterval = setInterval(autoRotate, 2000);
    }

    // erstelle die Autorenliste
    authorsContainer.innerHTML = testimonials
      .map((testimonial, index) => `
        <button class="author-button ${index === 0 ? 'active' : ''}" data-index="${index}">
          <span class="author-name">${testimonial.author}</span>
          <span class="author-role">${testimonial.title}</span>
        </button>
      `)
      .join('');

    // Add event listeners to author buttons
    authorsContainer.querySelectorAll('.author-button').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        displayTestimonial(index);
      });
    });

    // Display the first testimonial on load and start auto-rotate
    displayTestimonial(0);
  } else {
    console.warn('⚠️ Testimonials-Elemente nicht gefunden:', {
      quoteDisplay: !!quoteDisplay,
      authorsContainer: !!authorsContainer
    });
  }

  // Team Members
  const teamMembers = document.querySelector('.team-members');
  if (teamMembers && data.team && data.team.members) {
    teamMembers.innerHTML = data.team.members
      .map(member => `
        <div class="team-member">
          <h3>${member.name}</h3>
          <p class="title">${member.title}</p>
          <p class="credentials">${member.credentials}</p>
          <p class="quote">"${member.quote}"</p>
        </div>
      `)
      .join('');
  }

  // CTA Button
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      alert('Kontaktformular würde hier öffnen. Integration mit EmailService oder CRM-System erforderlich.');
    });
  }
}
