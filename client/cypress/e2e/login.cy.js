describe('SafeLedger Login - Cypress End-to-End Suite', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  describe('Theme Switching (Seamless Light <-> Dark)', () => {
    it('toggles dark mode without page refresh and preserves state in localStorage', () => {
      // 1. Initial State
      cy.get('html').should('not.have.class', 'dark');

      // 2. Toggle to dark mode
      cy.get('[data-testid="theme-toggle"]').click();
      cy.get('html').should('have.class', 'dark');
      cy.window().its('localStorage.theme').should('eq', 'dark');

      // 3. Toggle back to light mode
      cy.get('[data-testid="theme-toggle"]').click();
      cy.get('html').should('not.have.class', 'dark');
      cy.window().its('localStorage.theme').should('eq', 'light');

      // 4. Persistence on page reload
      cy.get('[data-testid="theme-toggle"]').click();
      cy.reload();
      cy.get('html').should('have.class', 'dark');
    });
  });

  describe('Responsive Viewports Matrix', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1440, height: 900 },
    ];

    viewports.forEach(({ name, width, height }) => {
      it(`renders correctly on ${name} (${width}x${height}) without horizontal overflow`, () => {
        cy.viewport(width, height);

        cy.get('.glass-card').should('be.visible');
        cy.get('[data-testid="email-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');
        cy.get('[data-testid="login-submit"]').should('be.visible');

        // Check horizontal overflow
        cy.document().then((doc) => {
          expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth);
        });
      });
    });
  });

  describe('Authentication Flows & Validation', () => {
    it('displays client-side errors on empty submit', () => {
      cy.get('[data-testid="login-submit"]').click();
      cy.get('[data-testid="email-error"]').should('contain.text', 'Email is required');
      cy.get('[data-testid="password-error"]').should('contain.text', 'Password is required');
    });

    it('displays server error on 401 invalid credentials', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 401,
        body: { message: 'Invalid email or password' },
      }).as('loginRequest');

      cy.get('[data-testid="email-input"]').type('admin@bank.com');
      cy.get('[data-testid="password-input"]').type('WrongPass');
      cy.get('[data-testid="login-submit"]').click();

      cy.wait('@loginRequest');
      cy.get('[data-testid="server-error"]').should('contain.text', 'Invalid email or password');
    });

    it('redirects to dashboard on 200 success', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: {
          token: 'cypress-jwt-token',
          user: { id: 'usr_cy_1', name: 'Cy Admin', email: 'admin@bank.com' },
        },
      }).as('loginSuccess');

      cy.intercept('GET', '**/api/accounts', { statusCode: 200, body: [] });

      cy.get('[data-testid="email-input"]').type('admin@bank.com');
      cy.get('[data-testid="password-input"]').type('Admin123');
      cy.get('[data-testid="login-submit"]').click();

      cy.wait('@loginSuccess');
      cy.url().should('include', '/dashboard');
    });
  });
});
