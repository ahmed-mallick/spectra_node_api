module.exports = {
	dataFetched: function (res, transactionID, message, data = []) {
		res.status(200).json({
			responseCode: 200,
			status: "Success",
			message: message || "Data successfully fetched",
			transactionID: transactionID || null,
			data: data,
		});
	},
	dataSent: function (res, transactionID, message, data = []) {
		res.status(200).json({
			responseCode: 200,
			status: "Success",
			message: message || "Data sent successfully",
			transactionID: transactionID || null,
			data: data,
		});
	},
	noContent: function (res, transactionID, message, data = []) {
		res.status(204).json({
			responseCode: 204,
			status: "Success",
			message: message || "Data sent successfully",
			transactionID: transactionID || null,
			data: data,
		});
	},
	dataFailure: function (res, transactionID, message, data = []) {
		res.status(200).json({
			responseCode: 200,
			status: "Failure",
			message: message || "Something went wrong",
			transactionID: transactionID || null,
			data: data,
		});
	},

	dataNoContent: function (res, transactionID, message, data = []) {
		res.status(200).json({
			responseCode: 204,
			status: "Failure",
			message: message || "Something went wrong",
			transactionID: transactionID || null,
			data: data,
		});
	},
	Failure: function (res, transactionID, message, data = []) {
		res.status(409).json({
			responseCode: 409,
			status: "Failure",
			message: message || "Something went wrong",
			transactionID: transactionID || null,
			data: data,
		});
	},
	created: function (res, transactionID, message, data = []) {
		res.status(201).json({
			responseCode: 201,
			status: "Success",
			message: message || "Resource created successfully",
			transactionID: transactionID || null,
			data: data,
		});
	},
	badRequest: function (res, transactionID, message, data = []) {
		res.status(400).json({
			responseCode: 400,
			status: "Error",
			message: message || "Bad request",
			transactionID: transactionID || null,
			data: data,
		});
	},
	unauthorized: function (res, transactionID, message, data = []) {
		res.status(401).json({
			responseCode: 401,
			status: "Error",
			message: message || "Unauthorized",
			transactionID: transactionID || null,
			data: data,
		});
	},
	forbidden: function (res, transactionID, message, data = []) {
		res.status(403).json({
			responseCode: 403,
			status: "Error",
			message: message || "Forbidden",
			transactionID: transactionID || null,
			data: data,
		});
	},
	notFound: function (res, transactionID, message, data = []) {
		res.status(404).json({
			responseCode: 404,
			status: "Error",
			message: message || "Not found",
			transactionID: transactionID || null,
			data: data,
		});
	},
	conflict: function (res, transactionID, message, data = []) {
		res.status(409).json({
			responseCode: 409,
			status: "Error",
			message: message || "Conflict",
			transactionID: transactionID || null,
			data: data,
		});
	},
	internalServerError: function (res, transactionID, message, data = []) {
		res.status(500).json({
			responseCode: 500,
			status: "Error",
			message: message || "Internal server error",
			transactionID: transactionID || null,
			data: data,
		});
	},
	validationError: function (res, transactionID, message, data = [], statusCode = "422") {
		res.status(422).json({
			responseCode: 422,
			statusCode: statusCode,
			status: "validation_error",
			message: message || "Validation failed",
			transactionID: transactionID || null,
			data: data,
		});
	},
};
