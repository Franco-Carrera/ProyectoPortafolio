import { LoginPage } from "../../support/pages/loginPage";

const { nameUser, adminUser, adminPass, specialUser, specialUserPass } =
  Cypress.env("user");

describe(" Module 001 | Login", () => {
  const loginPage = new LoginPage();
  let data;

  before("Obteniendo fixture", () => {
    cy.fixture("login").then((datos) => {
      data = datos;
    });
  });

  beforeEach("Precondiciones", () => {
    cy.visit(Cypress.env("baseUrl"));
    cy.url().should("contain", "net");
    cy.createTestUser(adminUser, adminPass, nameUser);
  });

  //Hechos

  it("TC1: Validar iniciar sesión al completar de forma válida ambos campos verificando su persistencia", () => {
    loginPage.typeEmail(adminUser);
    cy.log(adminUser);
    loginPage.typePassword(adminPass);
    loginPage.sendCredentials();
    cy.url().should("contain", "/home");
    cy.reload();
  });

  it("TC2: Validar iniciar sesión al ingresar datos de un usuario premium", () => {
    loginPage.createSpecialUser().should("exist").click({ force: true });
    cy.log(`Intentando login con: ${specialUser} / ${specialUserPass}`);
    loginPage.typeEmail(specialUser);
    loginPage.typePassword(specialUserPass);
    loginPage.sendCredentials();
    // Espera a que se redireccione a /home
    cy.url({ timeout: 15000 }).should("include", "/home");
  });

  it("TC3: Validar NO iniciar sesión al dejar el campo email vacío", () => {
    loginPage.typePassword(adminPass);
    loginPage.sendCredentials();
    loginPage
      .findLoginError()
      .should("have.text", data.errorMessage.emailEmpty);
  });

  it("TC4: Validar NO iniciar sesión al ingresar el campo email como inexistente", () => {
    const inexistentEmail = `usuarioFake${Date.now()
      .toString()
      .slice(-5)}@mail.com`;

    loginPage.typeEmail(inexistentEmail);
    loginPage.typePassword(adminPass);
    loginPage.sendCredentials();
    loginPage
      .findLoginError()
      .should("have.text", data.errorMessage.inexistentEmail);
  });

  it("TC5: Validar NO iniciar sesión al ingresar el campo email sin el @", () => {
    const invalidEmail = `usuariomail.com`;
    loginPage.typeEmail(invalidEmail);
    loginPage.typePassword(adminPass);
    loginPage.findSubmitButton().should("be.visible").click();
    // Esperar y validar el error
    loginPage
      .findLoginError()
      .should("exist")
      .and("have.text", data.errorMessage.withoutFormatEmail);
  });

  it("TC6: Validar NO iniciar sesión al ingresar el campo email sin la extensión", () => {
    const invalidEmail = `usuario@mail`;
    loginPage.typeEmail(invalidEmail);
    loginPage.typePassword(adminPass);
    loginPage.sendCredentials();
    loginPage
      .findLoginError()
      .should("have.text", data.errorMessage.withoutFormatEmail);
  });

  it("TC7: Validar NO iniciar sesión al ingresar el campo email con caracteres especiales", () => {
    const invalidEmail = `usuario528!!@gmail.com`;
    loginPage.typeEmail(invalidEmail);
    loginPage.typePassword(adminPass);
    loginPage.sendCredentials();
    loginPage
      .findLoginError()
      .should("have.text", data.errorMessage.withoutFormatEmail);
  });

  it("TC8: Validar NO iniciar sesión al ingresar el campo email sin el nombre de usuario", () => {
    const invalidEmail = `@gmail.com`;
    loginPage.typeEmail(invalidEmail);
    loginPage.typePassword(adminPass);
    loginPage.findSubmitButton().should("be.visible").click();
    // Esperar y validar el error
    loginPage
      .findLoginError()
      .should("exist")
      .and("have.text", data.errorMessage.withoutFormatEmail);
  });

  it("TC9: Validar NO iniciar sesión al dejar el campo password vacío", () => {
    loginPage.typeEmail(adminUser);
    loginPage.sendCredentials();
    loginPage
      .findLoginError()
      .should("have.text", data.errorMessage.passwordEmpty);
  });

  it("TC10: Validar NO iniciar sesión al ingresar el campo password como inexistente", () => {
    const invalidPassword = `passinexistente`;
    loginPage.typeEmail(adminUser);
    loginPage.typePassword(invalidPassword);
    loginPage.sendCredentials();
    loginPage
      .findLoginError()
      .should("have.text", data.errorMessage.inexistentPassword);
  });

  it("TC11: Validar NO iniciar sesión al ingresar el campo password sin coincidir", () => {
    loginPage.createSpecialUser().should("exist").click({ force: true });
    loginPage.typeEmail(adminUser);
    loginPage.typePassword(specialUserPass);
    loginPage.sendCredentials();
    loginPage
      .findLoginError()
      .should("have.text", data.errorMessage.notMatchPassword);
  });

  it("TC12: Validar NO iniciar sesión al ingresar el campo password con inyecciones SQL", () => {
    const invalidPassword = `' OR '1'='1
    ' OR 1=1 --
    admin' --`;

    loginPage.typeEmail(adminUser);
    loginPage.typePassword(invalidPassword);
    loginPage.sendCredentials();
    loginPage
      .findLoginError()
      .should("have.text", data.errorMessage.inexistentPassword);
  });
});
