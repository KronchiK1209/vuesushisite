const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'tests/cypress/support/e2e.js',
    specPattern: 'tests/e2e.test.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // Настройка для мокирования API
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
    }
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  }
});
