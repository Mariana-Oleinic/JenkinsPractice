const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  env: {
    apiUrl: "https://conduit-api.bondaracademy.com/api",
  },
  e2e: {
    baseUrl: "https://conduit.bondaracademy.com",
    specPattern: "cypress/{e2e,api}/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
