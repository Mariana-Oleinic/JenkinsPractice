const { faker } = require("@faker-js/faker");

const username = faker.internet.userName();
const email = faker.internet.email();
const password = faker.internet.password();
const articleTitle = faker.lorem.word();
const articleDescription = faker.lorem.sentence();
const articleBody = faker.lorem.paragraph();
const apiUrl = Cypress.env("apiUrl");
let slug;

describe("Main Suite: API tests", () => {
  it("Should register a new account", () => {
    const requestData = {
      user: {
        email: email,
        password: password,
        username: username,
      },
    };
    cy.request({
      method: "POST",
      url: `${apiUrl}/users`,
      body: requestData,
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.user.email).to.equal(email);
      expect(response.body.user.username).to.equal(username);
    });
  });

  describe("Inner Suite", () => {
    beforeEach(() => {
      cy.headlessAuthorization(email, password);
    });

    it("Should be able to create article", () => {
      const requestData = {
        article: {
          title: articleTitle,
          description: articleDescription,
          body: articleBody,
        },
      };
      cy.get("@token").then((token) => {
        cy.request({
          url: `${apiUrl}/articles`,
          headers: { Authorization: "Token " + token },
          method: "POST",
          body: requestData,
        }).then((response) => {
          expect(response.status).to.equal(201);
          expect(response.body.article.title).to.equal(articleTitle);
          expect(response.body.article.description).to.equal(
            articleDescription
          );
          expect(response.body.article.body).to.equal(articleBody);
          expect(response.body.article.author.username).to.equal(username);
          slug = response.body.article.slug;
        });
      });
    });

    it("Should be able to delete article", () => {
      cy.get("@token").then((token) => {
        cy.request({
          url: `${apiUrl}/articles/${slug}`,
          headers: { Authorization: "Token " + token },
          method: "DELETE",
        }).then((response) => {
          expect(response.status).to.equal(204);
        });
      });
    });
  });
});
