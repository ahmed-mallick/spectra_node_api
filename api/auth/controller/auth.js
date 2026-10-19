const appConfig = require("../../../public/config/config");
const utils = require("../../../utils/utils");
const sqlQueries = require("../../../sql/sqlQueries");
const responseHandler = require("../../../utils/responsesHandler");
const { getTranslation } = require("../../../utils/helper");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const fs = require("fs");
const cacheManager = require('../../../utils/cacheManager');

// Generate JWT
exports.generateToken = async (req, res) => {
	const { lang = "en" } = req.query;

	console.log("lang", lang);
	try {
		const guidPattern =
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
		const sId = req.query.sid;

		// Log incoming request parameters for tracking
		utils.log("info", `Incoming request query: ${JSON.stringify(req.query)}`);

		if (!sId) {
			utils.log(
				"error",
				"generateToken - Invalid parameters. 'sId' field is required."
			);
			return responseHandler.badRequest(
				res,
				"",
				getTranslation(lang?.toLowerCase(), "GenerateTokenInvalidParameters") ||
				"'sId' field is required to generate the token"
			);
		} else if (!guidPattern.test(sId)) {
			utils.log("error", "generateToken - Invalid GUID format for 'sId'.");
			return responseHandler.badRequest(
				res,
				"",
				getTranslation(lang?.toLowerCase(), "GenerateTokenInvalidGUID") ||
				"Invalid GUID format!"
			);
		}

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
				

		const payload = {
			sId: clientId,
			service: appConfig.APP_NAME,
		};

		const token = jwt.sign(payload, appConfig.AUTH_SECRET_KEY, {
			algorithm: appConfig.AUTH_TOKEN_ALGO,
			expiresIn: appConfig.AUTH_TOKEN_EXPIRY,
		});
		utils.log("info", "Token generated successfully");

		return responseHandler.dataSent(
			res,
			"",
			getTranslation(lang?.toLowerCase(), "GenerateTokenSuccess") ||
			"Token generated successfully",
			{ token }
		);
	} catch (error) {
		utils.log("error", `Error generating token: ${error.message}`);
		return responseHandler.internalServerError(
			res,
			"",
			getTranslation(lang?.toLowerCase(), "GenerateTokenInternalServerError") ||
			"An error occurred while generating token"
		);
	}
};

exports.getAuthGoogleApi = async (req, res) => {
	const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));
	const { client_secret, client_id, redirect_uris } =
		CREDENTIALS.installed || CREDENTIALS.web;

	const oAuth2Client = new google.auth.OAuth2(
		client_id,
		client_secret,
		redirect_uris || "http://localhost:3001"
	);

	const SCOPES = ["https://www.googleapis.com/auth/calendar"];
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	});

	res.redirect(authUrl);
};

exports.oauthcallback = async (req, res) => {
	const code = req.query.code;

	if (!code) {
		utils.log(
			"error",
			"oauthcallback: Missing parameters - No authorization code found in the query string"
		);
		return res
			.status(400)
			.send("No authorization code found in the query string");
	}

	try {
		const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));
		const { client_secret, client_id, redirect_uris } =
			CREDENTIALS.installed || CREDENTIALS.web;

		const oAuth2Client = new google.auth.OAuth2(
			client_id,
			client_secret,
			redirect_uris || "http://localhost:3001"
		);

		const { tokens } = await oAuth2Client.getToken(code);
		oAuth2Client.setCredentials(tokens);

		fs.writeFileSync("token.json", JSON.stringify(tokens));
		console.log("Token stored to token.json");

		res.send("Authentication successful! Tokens have been stored.");
	} catch (error) {
		utils.log("error", `Error retrieving access token: ${error.message}`);
		res.status(500).send("Error retrieving access token");
	}
};

// Generate JWT for Configuration Portal
exports.generateTokenForConfigurationPortal = function generateTokenForConfigurationPortal(userId, userName) {
	try {
		const payload = {
			userId: userId,
			userName: userName,
			service: appConfig.APP_NAME,
		};

		const token = jwt.sign(payload, appConfig.AUTH_SECRET_KEY, {
			algorithm: appConfig.AUTH_TOKEN_ALGO,
			expiresIn: appConfig.USER_AUTHENTICATION_TOKEN_EXPIRY,
		});

		utils.log("info", "Token generated successfully");

		return token;

	} catch (error) {
		utils.log("error", `Error generating token: ${error.message}`);
		return "An error occurred while generating token";
	}
};
