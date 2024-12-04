describe('Createflow after Login', () => {
  beforeEach(() => {
    // Mock API response for login
    cy.intercept('POST', '/api/token', {
      body: {
        user: {id: 2, name: 'Test User', email: 'test123@example.com'},
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxMjNAZXhhbXBsZS5jb20iLCJpZCI6Mn0.PnNyFyYQpAg13LU9zcCR9UACtKElK42PxvdjSkwW_9w',
      },
    }).as('postLogin');
  });

  it('Logs in, creates a workflow, and verifies the workflow page', () => {
    // Visit the homepage
    cy.visit('/');
    cy.wait(2000);

    // Click on the "Get Started" button
    cy.contains('Get Started').click();
    cy.wait(1000);

    // Enter email and password
    cy.get('input#email').type('test123@example.com'); // Adjust selectors as needed
    cy.wait(1000);
    cy.get('input#password').type('Testing123+$');
    cy.wait(1000);

    // Submit the login form
    cy.get('button[type="submit"]').click();

    // Wait for the login request to complete
    cy.wait('@postLogin');

    cy.wait(1000);

    // Store the awesomeUsersToken in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('awesomeUsersToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxMjNAZXhhbXBsZS5jb20iLCJpZCI6Mn0.PnNyFyYQpAg13LU9zcCR9UACtKElK42PxvdjSkwW_9w');
    });

    cy.visit('/home/2')
    cy.wait(1000);

    // Simulate hover over the vertical navbar
    cy.get('.vertical-navbar').trigger('mouseover');
    cy.wait(1000);

    // Open CreateflowPopup
    cy.get('.bi-file-earmark-plus-fill').click();
    cy.get('.option').click();
    cy.wait(1000);

    cy.get('[type="text"]').type('Testing Workflow');
    cy.get('[type="email"]').type('test123@example.com');
    cy.get('[type="password"]').type('asdfghjk');
    cy.get('.input-fields > button').click();

    // Assert that the .py-5 element is visible
    cy.get('.py-5').should('be.visible');

    // Optionally, assert its text or content
    cy.get('.py-5').should('contain.text', 'Workflow:');

  })
})