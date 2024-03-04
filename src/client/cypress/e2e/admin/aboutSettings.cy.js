import { loginAsAdmin } from "../helpers/testHelpers";
import license from "../../fixtures/license.json";

describe("Admin about page tests", () => {
  it("shows version information linking the corresponding release on GitHub.", () => {
    loginAsAdmin();
    cy.visit("/setting/about");

    cy.get('[data-cy="version"]')
      .should("contain", "0.0.99+dev")
      .should("have.attr", "href", "https://github.com/geoadmin/suite-bdms/releases/tag/v0.0.99");
  });

  it("shows license information (with fixtures)", () => {
    cy.intercept("/license.json", license);
    loginAsAdmin();
    cy.visit("/setting/about");

    cy.get('[data-cy^="credits-"]').should("have.length", 2);
    cy.get('[data-cy="credits-example-js@0.0.999"]').should("contain", "example-js (Version 0.0.999)");
    cy.get('[data-cy="credits-example-react@0.0.111"]').should("contain", "example-react (Version 0.0.111)");
  });

  it("shows license information (without fixtures)", () => {
    loginAsAdmin();
    cy.visit("/setting/about");
    cy.get('[data-cy^="credits-"]').should("have.length.above", 0);
  });
});
