import { BoardPage } from "../../support/pages/boardPage";

describe("Module Cards", () => {
  const boardPage = new BoardPage();
  let data;

  const createObjectiveInList = (listIndex, goal) => {
    boardPage.createGoalInList(
      listIndex,
      goal.title,
      goal.description,
      goal.createObjectiveButton
    );
  };

  before("Fixture Board", () => {
    cy.fixture("board").then((datos) => {
      data = datos;
      cy.log(data);
    });
  });

  beforeEach("Preconditions Create Board and Lists", () => {
    cy.initLogin();
    cy.visitActualBoard();
  });

  //proceder a crear cobertura 😉

  //Futura documentación.

  // TERMINADO!!!!!
  it("TC1: Validar crear y completar un objetivo, verificando su vencimiento y estado a través de los filtros.", () => {
    const goal = data.goals[0];
    createObjectiveInList(1, goal);

    boardPage.markGoalAsCompleted(goal.title);
    boardPage.findCheckCompleted().should("be.visible");
    boardPage.findCompletedFilter().should("include", data.filter.currentCount);
    boardPage
      .findUpcomingWeekFilter()
      .should("include", data.filter.currentCount);
  });
  //__________FIN TC1

  //_____________DOCUMENTACIONES PARA EL NOTION TC2 //TERMINADO!!!!!

  it("TC2: Validar editar un objetivo al establecer una fecha límite de ser completado", () => {
    const goal = data.goals[0];
    createObjectiveInList(1, goal);

    boardPage.editGoalByLastDayOfMonth().then((expectedText) => {
      boardPage.findDateEdited().should("have.text", expectedText);
    });
  });

  it("TC3: Validar crear un segundo objetivo en la primera lista Y eliminarlo", () => {
    const goalOne = data.goals[0];
    const goalTwo = data.goals[1];
    cy.log(goalTwo);

    createObjectiveInList(1, goalOne);
    createObjectiveInList(1, goalTwo);
    boardPage.deleteGoal(goalTwo.title);
    boardPage.getAllGoalsOfList().should("have.length", 1);
  });

  //El sistema no actualiza el estado del Objetivo en el modal de Edición cuando se selecciona la opción "En Proceso"

  it.skip("TC4: Validar editar un objetivo al modo 'En proceso' y ver coincidencia con su filtro de estado.", () => {
    const goalOne = data.goals[0];
    createObjectiveInList(1, goalOne);
    boardPage.editGoalByState();
    boardPage.findFilterInProcess().should("include", data.filter.currentCount);
  });

  it("TC5: Validar editar un objetivo a primer dia del mes y ver coincidencia con su filtro de vencimiento.", () => {
    const goalOne = data.goals[0];
    createObjectiveInList(1, goalOne);

    boardPage.editGoalByFirstDayOfMonth().then((expectedText) => {
      boardPage.findDateEdited().should("have.text", expectedText);
    });
  });

  it("TC6: Validar hacer un drag and drop del objetivo de la primera lista hacia la segunda lista", () => {
    boardPage.createOneList(data.board.nameListTwo);
    const goalOne = data.goals[0];
    createObjectiveInList(1, goalOne);

    cy.dragAndDrop(boardPage.draggableObjective, boardPage.secondList);
    boardPage.findObjectiveInSecondList().should("have.text", goalOne.title);
  });
});
