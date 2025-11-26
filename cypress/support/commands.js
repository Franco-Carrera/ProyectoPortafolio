const { adminUser, adminPass, nameUser } = Cypress.env("user");
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

/*
Cypress.on("uncaught:exception", (err, runnable) => {
  // Ignorar solo errores específicos
  if (err.message.includes("startsWith is not a function")) {
    return false; // Previene que el error falle el test
  }
});
*/

/*
Cypress.Commands.add("createTestUser", (email, password, name = "") => {
  cy.window().then((win) => {
    // Paso 1: leer lo que haya en localStorage
    let users = [];
    const raw = win.localStorage.getItem("users");
    cy.log("📦 Valor inicial de users en localStorage:", raw);

    try {
      users = raw ? JSON.parse(raw) : [];
    } catch (e) {
      cy.log("⚠ No se pudo parsear users, inicializando vacío.");
      users = [];
    }

    // Paso 2: si no existe, lo agregamos
    if (!users.some((u) => u.email === email)) {
      const newUser = {
        id: `cypress-${Date.now()}`,
        name,
        email,
        password,
      };
      users.push(newUser);

      // Paso 3: guardar en localStorage
      win.localStorage.setItem("users", JSON.stringify(users));
      cy.log("✅ Usuario agregado en localStorage:", JSON.stringify(newUser));

      // Paso 4: disparar evento para que la app reaccione
      win.dispatchEvent(new StorageEvent("storage", { key: "users" }));
      cy.log("📢 StorageEvent('users') disparado");
    } else {
      cy.log("ℹ Usuario ya existente, no se agrega nuevamente.");
    }
  });
});
*/

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

      cy.log("✅ Usuario agregado en localStorage:", JSON.stringify(newUser));
      win.dispatchEvent(new StorageEvent("storage", { key: "users" }));
      cy.log("📢 StorageEvent('users') disparado");
    } else {
      cy.log("ℹ Usuario ya existente, no se agrega nuevamente.");
    }

    // Disparar evento de storage para actualizar la UI
    // win.dispatchEvent(new Event("storage"));
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

/*
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
*/

Cypress.Commands.add("initLogin", () => {
  cy.log("===== Iniciando initLogin =====");

  cy.log(`Base URL: ${baseUrl || "No definido"}`);
  cy.log(`adminUser: ${adminUser || "No definido"}`);
  cy.log(`adminPass: ${adminPass ? "****" : "No definido"}`);
  cy.log(`nameUser: ${nameUser || "No definido"}`);

  const loginPage = new LoginPage();
  const homePage = new HomePage();
  const boardPage = new BoardPage();

  cy.session("Login", () => {
    cy.visit(baseUrl);

    // Crear usuario de prueba
    cy.createTestUser(adminUser, adminPass, nameUser);

    // Login
    loginPage.typeEmail(adminUser);
    loginPage.typePassword(adminPass);
    loginPage.sendCredentials();

    // Ir a Home y crear Board
    cy.visit(homePageUrl);
    homePage.findHomeTitle().should("be.visible");
    homePage.typeNameBoard(data.board.boardName);
    homePage.createBoard();
    boardPage.findTitleBoard().should("include", data.board.boardName);
    boardPage.createOneList(data.board.nameListOne);

    // Guardar boardId en localStorage de forma segura
    cy.window().then((win) => {
      const boardsJSON = win.localStorage.getItem("boards");
      cy.log(`Valor crudo de boardsJSON: ${boardsJSON || "null"}`);

      let boards = [];
      try {
        if (boardsJSON && boardsJSON.trim().startsWith("[")) {
          boards = JSON.parse(boardsJSON);
        } else {
          cy.log("⚠ boardsJSON no tiene formato JSON válido. Saltando parseo.");
        }
      } catch (error) {
        cy.log("❌ Error al parsear boardsJSON:", error.message);
      }

      if (boards.length > 0) {
        const boardId = boards[0].id;
        cy.log(`✅ Board ID detectado: ${boardId}`);
        win.localStorage.setItem("currentBoardId", boardId);
      } else {
        cy.log("⚠ No se encontró ningún board válido en localStorage.");
      }
    });
  });
});

Cypress.Commands.add("visitActualBoard", () => {
  // const boardId = localStorage.getItem("currentBoardId");
  // cy.visit(`${baseUrl}/board/${boardId}`);
  cy.window().then((win) => {
    const boardId = win.localStorage.getItem("currentBoardId");
    expect(boardId).to.exist;
    cy.visit(`${baseUrl}/board/${boardId}`);
  });
});

Cypress.Commands.add("dragAndDrop", (dragSelector, dropSelector) => {
  const dataTransfer = new DataTransfer();

  cy.get(dragSelector).trigger("dragstart", { dataTransfer });

  cy.get(dropSelector)
    .trigger("dragover", { dataTransfer })
    .trigger("drop", { dataTransfer });

  cy.get(dragSelector).trigger("dragend");
});
