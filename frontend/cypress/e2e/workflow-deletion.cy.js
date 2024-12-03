describe('Workflow Deletion', () => {
  beforeEach(() => {
    // Mock API response for login
    cy.intercept('POST', '/api/token', {
      body: {
        user: { id: 9, name: 'Test User', email: 'test123@example.com' },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxMjNAZXhhbXBsZS5jb20iLCJpZCI6OX0.e99J-IKJ_U8dcS0dYSo9oe5EXsGLrwW4iyUZkEGxduI',
      },
    }).as('postLogin');
  });

  it('Deletes a workflow and verifies the deletion', () => {
    // Visit the login page and perform login
    cy.visit('/');
    cy.contains('Get Started').click();
    cy.get('input#email').type('test123@example.com');
    cy.get('input#password').type('Testing123+$');
    cy.get('button[type="submit"]').click();
    cy.wait('@postLogin');
    cy.window().then((win) => {
      win.localStorage.setItem(
          'awesomeUsersToken',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxMjNAZXhhbXBsZS5jb20iLCJpZCI6OX0.e99J-IKJ_U8dcS0dYSo9oe5EXsGLrwW4iyUZkEGxduI'
      );
    });

    cy.visit('/home/9');
    cy.wait(1000);

    // Simulate hover over the vertical navbar
    cy.get('.vertical-navbar').trigger('mouseover');
    cy.wait(1000);

    // Navigate to the workflows page
    cy.get('.bi-collection-fill').trigger('mouseover');
    cy.get('.bi-collection-fill').click();
    cy.url().should('include', '/myflows/9');
    cy.wait(1000);

    // Hover the card then perform deletion
    cy.get(':nth-child(1) > .card > .card-body').trigger('mouseover');
    cy.wait(1000);
    cy.get(':nth-child(1) > .card > .card-body > .workflow-buttons > .delete-workflow-btn').click();
    cy.wait(1000);
    cy.get('.btn-danger').click();
    cy.wait(1000);
  });
});
