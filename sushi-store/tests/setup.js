/**
 * Настройка Jest для Vue.js тестирования
 */

// Мокаем глобальные объекты Vue
global.Vue = {
  createApp: jest.fn(),
  reactive: jest.fn((obj) => obj),
  ref: jest.fn((val) => ({ value: val })),
  computed: jest.fn((fn) => ({ value: fn() })),
  onMounted: jest.fn(),
  onUnmounted: jest.fn(),
  watch: jest.fn(),
  defineComponent: jest.fn((options) => options)
};

// Мокаем VueCompilerDOM для Vue Test Utils
global.VueCompilerDOM = {
  compile: jest.fn()
};

// Мокаем VueServerRenderer для Vue Test Utils
global.VueServerRenderer = {
  renderToString: jest.fn()
};

global.VueRouter = {
  createRouter: jest.fn(),
  createWebHistory: jest.fn(),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  useRoute: jest.fn(() => ({ params: {}, query: {} }))
};

// Мокаем axios
global.axios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  defaults: {
    headers: {
      common: {}
    }
  }
};

// Мокаем localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Мокаем console для тестов
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
