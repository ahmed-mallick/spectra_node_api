const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const config = {
	APP_NAME: "spectra-api",

	AUTH_SECRET_KEY: process.env.AUTH_SECRET_KEY,
	AUTH_TOKEN_ALGO: "HS256",
	AUTH_TOKEN_EXPIRY: "1d",

	DB: {
		eqReport: {
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			server: process.env.DB_SERVER,
			database: process.env.DB_EQREPORT,
			options: {
				encrypt: false,
				enableArithAbort: true,
			},
		},
		eqPortal: {
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			server: process.env.DB_SERVER,
			database: process.env.DB_EQPORTAL,
			options: {
				encrypt: false,
				enableArithAbort: true,
			},
		},
		Alert_Module: {
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			server: process.env.DB_SERVER,
			database: process.env.DB_ALERT_MODULE,
			options: {
				encrypt: false,
				enableArithAbort: true,
			},
		},
	},
	DB_CONNECTION_RETRY: 3,
	DB_CONNECTION_RETRY_DELAY: 5,
	API_BASE_URL: process.env.API_BASE_URL,
	REPRINT_TICKET_API_CALL: process.env.REPRINT_TICKET_API_CALL,
	RMQ_SERVICE: true,
	RMQ_CREDENTIALS: process.env.RMQ_CREDENTIALS,
	RMQ_RECONNECTION_TIMER: parseInt(process.env.RMQ_RECONNECTION_TIMER, 10),
	RMQ_RESPONSE_QUEUE: process.env.RMQ_RESPONSE_QUEUE,
	RMQ_EXCHANGE: process.env.RMQ_EXCHANGE,
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
	INSERT_CUSTOMER_VISIT: false,
	CUSTOMER_MULTIPLE_TICKETS: true,
	WaitingTicketsTimeInterval: 2,
	HTTP_PORT: parseInt(process.env.HTTP_PORT, 10),
	HTTPS_PORT: parseInt(process.env.HTTPS_PORT, 10),
	CACHE_EXPIRATION_TIME: 10,
	APPOINTMENT_DATES_FORMAT: "MM/dd/yyyy",
	MAX_RADIUS: 1000,
	MAX_ROWS: 100,
	appointmentEmailFrom: "your-email@example.com",
	cancel_appt_whatsapp_template: "cancel_appointment_msg",
	ContingencyConfigurable_StateId: "Contingency State",
	whatsAppBroadcastRequest: `../public/assets/WhatsAppBroadcast.json`,
	BroadcastBaseAddress: "http://34.212.81.23:9000/",
	BroadcastApiCall: "commandMarketingPost",
	GraceTimeCategoryWise: "0",
	GraceTimeWithinApptStartTime: "0",
	//OTP
	emailFrom: "your-email@example.com",
	smsFrom: "Wavetec",
	otpSendInResponse: true,
	isEnableEMAIL: true,
	isEnableSMS: true,
	otpLength: 5,
	otpOptions: {
		digits: true,
		alphabets: false,
		upperCase: false,
		specialChars: false,
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
	AllowMultipleAppt: true, // use to allow multiple appointments on issue Appointment
	SlotIntervalTime: "0", // use in ics for slotintervaltime
	ICSfilePath: "C:/ICS/", // use to save ics file
	CheckInURL:
		"http://35.86.25.9:2025/#/checkin?lang={{language}}&amp;appointmentnumber={{appointmentNumber}}", // check in url
	GenerateQRCode: true,
	QRBasePath: "C:/",
	QRPublicPath: "/ICS/QR/", // use to save qr file.
	AllowBackDateTimeAppointment: false,
	virtualAppointmentonIssue: true,
	virtualCheckinEnabled: true,
	APPOINTMENT_CHECK_CRON_TIME: 1, // Minute Specific Cron JOB will scheduled to check the appointment for check-in,
	virtualLinkUDFonTicketIssue: 2,
	DEFAULT_LANG: "en",
	VirtualAppointmentReminderForEmail: 10,
	VirtualAppointmentReminderForPopup: 5,
	VIRTUAL_APPOINPTMENT_UDF_ON_TICKETISSUE: [
		{ key: "EmailId", UDF_LOCATION: 1 },
		{ key: "MobileNumber", UDF_LOCATION: 2 },
		{ key: "PhoneModel", UDF_LOCATION: 3 },
		{ key: "PhoneColor", UDF_LOCATION: 4 },
		{ key: "PhoneService", UDF_LOCATION: 5 },
		{ key: "IMEINumber", UDF_LOCATION: 6 },
		{ key: "DeviceHealth", UDF_LOCATION: 7 },
		{ key: "Name", UDF_LOCATION: 3 },
		{ key: "LastName", UDF_LOCATION: 4 },
		{ key: "Note", UDF_LOCATION: 9 },
	],
};

module.exports = config;
