export class LoginPage {
  constructor() {
    //Register Section
    this.nameField = "#name";
    this.registerPassword = "[data-cy='password-input']";
    this.confirmPassword = "[data-cy='confirm-password-input']";
    //______________________
    //Login Section
    this.emailField = "[type='email']";
    this.passwordField = "[type='password']";
    this.submitButton = "[type='submit']";
    this.invalidCredentialsMessage = "[data-cy='login-error']";
    //--------------------
    this.specialUserButton = "[data-cy='create-co-domain-user']";
  }

  /// MI NUEVO PROYECTO /-->

  /* Sin Necesidad Por uso De Local Storage
  goToRegisterSection() {
    cy.contains("Regístrate aquí", { timeout: 5000 }).click();
    //LE PONGO TIMEOUT PARA QUE ESPERE 5 SEGUNDOS HASTA ENCONTRARLO AL CAMPO.
  }
    

  //____
  //REGISTER
  /*
  typeName(name) {
    cy.get(this.nameField, { timeout: 5000 }).type(name);
  }
  typeRegisterPassword(password) {
    cy.get(this.registerPassword, { timeout: 5000 }).type(password);
  }
  typeConfirmPassword(password) {
    cy.get(this.confirmPassword, { timeout: 5000 }).type(password);
  }

  */

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

  findErrEmailWithoutFormat() {
    //obtiene elemento email, saca su foco de él y obtiene mensaje de error.
    return cy.get(this.emailField).blur().invoke("prop", "validationMessage");
  }

  // ----------------------

  /* aparece en ocasiones*/
  /*
  cancelDobleAuth() {
    cy.get(this.withoutAuthButton).click();
  }

  captureTextTrello() {
    return cy.get(this.workspaceComment).invoke("text");
  }

  findEmailErrorText() {
    return cy.get(this.emailErrorMsg);
  }

  findUsernameField() {
    return cy.get(this.emailField, { timeout: 5000 });
  }

  findPasswordField() {
    return cy.get(this.passwordField);
  }

  findSubmitButton() {
    return cy.get(this.submitButton);
  }

  findFormErrMsg() {
    return cy.get(this.formErrMsg, { timeout: 10000 });
  }
*/
}
