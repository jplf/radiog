const {defaults} = require('jest-config');

module.exports = {
    verbose: true,
    
    collectCoverage: true,
    coverageDirectory: 'reports',
    collectCoverageFrom: ["src/**/*.ts"]
}
