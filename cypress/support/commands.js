// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("signIn", (email, password) => {
  cy.visit("/");
  cy.contains("Sign in").click();
  cy.get('[placeholder="Email"]').type(email);
  cy.get('[placeholder="Password"]').type(password);
  cy.get('button[type="submit"]').click();
});
Cypress.Commands.add("logout", () => {
  cy.contains("Settings").click();
  cy.contains("Or click here to logout.").click();
});

Cypress.Commands.add("headlessAuthorization", (email, password) => {
  const apiUrl = Cypress.env("apiUrl");
  const userCredentials = {
    user: {
      email: email,
      password: password,
    },
  };

  cy.request({
    method: "POST",
    url: `${apiUrl}/users/login`,
    body: userCredentials,
  })
    .its("body")
    .then((body) => {
      const token = body.user.token;
      cy.wrap(token).as("token");
      cy.visit("/", {
        onBeforeLoad(win) {
          win.localStorage.setItem("jwtToken", token);
        },
      });
    });
});
