const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    chromeWebSecurity: false,
    defaultCommandTimeout: 3000,
    watchForFileChanges: false,
    video: false,
    env: {
      baseUrl: process.env.BASE_URL,
      user: {
        adminUser: process.env.ADMIN_USER,
        adminUserTwo: process.env.ADMIN_USER_TWO,
        adminPass: process.env.ADMIN_PASS,
      },
      notUser: {
        inexistentUser: process.env.NOTEXIST_USER,
        brokeUserOne: process.env.BROKE_USER_ONE,
        brokeUserTwo: process.env.BROKE_USER_TWO,
        brokeUserThree: process.env.BROKE_USER_THREE,
        brokeUserFour: process.env.BROKE_USER_FOUR,
        brokeUserSix: process.env.BROKE_USER_SIX,
        brokePasswordOne: process.env.BROKE_PASSWORD_ONE,
        brokePasswordTwo: process.env.BROKE_PASSWORD_TWO,
        brokePasswordThree: process.env.BROKE_PASSWORD_THREE,
      },
    },
  },
});
