// tests/setup.js - Teszt környezet inicializálása

// Globális mock-ok minden teszthez
global.alert = jest.fn();
global.confirm = jest.fn();
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Fetch mock
global.fetch = jest.fn();

// LocalStorage mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// SessionStorage mock
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Window.location mock
delete window.location;
window.location = {
  href: '',
  pathname: '/',
  search: '',
  hash: '',
  host: 'localhost',
  hostname: 'localhost',
  origin: 'http://localhost',
  protocol: 'http:',
  reload: jest.fn(),
  replace: jest.fn(),
  assign: jest.fn(),
};

// Window.history mock
window.history = {
  pushState: jest.fn(),
  replaceState: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  go: jest.fn(),
};

// Performance.now mock
global.performance = {
  now: jest.fn(() => Date.now()),
};

// ResizeObserver mock (ha van ilyen a kódban)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// IntersectionObserver mock (ha van ilyen a kódban)
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// setTimeout/setInterval tisztítás minden teszt után
afterEach(() => {
  jest.clearAllTimers();
});

// Cleanup minden teszt után
afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});

console.log('✅ Test environment setup complete!');
