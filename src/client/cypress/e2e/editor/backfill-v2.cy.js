import {
  loginAsAdmin,
  bearerAuth,
  createBorehole,
  startBoreholeEditing,
  setTextfield,
  openDropdown,
  selectDropdownOption,
} from "../testHelpers";

describe("Backfill crud tests", () => {
  it("add, edit and delete backfills", () => {
    createBorehole({ "extended.original_name": "INTEADAL" })
      .as("borehole_id")
      .then(id =>
        cy.get("@id_token").then(token => {
          cy.request({
            method: "POST",
            url: "/api/v2/completion",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            body: {
              boreholeId: id,
              isPrimary: true,
              kindId: 16000002,
            },
            auth: bearerAuth(token),
          }).then(response => {
            expect(response).to.have.property("status", 200);
          });
        }),
      );

    // open completion editor
    cy.get("@borehole_id").then(id => {
      loginAsAdmin();
      cy.visit(`/editor/${id}/completion/v2`);
    });

    cy.wait("@get-completions-by-boreholeId");

    // start editing session
    startBoreholeEditing();

    // Necessary to wait for the backfill data to be loaded.
    cy.wait(1000);

    // select backfill tab
    cy.get("[data-cy=completion-content-header-tab-Backfill]").click();
    cy.wait("@backfill_GET");

    // add new backfill card
    cy.get('[data-cy="add-backfill-button"]').click({ force: true });

    // Necessary to wait for the backfill form to be loaded.
    cy.wait(1000);

    // fill out form
    setTextfield('[data-cy="notes-textfield"]', "Lorem.");
    setTextfield('[data-cy="fromDepth"]', "123456");
    setTextfield('[data-cy="toDepth"]', "987654");

    openDropdown("backfill-kind-select");
    selectDropdownOption(2);

    openDropdown("backfill-material-select");
    selectDropdownOption(1);

    // save backfill
    cy.get('[data-cy="save-icon"]').click();

    // check if backfill is saved
    cy.contains("123456");
    cy.contains("987654");
    cy.contains("Lorem.");
    cy.contains("casing plugging");
    cy.contains("filter gravel");

    // edit backfill
    cy.get('[data-cy="edit-icon"]').click({ force: true });

    cy.wait("@backfill_GET");

    cy.get('input[name="fromDepth"]')
      .click()
      .then(() => {
        cy.get('input[name="fromDepth"]').type("222", {
          delay: 10,
        });
      });

    // Necessary to wait, otherwise the type is not finished yet.
    // It cannot be checked for the value of the input element, because the value is not updated yet.
    cy.wait(1000);

    // close editing mask
    cy.get('[data-cy="save-icon"]').click({ force: true });
    cy.contains("123456222");
    cy.contains("inactive");

    // delete backfill
    cy.get('[data-cy="delete-icon"]').click({ force: true });
    cy.contains("From depth").should("not.exist");
  });
});
