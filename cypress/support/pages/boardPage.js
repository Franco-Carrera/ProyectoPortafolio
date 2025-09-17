import { ultimosDiasMes } from "../../e2e/utils/dateUtils";
import { primerDiaDelMes } from "../../e2e/utils/dateUtils";

export class BoardPage {
  constructor() {
    this.titleBoard = "[data-cy='board-title']";
    this.formList = "[data-cy='create-list-form']";

    this.addListButton = "[data-cy='add-list-button']";
    this.listInput = "[data-cy='list-title-input']";
    this.saveListButton = "[data-cy='save-list-button']";

    //    this.allList = "[data-cy^='list-container']";
    //this.allList = "[data-cy='list-container']";

    this.allList = ".bg-slate-100";
    this.secondList = "[data-cy-drop-type='objective']:nth-child(2)";

    this.allCards = "[data-v0-t='card']";
    this.objectiveItem = "[data-cy^='objective-item']";
    this.draggableObjective = '[data-cy^="drag-handle-"]';
    this.addObjectiveButton = "[data-cy^='add-objective-button']";
    this.objectiveTitleInput = "[data-cy='objective-title-input']";
    this.objectiveDescriptionInput = "[data-cy='objective-description-input']";
    this.objectiveDateInput = "[data-cy='objective-due-date-input']";

    this.objectiveMenu = "[data-cy^='objective-menu']";
    this.completeObjectiveItem = "[data-cy^='complete-objective']";
    this.editObjectiveItem = "[data-cy^='edit-objective']";
    this.deleteObjectiveItem = "[data-cy^='delete-objective']";

    this.dateInput = "[data-cy='modal-due-date-input']";
    this.modalStateButton = "[data-cy='modal-status-select']";
    this.completedFilter = "[data-cy='filter-completed']";

    this.upcomingWeekFilter = "[data-cy='filter-next-weeks']";
    this.filterInProgress = "[data-cy='filter-in-progress']";
    this.filterOverdue = "[data-cy='filter-overdue']";
    this.modalSaveButton = "[data-cy='modal-save-button']";
  }

  //Gets

  findDateEdited() {
    return cy.contains("Fecha Límite").parent("div").find("span");
  }

  findCheckCompleted() {
    return cy.contains("Completado");
  }

  findCompletedFilter() {
    return cy.get(this.completedFilter).invoke("text");
  }
  findUpcomingWeekFilter() {
    return cy.get(this.upcomingWeekFilter).invoke("text");
  }

  //Findings
  findFilterInProcess() {
    return cy.get(this.filterInProgress).invoke("text");
  }
  findFilterOverdue() {
    return cy.get(this.filterOverdue);
  }

  findObjectiveInSecondList() {
    return cy.get(this.secondList).find("h4");
  }

  findTitleBoard() {
    return cy.get(this.titleBoard).invoke("text");
  }

  //Sirve para elegir un título determinado pasado por parámetro específicamente
  //De esta manera voy a poder eliminarlo.
  getGoalByTitle(title) {
    return cy.contains(title).parent("div");
  }

  getAllGoalsOfList() {
    return cy.get(this.allList).find(this.objectiveItem);
  }

  // --- CREATE

  createOneList(nameList) {
    cy.get(this.addListButton).click({ force: true });
    cy.get(this.listInput).type(nameList);
    cy.get(this.saveListButton).click();
  }

  createGoalInList(listIndex, title, description, createGoalButton) {
    const { inputISO } = ultimosDiasMes();

    cy.get(this.allList)
      .eq(listIndex - 1)
      .within(() => {
        cy.get(this.addObjectiveButton).click();
        cy.get(this.objectiveTitleInput).type(title);
        cy.get(this.objectiveDescriptionInput).type(description);

        cy.get(this.objectiveDateInput).clear().type(inputISO);

        cy.contains(`${createGoalButton}`).click();
      });
  }

  /*
  setDueDate(dateISO) {
    cy.get(this.objectiveDueDate).then(($input) => {
      // Cambiar valor en el DOM
      $input.val(dateISO);

      // Notificar a React que hubo un cambio real
      $input[0].dispatchEvent(new Event("input", { bubbles: true }));
      $input[0].dispatchEvent(new Event("change", { bubbles: true }));
      $input[0].dispatchEvent(new Event("blur", { bubbles: true }));
    });
  }
    */

  // ---------- UPDATE

  /*------------Dates------------** */

  editGoalByLastsDayOfMonth() {
    const { inputISO, displayDMY } = ultimosDiasMes();
    cy.get(this.objectiveMenu).click();
    cy.get(this.editObjectiveItem).click();
    cy.contains("Editar Objetivo").click();

    cy.get(this.dateInput).invoke("val", inputISO).trigger("change");
    cy.get(this.modalSaveButton).click();

    return cy.wrap(displayDMY);
  }

  editGoalByFirstDayOfMonth() {
    const { inputISO, displayDMY } = primerDiaDelMes();

    cy.get(this.objectiveMenu).click();
    cy.get(this.editObjectiveItem).click();
    cy.contains("Editar Objetivo").click();

    //cy.get(this.dateInput).invoke("val", inputISO).trigger("change");
    cy.get(this.dateInput).clear().type(inputISO);
    cy.get(this.modalSaveButton).click();

    return cy.wrap(displayDMY);
  }

  editGoalByState() {
    cy.get(this.objectiveItem).click();
    cy.contains("Editar Objetivo").click();
    cy.get(this.modalStateButton).click({ force: true });
    cy.xpath("//div[text()='En Proceso']").click({ force: true });
  }

  /**------------------------------------------*/

  markGoalAsCompleted(title) {
    this.getGoalByTitle(title).within(() => {
      cy.get(this.objectiveMenu).click();
    });
    cy.get(this.completeObjectiveItem).click();
  }

  // -------- DELETE

  deleteGoal(title) {
    this.getGoalByTitle(title).within(() => {
      cy.get(this.objectiveMenu).click();
    });
    cy.get(this.deleteObjectiveItem).click();
  }
}
