// utils/context.js
const { AsyncLocalStorage } = require("async_hooks");

const asyncLocalStorage = new AsyncLocalStorage();

/**
 * Run a function within a context that holds the transaction ID.
 * @param {string} transactionId
 * @param {Function} fn - the function to execute (e.g., next())
 */
function runWithContext(transactionId, fn) {
	return asyncLocalStorage.run({ transactionId }, fn);
}

/**
 * Get the current transaction ID from the context.
 * @returns {string|null}
 */
function getTransactionId() {
	const store = asyncLocalStorage.getStore();
	return store ? store.transactionId : null;
}

module.exports = { runWithContext, getTransactionId };
