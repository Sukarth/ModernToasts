// Mock CSS injection for tests
Object.defineProperty(window, 'CSS', {
  value: {
    supports: jest.fn(() => true),
  },
});

// Mock requestAnimationFrame
window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(callback, 0) as unknown as number;
};

window.cancelAnimationFrame = (id: number): void => {
  clearTimeout(id);
};

// Add custom matchers if needed
expect.extend({
  toHaveBeenCalledWithToast(received: jest.Mock, expectedType: string) {
    const calls = received.mock.calls;
    const pass = calls.some(call => {
      const toast = call[0];
      return toast && toast.type === expectedType;
    });

    return {
      pass,
      message: () => pass
        ? `Expected not to be called with toast type ${expectedType}`
        : `Expected to be called with toast type ${expectedType}`,
    };
  },
});

// Clean up DOM after each test
afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  jest.clearAllTimers();
  jest.clearAllMocks();
});

// Use fake timers
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  if (jest.isMockFunction(setTimeout)) {
    jest.runOnlyPendingTimers();
  }
  jest.useRealTimers();
});