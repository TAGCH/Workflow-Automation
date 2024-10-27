module.exports = {
    testEnvironment: 'jsdom', // for testing DOM elements
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'], // adjust according to your file types
    testPathIgnorePatterns: ['/node_modules/', '/build/'], // ignore these folders
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',  // For CSS modules
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js', // For image files
    },
};
