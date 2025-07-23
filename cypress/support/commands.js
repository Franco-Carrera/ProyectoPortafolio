const { nameUser, adminUser, adminPass } = Cypress.env("user");
import { LoginPage } from "./pages/loginPage";
import { HomePage } from "./pages/homePage";
import { BoardPage } from "./pages/boardPage";

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.on("uncaught:exception", (err, runnable) => {
  // Ignorar solo errores específicos
  if (err.message.includes("startsWith is not a function")) {
    return false; // Previene que el error falle el test
  }
});

// Comando para crear un usuario de prueba
Cypress.Commands.add("createTestUser", (email, password, name = "") => {
  // Acceder al localStorage directamente
  cy.window().then((win) => {
    const usersJSON = win.localStorage.getItem("users") || "[]";
    const users = JSON.parse(usersJSON);

    // Verificar si ya existe
    if (!users.some((user) => user.email === email)) {
      const newUser = {
        id: `cypress-${Date.now()}`,
        name,
        email,
        password,
      };
      users.push(newUser);
      win.localStorage.setItem("users", JSON.stringify(users));

      // Disparar evento de storage para actualizar la UI
      win.dispatchEvent(new Event("storage"));
    }
  });
});

const baseUrl = Cypress.env("baseUrl");
const homePageUrl = `${baseUrl}/home`;

let data;
before("Trayendo Fixture", () => {
  cy.fixture("board").then((datos) => {
    data = datos;
  });
});

Cypress.Commands.add("initLogin", () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();
  const boardPage = new BoardPage();

  cy.session("Login", () => {
    cy.visit(baseUrl);
    cy.createTestUser(adminUser, adminPass, nameUser);
    loginPage.typeEmail(adminUser);
    loginPage.typePassword(adminPass);
    loginPage.sendCredentials();

    cy.visit(homePageUrl);

    homePage.findHomeTitle().should("be.visible");
    homePage.typeNameBoard(data.board.boardName);
    homePage.createBoard();

    boardPage.findTitleBoard().should("include", data.board.boardName);
    boardPage.createOneList(data.board.nameListOne);

    // 🔥 Guardamos el boardId desde el localStorage
    cy.window().then((win) => {
      const boardsJSON = win.localStorage.getItem("boards");
      cy.log(boardsJSON);

      const boards = JSON.parse(boardsJSON); // 👈 Esto transforma el string en un array
      const currentBoard = boards[0]; // Tomás el primer board
      const boardId = currentBoard.id; // Sacás el ID

      cy.log(`Board ID: ${boardId}`); // ✅ Confirmás que todo salió bien

      // Guardás el ID si querés usarlo después
      win.localStorage.setItem("currentBoardId", boardId);
    });
  });
});

Cypress.Commands.add("visitActualBoard", () => {
  const boardId = localStorage.getItem("currentBoardId");
  cy.visit(`${baseUrl}/board/${boardId}`);
});
