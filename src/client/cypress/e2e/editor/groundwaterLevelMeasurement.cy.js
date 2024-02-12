import {
  createBorehole,
  loginAsAdmin,
  startBoreholeEditing,
  createCompletion,
} from "../helpers/testHelpers";
import {
  evaluateDisplayValue,
  setInput,
  setSelect,
} from "../helpers/formHelpers";

describe("Tests for the groundwater level measurement editor.", () => {
  it("Creates, updates and deletes groundwater level measurement", () => {
    createBorehole({ "extended.original_name": "INTEADAL" })
      .as("borehole_id")
      .then(id => createCompletion("test hydrotest", id, 16000002, true))
      .then(response => {
        expect(response).to.have.property("status", 200);
      });
    cy.get("@borehole_id").then(id => {
      loginAsAdmin();
      cy.visit(`/editor/${id}/completion`);
    });
    startBoreholeEditing();
    cy.get("[data-cy=completion-content-header-tab-Casing]").click();
    cy.wait("@casing_GET");

    cy.get('[data-cy="addCasing-button"]').click({ force: true });
    cy.wait("@codelist_GET");

    setInput("name", "casing-1");
    setInput("fromDepth", "0");
    setInput("toDepth", "10");
    setSelect("kindId", 2);
    setSelect("materialId", 3);
    setInput("dateStart", "2021-01-01");
    setInput("dateFinish", "2021-01-02");
    setInput("innerDiameter", "3");
    setInput("outerDiameter", "4");

    cy.get('[data-cy="save-button"]').click();
    cy.wait("@casing_GET");

    cy.get('[data-cy="hydrogeology-menu-item"]').click({ force: true });
    cy.get('[data-cy="groundwaterlevelmeasurement-menu-item"]').click({
      force: true,
    });

    // switch to german
    cy.get('[data-cy="menu"]').click({ force: true });
    cy.contains("span", "DE").click({ force: true });

    // create groundwater level measurement
    cy.get('[data-cy="addGroundwaterLevelMeasurement-button"]').click({
      force: true,
    });
    cy.wait("@groundwaterlevelmeasurement_GET");

    setSelect("kindId", 2);
    setSelect("reliabilityId", 1);
    setSelect("casingId", 1);
    setInput("startTime", "2012-11-14T12:06");
    setInput("levelM", "789.12");
    setInput("levelMasl", "5.4567");

    // close editing mask
    cy.get('[data-cy="save-button"]').click({ force: true });
    evaluateDisplayValue("casingName", "casing-1");
    evaluateDisplayValue("gwlm_kind", "Manometer");
    evaluateDisplayValue("gwlm_levelm", "789.12");
    evaluateDisplayValue("gwlm_levelmasl", "5.4567");
    evaluateDisplayValue("reliability", "fraglich");

    // edit groundwater level measurement
    cy.get('[data-cy="edit-button"]').click({ force: true });
    setSelect("kindId", 1);
    cy.get('[data-cy="save-button"]').click({ force: true });
    evaluateDisplayValue("gwlm_kind", "Drucksonde");
    evaluateDisplayValue("casingName", "casing-1");

    // delete groundwater level measurement
    cy.get('[data-cy="delete-button"]').click({ force: true });
    cy.wait("@groundwaterlevelmeasurement_DELETE");
    cy.get("body").should("not.contain", "Drucksonde");
  });
});
