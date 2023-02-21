import { newEditableBorehole, login } from "../testHelpers";

describe("Test for the borehole form.", () => {
  beforeEach(() => {
    // Assert map number of boreholes
    login("/editor");
    cy.get("div[id=map]").should("be.visible");
    cy.get("tbody").children().should("have.length", 100);

    // Add new borehole
    newEditableBorehole().as("borehole_id");
  });

  it("Adds complete layer and displays it in viewer mode, checks if fields can be optionally hidden.", () => {
    // enter original name
    cy.contains("label", "Original name")
      .next()
      .children("input")
      .type("BONES-XVII");
    cy.wait("@edit_patch");

    // navigate to stratigraphy
    cy.get('[data-cy="stratigraphy-menu-item"]').click();
    cy.get('[data-cy="add-stratigraphy-button"]').click();
    cy.wait("@stratigraphy_edit_create");
    cy.get('[data-cy="add-layer-icon"]').click();
    cy.wait("@layer");
    cy.get('[data-cy="styled-layer-0"] [data-testid="ModeEditIcon"]').click();

    cy.contains("Show all fields").children(".checkbox").click();

    // fill all dropdowns in layer
    cy.get('[data-cy="domain-dropdown"]')
      .should("have.length", 20)
      .each((el, index, list) =>
        cy
          .wrap(el)
          .scrollIntoView()
          .click({ force: true })
          .find('[role="option"]')
          .last()
          .click(),
      );

    // fill all multiselect dropdowns with an additional value
    cy.get('[aria-multiselectable="true"]')
      .should("have.length", 6)
      .each((el, index, list) => {
        cy.wrap(el)
          .scrollIntoView()
          .click({ force: true })
          .find('[role="option"]')
          .eq(1)
          .click();
        cy.wait("@stratigraphy_layer_edit_patch");
      });

    // fill text fields
    cy.get('[data-cy="depth_from"]').click().clear().type(0);
    cy.get('[data-cy="depth_to"]').click().clear().type(50);
    cy.get('[data-cy="uscs_original"]')
      .find("input")
      .click()
      .clear()
      .type("Squirrel Milk Bar");
    cy.get('[data-cy="notes"]')
      .click()
      .clear()
      .type("Shipping large amounts of almond sandwiches.");
    cy.get('[data-cy="original_lithology"]')
      .find("input")
      .click()
      .clear()
      .type("Free peanuts.");

    // fill radio
    cy.get(".ui.radio.checkbox").first().click();

    // Lithology, Lithostratigraphy and Chronostratigraphy
    cy.get('[data-cy="domain-tree"] > input')
      .should("have.length", 3)
      .each((el, index, list) => {
        cy.wrap(el).scrollIntoView().click();
        cy.get('.modal [role="listitem"]').eq(5).click();
      });

    cy.get('[data-cy="styled-layer-0"] [data-testid="ClearIcon"]').click();

    // stop editing
    cy.contains("a", "Stop editing").click();
    cy.wait("@edit_unlock");
    cy.contains("h3", "Done").click();
    cy.wait(["@edit_list", "@borehole"]);

    // go to viewer settings
    cy.get("i[class='th big icon']").click();
    cy.contains("h4", "Settings").click();
    cy.contains("h3", "Viewer").click();
    cy.contains("div", "Stratigraphy fields").click();

    // select only one default field.
    cy.contains("button", "Unselect all").click();
    cy.wait("@codes");
    cy.get(".ui.fitted.checkbox").first().click({ force: true });
    cy.wait("@codes");

    // go to viewer mode
    cy.get("i[class='th big icon']").click();
    cy.contains("h4", "Viewer").click();

    cy.wait("@borehole");

    // Click on the added borehole
    cy.contains("Location").click();
    cy.contains("Original name").next().find("input").type("BONES-XVII");
    cy.wait("@borehole");

    cy.get(".table tbody").children().first().scrollIntoView().click();

    cy.wait("@borehole");
    cy.wait(5000);

    // Click on layer
    cy.get('[data-cy="stratigraphy-layer-0"]').scrollIntoView().click();

    // Three detail rows are displayed - two by default plus one that was selected as default field.
    cy.get('[data-cy="stratigraphy-layer-details"] h6').should(
      "have.length",
      3,
    );

    // Show all fields
    cy.get(".PrivateSwitchBase-input").click({ force: true });
    cy.get('[data-cy="stratigraphy-layer-details"] h6').should(
      "have.length",
      32,
    );
  });
});
