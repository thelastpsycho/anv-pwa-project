const isLoggingEnabled = import.meta.env.VITE_ENABLE_LOGS === 'true';

// Store original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info
};

// Override console methods
if (!isLoggingEnabled) {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
  console.info = () => {};
} else {
  // Restore original methods if logging is enabled
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
}
