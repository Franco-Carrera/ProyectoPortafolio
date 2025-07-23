export class BoardPage {
  constructor() {
    this.titleBoard = "[data-cy='board-title']";
    this.formList = "[data-cy='create-list-form']";

    this.addListButton = "[data-cy='add-list-button']";
    this.listInput = "[data-cy='list-title-input']";
    this.saveListButton = "[data-cy='save-list-button']";

    this.allList = "[data-cy^='list-container']";
    this.allCards = "[data-v0-t='card']";
    this.addObjectiveButton = "[data-cy^='add-objective-button']";
    this.objectiveTitleInput = "[data-cy='objective-title-input']";
    this.objectiveDescriptionInput = "[data-cy='objective-description-input']";
    this.objectiveMenu = "[data-cy^='objective-menu']";
    this.completeObjectiveItem = "[data-cy^='complete-objective']";
    this.editObjectiveItem = "[data-cy^='edit-objective']";
    this.deleteObjectiveItem = "[data-cy^='delete-objective']";
    this.dateInput = "[data-cy='modal-due-date-input']";
  }

  findTitleBoard() {
    return cy.get(this.titleBoard).invoke("text");
  }

  /* findInputList() {
    return cy.get(this.formList).children("input");
  }
*/

  createOneList(nameList) {
    cy.get(this.addListButton).click({ force: true });
    cy.get(this.listInput).type(nameList);
    cy.get(this.saveListButton).click();
  }

  //-------------------------

  createGoalInList(listIndex, title, description, createGoalButton) {
    cy.get(this.allList)
      .eq(listIndex - 1)
      .within(() => {
        cy.get(this.addObjectiveButton).click();
        cy.get(this.objectiveTitleInput).type(title);
        cy.get(this.objectiveDescriptionInput).type(description);
        cy.contains(`${createGoalButton}`).click();
      });
  }

  markGoalAsCompleted(title) {
    this.getGoalByTitle(title).within(() => {
      cy.get(this.objectiveMenu).click();
    });
    cy.get(this.completeObjectiveItem).click();
  }

  getGoalByTitle(title) {
    return cy.contains(this.allCards, title);
  }

  //que este nombre de card should not exist.

  editGoalByDate() {
    cy.get(this.objectiveMenu).click();
    cy.get(this.editObjectiveItem).click();
    cy.contains("Editar Objetivo").click();

    // Obtener fecha de mañana en formato YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    const fechaString = `${yyyy}-${mm}-${dd}`;

    // Aplicar la fecha correctamente
    cy.get(this.dateInput).invoke("val", fechaString).trigger("change"); // <- esto hace que React lo detecte

    return fechaString;
  }

  deleteGoal(title) {
    this.getGoalByTitle(title).within(() => {
      cy.get(this.objectiveMenu).click();
    });
    cy.get(this.deleteObjectiveItem).click();
  }

  findInputPicker() {
    return cy.get(this.dateInput);
  }

  findCheckCompleted(title) {
    return this.getGoalByTitle(title).within(() => {
      cy.contains("Completado");
    });
  }
}
