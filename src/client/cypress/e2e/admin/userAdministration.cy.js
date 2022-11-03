import { interceptApiCalls, login } from "../testHelpers";

describe("Admin settings test", () => {
  it("displays correct message when enabling user.", () => {
    interceptApiCalls();

    login("/setting/admin");

    cy.get('[data-cy="user-list-table-body"]')
      .children()
      .should("have.length", 7);

    // add user
    cy.get('[placeholder="Username"]').type("Testuser");
    cy.get('[placeholder="Password"]').type("123456");
    cy.get('[placeholder="Firstname"]').type("Cinnabuns");
    cy.get('[placeholder="Surname"]').type("Moonshine");
    cy.get('[data-cy="add-user-button"]').click();

    cy.get('[data-cy="user-list-table-body"]')
      .children()
      .should("have.length", 8);

    // disable user
    let newUserRow = cy
      .get('[data-cy="user-list-table-body"]')
      .children()
      .first();
    cy.contains("Testuser");
    cy.contains("Cinnabuns");
    cy.contains("Moonshine");
    newUserRow.contains("td", "Disable").click();

    cy.get('.modal [data-cy="disable-user-button"]').click();

    cy.get('[data-cy="user-list-table-body"]')
      .children()
      .should("have.length", 7);

    // show disabled users
    cy.contains("show Disabled").click();

    cy.get('[data-cy="user-list-table-body"]')
      .children()
      .should("have.length", 1);

    // enable user
    newUserRow = cy.get('[data-cy="user-list-table-body"]').children().first();
    newUserRow.contains("td", "Enable").click();

    cy.get(".modal p").should(
      "contain",
      'You are going to re-enable the user "Testuser". This user will be able to login and apply modifications based on its roles.',
    );

    cy.get('.modal [data-cy="enable-user-button"]').click();

    // show all users
    cy.contains("show all").click();

    cy.get('[data-cy="user-list-table-body"]')
      .children()
      .should("have.length", 8);

    // permanently delete test user
    newUserRow = cy.get('[data-cy="user-list-table-body"]').children().first();
    newUserRow.contains("td", "Disable").click();

    cy.get('.modal [data-cy="permanently-delete-user-button"]').click();
  });

  it("can add user with admin role.", () => {
    interceptApiCalls();

    login("/setting/admin");

    cy.get('[data-cy="user-list-table-body"]')
      .children()
      .should("have.length", 7);

    // add admin user
    cy.get('[data-cy="admin-checkbox"]').click();

    cy.get('[placeholder="Username"]').type("Bugby");
    cy.get('[placeholder="Password"]').type("Pea%a-boo3Moanihill");
    cy.get('[placeholder="Firstname"]').type("Doodoohill");
    cy.get('[placeholder="Surname"]').type("Gummoo");
    cy.get('[data-cy="add-user-button"]').click();

    cy.get('[data-cy="user-list-table-body"]')
      .children()
      .should("have.length", 8);

    // contains "Yes" in administrator column
    const newAdminUserRow = cy
      .get('[data-cy="user-list-table-body"]')
      .children()
      .first();
    newAdminUserRow.contains("td", "Yes");
    newAdminUserRow.click();

    // click of "New user" resets admin checkbox
    cy.get('[data-cy="admin-checkbox"]')
      .children()
      .first()
      .should("be.checked");
    cy.contains("New User").click();
    cy.get('[data-cy="admin-checkbox"]')
      .children()
      .first()
      .should("not.be.checked");

    // add non admin user
    cy.get('[placeholder="Username"]').type("Wiggleton");
    cy.get('[placeholder="Password"]').type("Trashbug");
    cy.get('[placeholder="Firstname"]').type("Chewbrain");
    cy.get('[placeholder="Surname"]').type("Pimplehill");
    cy.get('[data-cy="add-user-button"]').click();

    cy.get('[data-cy="user-list-table-body"]')
      .children()
      .should("have.length", 9);

    // contains "No" in administrator column
    const newViewerUserRow = cy
      .get('[data-cy="user-list-table-body"]')
      .children()
      .eq(1);
    newViewerUserRow.contains("td", "No");

    // permanently delete test users
    let userRow = cy.get('[data-cy="user-list-table-body"]').children().first();
    userRow.contains("td", "Disable").click();
    cy.get('.modal [data-cy="permanently-delete-user-button"]').click();

    cy.wait(["@user_reload", "@user_edit_list"]);
    cy.wait(2000);

    userRow = cy.get('[data-cy="user-list-table-body"]').children().first();
    userRow.contains("td", "Disable").click();
    cy.get('.modal [data-cy="permanently-delete-user-button"]').click();
  });

  it("cannot delete users with associated files.", () => {
    interceptApiCalls();

    login("/setting/admin");

    cy.get('[data-cy="user-list-table-body"]')
      .children()
      .should("have.length", 7);

    // Try to delete user that only has associated files
    let filesUser = cy
      .get('[data-cy="user-list-table-body"]')
      .children()
      .contains("tr", "filesUser");

    cy.contains("user_that_only");
    cy.contains("has_files");
    filesUser.contains("td", "Disable").click();

    // Deletion should not be possible
    cy.get(".modal").should(
      "not.contain",
      '[data-cy="permanently-delete-user-button"]',
    );

    cy.get('.modal [data-cy="disable-user-button"]').should("be.visible");
  });

  it("can delete users with no associated database entries.", () => {
    interceptApiCalls();

    login("/setting/admin");

    cy.get('[data-cy="user-list-table-body"]')
      .children()
      .should("have.length", 7);

    // Try to delete user
    let filesUser = cy
      .get('[data-cy="user-list-table-body"]')
      .children()
      .contains("tr", "deletableUser");

    cy.contains("user_that_can");
    cy.contains("be_deleted");
    filesUser.contains("td", "Disable").click();

    // Deletion should be possible
    cy.get('.modal [data-cy="permanently-delete-user-button"]').should(
      "be.visible",
    );

    cy.get(".modal").should("not.contain", '[data-cy="disable-user-button"]');
  });
});
