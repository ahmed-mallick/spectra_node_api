const appConfig = require("../public/config/config");
const sqlQueries = require("../sql/sqlQueries"); // Adjust the path as needed
const utils = require("../utils/utils");

const AlertsHandler = {
	insertEmailIntoAlertModule: async (
		emailTo,
		subject,
		alertTypeId,
		message,
		regionID,
		isOTP
	) => {
		try {
			const emailFrom = appConfig.emailFrom;
			const result = await sqlQueries.insertAlertMessage(
				emailFrom,
				emailTo,
				subject,
				message,
				alertTypeId,
				regionID,
				null,
				"email",
				isOTP
			);
			utils.log("info", "Insert email in Alert Message");

			return result;
		} catch (err) {
			utils.log("error", "Error inserting email into alert module:" + err);
			throw err;
		}
	},

	insertSMSIntoAlertModule: async (cellNo, message, alertTypeId, regionID,isOTP) => {
		try {
			const smsFrom = appConfig.smsFrom;
			const result = await sqlQueries.insertAlertMessage(
				smsFrom,
				cellNo.replace("MobileNumber:", ""),
				"SMS",
				message,
				alertTypeId,
				regionID,
				null,
				"sms",
				isOTP
			);
			utils.log("info", "Insert SMS in Alert Message");

			return result;
		} catch (err) {
			utils.log("error", "Error inserting SMS into alert module:" + err);
			throw err;
		}
	},
};

module.exports = AlertsHandler;
