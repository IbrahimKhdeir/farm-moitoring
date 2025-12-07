function log(...args) {
  console.log('[LOG]', ...args);
}

function err(...args) {
  console.error('[ERROR]', ...args);
}

module.exports = { log, err };
