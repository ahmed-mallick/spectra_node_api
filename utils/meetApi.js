const fs = require("fs");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const readline = require("readline");
const { getTranslation } = require("../utils/helper");
const config = require("../public/config/config");
const utils = require("../utils/utils");
const DEFAULT_LANG = config?.DEFAULT_LANG;
const TOKEN_PATH = "token.json";
const CREDENTIALS_PATH = "credentials.json";
exports.createGoogleMeetReference = async function (
	appointmentnumber,
	emailid,
	startDateTime,
	endTime,
	branchid
) {
	try {
		const CREDENTIALS = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
		const { client_secret, client_id, redirect_uris } =
			CREDENTIALS.installed || CREDENTIALS.web;
		const oAuth2Client = new google.auth.OAuth2(
			client_id,
			client_secret,
			redirect_uris || "http://localhost:3001"
		);

		if (fs.existsSync(TOKEN_PATH)) {
			const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
			if (!token.refresh_token) {
				console.log("No refresh token found, need to re-authorize.");
				await getAccessToken(oAuth2Client);
			} else {
				oAuth2Client.setCredentials(token);
			}
		} else {
			await getAccessToken(oAuth2Client);
		}

		const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

		let meetlink = await createCalenderEvent(
			calendar,
			appointmentnumber,
			emailid,
			startDateTime,
			endTime,
			branchid
		);
		return meetlink;
	} catch (err) {
		console.error("Error creating Virtual Appointment:", err.message);
	}
};

function getAccessToken(oAuth2Client) {
	return new Promise((resolve, reject) => {
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: "offline",
			scope: ["https://www.googleapis.com/auth/calendar"],
			prompt: "consent",
		});

		console.log("Authorize this app by visiting this URL:", authUrl);

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.question("Enter the code from that page here: ", async (code) => {
			rl.close();
			try {
				const { tokens } = await oAuth2Client.getToken(code);
				oAuth2Client.setCredentials(tokens);

				fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
				console.log("Token stored to", TOKEN_PATH);
				resolve();
			} catch (err) {
				console.error("Error retrieving access token", err);
				reject(err);
			}
		});
	});
}

async function createCalenderEvent(
	calendar,
	appointmentnumber,
	emailid,
	startDateTime,
	endTime,
	branchid
) {
	try {
		const timeZoneFromOffset = await utils.getBranchTimeZoneName(branchid);

		let systemTimeZone = null;
		if (!timeZoneFromOffset) {
			systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		}
		let startDate = `${startDateTime}`;

		startDate = `${startDateTime}`; // Correct time zone offset for PDT
		endDateTime = `${startDate?.split("T")[0]}T${endTime}:00`; // Same date but with the new end time

		const event = {
			summary:
				getTranslation(DEFAULT_LANG, "virtualAppointmentEventSummary") ||
				"Virtual Appointment",
			location:
				getTranslation(DEFAULT_LANG, "virtualAppointmentLocation") || "Online",
			description:
				getTranslation(DEFAULT_LANG, "virtualAppointmentDescription") ||
				`Virtual Appointment Meeting For Appointment No: ${appointmentnumber.toString()}`,

			start: {
				dateTime: `${startDate}`,
				timeZone: timeZoneFromOffset.toString(),
			},
			end: {
				dateTime: `${endDateTime}`,
				timeZone: timeZoneFromOffset.toString(),
			},
			reminders: {
				useDefault: false,
				overrides: [
					{
						method: "email",
						minutes: config.VirtualAppointmentReminderForEmail || 10,
					},
					{
						method: "popup",
						minutes: config.VirtualAppointmentReminderForPopup || 5,
					},
				],
			},
			conferenceData: {
				createRequest: {
					requestId: appointmentnumber.toString(),
					conferenceSolutionKey: {
						type: "hangoutsMeet",
					},
				},
			},
			...(emailid ? { attendees: [{ email: emailid }] } : {}),
		};

		const response = await calendar.events.insert({
			calendarId: "primary",
			resource: event,
			conferenceDataVersion: 1,
		});

		let meetLink = response.data.hangoutLink;
		if (meetLink) {
			meetLink = meetLink + "|" + response.data.id;
		}
		const meetID = response.data.id;
		console.log("Google Meet link:", meetLink);

		return meetLink;
	} catch (error) {
		console.error("Error creating calendar event:", error);
	}
}

exports.cancelCalenderEvent = async function (eventId) {
	try {
		const token = JSON.parse(fs.readFileSync("token.json"));
		const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));
		const { client_secret, client_id, redirect_uris } =
			CREDENTIALS.installed || CREDENTIALS.web;

		const oAuth2Client = new google.auth.OAuth2(
			client_id,
			client_secret,
			redirect_uris || "http://localhost:3001"
		);

		oAuth2Client.setCredentials(token);

		const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

		const event = await calendar.events.get({
			calendarId: "primary",
			eventId: eventId,
		});

		const updatedEvent = await calendar.events.patch({
			calendarId: "primary",
			eventId: eventId,
			resource: {
				conferenceData: null,
			},
			conferenceDataVersion: 1,
		});

		console.log("updatedEvent::::::>", updatedEvent);
		// utils.log("info", "Cancel Virtual Apppointment Meeting");

		await calendar.events.delete({
			calendarId: "primary",
			eventId: eventId,
			sendUpdates: "all",
		});

		console.log("Event successfully canceled.");
	} catch (err) {
		console.error("Error during event cancellation process: ", err);
	}
};
