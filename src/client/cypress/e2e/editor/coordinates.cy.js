import { newEditableBorehole, delayedType } from "../helpers/testHelpers";

function checkDecimalPlaces(inputAlias, expectedDecimalPlaces) {
  cy.get(inputAlias)
    .invoke("val")
    .then(val => {
      const parts = val.split(".");
      expect(parts[1]).to.have.length(expectedDecimalPlaces);
    });
}

function waitForCoordinatePatches() {
  cy.wait([
    "@edit_patch",
    "@edit_patch",
    "@edit_patch",
    "@edit_patch",
    "@edit_patch",
    "@edit_patch",
    "@edit_patch",
    "@edit_patch",
    "@edit_patch",
  ]);
}

describe("Tests for editing coordinates of a borehole.", () => {
  beforeEach(() => {
    newEditableBorehole().as("borehole_id");

    cy.get('[data-cy="LV95X"]').as("LV95X-input");
    cy.get('[data-cy="LV95Y"]').as("LV95Y-input");
    cy.get('[data-cy="LV03X"]').as("LV03X-input");
    cy.get('[data-cy="LV03Y"]').as("LV03Y-input");
    cy.get('[data-cy="country"] > input').as("country");
    cy.get('[data-cy="canton"] > input').as("canton");
    cy.get('[data-cy="municipality"] > input').as("municipality");
  });

  it("creates new borehole and adds coordinates", () => {
    // fill inputs for LV95
    cy.wait(500);
    cy.get("@LV95X-input").type("2645123");
    cy.wait(500);
    cy.get("@LV95Y-input").type("1245794");
    // wait edits of all 4 inputs to complete
    cy.wait(["@location", "@edit_patch", "@edit_patch", "@edit_patch"]);
    // verify automatically filled inputs for LV03
    cy.get("@LV95Y-input").should("have.value", "1'245'794");
    cy.get("@LV03Y-input").should("have.value", "245'794");
    cy.get("@LV03X-input").should("have.value", "645'122");
    // verify location set
    cy.get("@country").should("have.value", "Schweiz");
    cy.get("@canton").should("have.value", "Aargau");
    cy.get("@municipality").should("have.value", "Oberentfelden");

    //switch reference system
    cy.get("input[value=20104002]").click();
    //await all patch requests
    cy.wait(["@edit_patch", "@edit_patch", "@edit_patch"]);
    // verify all inputs are empty
    cy.get("@LV95X-input").should("be.empty");
    cy.get("@LV95Y-input").should("be.empty");
    cy.get("@LV03X-input").should("be.empty");
    cy.get("@LV03Y-input").should("be.empty");
    cy.get("@country").should("have.value", "");
    cy.get("@canton").should("have.value", "");
    cy.get("@municipality").should("have.value", "");
  });

  it("validates inputs", () => {
    // divs have errors as long as inputs are empty
    cy.get("[name=location_x_lv03]").should("have.class", "error");
    cy.get("[name=location_y_lv03]").should("have.class", "error");
    cy.get("[name=location_x]").should("have.class", "error");
    cy.get("[name=location_y]").should("have.class", "error");

    // type valid coordinates
    cy.get("@LV95X-input").scrollIntoView();
    delayedType(cy.get("@LV95X-input"), "2645123.12124");
    cy.get("@LV95Y-input").scrollIntoView();
    delayedType(cy.get("@LV95Y-input"), "1245794.92348");

    // divs have errors as long as inputs are empty
    cy.get("[name=location_x_lv03]").should("not.have.class", "error");
    cy.get("[name=location_y_lv03]").should("not.have.class", "error");
    cy.get("[name=location_x]").should("not.have.class", "error");
    cy.get("[name=location_y]").should("not.have.class", "error");

    // wait edits of all 4 inputs to complete
    cy.wait(["@location", "@edit_patch", "@edit_patch", "@edit_patch", "@edit_patch"]);

    // type coordinates that are out of bounds
    cy.get("@LV95X-input").clear();
    delayedType(cy.get("@LV95X-input"), "264512");

    cy.get("@LV95Y-input").clear();
    delayedType(cy.get("@LV95Y-input"), "124579");

    // divs that changed have errors
    cy.get("[name=location_x_lv03]").should("not.have.class", "error");
    cy.get("[name=location_y_lv03]").should("not.have.class", "error");
    cy.get("[name=location_x]").should("have.class", "error");
    cy.get("[name=location_y]").should("have.class", "error");
  });

  it("edits borehole and changes coordinates from map", () => {
    //start with references system LV03
    cy.get("input[value=20104002]").click();
    cy.get("input[value=20104002]").should("be.checked");

    // verify automatically filled inputs
    cy.get("@LV95X-input").should("have.value", "");
    cy.get("@LV95Y-input").should("have.value", "");
    cy.get("@LV03X-input").should("have.value", "");
    cy.get("@LV03Y-input").should("have.value", "");
    cy.get("@country").should("have.value", "");
    cy.get("@canton").should("have.value", "");
    cy.get("@municipality").should("have.value", "");

    // zoom into map
    cy.get('[class="ol-zoom-in"]').click({ force: true });
    cy.get('[class="ol-zoom-in"]').click({ force: true });

    cy.wait(2000);
    // click on map
    cy.get('[class="ol-viewport"]').scrollIntoView().click(390, 250, { force: true });

    cy.wait("@location");
    cy.get('[data-cy="apply-button"]').click();

    // verify automatically filled inputs
    cy.get("@LV95X-input").should("not.have.value", "");
    cy.get("@LV95Y-input").should("not.have.value", "");
    cy.get("@LV03X-input").should("not.have.value", "");
    cy.get("@LV03Y-input").should("not.have.value", "");
    cy.get("@country").should("not.have.value", "");
    cy.get("@canton").should("not.have.value", "");
    cy.get("@municipality").should("not.have.value", "");

    // verify original reference system has switched to LV95
    cy.get("input[value=20104002]").should("not.be.checked");
    cy.get("input[value=20104001]").should("be.checked");

    waitForCoordinatePatches();

    // verify that all inputs have a precision of 2 decimal places
    checkDecimalPlaces("@LV95X-input", 2);
    checkDecimalPlaces("@LV95Y-input", 2);
    checkDecimalPlaces("@LV03X-input", 2);
    checkDecimalPlaces("@LV03Y-input", 2);
  });

  it("validates decimal precision", () => {
    // Type valid coordinates with zeros after decimal
    cy.get("@LV95X-input").scrollIntoView().type("2645123.0000").trigger("input");
    cy.get("@LV95Y-input").scrollIntoView().type("1245794.000").trigger("input");
    waitForCoordinatePatches();

    checkDecimalPlaces("@LV03X-input", 4);
    checkDecimalPlaces("@LV03Y-input", 4);

    // Navigate somewhere else and return
    cy.get('[data-cy="borehole-menu-item"]').click();
    cy.get('[data-cy="location-menu-item"]').click();

    // Check that the values are still the same
    cy.get("@LV95X-input").should("have.value", `2'645'123.0000`);
    cy.get("@LV95Y-input").should("have.value", `1'245'794.000`);

    // Add more zeros to LV95Y input
    cy.get("@LV95Y-input").scrollIntoView();
    cy.get("@LV95Y-input").clear();
    cy.get("@LV95Y-input").type("1245794.00000").trigger("input");
    waitForCoordinatePatches();

    checkDecimalPlaces("@LV03X-input", 5);
    checkDecimalPlaces("@LV03Y-input", 5);

    //switch reference system to LV03
    cy.get("input[value=20104002]").click();
    waitForCoordinatePatches();

    cy.get("@LV03X-input").scrollIntoView().type("645123.0").trigger("input");
    cy.get("@LV03Y-input").scrollIntoView().type("245794.000").trigger("input");
    waitForCoordinatePatches();

    checkDecimalPlaces("@LV95X-input", 3);
    checkDecimalPlaces("@LV95Y-input", 3);

    // Navigate somewhere else and return
    cy.get('[data-cy="borehole-menu-item"]').click();
    cy.get('[data-cy="location-menu-item"]').click();

    // Check that the values are still the same
    cy.get("@LV03X-input").should("have.value", `645'123.0`);
    cy.get("@LV03Y-input").should("have.value", `245'794.000`);

    // Delete zeros from LV03Y input
    cy.get("@LV03Y-input").scrollIntoView();
    cy.get("@LV03Y-input").clear();
    cy.get("@LV03Y-input").type("245794.0").trigger("input");
    waitForCoordinatePatches();

    checkDecimalPlaces("@LV95X-input", 1);
    checkDecimalPlaces("@LV95Y-input", 1);
  });
});
