const { v4: uuidv4 } = require("uuid");
const { randomBytes, createHash } = require("crypto");
const config = require("../public/config/config");
const moment = require("moment-timezone");
const sqlQueries = require("../sql/sqlQueries");
const axios = require("axios");
const { getTranslation } = require("./helper");
const { EncryptForURL } = require("../classes/CryptorEngine");
const { getTransactionId } = require("./context");
let cacheData = [];
const cacheExpirationTime = config.CACHE_EXPIRATION_TIME * 60000 || 10 * 60000; // Default to 10 minutes if not set in config

exports.log = function (type, message) {
    const log = require("./winston");
    const tid = getTransactionId(); // get current TID from context
    const tidPrefix = tid ? `[TID: ${tid}] ` : '';
    const fullMessage = tidPrefix + message;

    switch (type) {
        case "error":
            log.error(fullMessage);
            break;
        case "info":
            log.info(fullMessage);
            break;
        // ... others if any
        default:
            break;
    }
};

exports.transactionLog = async function (transaction) {
	try {
		const log = require("./winston");

		const {
			branchid,
			previousapptbranchid,
			categoryid,
			previousapptcategoryid,
			appointmentdate,
			prevappointmentdate,
			appointmentnumber,
			prevappointmentnumber,
			mobilenumber,
			emailid,
			slottime,
			prevslottime,
			endtime,
			prevendtime,
			agentid,
			agentname,
			stateid,
			source
		} = transaction;

		const transactionLog = await sqlQueries.insertApptAuditLogs(
			branchid,
			previousapptbranchid,
			categoryid,
			previousapptcategoryid,
			appointmentdate,
			prevappointmentdate,
			appointmentnumber,
			prevappointmentnumber,
			mobilenumber,
			emailid,
			slottime,
			prevslottime,
			endtime,
			prevendtime,
			agentid,
			agentname,
			stateid,
			source
		);

		if (!transactionLog) {
			log.error(
				`Uanble to add transaction log against transaction: ${JSON.stringify(transaction)}`
			);
		} else {
			log.info(
				`Transaction log added successfully: ${JSON.stringify(transaction)}`
			);
		}
	} catch (error) {
		console.log("error: while adding transaction log: ", error);
		return null;
	}
};

exports.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.getFromCache = async function (key) {
	const cacheItem = cacheData.find((item) => item.key === key);
	if (cacheItem && cacheItem.expiration > Date.now()) {
		return cacheItem.value;
	}
	return null;
};

exports.setToCache = async function (
	key,
	value,
	duration = cacheExpirationTime
) {
	const expiration = Date.now() + duration;
	cacheData = cacheData.filter((item) => item.key !== key);
	cacheData.push({ key, value, expiration });
};

exports.getNextWeekday = function (date, weekday) {
	const resultDate = new Date(date.getTime());
	resultDate.setDate(
		resultDate.getDate() + ((weekday + 7 - date.getDay()) % 7)
	);
	return resultDate;
};

exports.formatDateTime = function (input, format = "MM/dd/yyyy HH:mm:ss") {
	let date;

	// Convert input to Date object
	if (typeof input === "string") {
		// Handle ISO 8601 and date-only formats
		if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?/.test(input)) {
			date = new Date(input);
		} else if (/^\d{2}:\d{2}(:\d{2})?$/.test(input)) {
			date = new Date();
			const [hours, minutes, seconds] = input
				?.split(":")
				.map((num) => parseInt(num, 10));
			date.setHours(hours, minutes, seconds || 0);
		} else if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
			date = new Date(input + "T00:00:00"); // Add time to avoid UTC shift
		} else if (/^\d{10,13}$/.test(input)) {
			date = new Date(parseInt(input, 10));
		} else {
			throw new Error("Invalid date/time format");
		}
	} else if (input instanceof Date) {
		date = input;
	} else if (typeof input === "number") {
		date = new Date(input); // Assume milliseconds if a number
	} else {
		throw new Error(
			"Invalid input type. Must be a string, number, or Date object."
		);
	}

	// Helper function to pad numbers
	const pad = (num, length = 2) => String(num).padStart(length, "0");

	// Extract date and time components using local time
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // Months are zero-based
	const day = date.getDate();
	const hours24 = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const ampm = hours24 >= 12 ? "PM" : "AM";
	const hours12 = hours24 % 12 || 12;

	// Replace format placeholders
	const replacements = {
		yyyy: year,
		yy: String(year).slice(-2), // Two-digit year
		MMMM: new Intl.DateTimeFormat("en-US", { month: "long" }).format(date), // Full month name
		MMM: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date), // Short month name
		MM: pad(month),
		dd: pad(day),
		HH: pad(hours24), // 24-hour format
		hh: pad(hours12), // 12-hour format
		mm: pad(minutes),
		ss: pad(seconds),
		A: ampm,
		ZZ: date.toISOString()?.split("T")[1]?.split(".")[0], // Time in HH:mm:ss
		W: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date), // Full weekday name
		D: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date), // Short weekday name
	};

	// Return formatted date string
	return Object.keys(replacements).reduce(
		(formatted, key) => formatted.replace(key, replacements[key]),
		format
	);
};

exports.convertSecondAndMilliSecond = function (value, toMilliseconds = false) {
	if (toMilliseconds) {
		return value * 1000; // Convert seconds to milliseconds
	} else {
		return value / 1000; // Convert milliseconds to seconds
	}
};

exports.generateUUID = function () {
	const now = new Date();
	const getDate =
		now.getFullYear().toString() +
		String(now.getMonth() + 1).padStart(2, "0") +
		String(now.getDate()).padStart(2, "0") +
		String(now.getHours()).padStart(2, "0") +
		String(now.getMinutes()).padStart(2, "0") +
		String(now.getSeconds()).padStart(2, "0") +
		String(now.getMilliseconds()).padStart(3, "0");
	return uuidv4().replace(/-/g, "") + getDate;
};

let clientId = null;

exports.setClientId = function (id) {
	clientId = id;
};

exports.getClientId = function () {
	return clientId;
};

exports.getValueFromPayloads = function (field, payloads) {
	let value = null;
	for (let i = 0; i < 10; i++) {
		if (i <= payloads.length) {
			if (payloads[i]?.fieldName) {
				if (
					payloads[i].fieldName.toLowerCase() === field &&
					payloads[i].fieldValue
				) {
					if (field === "mobilenumber") {
						value = payloads[i].fieldValue;
					} else if (field === "mobilenumberwithfield") {
						value = payloads[i].fieldName + ":" + payloads[i].fieldValue;
					} else {
						value = payloads[i].fieldValue;
					}
					break;
				}
			}
		}
	}
	return value;
};

exports.getAllPayloadsList = function (payloads) {
	const extractedValues = {};

	// Iterate over payloads and extract each fieldName and fieldValue
	payloads.forEach((payload) => {
		if (payload.fieldName) {
			// Convert fieldName to camelCase for variable name consistency
			const variableName = payload.fieldName.replace(/[^a-zA-Z0-9]/g, "");
			extractedValues[variableName] = payload.fieldValue || "";
		}
	});

	return extractedValues;
};
exports.parseTime = function (timeString) {
	const [hours, minutes] = timeString?.split(":").map(Number);

	if (isNaN(hours) || isNaN(minutes)) {
		throw new Error("Invalid time format");
	}
	const formattedTime = `${String(hours).padStart(2, "0")}:${String(
		minutes
	).padStart(2, "0")}:00`;

	return formattedTime;
};

exports.generateRandomNo5 = function () {
	// Get 2 random digits from the current timestamp ticks
	const tickDigits = getRandomDigitsFromTicks(2);

	// Generate 3 secure random digits
	const randomPart = generateSecureRandomNumber(3);

	// Concatenate tick digits and random part
	const newAppointmentNumber = tickDigits + randomPart;

	// Scramble the digits
	const scrambledNumber = scrambleDigits(newAppointmentNumber);

	return scrambledNumber;
};

// Helper function to get random digits from the current time (ticks)
getRandomDigitsFromTicks = function (count) {
	const ticks = Date.now().toString(); // Using current time as ticks
	let result = "";

	for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(Math.random() * ticks.length); // Get a random index
		result += ticks[randomIndex]; // Append the randomly picked digit
	}

	return result;
};

// Helper function to generate secure random numbers of the given length
generateSecureRandomNumber = function (length) {
	const randomBytess = randomBytes(length); // Secure random bytes
	let result = "";

	// Map each byte to a number (0-9) using modulo operation
	for (let i = 0; i < randomBytess.length; i++) {
		result += (randomBytess[i] % 10).toString();
	}

	return result;
};

// Helper function to scramble digits using the Fisher-Yates shuffle
scrambleDigits = function (input) {
	const array = input?.split(""); // Convert string to array
	let n = array.length;

	// Fisher-Yates shuffle algorithm to randomize array
	while (n > 1) {
		n--;
		const k = Math.floor(Math.random() * (n + 1));
		const temp = array[k];
		array[k] = array[n];
		array[n] = temp;
	}

	return array.join("");
};

exports.formatDateToString = function () {
	const now = new Date();

	// Helper function to pad numbers with leading zeros
	const pad = (num, size) => num.toString().padStart(size, "0");

	// Extract and format components of the date and time
	const year = now.getFullYear();
	const month = pad(now.getMonth() + 1, 2); // Months are 0-based
	const day = pad(now.getDate(), 2);
	const hours = pad(now.getHours(), 2);
	const minutes = pad(now.getMinutes(), 2);
	const seconds = pad(now.getSeconds(), 2);
	const milliseconds = pad(now.getMilliseconds(), 3);

	// Return the formatted date string
	return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
};

exports.verificationCode = function (objectAsBytes) {
	try {
		const md5Hash = createHash("md5");
		md5Hash.update(objectAsBytes);
		const result = md5Hash.digest();

		let verificationCode = "";
		for (let i = 0; i < 3; i++) {
			verificationCode += result[generateRandomNo()].toString();
		}

		return verificationCode;
	} catch (err) {
		console.error("Error generating verification code:", err);
		return null;
	}
};

function generateRandomNo() {
	const min = 0;
	const max = 15;
	return Math.floor(Math.random() * (max - min)) + min;
}

exports.convertToTimeZone = function (appointmentDate, slottime, timeZoneData) {
	const match = timeZoneData?.TimeZoneDisplay.match(
		/\((UTC|GMT)([+-]\d{2}):(\d{2})\)/
	);
	if (match) {
		const timeZonePrefix = match[1];
		const timeZoneHour = parseInt(match[2]);
		const timeZoneMinute = parseInt(match[3]);
		const appointmentDateTimeString = `${appointmentDate}T${slottime}:00`;
		const timeZoneName = `${timeZonePrefix}${match[2]}:${match[3]}`;
		let appointmentDateTime = moment.utc(appointmentDateTimeString);

		const offsetInMinutes = timeZoneHour * 60 + timeZoneMinute;

		const adjustedTime = appointmentDateTime.add(offsetInMinutes, "minutes");

		const formattedDateUTC = adjustedTime
			.utc()
			.format(`YYYY-MM-DDTHH:mm:ss[z]`);
		return formattedDateUTC;
	} else {
		throw new Error("Invalid time zone format");
	}
};
exports.getBranchTimeZoneName = async function (branchid) {
	let branchTimeZoneInfo;
	try {
		let getTimezoneForBranch = await sqlQueries.getTimezoneForBranch(branchid);
		branchTimeZoneInfo = {
			TimeZoneHour: getTimezoneForBranch[0].TimeZoneHour,
			TimeZoneMinute: getTimezoneForBranch[0].TimeZoneMinute,
			TimeZoneDisplay: getTimezoneForBranch[0].TimeZoneDisplay,
			TimeZoneIANA: getTimezoneForBranch[0].TimeZoneIANA,
		};

		if (branchTimeZoneInfo?.TimeZoneIANA) {
			return branchTimeZoneInfo?.TimeZoneIANA;
		}

		const userOffset = getBranchTimeZoneOffset(branchTimeZoneInfo) || "+00:00"; // Default to +00:00 if no offset
		const userTimeZone = `${userOffset}`;
		let timeZoneFromOffset = moment.tz.names().find((zone) => {
			const isOffsetMatch = moment.tz(zone).format("Z") === userTimeZone;

			const zoneWords = zone.split(" ");
			const branchTimeZoneWords = branchTimeZoneInfo.TimeZoneDisplay.split(" ");

			const isNameMatch = branchTimeZoneWords.some((word) =>
				zoneWords.some((zoneWord) =>
					zoneWord.toLowerCase().includes(word.toLowerCase())
				)
			);

			return isOffsetMatch && isNameMatch;
		});

		if (!timeZoneFromOffset) {
			timeZoneFromOffset = moment.tz
				.names()
				.find((zone) => moment.tz(zone).format("Z") === userTimeZone);
		}

		console.log(timeZoneFromOffset);
		return timeZoneFromOffset;
	} catch (error) {
		console.log("error: while fetching branch time zone", error);
		return null;
	}
};
function getBranchTimeZoneOffset(timeZoneData) {
	if (timeZoneData) {
		let { TimeZoneHour, TimeZoneMinute } = timeZoneData;

		let offsetSign = TimeZoneHour >= 0 ? "+" : "-";
		let offsetHour = Math.abs(TimeZoneHour).toString().padStart(2, "0");
		let offsetMinute = Math.abs(TimeZoneMinute).toString().padStart(2, "0");

		return `${offsetSign}${offsetHour}:${offsetMinute}`;
	}
	return null;
}

exports.generatePassword = function (length = 8, specialCharsCount = 1) {
	const charset =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

	let password = "";

	// Add random alphanumeric characters
	for (let i = 0; i < length - specialCharsCount; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}

	// Add required number of special characters
	for (let i = 0; i < specialCharsCount; i++) {
		password += specialChars.charAt(
			Math.floor(Math.random() * specialChars.length)
		);
	}

	// Shuffle password to mix special characters
	return password
		.split("")
		.sort(() => 0.5 - Math.random())
		.join("");
};


exports.parseTranslations = function (translations) {
	if (translations) {
		const translationsObject = {};
		// Split the translation string by commas
		const translationArray = translations.toString().split('|').filter(Boolean);
		// Loop through the array and create the key-value pairs
		translationArray.forEach((translation) => {
			const [language, translationText] = translation.split(':');
			if (language && translationText) {
				translationsObject[language.trim()] = translationText.trim();
			}
		});
		return translationsObject;
	} else {
		return null;
	}
};

exports.getAcronym = function (str) {
	if (!str) return '';
	return str
		.split(' ')
		.map(word => word.charAt(0).toUpperCase())
		.join('');
}

exports.sendWhatsappMessage = async (recipientNumber, parameters) => {
	const {
		apiBaseURL,
		apiVersion,
		phoneNumberId,
		bearerToken,
		templateName,
		languageCode,
		templateParameters
	} = config.WHATSAPP;

	const url = `${apiBaseURL}${apiVersion}/${phoneNumberId}/messages`;

	const payload = {
		messaging_product: 'whatsapp',
		recipient_type: 'individual',
		to: recipientNumber,
		type: 'template',
		template: {
			name: templateName,
			language: { code: languageCode },
			components: [
				{
					type: 'body',
					parameters: templateParameters.map((param, index) => ({
						type: 'text',
						parameter_name: param,
						text: parameters[index]
					}))
				}
			]
		}
	};

	try {
		const response = await axios.post(url, payload, {
			headers: {
				'Authorization': `Bearer ${bearerToken}`,
				'Content-Type': 'application/json'
			}
		});
		console.log('WhatsApp message sent:', response.data);
	} catch (error) {
		console.error('Failed to send WhatsApp message:', error.response?.data || error.message);
	}
}

exports.validateRequestPayloads = function (input, mode = 'field') {
	const errors = [];


	const configMap = config.REQUEST_PAYLOAD_VALIDATION.reduce((map, rule) => {
		map[rule.name] = rule;
		return map;
	}, {});

	if (mode === 'field') {

		input.forEach((item, i) => {
			const { fieldName, fieldValue } = item;

			if (fieldValue) {
				if (!fieldName) return;

				const rule = configMap[fieldName];
				if (!rule) return;


				if (rule?.maxLength !== -1 && (!fieldValue || fieldValue.length > rule.maxLength)) {
					errors.push({
						field: fieldName,
						message: `${fieldName} exceed the max ${rule.maxLength} length`,
					});
					return;
				}


				if (rule?.regex && !new RegExp(rule?.regex, "u").test(fieldValue)) {
					errors.push({
						field: fieldName,
						message: `${fieldName} is invalid. Please enter a valid ${fieldName}.`,
					});
				}
			}
		});
	} else if (mode === 'index') {

		config.REQUEST_PAYLOAD_VALIDATION.forEach((rule) => {
			if (rule.index === -1) return;

			const value = input[rule.index];

			if (value) {
				if (rule?.maxLength !== -1 && (!value || value.length > rule.maxLength)) {
					errors.push({
						index: rule.index,
						message: `${rule.name} exceed the max ${rule.maxLength} length`,
					});
					return;
				}

				if (rule?.regex && !new RegExp(rule?.regex, "u").test(value)) {
					errors.push({
						index: rule.index,
						message: `${rule.name} is invalid. Please enter a valid ${rule.name}.`,
					});
				}
			}
		});
	}

	return errors;
}

exports.verifyCaptchHandler = async (captchaToken, remoteIp) => {
	let resp = { data: { success: true } };

	if (config.VERIFY_CAPTCHA) {
		const params = new URLSearchParams({
			secret: process.env?.SECRET_KEY_HCAPTCHA,
			response: captchaToken,
		});

		if (remoteIp) {
			params.append("remoteip", remoteIp);
		}

		resp = await axios.post(config.CAPTCHA_SITE, params, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});
	}

	return resp;
}

exports.getClientIp = (req) => {
	try {
		let rawIp =
			(req.headers['x-forwarded-for'] || '') // May include multiple IPs
				.split(',')[0]
				.trim() ||
			req.connection?.remoteAddress ||
			req.socket?.remoteAddress ||
			req.connection?.socket?.remoteAddress ||
			'';

		// Strip IPv6 localhost
		if (rawIp === '::1') {
			return '127.0.0.1';
		}

		// Remove IPv6 prefix (e.g., ::ffff:123.123.123.123)
		if (rawIp.startsWith('::ffff:')) {
			rawIp = rawIp.substring(7);
		}

		// Strip port (e.g., 123.123.123.123:56789 or [::1]:54321)
		rawIp = rawIp.replace(/^.*:/, '').replace(/:\d+$/, '');

		// Optional: Basic IPv4 format validation
		const isValidIp = /^[\d.]+$/.test(rawIp);
		const ip = isValidIp ? rawIp : '127.0.0.1';

		console.log('ipAddress:', ip);
		return ip;
	} catch (error) {
		console.warn('Error extracting IP:', error);
		return '127.0.0.1';
	}
};

exports.validateTicketIssuanceWithQuotaHandler = async (
	data
) => {
	let response = {
		message: "",
		status: "",
		statusCode: "",
		data: {},
		transactionID: "",
	};

	const ticketQuotaConfig = config.ticketQuotaConfig;
	const branchid = data?.branchid;
	const categoryname = data?.categorysqn || data?.categoryname;
	const lang = data?.lang || "en";

	if (Object.keys(ticketQuotaConfig).length > 0) {
		if (
			ticketQuotaConfig?.restrictOnQuota &&
			ticketQuotaConfig?.quota_basedon
		) {
			try {
				let validateResp =
					await sqlQueries.checkQuotaBasedTicketIssueRestrictions(
						branchid,
						ticketQuotaConfig?.quota_basedon === "branch"
							? null
							: categoryname
					);

				if (validateResp[0]?.result) {
					validateResp = validateResp[0]?.result.split("|")[0];
					if (validateResp === "0") {
						response.message =
							getTranslation(
								lang?.toLowerCase(),
								"ValidatedTicketIssuanceCriteriaSuccessfully"
							) || "Validated Ticket Issuance Criteria Successfully";
						response.status = "success";
						response.statusCode = "1";
						return response;
					} else if (validateResp === "-1") {
						response.message =
							getTranslation(lang?.toLowerCase(), "QuotaFull") ||
							"Quota Exceeded.. Please Try again later..";
						response.statusCode = "-5";
						return response;
					} else if (validateResp === "-2") {
						response.message =
							getTranslation(
								lang?.toLowerCase(),
								"QuotaWaitTimeReachedClosingTime"
							) || "Customer may not be served before closing time.";
						response.statusCode = "-5";
						return response;
					} else if (validateResp === "-3") {
						response.message =
							getTranslation(lang?.toLowerCase(), "QuotaWaitTimeReached") ||
							"Average wait time exceeds the limit.";
						response.statusCode = "-5";
						return response;
					}
				}
			} catch (error) {
				response.message =
					getTranslation(lang?.toLowerCase(), "ValidatedTicketIssuanceError") ||
					error.message ||
					"An error occurred while checking validation for issuing ticket";
				response.statusCode = "-4";
				return response;
			}
		} else {
			response.message = "";
			response.status = "success";
			response.statusCode = "1";
			return response;
		}
	}
};

exports.validateDuplicateTicketHelper = async (data) => {

	const { payloadArray } = data;

	let response = {
		message: "",
		status: "",
		statusCode: "",
		data: {},
		transactionID: "",
	};

	const ticketQuotaConfig = config.ticketQuotaConfig;
	const requestdata = data?.requestdata;
	const branchid = data?.branchid;
	const categoryname = data?.categoryname
	const lang = data?.lang || "en";
	if (categoryname && branchid && Object.keys(ticketQuotaConfig).length > 0) {
		if (
			requestdata.length > 0 &&
			ticketQuotaConfig?.restrictOnSameContactInfo
		) {
			const isIssued = await sqlQueries.isTicketAlreadyIssue_validate(
				requestdata,
				branchid
			);
			if (isIssued?.Result === "0") {
				console.log(
					"isIssued",
					"Your ticket cannot be issued again only one ticket is allowed per day"
				);

				response.message =
					getTranslation(lang?.toLowerCase(), "CannotIssueAgain") ||
					"Your ticket cannot be issued again";
				response.statusCode = "-6";
				return response;
			}
		}
		return true;
	} else if (Object.keys(payloadArray).length > 0 && branchid && Object.keys(ticketQuotaConfig).length > 0) {
		if (
			requestdata.length > 0
		) {

		}
	}
}

exports.getmbtappointmentuserpayloadsparams = (
	userId,
	apptNum,
	values,
	cellPhoneNumber,
	encreferenceno) => {

	const list = [];
	
	// list.push(parseInt(apptNum, 10)); // Appointment number as bigint
	list.push(cellPhoneNumber); // Encrypted cell phone number

	for (let i = 0; i < 10; i++) {
		if (i < values.length) {
			if (
				values[i]?.fieldName &&
				values[i]?.fieldName.toLowerCase().includes("url")
			) {
				const URL = values[i].fieldValue.replace(
					"{{appointmentnumber}}",
					encreferenceno
				);
				list.push(`${values[i].fieldName}:${URL}`);
			} else if (values[i]?.fieldName) {
				const fieldName = values[i].fieldName.toLowerCase();
				list.push(
					fieldName === "wizardinfo"
						? null
						: `${values[i].fieldName}:${values[i].fieldValue}`
				);
			} else {
				list.push(null);
			}
		} else {
			list.push(null); // Fill remaining slots with null
		}
	}
	// Add ProductTypeName and ProductFamilyName if needed
	list.push(null); // Assuming no value for ProductTypeName
	list.push(null); // Assuming no value for ProductFamilyName

	return list;
}

exports.generateVerificationLink = (email, customerId = 0) => {
	const expiresAt = Date.now() + config.EMAIL_VERIFICATION_EXPIRY_MINUTES * 60 * 1000;
  	const issuedAt = Date.now();

	const payload = JSON.stringify({
		email,
		issuedAt,
		expiresAt,
		customerId
	});

	const token = EncryptForURL(payload);

	const baseUrl = config.EMAIL_VERIFICATION_BASE_URL;

	return `${baseUrl}?token=${encodeURIComponent(token)}`;
};

exports.generateTransactionId = function () {
	const now = Date.now().toString(36).toUpperCase(); // base36 timestamp
	const random = Math.random().toString(36).substring(2, 4).toUpperCase(); // 2-char random
	return `TX-${now}${random}`; // TX-K83JL1RZ9D
};
