import { BoardPage } from "../../support/pages/boardPage";

describe("Module Cards", () => {
  //DESCUBRIMIENTO. SI CODEO BIEN DE MI LADO Y LA WEB NO REACCIONA COMO DEBE, PUEDO REPORTAR BUG. GRAN IDEA. EJ: ESCRIBIR EN UNA LISTA Y NO VERLO, SINO QUE SISTEMA REDIRECCIONA AL HOME.
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

  it("TC1: Validar crear un objetivo en la primera lista y completarlo", () => {
    const goal = data.goals[0];
    createObjectiveInList(1, goal);

    /*boardPage.createGoalInList(
      1,
      goal.title,
      goal.description,
      goal.createObjectiveButton
    );
*/
    boardPage.markGoalAsCompleted(goal.title);
    boardPage.findCheckCompleted(goal.title).should("be.visible");
  });

  it.only("TC2: Validar editar un objetivo al establecer su fecha límite de ser completado", () => {
    const goal = data.goals[0];
    createObjectiveInList(1, goal);

    let day = boardPage.editGoalByDate();
    boardPage.findInputPicker().should("have.value", `${day}`);
  });

  //quiero que mi fixture este al lado de la fechaString

  it("TC3: Validar crear un segundo objetivo en la primera lista Y eliminarlo", () => {
    const goalOne = data.goals[0];
    const goalTwo = data.goals[1];
    cy.log(goalTwo);

    createObjectiveInList(1, goalOne);
    createObjectiveInList(1, goalTwo);
    boardPage.deleteGoal(goalTwo.title);

    boardPage.getGoalByTitle(goalTwo.title).should("not.exist");
  });

  //proceder a crear cobertura 😉
});
