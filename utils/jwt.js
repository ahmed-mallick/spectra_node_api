const appConfig = require("../public/config/config");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const sqlQueries = require("../sql/sqlQueries");
const responseHandler = require("./responsesHandler");
const { getTranslation } = require("../utils/helper");
const cacheManager = require('./cacheManager');

// Middleware to verify JWT
exports.verifyJWT = async (req, res, next) => {
	try {
		const guidPattern =
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
		const token = req.headers["authorization"];
		const sId = req.headers["sid"];

		utils.log(
			"info",
			`Incoming request: ${JSON.stringify(req.originalUrl)}`
		);

		if (!sId) {
			const allowlistEndpoints =
				process.env.ALLOWLIST_ENDPOINTS?.split(",") || [];
			const currentEndpoint = req.originalUrl?.toLowerCase();

			let endpoint = currentEndpoint.split("?")[0];
			if (allowlistEndpoints.includes(endpoint)) {				
				return next();
			}
			utils.log(
				"error",
				"verifyJWT: Missing parameters - sId field is required to verify the token!"
			);
			return responseHandler.forbidden(
				res,
				"",
				getTranslation(
					req.headers.lang?.toLowerCase(),
					"VerifyJWTMissingSID"
				) || "sId field is required to verify the token!"
			);
		} else if (!guidPattern.test(sId)) {
			utils.log("error", "verifyJWT: Missing parameters - Invalid GUID!");
			return responseHandler.badRequest(
				res,
				"",
				getTranslation(
					req.headers.lang?.toLowerCase(),
					"VerifyJWTInvalidGUID"
				) || "Invalid GUID!"
			);
		}

		// Check cache for client ID first
		let clientId = cacheManager.get('clientId', sId);
		
		if (!clientId) {
			const result = await sqlQueries.retrieveClientId(sId);
			
			if (!result.recordset.length) {				
				return responseHandler.badRequest(
					res,
					"",
					getTranslation(
						req.headers.lang?.toLowerCase(),
						"VerifyJWTClientIdNotFound"
					) || "sId not found!"
				);
			}
			
			clientId = result.recordset[0].ClientId;
			// Cache the client ID
			cacheManager.set('clientId', sId, clientId);
		}
		
		req.clientid = clientId;
		utils.setClientId(clientId);

		if (!token) {			
			return responseHandler.unauthorized(
				res,
				"",
				getTranslation(req.headers.lang?.toLowerCase(), "VerifyJWTNoToken") ||
				"A token is required for authentication"
			);
		}

		// Check cache for JWT verification first
		let decoded = cacheManager.get('jwt', token);
		
		if (!decoded) {
			try {
				decoded = jwt.verify(token, appConfig.AUTH_SECRET_KEY);
				// Cache the decoded token
				cacheManager.set('jwt', token, decoded);
			} catch (err) {
				utils.log("error", "verifyJWT: Invalid token!");
				return responseHandler.unauthorized(
					res,
					"",
					getTranslation(
						req.headers.lang?.toLowerCase(),
						"VerifyJWTInvalidToken"
					) || "Invalid Token!"
				);
			}
		}
		
		req.user = decoded;

		return next();
	} catch (error) {
		utils.log("error", `Error verifying token: ${error.message}`);
		return responseHandler.internalServerError(
			res,
			"",
			getTranslation(
				req.headers.lang?.toLowerCase(),
				"VerifyJWTInternalServerError"
			) || "An error occurred while verifying token"
		);
	}
};



// Middleware to verify JWT
exports.verifyConfigurationPortalJWT = async (req, res, next) => {
	try {
		const allowlistEndpoints =
			process.env.ALLOWLIST_ENDPOINTS?.split(",") || [];
		const currentEndpoint = req.originalUrl?.toLowerCase();

		let endpoint = currentEndpoint.split("?")[0];
		if (allowlistEndpoints.includes(endpoint)) {
			utils.log(
				"info",
				`verifyConfigurationPortalJWT: Skipping JWT verification for allowed listed endpoint: ${currentEndpoint}`
			);
			return next();
		}
		const jwtToken = req.headers["authorization"];

		utils.log(
			"info",
			`verifyConfigurationPortalJWT: Incoming request headers: ${JSON.stringify(req.headers)}`
		);

		if (!jwtToken) {
			utils.log(
				"error",
				"verifyConfigurationPortalJWT: Missing parameters - A token is required for authentication"
			);
			return responseHandler.unauthorized(
				res,
				"",
				"verifyConfigurationPortalJWT: A token is required for authentication"
			);
		}

		//split token
		const parts = jwtToken.trim().split(' ');

		if (parts.length !== 2) {
			return null;
		}

		const [scheme, token] = parts;

		// Case-insensitive check for Bearer
		if (scheme.toLowerCase() !== 'bearer') {
			utils.log("error", "verifyConfigurationPortalJWT: Invalid token!");
			return responseHandler.unauthorized(
				res,
				"",
				"verifyConfigurationPortalJWT: Invalid Token!"
			);
		}

		// Validate token is not empty
		if (!token || token.trim().length === 0) {
			utils.log("error", "verifyConfigurationPortalJWT: Invalid token!");
			return responseHandler.unauthorized(
				res,
				"",
				"verifyConfigurationPortalJWT: Invalid Token!"
			);
		}

		try {

			const decoded = jwt.verify(token, appConfig.AUTH_SECRET_KEY);
			req.body.user = decoded ?? null;
			utils.log("info", `verifyConfigurationPortalJWT: Token verified. user: ${JSON.stringify(decoded)}`);
		} catch (err) {
			utils.log("error", "verifyConfigurationPortalJWT: Invalid token!" + err);
			return responseHandler.unauthorized(
				res,
				"",
				`verifyConfigurationPortalJWT: ${err?.message}`
			);
		}

		next();
	} catch (error) {
		utils.log("error", `verifyConfigurationPortalJWT: Error verifying token: ${error?.message}`);
		return responseHandler.internalServerError(
			res,
			"",
			"verifyConfigurationPortalJWT: An error occurred while verifying token. " + error?.message
		);
	}
};