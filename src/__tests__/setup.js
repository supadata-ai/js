const fetchMock = require('jest-fetch-mock');

// Enable fetch mocks
fetchMock.enableMocks();

// Mock cross-fetch to use the jest-fetch-mock
jest.mock('cross-fetch', () => fetchMock);