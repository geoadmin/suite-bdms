import { loginAsViewer } from "../helpers/testHelpers";

describe("Viewer tests", () => {
  it("Assures viewer cannot add, edit or delete boreholes", () => {
    loginAsViewer();
    cy.visit("/");

    cy.wait("@edit_list");
    cy.get("div[id=map]").should("be.visible");
    cy.get("tbody").children().should("have.length", 100);

    cy.get('[data-cy="app-title"]').contains("localhost");
    cy.get('[data-cy="import-borehole-button"]').should("have.attr", "class", "disabled item");
    cy.get('[data-cy="new-borehole-button"]').should("have.attr", "class", "disabled item");

    // click on borehole
    cy.contains("td", "Immanuel Christiansen").click();
    // verify all text inputs are readonly on Location tab
    cy.get('input[type="text"]').each(i => {
      cy.wrap(i).should("have.attr", "readonly");
    });

    // click on Borehole tab
    cy.get('[data-cy="borehole-menu-item"]').click();
    // verify all text inputs are readonly on Borehole tab
    cy.get('input[type="text"]').each(i => {
      cy.wrap(i).should("have.attr", "readonly");
    });
    cy.get('[data-cy="datepicker"]').each(i => {
      cy.wrap(i).should("have.attr", "class", "ui disabled left icon input datepicker-input");
    });

    cy.contains("a", "Start editing").should("not.exist");
  });
});
