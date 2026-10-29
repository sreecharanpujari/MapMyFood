import '@testing-library/jest-dom';

// Mock Leaflet as it requires a browser DOM with canvas/webgl
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.scrollTo
window.scrollTo = () => {};

