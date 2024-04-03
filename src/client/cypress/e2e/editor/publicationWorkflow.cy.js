import { createBorehole, loginAsAdmin } from "../helpers/testHelpers";

const verifyColorForStatus = (status, color) => {
  cy.get(`[data-cy=workflow_status_color_${status}]`).should("have.have.class", `ui ${color} circular label`);
};

const statusTitles = {
  edit: "Change in progress",
  control: "In review",
  valid: "In validation",
  public: "Publication",
};

const verifyStatusTextsInHeader = status => {
  status.forEach(s => {
    cy.get("[data-cy=workflow_status_header]").should("contain", statusTitles[s]);
  });
};

const verifyStatusTextsNotInHeader = status => {
  status.forEach(s => {
    cy.get("[data-cy=workflow_status_header]").should("not.contain", statusTitles[s]);
  });
};

describe("Tests the publication workflow.", () => {
  it("Publishes a borehole without rejections", () => {
    createBorehole({ "extended.original_name": "Borehole to publish" }).as("borehole_id");
    cy.get("@borehole_id").then(id => {
      loginAsAdmin();
      cy.visit(`/${id}`);
    });
    cy.contains("a", "Start editing").click();

    verifyStatusTextsInHeader(["edit"]);
    verifyStatusTextsNotInHeader(["control", "valid", "public"]);
    verifyColorForStatus("edit", "orange");

    // Submit for review
    cy.get("[data-cy=workflow_submit]").click();
    cy.get("[data-cy=workflow_dialog_submit]").click();

    verifyStatusTextsInHeader(["edit", "control"]);
    verifyStatusTextsNotInHeader(["valid", "public"]);
    verifyColorForStatus("edit", "green");
    verifyColorForStatus("control", "orange");

    // Submit for validation
    cy.contains("a", "Start editing").click();
    cy.get("[data-cy=workflow_submit]").click();
    cy.get("[data-cy=workflow_dialog_submit]").click();

    verifyStatusTextsInHeader(["edit", "control", "valid"]);
    verifyStatusTextsNotInHeader(["public"]);
    verifyColorForStatus("edit", "green");
    verifyColorForStatus("control", "green");
    verifyColorForStatus("valid", "orange");

    // Submit for publication
    cy.contains("a", "Start editing").click();
    cy.get("[data-cy=workflow_submit]").click();
    cy.get("[data-cy=workflow_dialog_submit]").click();

    verifyStatusTextsInHeader(["edit", "control", "valid", "public"]);

    verifyColorForStatus("edit", "green");
    verifyColorForStatus("control", "green");
    verifyColorForStatus("valid", "green");
    verifyColorForStatus("public", "orange");

    // Publicate
    cy.contains("a", "Start editing").click();
    cy.get("[data-cy=workflow_submit]").click();
    cy.get("[data-cy=workflow_dialog_submit]").click();
    verifyColorForStatus("public", "green");

    // Restart workflow
    cy.contains("a", "Start editing").click();
    cy.contains("span", "Restart the workflow").click();
    cy.get("[data-cy=workflow_dialog_confirm_restart]").click();
    cy.wait("@workflow_edit_list");

    verifyStatusTextsInHeader(["edit"]);
    verifyStatusTextsNotInHeader(["control", "valid", "public"]);

    verifyColorForStatus("edit", "orange");
    verifyColorForStatus("control", "red");
    verifyColorForStatus("valid", "red");
    verifyColorForStatus("public", "red");
  });
});
