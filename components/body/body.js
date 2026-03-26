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

  // Testimonials
  const testimonialsGrid = document.querySelector('.testimonials-grid');
  if (testimonialsGrid && data.testimonials && data.testimonials.items) {
    testimonialsGrid.innerHTML = data.testimonials.items
      .map(testimonial => `
        <div class="testimonial-card">
          <p class="testimonial-quote">${testimonial.quote}</p>
          <p class="testimonial-author">${testimonial.author}</p>
          <p class="testimonial-title">${testimonial.title}</p>
        </div>
      `)
      .join('');
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
