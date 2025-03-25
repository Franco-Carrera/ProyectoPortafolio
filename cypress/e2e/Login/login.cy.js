import { HomePage } from "../../support/pages/homePage";
import { LoginPage } from "../../support/pages/loginPage";

const { adminUser, adminUserTwo, adminPass } = Cypress.env("user");
const {
  inexistentUser,
  brokeUserOne,
  brokeUserTwo,
  brokeUserThree,
  brokeUserFour,
  brokeUserSix,
  brokePasswordOne,
  brokePasswordTwo,
  brokePasswordThree,
} = Cypress.env("notUser");

describe(" Module 001 | Login", () => {
  const homePage = new HomePage();
  const loginPage = new LoginPage();
  let data;

  before("Obteniendo fixture", () => {
    cy.fixture("login").then((datos) => {
      data = datos;
    });
  });

  beforeEach("Precondiciones", () => {
    cy.visit(Cypress.env("baseUrl"));
    cy.on("uncaught:exception", (err, runnable) => {
      // Ignora errores relacionados con Google Analytics
      if (err.message.includes("ga")) {
        return false;
      }
      return true;
    });
    homePage.goToLoginSection();
  });

  it("TC1: Validar iniciar sesión al completar de forma válida ambos campos verificando su persistencia", () => {
    loginPage.typeEmail(adminUser);
    loginPage.sendCredential();

    // 🔍 Esperamos hasta que la URL cambie a Atlassian
    cy.location("hostname", { timeout: 10000 }).should(
      "include",
      "id.atlassian.com"
    );

    // 🔥 Interactuamos directamente sin `cy.origin()`
    loginPage.typePassword(adminPass);
    loginPage.sendCredential();

    loginPage.cancelDobleAuth();

    // ✅ Esperamos a que vuelva a Trello
    cy.location("hostname", { timeout: 10000 }).should("include", "trello.com");
    cy.reload();
    loginPage.captureTextTrello().should("include", "Trello");
  });

  it("TC2: Validar NO iniciar sesión al dejar el campo email vacío", () => {
    loginPage.sendCredential();
    loginPage
      .findEmailErrorText()
      .should("have.text", data.errorMessage.emailEmpty);
  });

  it("TC3: Validar NO iniciar sesión al ingresar el campo email como inexistente", () => {
    loginPage.typeEmail(inexistentUser);
    loginPage.sendCredential();

    //assertion que indica que el campo sigue siendo el de email y no paso al de password.
    loginPage.findUsernameField().should("have.attr", "type", "email");
  });

  it("TC4: Validar NO iniciar sesión al ingresar el campo email sin el @", () => {
    loginPage.typeEmail(brokeUserOne);
    loginPage.sendCredential();
    loginPage
      .findValidationMessageForEmail()
      .should("include", 'Incluye un signo "@"');
  });

  it("TC5: Validar NO iniciar sesión al ingresar el campo email sin el dominio", () => {
    loginPage.typeEmail(brokeUserTwo);
    loginPage.sendCredential();
    loginPage
      .findValidationMessageForEmail()
      .should(
        "include",
        'El signo "." está colocado en una posición incorrecta'
      );
  });

  it("TC6: Validar NO iniciar sesión al ingresar el campo email con el dominio incompleto", () => {
    loginPage.typeEmail(brokeUserThree);
    loginPage.sendCredential();
    //assertion que indica que el campo sigue siendo el de email y no paso al de password.
    loginPage.findUsernameField().should("have.attr", "type", "email");

    //###REPORTAR MEJORA DE QUE PODRÍA INDICAR UN MENSAJE DE ERROR LUEGO DE ENVIAR FIELD.

    loginPage.findPasswordField().should("not.be.visible");
  });

  it("TC9: Validar NO iniciar sesión al ingresar el campo email con caracteres especiales", () => {
    loginPage.typeEmail(brokeUserFour);
    loginPage.sendCredential();
    //atrapar resultado actual. QUeda pendiente.
    loginPage.findUsernameField().should("have.attr", "type", "email");
  });

  it("TC10: Validar NO iniciar sesión al ingresar el campo email con espacios en blanco", () => {
    loginPage.typeEmail(brokeUserSix);
    loginPage.sendCredential();

    loginPage.findPasswordField().should("not.be.visible");

    //loginPage.findUsernameField().should("have.attr", "type", "email");
  });

  it("TC11: Validar NO iniciar sesión al dejar el campo password vacío", () => {
    loginPage.typeEmail(adminUser);
    loginPage.sendCredential();

    // 🔍 Esperamos hasta que la URL cambie a Atlassian
    cy.location("hostname", { timeout: 10000 }).should(
      "include",
      "id.atlassian.com"
    );

    loginPage.sendCredential();
    loginPage.findSubmitButton().should("be.visible");
  });

  it("TC12: Validar NO iniciar sesión al ingresar el campo password como inexistente", () => {
    loginPage.typeEmail(adminUser);
    loginPage.sendCredential();

    // 🔍 Esperamos hasta que la URL cambie a Atlassian
    cy.location("hostname", { timeout: 10000 }).should(
      "include",
      "id.atlassian.com"
    );

    loginPage.typePassword(brokePasswordOne);
    loginPage.sendCredential();
    loginPage.findSubmitButton().should("be.visible");
  });

  it("TC13: Validar NO iniciar sesión al ingresar el campo password sin coincidir", () => {
    loginPage.typeEmail(adminUser);
    loginPage.sendCredential();

    cy.location("hostname", { timeout: 10000 }).should(
      "include",
      "id.atlassian.com"
    );

    loginPage.typePassword(brokePasswordTwo);
    loginPage.sendCredential();

    loginPage.findFormErrMsg().should("have.text", data.errorMessage.recaptcha);
  });

  it.only("TC14: Validar NO iniciar sesión al ingresar el campo password con inyecciones SQL", () => {
    loginPage.typeEmail(adminUserTwo);
    loginPage.sendCredential();

    cy.location("hostname", { timeout: 10000 }).should(
      "include",
      "id.atlassian.com"
    );

    loginPage.typePassword(brokePasswordThree);
    loginPage.sendCredential();

    loginPage
      .findFormErrMsg()
      .should("have.text", data.errorMessage.invalidcredentials);
  });
});
