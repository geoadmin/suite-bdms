import { login } from "../testHelpers";
import license from "../../fixtures/license.json";

describe("Admin about page tests", () => {
  beforeEach(() => login("/setting/about"));

  it("shows version information linking the corresponding release on GitHub.", () => {
    cy.get('[data-cy="version"]')
      .should("contain", "0.0.99+dev")
      .should(
        "have.attr",
        "href",
        "https://github.com/geoadmin/suite-bdms/releases/tag/v0.0.99",
      );
  });

  it("shows license information (with fixtures)", () => {
    cy.intercept("/license.json", license);

    cy.get('[data-cy^="credits-"]').should("have.length", 2);
    cy.get('[data-cy="credits-example-js@0.0.999"]').should(
      "contain",
      "example-js (Version 0.0.999)",
    );
    cy.get('[data-cy="credits-example-react@0.0.111"]').should(
      "contain",
      "example-react (Version 0.0.111)",
    );
  });

  it("shows license information (without fixtures)", () => {
    cy.get('[data-cy^="credits-"]').should("have.length.above", 0);
  });
});
