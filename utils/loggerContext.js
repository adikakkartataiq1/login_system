const { AsyncLocalStorage } = require('async_hooks');

const storage = new AsyncLocalStorage();

const loggerContext = {
  run: (context, callback) => {
    storage.run(context, callback);
  },
  get: () => {
    return storage.getStore();
  }
};

const getLoggerContext = () => {
  return storage.getStore();
};

module.exports = {
  loggerContext,
  getLoggerContext
};
