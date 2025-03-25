export class HomePage {
  constructor() {
    this.navLink = "[data-uuid='MJFtCCgVhXrVl7v9HA7EH_login']";
  }

  goToLoginSection() {
    cy.get(this.navLink).click();
  }

  goToTrelloForm() {
    cy.contains("Obtener Trello gratis").click();
  }
}
