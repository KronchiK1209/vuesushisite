module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/crud-*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testTimeout: 30000, // 30 секунд для HTTP запросов
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/server.js',
    '!server/server-pg.js',
    '!**/node_modules/**'
  ],
  coverageReporters: ['text', 'lcov', 'html']
};


