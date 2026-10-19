const { AsyncLocalStorage } = require("async_hooks");

const asyncLocalStorage = new AsyncLocalStorage();

function runWithContext(store, callback) {
	asyncLocalStorage.run(store, callback);
}

function getContext() {
	try {
		return asyncLocalStorage.getStore() || null;
	} catch (err) {
		return null;
	}
}

module.exports = { runWithContext, getContext };