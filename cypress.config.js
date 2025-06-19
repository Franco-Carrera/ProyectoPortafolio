const { defineConfig } = require("cypress");
require("dotenv").config();

//YO QUIERO CREAR USUARIOS RANDOM PARA PODER PROBAR EL COMPORTAMIENTO
//DEL SISTEMA CUANDO INGRESO MUCHAS VECES INCORRECTO UN USUARIO.
//ES DECIR EN TC'S DONDE PRUEBO LA DATA ERRÓNEA CONTINUAMENTE.

//RANDOM USER VÁLIDO
//const numero = Math.floor(Math.random() * 1000);

module.exports = defineConfig({
  projectId: "qc94ar",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    chromeWebSecurity: false,
    defaultCommandTimeout: 12000,
    watchForFileChanges: false,
    video: false,
    env: {
      baseUrl: process.env.BASE_URL,
      user: {
        nameUser: process.env.NAME_USER,
        adminUser: process.env.NORMAL_USER,
        adminPass: process.env.NORMAL_PASS,
        specialUser: process.env.SPECIAL_USER,
        specialUserPass: process.env.SPECIALUSER_PASS,
      },
    },
  },
});
