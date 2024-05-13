import { loginAsAdmin } from "../e2e/helpers/testHelpers";

describe("Search filter tests", () => {
  it("has search filters", () => {
    loginAsAdmin();
    cy.visit("/");
    cy.get('[data-cy="show-filter-button"]').click();
    cy.contains("Filters");
  });

  it("shows the correct dropdowns", () => {
    loginAsAdmin();
    cy.visit("/");
    cy.get('[data-cy="show-filter-button"]').click();
    cy.contains("span", "Location").click();
    cy.contains("Show all fields").children().eq(0).click();
    let indentifierDropdown = cy.contains("label", "ID type").next();

    indentifierDropdown.click();
    indentifierDropdown
      .find("div[role='option']")
      .should("have.length", 12)
      .should(options => {
        expect(options[0]).to.have.text("Reset");
        expect(options[1]).to.have.text("ID Original");
      });

    cy.contains("span", "Borehole").click();
    let boreholeTypeDropdown = cy.contains("label", "Borehole type").next();

    boreholeTypeDropdown.click();
    boreholeTypeDropdown
      .find("div[role='option']")
      .should("have.length", 7)
      .should(options => {
        expect(options[0]).to.have.text("Reset");
        expect(options[1]).to.have.text("borehole");
        expect(options[2]).to.have.text("virtual borehole");
        expect(options[3]).to.have.text("penetration test");
        expect(options[4]).to.have.text("trial pit");
        expect(options[5]).to.have.text("other");
        expect(options[6]).to.have.text("not specified");
      });
  });

  it("checks that the registration filter settings control the filter visibility.", () => {
    // precondition filters not visible
    loginAsAdmin();
    cy.visit("/");
    cy.get('[data-cy="show-filter-button"]').click();
    cy.contains("Registration").click();
    cy.contains("Show all fields")
      .next()
      .within(() => {
        cy.contains("Created by").should("not.exist");
        cy.contains("Creation date").should("not.exist");
      });

    // turn on registration filters
    cy.get('[data-cy="settings-button"]').click();
    cy.contains("Registration filters").click();
    cy.contains("Select all").click();
    cy.wait("@setting");

    // check visibility of filters
    cy.contains("h3", "Done").click();
    cy.get('[data-cy="show-filter-button"]').click();
    cy.contains("Registration").click();
    cy.contains("Created by");
    cy.contains("Creation date");

    // reset setting
    cy.get('[data-cy="settings-button"]').click();
    cy.contains("Registration filters").click();
    cy.contains("Unselect all").click();
    cy.wait("@setting");
  });

  it("filters boreholes by creator name", () => {
    loginAsAdmin();
    cy.visit("/");
    cy.get('[data-cy="show-filter-button"]').click();
    cy.contains("Registration").click();
    cy.contains("Show all fields").children(".checkbox").click();

    // input value
    cy.contains("Created by").next().find("input").type("v_ U%r");
    cy.wait("@edit_list");

    // check content of table
    cy.get('[data-cy="borehole-table"] tbody')
      .children()
      .should("have.length", 100)
      .each(el => {
        cy.wrap(el).contains("v. user");
      });
  });

  it("filters boreholes by color and uscs3", () => {
    loginAsAdmin();
    cy.visit("/");
    cy.get('[data-cy="show-filter-button"]').click();
    cy.contains("Lithology").click();
    cy.contains("Show all fields").children(".checkbox").click();

    let colorDropdown = cy.contains("label", "Colour").next();

    colorDropdown.click();
    colorDropdown
      .find("div[role='option']")
      .should("have.length", 25)
      .should(options => {
        expect(options[0]).to.have.text("Reset");
        expect(options[1]).to.have.text("beige");
      })
      .then(options => {
        cy.wrap(options).contains("beige").click();
      });

    cy.wait("@edit_list");
    cy.get('[data-cy="borehole-table"] tbody').children().should("have.length", 100);

    let uscs3Dropdown = cy.contains("label", "USCS 3").next();
    uscs3Dropdown.click();
    uscs3Dropdown
      .find("div[role='option']")
      .should("have.length", 36)
      .should(options => {
        expect(options[0]).to.have.text("Reset");
        expect(options[2]).to.have.text("lean clay");
      })
      .then(options => {
        cy.wrap(options).contains("gravel").click();
      });

    cy.wait("@edit_list");

    // check content of table
    cy.get('[data-cy="borehole-table"] tbody').children().should("have.length", 39);
  });

  function filterByOriginalLithology() {
    cy.contains("Lithology").click();
    cy.contains("Show all fields").children(".checkbox").click();
    cy.contains("Original lithology").next().find("input").type("Wooden Chair");
  }

  it("filters boreholes by original lithology in editor mode", () => {
    loginAsAdmin();
    cy.visit("/");
    cy.get('[data-cy="show-filter-button"]').click();
    filterByOriginalLithology();
    cy.wait("@edit_list");
    cy.get('[data-cy="borehole-table"] tbody').children().should("have.length", 21);
  });

  it("filters boreholes by creation date", () => {
    loginAsAdmin();
    cy.visit("/");
    cy.get('[data-cy="show-filter-button"]').click();
    cy.contains("Registration").click();
    cy.contains("Show all fields").children(".checkbox").click();

    // input values
    cy.contains("Creation date").next().find(".react-datepicker-wrapper .datepicker-input").click();

    cy.get(".react-datepicker__year-select").select("2021");
    cy.get(".react-datepicker__month-select").select("November");
    cy.get(".react-datepicker__day--009").click();

    cy.wait("@edit_list");

    cy.contains("Creation date").parent().parent().next().find(".react-datepicker-wrapper .datepicker-input").click();

    cy.get(".react-datepicker__year-select").select("2021");
    cy.get(".react-datepicker__month-select").select("November");
    cy.get(".react-datepicker__day--010").click();

    cy.wait("@edit_list");

    // check content of table
    cy.get('[data-cy="borehole-table"] tbody').children().should("have.length", 3);

    cy.contains("td", "09.11.2021");
  });

  it("filters boreholes by workgroup", () => {
    loginAsAdmin();
    cy.visit("/");
    cy.get('[data-cy="show-filter-button"]').click();
    cy.contains("Workgroup").click();
    cy.contains("Default").click();
    cy.wait("@borehole");
  });
});
