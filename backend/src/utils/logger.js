export const morganStream = {
  write: (message) => {
    console.log(message.trim());
  },
};

export const logger = {
  log: (message) => console.log(`[INFO] ${message}`),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  warn: (message) => console.warn(`[WARN] ${message}`),
};
