export class LoginPage {
  constructor() {
    this.emailField = "[data-testid='username']";
    this.submitButton = "[type='submit']";
    this.passwordField = "[data-testid='password']";
    this.logInLink = "[id='already-have-an-account']";
    this.workspaceComment = "[data-testid='home-team-tab-name']";
    this.withoutAuthButton = "#mfa-promote-dismiss";
    this.emailErrorMsg = "[id='username-uid2-error']";
    this.formErrMsg = "[data-testid='form-error--content']";
  }

  goToLoginSection() {
    cy.get(this.logInLink).click();
  }

  typeEmail(email) {
    cy.get(this.emailField, { timeout: 5000 }).type(email);
  }

  sendCredential() {
    cy.get(this.submitButton, { timeout: 5000 }).click();
  }

  typePassword(password) {
    cy.get(this.passwordField, { timeout: 5000 }).type(password, {
      delay: 100,
    });
  }
  /* aparece en ocasiones*/
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

  //obtiene elemento email, saca su foco de él y obtiene mensaje de error.
  findValidationMessageForEmail() {
    return cy.get(this.emailField).blur().invoke("prop", "validationMessage");
  }

  findFormErrMsg() {
    return cy.get(this.formErrMsg, { timeout: 10000 });
  }
}
