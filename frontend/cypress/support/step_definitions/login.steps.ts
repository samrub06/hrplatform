import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given('I am on the login page', () => {
  cy.visit('/login');
});

When('I enter my email {string}', (email: string) => {
  cy.get('input[name="email"]').type(email);
});

When('I enter my password {string}', (password: string) => {
  cy.get('input[name="password"]').type(password);
});

When('I click the login button', () => {
  cy.get('button[type="submit"]').click();
});

When('I click the login button', () => {
  cy.get('button[type="submit"]').click();
  cy.request('POST', '/api/login', {
    email: 'test@test.com',
    password: 'password'
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});





Then('I should see the message {string}', (message: string) => {
  cy.get('div').contains(message);
}); 