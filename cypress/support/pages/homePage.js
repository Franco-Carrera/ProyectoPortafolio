export class HomePage {
  constructor() {
    this.addListButton = "[data-cy='add-list-button']";
    this.listInput = "[data-cy='list-title-input']";
    this.saveListButton = "[data-cy='save-list-button']";

    this.boardInput = "[data-cy='board-title-input']";
    this.boardButton = "[data-cy='create-board-button']";
  }

  findHomeTitle() {
    return cy.contains("Tus Tableros");
  }

  typeNameBoard(nameBoard) {
    cy.get(this.boardInput).type(nameBoard);
  }

  createBoard() {
    cy.get(this.boardButton).click();
  }

  //contains e invoke sería bueno meter.
}
