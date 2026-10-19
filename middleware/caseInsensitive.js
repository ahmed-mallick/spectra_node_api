// middleware/caseInsensitive.js

function normalizePath(req, res, next) {
	// Normalize the endpoint path to lowercase
	req.url = req.url.toLowerCase();
	next();
}

function lowercaseRequestBodyKeys(req, res, next) {
	if (req.body && typeof req.body === "object") {
		req.body = Object.keys(req.body).reduce((acc, key) => {
			const value = req.body[key];
			// Convert 'undefined' string values to null
			acc[key.toLowerCase()] = value === "undefined" ? null : value;
			return acc;
		}, {});
	}
	next();
}

function lowercaseRequestQueryKeys(req, res, next) {
	if (req.query && typeof req.query === "object") {
		req.query = Object.keys(req.query).reduce((acc, key) => {
			const value = req.query[key];
			// Convert 'undefined' string values to null
			acc[key.toLowerCase()] = value === "undefined" ? null : value;
			return acc;
		}, {});
	}
	next();
}

module.exports = {
	normalizePath,
	lowercaseRequestBodyKeys,
	lowercaseRequestQueryKeys,
};
