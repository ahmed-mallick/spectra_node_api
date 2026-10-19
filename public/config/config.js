// Load environment variables from .env file;
require("dotenv").config();

const config = {
	HTTP_PORT_ENABLE: parseInt(process.env.HTTP_PORT_ENABLE, 10),
	HTTP_PORT: parseInt(process.env.HTTP_PORT, 10),
	HTTPS_PORT: parseInt(process.env.HTTPS_PORT, 10),
	APP_NAME: "spectra-api",

	AUTH_SECRET_KEY: process.env.AUTH_SECRET_KEY,
	AUTH_TOKEN_ALGO: "HS256",
	AUTH_TOKEN_EXPIRY: "1d",

	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET,

	APT_RELEASE_SLOT_MIN_TIME_IN_MINS: 1,
	APT_RELEASE_SLOT_MAX_TIME_IN_MINS: 2,
	APT_SLOT_AUTO_RELEASE_ENABLED: false,
	APT_SLOT_AUTO_RELEASE_CRON_TIME: 5,
	APT_LOCK_SLOT_TIME_IN_MINS: 5,

	APT_IMPLICIT_CANCELLED_CRON_RETRY_COUNT: 2,
	APT_IMPLICIT_CANCELLED_CRON_ENABLED: true,
	APT_IMPLICIT_CANCELLED_CRON_TIME: "07:55",

	DB: {
		eqReport: {
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			server: process.env.DB_SERVER,
			database: process.env.DB_EQREPORT,
			port: process.env?.DB_PORT ? parseInt(process.env?.DB_PORT, 10) : 1433,
			options: {
				encrypt: false,
				enableArithAbort: true,
				parseJSON: false, // Prevent Automatic JSON parsing of datetime
				useUTC: false, // Prevent datetime conversion
			},
			requestTimeout: 60000, // Increase to 60 seconds
			connectionTimeout: 60000, // 30 seconds for connection timeout
			pool: {
				max: 10,
				min: 2,
				idleTimeoutMillis: 60000, // 30 seconds for idle connections
				acquireTimeoutMillis: 15000, // wait max 15s for a free connection
			},
		},
		eqPortal: {
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			server: process.env.DB_SERVER,
			database: process.env.DB_EQPORTAL,
			port: process.env?.DB_PORT ? parseInt(process.env?.DB_PORT, 10) : 1433,
			options: {
				encrypt: false,
				enableArithAbort: true,
				parseJSON: false, // Prevent Automatic JSON parsing of datetime
				useUTC: false, // Prevent datetime conversion
			},
			requestTimeout: 60000, // Increase to 60 seconds
			connectionTimeout: 30000, // 30 seconds for connection timeout
			pool: {
				max: 10,
				min: 2,
				idleTimeoutMillis: 30000, // 30 seconds for idle connections
				acquireTimeoutMillis: 15000, // wait max 15s for a free connection
			},
		},
		Alert_Module: {
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			server: process.env.DB_SERVER,
			database: process.env.DB_ALERT_MODULE,
			port: process.env?.DB_PORT ? parseInt(process.env?.DB_PORT, 10) : 1433,
			options: {
				encrypt: false,
				enableArithAbort: true,
				parseJSON: false, // Prevent Automatic JSON parsing of datetime
				useUTC: false, // Prevent datetime conversion
			},
			requestTimeout: 60000, // Increase to 60 seconds
			connectionTimeout: 30000, // 30 seconds for connection timeout
			pool: {
				max: 10,
				min: 1,
				idleTimeoutMillis: 30000, // 30 seconds for idle connections
				acquireTimeoutMillis: 15000, // wait max 15s for a free connection
			},
		},
	},
	DB_CONNECTION_RETRY: 5,
	DB_CONNECTION_RETRY_DELAY: 1,
	API_BASE_URL: process.env.API_BASE_URL,
	EXTERNAL_API_BASE_URL: process.env.EXTERNAL_API_BASE_URL,
	REPRINT_TICKET_API_CALL: process.env.REPRINT_TICKET_API_CALL,
	EXTERNAL_API_TOKEN_URL: process.env.EXTERNAL_API_TOKEN_URL,
	EXTERNAL_API_FEE_PAYMENT_URL: process.env.EXTERNAL_API_FEE_PAYMENT_URL,
	RMQ_SERVICE: true,
	RMQ_CREDENTIALS: process.env.RMQ_CREDENTIALS,
	RMQ_HEARTBEAT: process.env.RMQ_HEARTBEAT,
	RMQ_RECONNECTION_TIMER: parseInt(process.env.RMQ_RECONNECTION_TIMER, 10),
	RMQ_RESPONSE_QUEUE: process.env.RMQ_RESPONSE_QUEUE,
	RMQ_EXCHANGE: process.env.RMQ_EXCHANGE,
	RMQ_EXCHANGE_WEB_TICKETING: process.env.RMQ_EXCHANGE_WEB_TICKETING,
	RMQ_QUEUE_NAME: process.env.RMQ_QUEUE_NAME,
	RMQ_INSTANCE_ID: process.env.RMQ_INSTANCE_ID,
	RMQ_X_MESSAGE_TTL: parseInt(process.env.RMQ_X_MESSAGE_TTL, 10),
	RMQ_X_EXPIRES: parseInt(process.env.RMQ_X_EXPIRES, 10),
	RMQ_CONNECTION_TIMEOUT: 10,
	RMQ_MAX_CHANNELS: 10,
	CHECK_BRANCH_SCHEDULER: false,
	SWISS_POST_HTTPSTATUS_CODE: true,
	CHECK_BRANCH_HOLIDAY: false,
	WORKFLOW_ENABLE_OR_DISABLE: false,
	GET_PRACTITIONER_INDEX: 2,
	REPRINT_TICKET: false,
	TEMPLATE_NAME: "reprint_ticket",
	PHONE_NUMBER_INDEX: 1,
	PATIENT_NUMBER_INDEX: 2,
	CUSTOMER_MULTIPLE_TICKETS: true,
	WaitingTicketsTimeInterval: 2,
	HTTP_PORT: parseInt(process.env.HTTP_PORT, 10),
	HTTPS_PORT: parseInt(process.env.HTTPS_PORT, 10),
	CACHE_EXPIRATION_TIME: 10,
	APPOINTMENT_DATES_FORMAT: "MM/dd/yyyy",
	MAX_RADIUS: 10000000,
	MAX_ROWS: 100,
	appointmentEmailFrom: "update@wavetec.com",
	cancel_appt_whatsapp_template: "cancel_appointment_msg",
	ContingencyConfigurable_StateId: "Contingency State",
	whatsAppBroadcastRequest: `../public/assets/WhatsAppBroadcast.json`,
	BroadcastBaseAddress: "http://34.212.81.23:9000/",
	BroadcastApiCall: "commandMarketingPost",
	GraceTimeCategoryWise: "0",
	GraceTimeWithinApptStartTime: "1",
	//OTP
	emailFrom: "update@wavetec.com",
	smsFrom: "Wavetec",
	otpSendInResponse: false,
	isEnableEMAIL: true,
	isEnableSMS: true,
	otpLength: 5,
	otpOptions: {
		digits: true,
		alphabets: false,
		upperCase: false,
		specialChars: false,
		isEnableOTPAuditLog:true,
	},
	otpExpirationTime: 5, //minutes

	//Issue Appointment Tags

	DeviceType: [
		"OpinionPlus",
		"webticket",
		"MobileTicketing",
		"SMSTicketing",
		"IVRTicketing",
		"WhatsAppTicketing",
		"CallCenterTicketing",
	],
	AllowMultipleAppt: false, // use to allow multiple appointments on issue Appointment
	SlotIntervalTime: "0", // use in ics for slotintervaltime
	ICSfilePath: "C:/inetpub/wwwroot/Webticketing-3.4.1/ICS/", // use to save ics file
	CheckInURL:
		"https://drivetestqa.wavetec.live:446/WebTicketingAppointment/#/checkin?lang={{language}}&amp;appointmentnumber={{appointmentNumber}}", // check in url
	CHECKIN_URL_IN_EMAILALERTS: true, //it will use {app_url} key for template to insert from backend
	EMAIL_VERIFICATION_BASE_URL: "localhost:3000/signin",
	EMAIL_VERIFICATION_EXPIRY_MINUTES: 1440, // 24 hours
	GenerateQRCode: true,
	QRBasePath: "C:/inetpub/wwwroot/Webticketing-3.4.1",
	QRPublicPath: "QR/", // use to save qr file.
	AllowBackDateTimeAppointment: false,
	virtualAppointmentonIssue: true,
	virtualCheckinEnabled: false,
	APPOINTMENT_CHECK_CRON_TIME: 1, // Minute Specific Cron JOB will scheduled to check the appointment for check-in,
	DELAY_BETWEEN_CHECKINS: 6, //Seconds
	virtualLinkUDFonTicketIssue: 8, //array payload array index will be -1 from virtualLinkUDFonTicketIssue
	AUTO_CHECKING_TICKET_PRIORITY: 1, //Priority Used in ticket issue while auto checkin for virtual Appointment
	DEFAULT_LANG: "en",
	VirtualAppointmentReminderForEmail: 10, //Email Reminder from Third Party API for Virtual Appointment in minutes
	VirtualAppointmentReminderForPopup: 5, //POPup Reminder from Third Party API for Virtual Appointment in minutes
	//Virtual Appointment Payload UDF Configuration with udf location
	VIRTUAL_APPOINPTMENT_UDF_ON_TICKETISSUE: [
		{ key: "MobileNumber", UDF_LOCATION: 1 },
		{ key: "EmailId", UDF_LOCATION: 3 },
		{ key: "LastName", UDF_LOCATION: 9 },
		{ key: "Name", UDF_LOCATION: 2 },
		{ key: "language:", UDF_LOCATION: 6 },
		/*{ key: "PhoneService", UDF_LOCATION: 5 },
		{ key: "IMEINumber", UDF_LOCATION: 6 },
		{ key: "DeviceHealth", UDF_LOCATION: 7 },
		{ key: "PhoneModel", UDF_LOCATION: 8 },
		{ key: "PhoneColor", UDF_LOCATION: 9 },
		{ key: "Note", UDF_LOCATION: 10 },*/
	], //array payload array index will be -1 from VIRTUAL_APPOINPTMENT_UDF_ON_TICKETISSUE UDF_LOCATION

	APPOINTMENT_ALERT_TEMPLATES: {
		ONSITE_APPOINTMENT: {
			RESCHEDULE: "EMAIL_ON_RESCHEDULE_APPOINTMENT",
			ISSUE: "EMAIL_ON_ISSUE_APPOINTMENT",
		},
		VIRTUAL_APPOINTMENT: {
			RESCHEDULE: "EMAIL_ON_RESCHEDULE_APPOINTMENT",
			ISSUE: "EMAIL_ON_ISSUE_APPOINTMENT",
		},
	},

	GET_APPOINTMENT_DATA: {
		FIRST_NAME_UDF: "UDF3",
		LAST_NAME_UDF: "UDF4",
		NO_OF_DAYS_PREVIOUS_APPOINTMENTS: "15",
		NO_OF_DAYS_FUTURE_APPOINTMENTS: "15",
		APPOINTMENT_EMAIL_UDF: "UDF1",
		APPOINTMENT_PHONE_NUMBER_UDF: "UDF2",
		CUSTOMER_ID_UDF: "UDF8",
	},
	DENSITY_STATUS_CONFIG: {
		ranges: [
			{
				minBookedPercent: 0,
				maxBookedPercent: 15,
				status: "Open",
				code: 0,
			},
			{
				minBookedPercent: 16,
				maxBookedPercent: 50,
				status: "Some",
				code: 1,
			},
			{
				minBookedPercent: 51,
				maxBookedPercent: 85,
				status: "Most",
				code: 2,
			},
			{
				minBookedPercent: 86,
				maxBookedPercent: 100,
				status: "Full",
				code: 3,
			},
		],
		default: {
			status: "Unavailable",
			code: 4,
		},
	},
	DB_CONNECTION_INITIAL_STARTUP: false, //
	GET_CATEGORY_WAITING_LIST_FROM_CACHE: false, //Disable/Enable cache feature in get category waiting list
	CUSTOMER_ID_PREFIX: "S",
	CUSTOMER_ID_BATCH_SIZE: 10,
	TICKET_ISSUE_ALERT: true,
	GETTICKETDETAIL_BASEURL:
		"https://qa-booking.serco-des.ca/SercoJTL/#/getticketdetail?ticketid={ticketid}",
	USER_PASSWORD_ENCRYPTION_KEY: process.env.USER_PASSWORD_ENCRYPTION_KEY,
	USER_AUTHENTICATION_TOKEN_EXPIRY:
		process.env.USER_AUTHENTICATION_TOKEN_EXPIRY,
	TICKET_RESTRICT_ON_UNIQUE_PAYLOAD: {
		PHONE_NO_UDF: "UDF2", //Add data index as UDF1, UDF2.... UDF10
		EMAIL_UDF: "UDF3",
	},
	BULK_CANCEL_QUOTA_RELEASE: false,

	REQUEST_PAYLOAD_VALIDATION: [
		{
			index: -1,
			name: "EmailId",
			regex:
				"^(?!.*[-_.]{2})([\\p{L}\\p{N}]+(?:[-_.][\\p{L}\\p{N}]+)*)@[a-zA-Z0-9-]+(\\.[a-zA-Z]{1,4}){1,2}$",
			maxLength: -1,
		},
		{
			index: -1,
			name: "MobileNumber",
			regex: "^\\+?[0-9\\s\\-]{10,15}$",
			maxLength: 20,
		},
		{
			index: 0,
			name: "FullName", //ticketing
			regex:
				"^(?=.{1,50}$)[A-Za-zÀ-ÖØ-öø-ÿĀ-ſƀ-ƿȘșȚțÂâÎîÊêÔôÛûÉéÈèÙù'’|-]+(?: [A-Za-zÀ-ÖØ-öø-ÿĀ-ſƀ-ƿȘșȚțÂâÎîÊêÔôÛûÉéÈèÙù'’|-]+)*$",
			maxLength: 50,
		},
		{
			index: -1,
			name: "FirstName", //appointment
			regex: "^[a-zA-Z\\s'-]{1,}$",
			maxLength: 30,
		},
		{
			index: -1,
			name: "Surname", //appointment
			regex: "^[a-zA-Z\\s'-]{1,}$",
			maxLength: 30,
		},
		{
			index: -1,
			name: "LicenceCountry",
			regex: "",
			maxLength: -1,
		},
		{
			index: -1,
			name: "licenceIssuedDate",
			regex: "^\\d{4}-\\d{2}-\\d{2}$",
			maxLength: -1,
		},
		{
			index: -1,
			name: "OntarioCard",
			regex: "",
			maxLength: -1,
		},
		{
			index: -1,
			name: "ModifyCancelURL",
			regex: "^(http|https)://.+$",
			maxLength: -1,
		},
		{
			index: -1,
			name: "CheckinURL",
			regex: "^(http|https)://.+$",
			maxLength: -1,
		},
		{
			index: 5,
			name: "Language",
			regex: "", // e.g., en, fr
			maxLength: -1,
		},
		{
			index: -1,
			name: "peopleAttending",
			regex: "^[0-9]+$",
			maxLength: -1,
		},
	],

	DATA_IMPORT: {
		languageCode: "en",
		categoryId: "",
		branchId: 60,
		appointmentNumberIndex: 0,
		appointmentDateIndex: 7,
		slotStartTimeIndex: 8,
		slotEndTimeIndex: 8,
		userIdIndex: 4,
		skipUDFIndexes: [6], // Skip UDF6
	},
	DATA_IMPORT_V2: {
		languageCode: "en",
		categoryId: "BIG", // Default category
		branchId: 33, // Default branch
		clientId: 5, // Default client
		saveToServer: false, // Set to false if you don't want to save files on server

		hasHeaders: false, // Your CSV doesn't have headers

		// Actual column headers (based on your CSV structure)
		columnHeaders: [
			"CASENO", // Column 0
			"PROCESS_ID", // Column 1 (appointment number)
			"LAST_NAME", // Column 2
			"FIRST_NAME", // Column 3
			"DOB", // Column 4
			"TYPE_ID", // Column 5
			"APPOINTMENT_NAME", // Column 6
			"AREA_DESC", // Column 7
			"WORKER_NAME", // Column 8
			"APPOINTMENT_DT", // Column 9 (date-time)
		],

		// REQUIRED FIELD MAPPING
		columns: {
			// Appointment number
			appointmentNumber: {
				index: 1, // Column index 1 (second column)
				header: "PROCESS_ID",
				default: null,
			},

			// Date-time
			appointmentDate: {
				index: 9, // Column index 9 (tenth column)
				header: "APPOINTMENT_DT",
				default: null,
			},

			// User ID
			userId: {
				index: 1, // PROCESS_ID at column index 1
				header: "PROCESS_ID",
				default: null,
			},

			// OPTIONAL TIME FIELDS (set to -1 if not present in file)
			startTime: { index: -1, header: "", default: null },
			endTime: { index: -1, header: "", default: null },

			// FLEXIBLE UDF MAPPING - Map only the columns that exist
			udfMapping: {
				UDF1: { index: 0, header: "CASENO", default: null },
				UDF2: { index: 1, header: "PROCESS_ID", default: null },
				UDF3: { index: 2, header: "LAST_NAME", default: null },
				UDF4: { index: 3, header: "FIRST_NAME", default: null },
				UDF5: { index: 4, header: "DOB", default: null },
				UDF6: { index: 5, header: "TYPE_ID", default: null },
				UDF7: { index: 6, header: "APPOINTMENT_NAME", default: null },
				UDF8: { index: 7, header: "AREA_DESC", default: null },
				UDF9: { index: 8, header: "WORKER_NAME", default: null },
				UDF10: { index: 9, header: "APPOINTMENT_DT", default: null },
			},

			// Configuration
			skipUDFs: [], // UDF numbers (1-10) to skip (empty array = don't skip any)
			defaultDuration: 60, // 60-minute appointments if end time not provided
		},

		// Dynamic category mapping (optional)
		dynamicCategory: {
			enabled: false, // Set to true to auto-detect category from data
			mappings: [
				{ match: "SNAP", categoryId: "SNAP" },
				{ match: "TA", categoryId: "TA" },
				{ match: "HOUSING", categoryId: "HOUSING" },
			],
			sourceColumn: { index: 7, header: "AREA_DESC" },
		},
	},

	WHATSAPP: {
		apiVersion: "v19.0",
		apiBaseURL: "https://graph.facebook.com/",
		countryCode: "92",
		phoneNumberId: "110074261995534",
		bearerToken: process.env.WHATSAPP_BEARER_TOKEN,
		templateName: "reg_rawalpindi",
		languageCode: "en",
		templateParameters: ["name", "date", "time_slot", "task_id", "cnic"], // in order
		recipients: [
			{
				phoneIndex: 2,
				nameIndex: 1,
				cnicIndex: 5,
			},
			{
				phoneIndex: 4,
				nameIndex: 3,
				cnicIndex: 6,
			},
		],
	},
	VERIFY_CAPTCHA: false,
	CAPTCHA_SITE: "https://hcaptcha.com/siteverify",
	ticketQuotaConfig: {
		restrictOnQuota: true,
		quota_basedon: "category", //small branch OR category
		restrictOnSameContactInfo: true,
	},
	TWILIO_PHONE_URL: "https://lookups.twilio.com/v1/PhoneNumbers",
	CLIENT_CLOSE_COUNTER_LOGGING: ["1"],
};

module.exports = config;
