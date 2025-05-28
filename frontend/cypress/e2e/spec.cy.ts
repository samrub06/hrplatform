describe('Navigation', () => {
  it('should navigate to the about page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/login')
     cy.get('input[name="email"]').type('test@test.com')
    cy.get('input[name="password"]').type('password')
    cy.get('div').contains('Welcome back')

  })
})