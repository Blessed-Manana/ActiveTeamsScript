const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUr: 'https://teams.theactivechurch.org/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true,
    testIsolation: false,
    defaultCommandTimeout: 90000,
    requestTimeout: 65000,
    responseTimeout: 65000,

    // Increased the screen resolution to full HD...
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});
