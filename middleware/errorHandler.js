// errorHandler.js
const utils = require("../utils/utils"); // Assuming you have a log function in your utils.js

function errorHandler(err, req, res, next) {
	// Log the error details
	utils.log("error", `Error occurred: ${err.message}`, {
		stack: err.stack,
		request: {
			method: req.method,
			url: req.originalUrl,
			headers: req.headers,
			body: req.body,
		},
	});

	// Send a user-friendly error message
	res
		.status(500)
		.json({ message: "Something went wrong, please try again later." });
}

module.exports = errorHandler;
