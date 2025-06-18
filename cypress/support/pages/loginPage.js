export class LoginPage {
  constructor() {
    //______________________
    //Login Section
    this.emailField = "#email";
    this.passwordField = "[type='password']";
    this.submitButton = "[type='submit']";
    this.invalidCredentialsMessage = "[data-cy='login-error']";
    this.specialUserButton = "[data-cy='create-co-domain-user']";
  }

  /// MI NUEVO PROYECTO /-->

  //_____
  //LOGIN

  typeEmail(email) {
    cy.get(this.emailField, { timeout: 10000 }).type(email, { delay: 80 });
    //SE PUEDE USAR DOS VECES LA FUNCIÓN, YA QUE SOLO HAY UN CAMPO DE ESTE TIPO POR SECCIÓN.
  }

  typePassword(password) {
    cy.get(this.passwordField, { timeout: 10000 }).type(password, {
      delay: 80,
    });
  }

  sendCredentials() {
    cy.get(this.submitButton, { timeout: 10000 }).click();
  }

  createSpecialUser() {
    cy.get(this.specialUserButton, { timeout: 10000 }).click();
  }

  // LOGIN ERROR MESSAGES
  findLoginError() {
    return cy.get(this.invalidCredentialsMessage);
  }

  // ----------------------
}
