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
