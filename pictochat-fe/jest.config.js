const path = require('path');

module.exports = {
  // rootDir: __dirname,
  testEnvironment: 'jsdom',
  // preset: 'jest-puppeteer',
  setupFiles: [/*'react-app-polyfill/jsdom',*/ path.resolve(__dirname, 'test-utils/Setup.js'), 'jest-canvas-mock'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleDirectories: [path.resolve(__dirname, '../node_modules')],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': ['babel-jest', { root: __dirname }],
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': path.resolve(__dirname, 'test-utils/FileTransform.js')
  },
  clearMocks: true,
  // Source: https://jestjs.io/docs/en/webpack
  moduleNameMapper: {
    // '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    // '<rootDir>/__test__/mocks/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy'
  }
};
