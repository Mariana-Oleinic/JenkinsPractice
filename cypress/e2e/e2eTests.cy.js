const { faker } = require("@faker-js/faker");

const username = faker.internet.userName();
const email = faker.internet.email();
const password = faker.internet.password();
const articleTitle = faker.lorem.word();
const articleDescription = faker.lorem.sentence();
const articleBody = faker.lorem.paragraph();

describe("Main Suite: E2E tests", () => {
  it("Should register a new account", () => {
    cy.visit("/");
    cy.contains("Sign up").click();
    cy.location("pathname").should("contain", "register");
    cy.get('[placeholder="Username"]').type(username);
    cy.get('[placeholder="Email"]').type(email);
    cy.get('[placeholder="Password"]').type(password);
    cy.get('button[type="submit"]').should("be.enabled").click();
    cy.location("pathname").should("eq", "/");
    cy.contains("Home");
    cy.contains(username);
  });

  describe("Inner Suite", () => {
    beforeEach(() => {
      cy.signIn(email, password);
    });

    afterEach(() => {
      cy.logout();
    });

    it("Should be able to create article", () => {
      cy.contains("New Article").click();
      cy.location("pathname").should("contain", "editor");
      cy.get('[formcontrolname="title"]').type(articleTitle);
      cy.get('[formcontrolname="description"]').type(articleDescription);
      cy.get('[formcontrolname="body"]').type(articleBody);
      cy.get('[placeholder="Enter tags"]').type("Cypress");
      cy.contains("Publish Article").click();
      cy.location("pathname").should("contain", "article");
      cy.contains(articleBody);
    });

    it("Should be able to delete article", () => {
      cy.contains(username).click();
      cy.location("pathname").should("contain", `profile/${username}`);
      cy.wait(1000);
      cy.contains(articleTitle).click();
      cy.contains("Delete Article").click();
      cy.wait(1000);
      cy.get("app-article-list").each((article) => {
        cy.wrap(article).within(() => {
          cy.get("h1").invoke("text").should("not.contain", articleTitle);
        });
      });
    });
  });
});
