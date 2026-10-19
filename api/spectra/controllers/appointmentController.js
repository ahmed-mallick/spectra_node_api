const cryptorEngine = require("../../../classes/CryptorEngine");
const config = require("../../../public/config/config");
const sqlQueries = require("../../../sql/sqlQueries");
const sql = require("mssql");
const { readFileContent } = require("../../../utils/fileUtils");
const { getTranslation } = require("../../../utils/helper");
const {	
	cancelCalenderEvent,
} = require("../../../utils/meetApi");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");


const {
	badRequest,
	dataFetched,
	internalServerError,
	notFound,
	dataSent,
	dataFailure,
	conflict,
	Failure,
	forbidden,
	validationError,
} = require("../../../utils/responsesHandler");
const utils = require("../../../utils/utils");
const { default: axios, request } = require("axios");
const cacheManager = require("../../../utils/cacheManager");
const AlertsHandler = require("../../../utils/alertsHandler");

const DB_EQ_REPORT = config.DB.eqReport.database;
const DB_EQ_PORTAL = config.DB.eqPortal.database;

exports.getApptCategories = async (req, res) => {
	const {
		lang = "en",
		branchid,
		groupwisedata,
		transactionid,
		categoryid,
		branchcode,
		matterlistenable = false,
		mode = "",
		applicationid = null,
		devicetype,
	} = req.query;

	if (!lang) {
		utils.log(
			"error",
			`getApptCategories - Invalid parameters: Missing 'lang'`,
		);
		return badRequest(
			res,
			"",
			getTranslation(
				lang?.toLowerCase(),
				"GetApptCategoriesInvalidParameters",
			) || "Invalid parameters",
		);
	}

	const id = transactionid || utils.generateUUID();
	try {
		const client_id = req?.clientid;
		if (!client_id) {
			return badRequest(
				res,
				"",
				getTranslation(
					lang?.toLowerCase(),
					"GetApptCategoriesInvalidParameters",
				) || "Invalid parameters",
			);
		}

		let branch_id = branchid;
	

		const cacheKey = `appointmentCategories:${lang}:${branch_id}:${client_id}:${
			categoryid || "none"
		}`;

		let data = null;
		let groupData = [];

		data = cacheManager.get("appointmentCategories", cacheKey) || {};
		groupData = cacheManager.get("appointmentCategories", cacheKey) || {};
		if (Object.keys(data).length > 0) {
		} else {
			data = await sqlQueries.getApptCategories(
				lang,
				branch_id,
				client_id,
				applicationid,
			);

			let mattersList =
				matterlistenable === "true"
					? await matterCodeList(client_id, branch_id, lang)
					: [];

			const matterMap =
				matterlistenable === "true"
					? mattersList.reduce((acc, matter) => {
							if (!acc[matter.SQN]) {
								acc[matter.SQN] = [];
							}
							acc[matter.SQN].push({
								MatterCodeID: matter.MatterCodeID,
								MatterCode: matter.MatterCode,
								MaxServiceTime: matter.MaxServiceTime,
							});
							return acc;
						}, {})
					: {};

			if (groupwisedata === "true") {
				if (data) {
					const groupMap = new Map();
					data.forEach(
						({
							GroupID,
							GroupName,
							CategoryID,
							CategoryTitle,
							branchid,
							slotid,
							slotdate,
							slotStartTime,
							slotEndTime,
							CategoryTranslations,
							GroupTranslations,
						}) => {
							if (!groupMap.has(GroupName)) {
								groupMap.set(GroupName, {
									groupName: GroupName,
									categories: [],
								});
							}
							groupMap.get(GroupName).categories.push({
								groupID: GroupID,
								categoryID: CategoryID,
								categoryTitle: CategoryTitle,
								branchId: branchid,
								slotDetail: {
									slotID: slotid,
									slotDate: slotdate
										? moment(slotdate, ["YYYY/MM/DD", "YYYY-MM-DD"]).format(
												"MM/DD/YYYY",
											)
										: null,
									startTime: slotStartTime,
									endTime: slotEndTime,
								},
								...(CategoryTranslations && {
									categoryTranslations:
										utils.parseTranslations(CategoryTranslations),
								}),
								...(GroupTranslations && {
									groupTranslations: utils.parseTranslations(GroupTranslations),
								}),
							});
						},
					);
					groupData = Array.from(groupMap.values());

					if (matterlistenable === "true") {
						groupData.forEach((group) => {
							group.categories.forEach((category) => {
								category.matterList = matterMap[category.categoryID] || [];
							});
						});
					}

					if (categoryid && branch_id) {
						groupData = groupData
							.map((group) => ({
								...group,
								categories: group.categories.filter((category) => {
									const matchesCategoryID = categoryid
										? category.categoryID === categoryid
										: true;
									const matchesBranchID = branch_id
										? category.branchId?.toString() === branch_id?.toString()
										: true;
									return matchesCategoryID && matchesBranchID;
								}),
							}))
							.filter((group) => group.categories.length > 0);
					}
				}
			} else {
				if (data) {
					groupData = data.map(
						({
							CategoryID,
							CategoryTitle,
							branchid,
							GroupID,
							GroupName,
							slotid,
							slotdate,
							slotStartTime,
							slotEndTime,
							CategoryTranslations,
							GroupTranslations,
						}) => {
							const category = {
								categoryID: CategoryID,
								categoryTitle: CategoryTitle,
								branchId: branchid,
								groupID: GroupID,
								groupName: GroupName,
								slotDetail: {
									slotID: slotid,
									slotDate: slotdate
										? moment(slotdate, ["YYYY/MM/DD", "YYYY-MM-DD"]).format(
												"MM/DD/YYYY",
											)
										: null,
									startTime: slotStartTime,
									endTime: slotEndTime,
								},
								...(CategoryTranslations && {
									categoryTranslations:
										utils.parseTranslations(CategoryTranslations),
								}),
								...(GroupTranslations && {
									groupTranslations: utils.parseTranslations(GroupTranslations),
								}),
							};
							if (matterlistenable === "true") {
								category.matterList = matterMap[CategoryID] || [];
							}

							return category;
						},
					);
					if (categoryid && branch_id) {
						groupData = groupData.filter((category) => {
							const matchesCategoryID = categoryid
								? category.categoryID === categoryid
								: true;
							const matchesBranchID = branch_id
								? category.branchId?.toString() === branch_id?.toString()
								: true;
							return matchesCategoryID && matchesBranchID;
						});
					}
					const seen = new Set();
					if (branch_id) {
						groupData = groupData.filter(
							(item) =>
								item.branchId == branch_id &&
								!seen.has(item.categoryID) &&
								seen.add(item.categoryID),
						);
					} else {
						groupData = groupData.filter(
							(item) =>
								!seen.has(item.categoryID && item.categoryTitle) &&
								seen.add(item.categoryID && item.categoryTitle),
						);
					}
				}
			}
		}
		if (groupData) {
			cacheManager.set("appointmentCategories", cacheKey, groupData);
		}

		if (groupData.length) {
			return dataFetched(
				res,
				id,
				getTranslation(lang?.toLowerCase(), "GetApptCategoriesDataFetched") ||
					"Data successfully fetched",
				groupData,
			);
		} else {
			return notFound(
				res,
				id,
				getTranslation(lang?.toLowerCase(), "GetApptCategoriesNotFound") ||
					"No data found.",
			);
		}
	} catch (error) {
		utils.log(
			"error",
			`getApptCategories - Error: ${error.message}, Transaction ID: ${id}`,
		);
		return internalServerError(
			res,
			id,
			getTranslation(
				lang?.toLowerCase(),
				"GetApptCategoriesInternalServerError",
			) || "An error occurred while fetching data",
		);
	}
};

async function generateSlotsList(
	dataTable,
	branchDateTime,
	startDate,
	daysAhead,
	endDateLimit,
) {
	const slotList = [];

	for (let i = 0; i < daysAhead; i++) {
		let newDate = new Date(startDate);
		newDate.setDate(newDate.getDate() + i);

		if (newDate <= endDateLimit) {
			const slotDetails = await getSlotsOfDay(
				dataTable,
				branchDateTime,
				newDate,
			);
			slotList.push({
				slotDetail: slotDetails,
				date: utils.formatDateTime(newDate, config.APPOINTMENT_DATES_FORMAT),
				dayID: newDate.getDay(),
			});
		}
	}

	return slotList;
}

// Main method
exports.getAllDaysSlotsOfBranch = async (req, res) => {
	const {
		branchid,
		categoryid,
		appointmentdate,
		appointmentaheaddays,
		transactionid,
		categorywise,
		lang = "en",
	} = req.query;

	const id = transactionid || utils.generateUUID();

	utils.log(
		"info",
		`getAllDaysSlotsOfBranch - Request Parameters: ${JSON.stringify(req.query)}`,
	);

	if (!branchid || !categoryid) {
		utils.log(
			"error",
			`getAllDaysSlotsOfBranch - Invalid parameters: Missing 'branchid' or 'categoryid', Transaction ID: ${id}`,
		);
		return badRequest(
			res,
			"",
			getTranslation(
				lang?.toLowerCase(),
				"GetAllDaysSlotsOfBranchInvalidParameters",
			) || "Invalid parameters",
		);
	}

	try {
		let appointmentDate = appointmentdate
			? utils.formatDateTime(new Date(appointmentdate), "yyyy-MM-dd")
			: null;
		let daysAhead = appointmentaheaddays ? appointmentaheaddays : 7; // Default to 7 days

		const futureDays = await sqlQueries.getBranchDaysAhead(branchid);
		if (futureDays) daysAhead = parseInt(futureDays);

		if (appointmentDate && appointmentaheaddays) {
			daysAhead = Math.min(parseInt(appointmentaheaddays), daysAhead);
		} else if (!appointmentDate && appointmentaheaddays) {
			const currentDate = new Date();
			daysAhead = Math.min(parseInt(appointmentaheaddays), daysAhead);
			appointmentDate = utils.formatDateTime(currentDate, "yyyy-MM-dd");
		} else if (appointmentDate && !appointmentaheaddays) {
			const d1 = new Date(appointmentDate);
			const d2 = new Date(appointmentDate);
			d2.setDate(d2.getDate() + daysAhead);

			if (d1 > d2) {
				utils.log(
					"info",
					`getAllDaysSlotsOfBranch - No future slots available, Transaction ID: ${id}`,
				);
				return dataFetched(
					res,
					id,
					getTranslation(
						lang?.toLowerCase(),
						"GetAllDaysSlotsOfBranchNoFutureSlots",
					) || "No available slots in the future",
					[],
				);
			}
			daysAhead = Math.min(
				Math.abs(Math.floor((d1 - d2) / (1000 * 60 * 60 * 24))),
				7,
			);
		} else {
			// No appointmentDate or appointmentAheadDays provided, use current date
			appointmentDate = utils.formatDateTime(new Date(), "yyyy-MM-dd");
		}

		let daysSlotsList = [];
		const appointmentIssueTillDate = new Date(appointmentDate);
		appointmentIssueTillDate.setDate(
			appointmentIssueTillDate.getDate() + daysAhead,
		);

		const branchDateTime = await sqlQueries.getBranchDateTime(branchid);

		// If categorywise is true
		if (categorywise === "true") {
			const categoryIds = categoryid.split("|");
			const categorySlotMap = {};

			for (let catId of categoryIds) {
				const result = await sqlQueries.getAllDaysSlotsOfBranch(
					branchid,
					catId,
					appointmentDate,
					null,
					lang,
					daysAhead,
				);

				const dataTable = result.recordset;
				if (!dataTable || dataTable.length === 0) continue;

				let subCatSlots = await generateSlotsList(
					dataTable,
					branchDateTime,
					appointmentDate,
					daysAhead,
					appointmentIssueTillDate,
				);

				// Fetch and apply disabled dates
				let maxmindays = await sqlQueries.getDisabledDates(
					branchid,
					catId,
					null,
					lang,
				);
				if (maxmindays) {
					// Apply lastdate filter
					if (maxmindays[2][0]?.lastdate) {
						const maxDate = new Date(maxmindays[2][0]?.lastdate);
						subCatSlots = subCatSlots.filter(
							(item) => new Date(item.date) <= maxDate,
						);
					}

					// Apply contingency offDates
					if (maxmindays[3]?.length > 0) {
						let offDates = [];
						maxmindays[3].forEach(({ startdate, enddate }) => {
							let currentDate = new Date(startdate);
							let lastDate = new Date(enddate);
							while (currentDate <= lastDate) {
								offDates.push(
									utils.formatDateTime(
										currentDate,
										config?.APPOINTMENT_DATES_FORMAT,
									),
								);
								currentDate.setDate(currentDate.getDate() + 1);
							}
						});

						subCatSlots = subCatSlots.filter((item) => {
							const formattedItemDate = utils.formatDateTime(
								new Date(item.date),
								config?.APPOINTMENT_DATES_FORMAT,
							);
							return !offDates.includes(formattedItemDate);
						});
					}
				}

				categorySlotMap[catId] = subCatSlots;
			}

			return dataFetched(
				res,
				id,
				getTranslation(
					lang.toLowerCase(),
					"GetAllDaysSlotsOfBranchDataFetched",
				) || "Data successfully fetched",
				categorySlotMap,
			);
		}

		// Regular (non-categorywise) flow
		const result = await sqlQueries.getAllDaysSlotsOfBranch(
			branchid,
			categoryid,
			appointmentDate,
			null,
			lang,
			daysAhead,
		);

		const dataTable = result.recordset;
		if (!dataTable || dataTable.length === 0) {
			utils.log(
				"info",
				`getAllDaysSlotsOfBranch - No data found, Transaction ID: ${transactionid}`,
			);
			return notFound(
				res,
				id,
				getTranslation(
					lang?.toLowerCase(),
					"GetAllDaysSlotsOfBranchNotFound",
				) || "No data found.",
			);
		}

		daysSlotsList = await generateSlotsList(
			dataTable,
			branchDateTime,
			appointmentDate,
			daysAhead,
			appointmentIssueTillDate,
		);

		let maxmindays = await sqlQueries.getDisabledDates(
			branchid,
			categoryid,
			null,
			lang,
		);

		if (maxmindays) {
			if (maxmindays[2][0]?.lastdate) {
				const maxDate = new Date(maxmindays[2][0]?.lastdate);
				if (maxDate) {
					const filteredData = daysSlotsList.filter((item) => {
						const itemDate = new Date(item.date);
						return itemDate <= maxDate;
					});

					if (filteredData) {
						daysSlotsList = filteredData;
					}
				}
			}

			try {
				if (maxmindays[3]?.length > 0) {
					let offDates = [];
					maxmindays[3]?.forEach(({ startdate, enddate }) => {
						if (startdate && enddate) {
							let currentDate = new Date(startdate);
							let lastDate = new Date(enddate);

							while (currentDate <= lastDate) {
								// Ensure formatting is consistent
								const formattedDate = utils.formatDateTime(
									currentDate,
									config?.APPOINTMENT_DATES_FORMAT,
								);
								offDates.push(formattedDate);
								currentDate.setDate(currentDate.getDate() + 1);
							}

							// filter the daysSlotList not include the offdates in daysSlotsList
							const filteredData = daysSlotsList.filter((item) => {
								const formattedItemDate = utils.formatDateTime(
									new Date(item.date),
									config?.APPOINTMENT_DATES_FORMAT,
								);

								return !offDates.includes(formattedItemDate);
							});

							if (filteredData) {
								daysSlotsList = filteredData;
							}
						}
					});
				}
			} catch (err) {
				utils.log("error", "error in Added OffDates for Branch Contingency");
			}
		}

		utils.log(
			"info",
			`getAllDaysSlotsOfBranch - Response sent, Transaction ID: ${transactionid}, Slots Found: ${daysSlotsList.length}`,
		);
		return dataFetched(
			res,
			id,
			getTranslation(
				lang?.toLowerCase(),
				"GetAllDaysSlotsOfBranchDataFetched",
			) || "Data successfully fetched",
			daysSlotsList,
		);
	} catch (err) {
		utils.log(
			"error",
			`getAllDaysSlotsOfBranch - Error: ${err.message}, Transaction ID: ${id}`,
		);
		return internalServerError(
			res,
			id,
			getTranslation(
				lang?.toLowerCase(),
				"GetAllDaysSlotsOfBranchInternalServerError",
			) || "An error occurred while fetching data",
		);
	}
};

exports.getDisabledDates = async (req, res) => {
	const {
		branchid,
		categoryid,
		daysinfo,
		transactionid,
		startdate,
		lang = "en",
	} = req.query;
	utils.log(
		"info",
		`getDisabledDates - Request Parameters: ${JSON.stringify(req.query)}`,
	);

	if (!branchid || !categoryid) {
		utils.log(
			"error",
			`getDisabledDates - Invalid parameters: Missing 'branchid' or 'categoryid'`,
		);
		return badRequest(
			res,
			"",
			getTranslation(
				lang?.toLowerCase(),
				"GetDisabledDatesInvalidParameters",
			) || "Invalid parameters",
		);
	}

	const id = transactionid || utils.generateUUID();
	try {
		// let cacheKey = `${branchid}${categoryid}getDisabledDates`;
		// (cacheManager.get('getDisabledDates', cacheKey)) ||
		let dataTables = await sqlQueries.getDisabledDates(
			branchid,
			categoryid,
			startdate,
			lang,
		);

		const today = new Date();
		const todayDate = utils.formatDateTime(startdate || today, "yyyy-MM-dd");
		let offDaysROb = { MinDate: "", offDates: [], MaxDate: "", offDays: [] };

		if (dataTables[0] || dataTables[1]) {
			// cacheManager.set('getDisabledDates', cacheKey, dataTables);
			if (dataTables[0].length > 0) {
				let check = 0;

				for (let i = 0; i < dataTables[0].length; i++) {
					const formatedDate = dataTables[0][i].date_appointment;
					const formatedNextDate = dataTables[0][i + 1]?.date_appointment;

					if (i === 0 && formatedDate !== todayDate) {
						offDaysROb.MinDate = todayDate;
						check = 1;
						offDaysROb.offDates.push(formatedDate);
					} else if (
						formatedNextDate &&
						new Date(formatedNextDate) - new Date(formatedDate) > 86400000 &&
						check === 0
					) {
						offDaysROb.MinDate = utils.formatDateTime(
							new Date(formatedDate).setDate(
								new Date(formatedDate).getDate() + 1,
							),
							"yyyy-MM-dd",
						);
						check = 1;
					} else if (check === 1) {
						offDaysROb.offDates.push(formatedDate);
					}
				}

				if (check === 0) {
					offDaysROb.MinDate = utils.formatDateTime(
						new Date(
							dataTables[0][dataTables[0].length - 1].date_appointment,
						).setDate(
							new Date(
								dataTables[0][dataTables[0].length - 1].date_appointment,
							).getDate() + 1,
						),
						"yyyy-MM-dd",
					);
				}
			}

			if (dataTables[3]?.length > 0) {
				dataTables[3]?.forEach(({ startdate, enddate }) => {
					if (startdate && enddate) {
						let currentDate = new Date(startdate);
						let lastDate = new Date(enddate);

						while (currentDate <= lastDate) {
							offDaysROb?.offDates.push(
								new Date(
									utils.formatDateTime(
										currentDate,
										config?.APPOINTMENT_DATES_FORMAT,
									),
								),
							);
							currentDate.setDate(currentDate.getDate() + 1);
						}
					}
				});
			}

			if (!offDaysROb.MinDate) {
				offDaysROb.MinDate = todayDate;
			}

			if (dataTables[1].length > 0) {
				// if (daysinfo === "1") {
				// 	offDaysROb.offDays = dataTables[1];
				// } else {
				if (daysinfo === "1") {
					offDaysROb.offDays = dataTables[1];
				}
				const lastDate = utils.formatDateTime(
					new Date(dataTables[2][0].lastdate),
					"yyyy-MM-dd",
				);
				const offDates = await getWeekendDates(
					offDaysROb.MinDate,
					lastDate,
					dataTables[1],
				);

				if (offDates) {
					offDaysROb.offDates.push(
						...offDates.filter(
							(newDate) =>
								!offDaysROb.offDates.some(
									(date) => date.getTime() === newDate.getTime(),
								),
						),
					);
				}
				// }
			}

			while (offDaysROb.offDates.includes(offDaysROb.MinDate)) {
				offDaysROb.MinDate = utils.formatDateTime(
					new Date(offDaysROb.MinDate).setDate(
						new Date(offDaysROb.MinDate).getDate() + 1,
					),
					"yyyy-MM-dd",
				);
			}

			offDaysROb.MaxDate = utils.formatDateTime(
				new Date(dataTables[2][0].lastdate),
				"yyyy-MM-dd",
			);
			offDaysROb.offDates = offDaysROb.offDates
				.map((dateStr) => new Date(dateStr))
				.sort((a, b) => a - b)
				.map((date) =>
					utils.formatDateTime(date, config.APPOINTMENT_DATES_FORMAT),
				);

			offDaysROb.MinDate = utils.formatDateTime(
				offDaysROb.MinDate,
				config.APPOINTMENT_DATES_FORMAT,
			);
			offDaysROb.MaxDate = utils.formatDateTime(
				offDaysROb.MaxDate,
				config.APPOINTMENT_DATES_FORMAT,
			);

			utils.log(
				"info",
				`getDisabledDates - Response sent, Transaction ID: ${transactionid}, OffDays: ${JSON.stringify(
					offDaysROb,
				)}`,
			);
			return dataFetched(
				res,
				id,
				getTranslation(lang?.toLowerCase(), "GetDisabledDatesDataFetched") ||
					"Data successfully fetched",
				offDaysROb,
			);
		} else {
			utils.log(
				"info",
				`getDisabledDates - No data found, Transaction ID: ${transactionid}`,
			);
			return notFound(
				res,
				id,
				getTranslation(lang?.toLowerCase(), "GetDisabledDatesNotFound") ||
					"No data found.",
			);
		}
	} catch (err) {
		utils.log(
			"error",
			`getDisabledDates - Error: ${err.message}, Transaction ID: ${id}`,
		);
		return internalServerError(
			res,
			id,
			getTranslation(
				lang?.toLowerCase(),
				"GetDisabledDatesInternalServerError",
			) || "An error occurred while fetching data",
		);
	}
};

async function getWeekendDates(startDate, endDate, dayIds) {
	let weekends = [];
	let currentDate = new Date(startDate);
	const lastDate = new Date(endDate);

	// Create a Set of day IDs to check against
	const weekendDayIds = new Set(dayIds.map((day) => day.dayid));

	// Loop through each date from startDate to endDate
	while (currentDate <= lastDate) {
		let day = currentDate.getDay(); // Get the day of the week (0 for Sunday, 6 for Saturday)
		// weekends = [];
		if (weekendDayIds.has(day)) {
			// Check if the day ID is in the weekendDayIds set
			weekends.push(new Date(currentDate)); // Add the date to the array in YYYY-MM-DD format
		}

		currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
	}

	return weekends;
}

async function getSlotsOfDay(dataTable, branchDateTime, newDate) {
	let slotDetails = [];

	const branchDate = new Date(branchDateTime);
	const branchTime = branchDate.getTime();
	let dayID = newDate.getDay();

	if (dayID === 0) {
		dayID = 7;
	}
	if (Array.isArray(dataTable) && dataTable.length > 0) {
		slotDetails = dataTable
			.filter((row) => {
				if (parseInt(row["dayid"], 10) !== dayID) {
					return false;
				}

				const slotStartTime = new Date(
					`${newDate.toISOString()?.split("T")[0]}T${row["slotStartTime"]}`,
				);

				if (newDate.toDateString() === branchDate.toDateString()) {
					return slotStartTime.getTime() > branchTime;
				}

				return newDate > branchDate;
			})
			.map((row) => {
				return {
					slotID: row["slotid"],
					slotCaption: row["slotcaption"],
					startTime: row["slotStartTime"],
					endTime: row["slotEndTime"],
				};
			});
	}

	// Deduplicate by start + end time
	const seen = new Set();
	slotDetails = slotDetails.filter((s) => {
		const key = `${s.startTime}-${s.endTime}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});

	return slotDetails;
}

async function getDesireSlotsOfDay(dataTable, branchDateTime, newDate) {
	let slotDetails = [];

	const branchDate = new Date(branchDateTime);
	const branchTime = branchDate.getTime();
	let dayID = newDate.getDay();

	if (dayID === 0) dayID = 7;

	if (Array.isArray(dataTable) && dataTable.length > 0) {
		slotDetails = dataTable
			.filter((row) => {
				if (parseInt(row["dayid"], 10) !== dayID) {
					return false;
				}

				const slotStartTime = new Date(
					`${newDate.toISOString()?.split("T")[0]}T${row["slotStartTime"]}`,
				);

				if (newDate.toDateString() === branchDate.toDateString()) {
					return slotStartTime.getTime();
				}

				return newDate > branchDate;
			})
			.map((row) => {
				return {
					slotID: row["slotid"],
					slotCaption: row["slotcaption"],
					startTime: row["slotStartTime"],
					endTime: row["slotEndTime"],
				};
			});
	}

	return slotDetails;
}

exports.getSlotDetail = async (req, res) => {
	const { slotid, transactionid, lang = "en" } = req.query;
	utils.log(
		"info",
		`getSlotDetail - Request Parameters: ${JSON.stringify(req.query)}`,
	);

	if (!slotid) {
		utils.log("error", `getSlotDetail - Invalid parameters: Missing 'slotid'`);
		return badRequest(
			res,
			"",
			getTranslation(lang?.toLowerCase(), "GetSlotDetailInvalidParameters") ||
				"Invalid parameters",
		);
	}

	const id = transactionid || utils.generateUUID();

	try {
		// const cacheKey = `${slotid}Slots`;
		// let slotDetail = cacheManager.get('Slots', cacheKey) || {};

		// if (!slotDetail) {
		const data = await sqlQueries.getSlotDetail(slotid);
		const slotDetail = data.map((row) => ({
			dayID: parseInt(row.dayid, 10),
			date: utils.formatDateTime(row.ApptDate, config.APPOINTMENT_DATES_FORMAT),
			slotDetail: [
				{
					slotID: row.slotid.toString(),
					slotCaption: row.slot_caption.toString(),
					startTime: utils.formatDateTime(row.start_time, "HH:mm"),
					endTime: utils.formatDateTime(row.end_time, "HH:mm"),
				},
			],
		}));
		// 	cacheManager.set('Slots', cacheKey, slotDetail);
		// }

		if (slotDetail && slotDetail.length) {
			utils.log(
				"info",
				`getSlotDetail - Response sent, Transaction ID: ${transactionid}, Slot Detail: ${JSON.stringify(
					slotDetail,
				)}`,
			);
			return dataFetched(
				res,
				id,
				getTranslation(lang?.toLowerCase(), "GetSlotDetailDataFetched") ||
					"Data successfully fetched",
				slotDetail,
			);
		} else {
			utils.log(
				"info",
				`getSlotDetail - No data found, Transaction ID: ${transactionid}`,
			);
			return notFound(
				res,
				id,
				getTranslation(lang?.toLowerCase(), "GetSlotDetailNotFound") ||
					"No data found.",
			);
		}
	} catch (err) {
		utils.log(
			"error",
			`getSlotDetail - Error: ${err.message}, Transaction ID: ${id}`,
		);
		return internalServerError(
			res,
			id,
			getTranslation(lang?.toLowerCase(), "GetSlotDetailInternalServerError") ||
				"An error occurred while fetching data",
		);
	}
};

exports.getNearestBranches = async (req, res) => {
	const {
		lat,
		long,
		categoryid,
		transactionid,
		lang = "en",
		branchid,
		branchcode,
		isexcludedcategory = false,
		prioritylevel = 0,
		appointmentdate,
		appointmentaheaddays,
		suboption,
	} = req.query;
	utils.log(
		"info",
		`getNearestBranches - Request Parameters: ${JSON.stringify(req.query)}`,
	);

	if (!lat || !long || !categoryid) {
		utils.log(
			"error",
			`getNearestBranches - Invalid parameters: Missing 'lat', 'long', or 'categoryid'`,
		);
		return badRequest(
			res,
			"",
			getTranslation(
				lang?.toLowerCase(),
				"GetNearestBranchesInvalidParameters",
			) || "Invalid parameters",
		);
	}

	const id = transactionid || utils.generateUUID();
	let branch_id = branchid;	

	try {
		let getNearestBranches = null;
		// const cacheKey = `getNearestBranchList:${lat}${long}${categoryid}${lang}${lang}${branchid}${branchcode || "none"}${isexcludedcategory}${prioritylevel}${appointmentdate}${appointmentaheaddays}`;
		// const cacheData1 = cacheManager.get('getNearestBranchList', cacheKey)
		// cacheData1 ||

		getNearestBranches =
			(await sqlQueries.getNearestBranchesByCategory(
				req.query.devicetype || 3,
				categoryid,
				"en",
				req.query.regionid || -1,
				lat,
				long,
				req.query.radius || config.MAX_RADIUS,
				req.query.maxrow || config.MAX_ROWS,
				req?.clientid,
				prioritylevel,
				suboption || null,
			)) || {};

		const branchIds = getNearestBranches
			.map((branch) => branch.branchID)
			.join("|");
		// const currentStatusCacheKey = `branchandCategoryCurrentStatus:${branchIds}${categoryid || '-1'}0`;
		// const cacheData2 = cacheManager.get('branchandCategoryCurrentStatus', currentStatusCacheKey);
		// cacheData2 ||

		const dynamicValuesForBranch =
			(await sqlQueries.getBranchandCategoryCurrentStatus(
				branchIds,
				categoryid || "-1",
				null,
			)) || {};

		if (getNearestBranches && getNearestBranches.length) {
			if (branch_id) {
				getNearestBranches = getNearestBranches.filter(
					(branch) => branch?.branchID?.toString() === branch_id?.toString(),
				);
			}

			if (Object?.keys(dynamicValuesForBranch || {}).length > 0) {
				// cacheManager.set('branchandCategoryCurrentStatus', currentStatusCacheKey,dynamicValuesForBranch);
				getNearestBranches = getNearestBranches.map((branch) => {
					const dynamicData = dynamicValuesForBranch.find(
						(item) => item.branchID == branch.branchID,
					);
					if (dynamicData) {
						return {
							...branch,
							status: dynamicData.status,
							holiday: dynamicData.holiday,
							categoryActive:
								dynamicData?.categoryActive !== null &&
								dynamicData?.categoryActive !== undefined
									? dynamicData?.categoryActive
									: 1,
							currentTime: dynamicData.currentTime,
						};
					}
					return branch;
				});
			}

			// cacheManager.set('getNearestBranchList', cacheKey, getNearestBranches);

			let data = getNearestBranches.map((item) => ({
				clientid: item.clientId,
				branchID: item.branchID,
				branchTitle: item.branchTitle,
				branchCode: item.branchCode,
				encbranchCode: cryptorEngine.EncryptForURL(
					item.branchCode,
					true,
					process.env.APPOINTMENT_SECRET_KEY,
				),
				address: item.address,
				branchStartTime: item.branchStartTime,
				branchEndTime: item.branchEndTime,
				contactNo: item.contactNo,
				resultant: item.resultant,
				futureDaysForAppointment: item.futureDaysForAppointment,
				latitude: item.latitude,
				longitude: item.longitude,
				distanceInKM: item.distanceInKM,
				langCode: lang,
				regionid: req.query.regionid || -1,
				categoryid: categoryid,
				...(item?.branchTranslations && {
					branchTranslations: utils.parseTranslations(item.branchTranslations),
				}),
				...(item?.branchAddressTranslations && {
					branchAddressTranslations: utils.parseTranslations(
						item.branchAddressTranslations,
					),
				}),
				slotDetail: {
					slotID: item.slotid,
					slotDate: item.slotdate,
					startTime: item.slotStartTime,
					endTime: item.slotEndTime,
				},
				status: item.status,
				holiday: item.holiday,
				categoryActive:
					item?.categoryActive !== null && item?.categoryActive !== undefined
						? item?.categoryActive
						: 1,
				currentTime: item.currentTime,
				branchSlots: [],
			}));

			if (appointmentdate && appointmentaheaddays) {
				// Only when getAllDays=true, attach slot data
				data = await Promise.all(
					data.map(async (item) => {
						try {
							const branchSlots = await getSlotsData(
								item.branchID,
								categoryid,
								appointmentdate,
								appointmentaheaddays,
								lang,
							);
							return { ...item, branchSlots: branchSlots };
						} catch (err) {
							utils.log(
								"error",
								`Slot fetch failed for branch ${item.branchID}`,
							);
							return item; // Return the item even if slot fetch fails
						}
					}),
				);
			}

			if (categoryid) {
				//This is query is responsible to fetch position and est wait time in sb mode for multiple branches

				//isexcludedcategory to fetch only target category position queue and est wait time
				let targetCategorySQN = isexcludedcategory === "1" ? categoryid : null;
				let categoryTicketInfo =
					await sqlQueries.getBranchWiseCategoryTicketInfo(targetCategorySQN);

				if (Object.keys(categoryTicketInfo).length > 0) {
					data = data.map((item) => {
						const matchingCategory = categoryTicketInfo.find(
							(info) => info.branchId == item.branchID,
						);
						return {
							...item,
							categoryInfo: matchingCategory
								? {
										categoryname: matchingCategory.categoryname,
										estwaittime: matchingCategory.estwaittime,
										positionInQueue: matchingCategory.positionInQueue,
									}
								: null,
						};
					});
				}
			}
			utils.log("info", `getNearestBranches - Response sent`);
			return dataFetched(
				res,
				id,
				getTranslation(lang?.toLowerCase(), "GetNearestBranchesDataFetched") ||
					"Data successfully fetched",
				data,
			);
		} else {
			return notFound(
				res,
				id,
				getTranslation(lang?.toLowerCase(), "GetNearestBranchesNotFound") ||
					"Branch not found",
			);
		}
	} catch (err) {
		utils.log(
			"error",
			`getNearestBranches - Error: ${err.message}, Transaction ID: ${id}`,
		);
		return internalServerError(
			res,
			id,
			getTranslation(
				lang?.toLowerCase(),
				"GetNearestBranchesInternalServerError",
			) || "An error occurred while fetching data",
		);
	}
};

// Wrapper function to getAppointmentAvailability
const getSlotsData = (branchid, sqn, startdate, daysahead, lang = "en") => {
	return new Promise((resolve, reject) => {
		const req = {
			body: {
				branchid,
				sqn,
				startdate,
				daysahead,
				lang,
			},
		};

		const res = {
			status() {
				return this;
			},
			json(result) {
				if (result.responseCode !== 200) reject(result);
				else resolve(result.data);
			},
		};

		getAppointmentAvailability(req, res);
	});
};

exports.getBranchList = async (req, res) => {
	const {
		devicetype,
		lang = "en",
		regionid,
		transactionid,
		branchid,
		branchcode,
		lat = 0,
		long = 0,
		method = false,
		filterbylanguage,
		categoryid,
		suboption,
		city = null,
	} = req.query;
	utils.log(
		"info",
		`getBranchList - Request Parameters: ${JSON.stringify(req.query)}`,
	);

	const device_type = devicetype || 3;
	const category_id = categoryid || "-1"; // Default category ID
	// Language has tempararily changed to EN front end need to implement fetch translated branchname
	const language = "en";
	const region_id = regionid || -1;
	const center_latitude = lat; // Default values
	const center_longitude = long;
	const max_radius = 2147483647; // Default values
	const max_rows = 2147483647; //Default values
	const client_id = req?.clientid;
	const id = transactionid || utils.generateUUID();
	// Convert the query param safely to bit (0 or 1)
	const filterByLanguageBit =
		filterbylanguage === "true" || filterbylanguage === "1" ? 1 : 0;

	let branch_id = branchid;


	try {
		let getNearestBranches = null;
		// const cacheKey = `branchList:${device_type}${category_id}${language}${client_id}${region_id}${center_latitude}${center_longitude}${max_radius}${max_rows}${branchcode || "none"}${branch_id || "none"}`;
		// const cacheData1 = cacheManager.get('getBranchList', cacheKey) || {};
		// Language has tempararily changed to EN front end need to implement fetch translated branchname
		// Object.keys(cacheData1).length > 0 ?  cacheData1 :

		getNearestBranches =
			(await sqlQueries.getNearestBranchesByCategory(
				device_type,
				category_id,
				lang,
				region_id,
				center_latitude,
				center_longitude,
				max_radius,
				max_rows,
				client_id,
				null,
				suboption || null,
				filterByLanguageBit,
				city,
			)) || {};
		const branchIds = getNearestBranches
			.map((branch) => branch.branchID)
			.join("|");
		const currentStatusCacheKey = `branchandCategoryCurrentStatus:${branchIds}${category_id}0`;

		// const cacheData2 = cacheManager.get('branchandCategoryCurrentStatus', currentStatusCacheKey);
		// Object.keys(cacheData1).length > 0 ?  cacheData1 :

		const dynamicValuesForBranch =
			(await sqlQueries.getBranchandCategoryCurrentStatus(
				branchIds,
				category_id,
				null,
			)) || {};

		if (Object?.keys(dynamicValuesForBranch || {}).length > 0) {
			// if(!cacheData2){
			// 	cacheManager.set('branchandCategoryCurrentStatus', currentStatusCacheKey,dynamicValuesForBranch);
			// }
			getNearestBranches = getNearestBranches.map((branch) => {
				const dynamicData = dynamicValuesForBranch.find(
					(item) => item.branchID == branch.branchID,
				);
				if (dynamicData) {
					return {
						...branch,
						status: dynamicData.status,
						holiday: dynamicData.holiday,
						categoryActive:
							dynamicData?.categoryActive !== null &&
							dynamicData?.categoryActive !== undefined
								? dynamicData?.categoryActive
								: 1,
						currentTime: dynamicData.currentTime,
					};
				}
				return branch;
			});
		}

		if (getNearestBranches && getNearestBranches.length) {
			if (branch_id) {
				getNearestBranches = getNearestBranches.filter(
					(branch) => branch?.branchID?.toString() == branch_id?.toString(),
				);
			}

			const weekDays = [
				{ weekName: "Monday", dayID: 1 },
				{ weekName: "Tuesday", dayID: 2 },
				{ weekName: "Wednesday", dayID: 3 },
				{ weekName: "Thursday", dayID: 4 },
				{ weekName: "Friday", dayID: 5 },
				{ weekName: "Saturday", dayID: 6 },
				{ weekName: "Sunday", dayID: 7 },
			];

			const data = getNearestBranches.map((item) => {
				const offDayIds = item?.OffDaysid
					? item.OffDaysid.split(",").map((d) => Number(d.trim()))
					: [];

				const weekStatus = weekDays.map(({ weekName, dayID }) => ({
					weekName,
					isWorkingDay: offDayIds.includes(dayID) ? 0 : 1, // 0 = off, 1 = working
				}));

				return {
					clientid: item.clientId,
					branchID: item.branchID,
					branchTitle: item.branchTitle,
					branchCode: item.branchCode,
					encbranchCode: cryptorEngine.EncryptForURL(
						item.branchCode,
						true,
						process.env.APPOINTMENT_SECRET_KEY,
					),
					address: item.address,
					branchStartTime: item.branchStartTime,
					branchEndTime: item.branchEndTime,
					contactNo: item.contactNo,
					fax: item.Fax, // <-- new
					city: item.City, // <-- new
					resultant: item.resultant,
					futureDaysForAppointment: item.futureDaysForAppointment,
					latitude: item.latitude,
					longitude: item.longitude,
					distanceInKM: item.distanceInKM,
					langCode: lang,
					regionid: req.query.regionid || -1,
					categoryid: category_id,
					...(item?.branchTranslations && {
						branchTranslations: utils.parseTranslations(
							item.branchTranslations,
						),
					}),
					...(item?.branchAddressTranslations && {
						branchAddressTranslations: utils.parseTranslations(
							item.branchAddressTranslations,
						),
					}),
					slotDetail: {
						slotID: item.slotid,
						slotDate: item.slotdate,
						startTime: item.slotStartTime,
						endTime: item.slotEndTime,
					},
					status: item.status,
					holiday: item.holiday,
					categoryActive:
						item?.categoryActive !== null && item?.categoryActive !== undefined
							? item?.categoryActive
							: 1,
					currentTime: item.currentTime,
					weekStatus,
				};
			});

			// cacheManager.set('getBranchList', cacheKey, getNearestBranches);

			utils.log("info", `getBranchList - Response sent`);
			if (method === false) {
				return dataFetched(
					res,
					id,
					getTranslation(language?.toLowerCase(), "GetBranchListDataFetched") ||
						"Data successfully fetched",
					data,
				);
			} else {
				return data[0];
			}
		} else {
			utils.log("info", `getBranchList - No branches found, `);
			return notFound(
				res,
				id,
				getTranslation(language?.toLowerCase(), "GetBranchListNotFound") ||
					"Branch not found",
			);
		}
	} catch (err) {
		utils.log(
			"error",
			`getBranchList - Error: ${err.message}, Transaction ID: ${id}`,
		);
		return internalServerError(
			res,
			id,
			getTranslation(
				language?.toLowerCase(),
				"GetBranchListInternalServerError",
			) || "An error occurred while fetching data",
		);
	}
};

exports.getVirtualBranchList = async (req, res) => {
	const {
		devicetype,
		lang = "en",
		lat,
		lng,
		regionid,
		transactionid,
		branchid,
		branchcode,
		categories,
	} = req.body;
	utils.log(
		"info",
		`getVirtualBranchList - Request Parameters: ${JSON.stringify(req.body)}`,
	);

	const device_type = devicetype || 3;
	const category_id = "-1"; // Default category ID
	const language = lang;
	const region_id = regionid || -1;
	const center_latitude = lat || 0; // Default values
	const center_longitude = lng || 0;
	const max_radius = -1; // Default values
	const max_rows = -1;
	const client_id = req?.clientid;
	const id = transactionid || utils.generateUUID();

	let branch_id = branchid;

	try {
		const categoriesList = categories.join("|");
		const cacheKey = `${device_type}${categoriesList}${language}${client_id}${region_id}${center_latitude}${center_longitude}${max_radius}${max_rows}getVirtualBranchList`;
		let getNearestBranches = await utils.getFromCache(cacheKey);

		if (!getNearestBranches) {
			getNearestBranches =
				await sqlQueries.getBranchesAgainstMultipleCategories(
					device_type,
					categoriesList,
					language,
					region_id,
					center_latitude,
					center_longitude,
					max_radius,
					max_rows,
					client_id,
				);

			await utils.setToCache(cacheKey, getNearestBranches);
		}

		if (getNearestBranches && getNearestBranches.length) {
			if (branch_id) {
				getNearestBranches = getNearestBranches.filter(
					(branch) => branch?.BranchId?.toString() === branch_id?.toString(),
				);
			}
			const data = getNearestBranches.map((item) => ({
				clientid: item.ClientId,
				branchID: item.BranchId,
				branchTitle: item.BranchTitle,
				branchCode: item.BranchCode,
				encbranchCode: cryptorEngine.EncryptForURL(
					item.BranchCode,
					true,
					process.env.APPOINTMENT_SECRET_KEY,
				),
				address: item.Address,
				branchStartTime: item.BranchStartTime,
				branchEndTime: item.BranchEndTime,
				currentTime: item.CurrentTime,
				contactNo: item.ContactNo,
				resultant: item.Resultant,
				futureDaysForAppointment: item.FutureDaysForAppointment,
				latitude: item.Latitude,
				longitude: item.Longitude,
				distanceInKM: item?.DistanceInKM || 0,
				status: item.Status,
				langCode: language,
				regionid: region_id,
				categoryid: category_id,
				slotDetail: {
					slotID: item.slotid,
					slotDate: item.slotdate,
					startTime: item.slotStartTime,
					endTime: item.slotEndTime,
				},
				holiday: item.Holiday,
				...(item?.branchTranslations && {
					branchTranslations: utils.parseTranslations(item.branchTranslations),
				}),
				...(item?.branchAddressTranslations && {
					branchAddressTranslations: utils.parseTranslations(
						item.branchAddressTranslations,
					),
				}),
			}));

			utils.log(
				"info",
				`getVirtualBranchList - Response sent, Transaction ID: ${transactionid}, Branches Found: ${data.length}`,
			);
			return dataFetched(
				res,
				id,
				getTranslation(language?.toLowerCase(), "GetBranchListDataFetched") ||
					"Data successfully fetched",
				data,
			);
		} else {
			utils.log(
				"info",
				`getVirtualBranchList - No branches found, Transaction ID: ${transactionid}`,
			);
			return notFound(
				res,
				id,
				getTranslation(language?.toLowerCase(), "GetBranchListNotFound") ||
					"Branch not found",
			);
		}
	} catch (err) {
		utils.log(
			"error",
			`getVirtualBranchList - Error: ${err.message}, Transaction ID: ${id}`,
		);
		return internalServerError(
			res,
			id,
			getTranslation(
				language?.toLowerCase(),
				"GetBranchListInternalServerError",
			) || "An error occurred while fetching data",
		);
	}
};

exports.getBranchListByCategory = async (req, res) => {
	const {
		categoryid,
		lang = "en",
		regionid,
		transactionid,
		branchid,
		branchcode,
		suboption,
	} = req.query;
	utils.log(
		"info",
		`getBranchListByCategory - Request Parameters: ${JSON.stringify(req.query)}`,
	);

	if (!categoryid || !req.query.lang) {
		utils.log(
			"error",
			`getBranchListByCategory - Invalid parameters: Missing 'categoryid' or 'lang'`,
		);
		return badRequest(
			res,
			"",
			getTranslation(
				lang?.toLowerCase(),
				"GetBranchListByCategoryNotFoundFromBranchCode",
			) || "Invalid parameters",
		);
	}

	const device_type = req.query.devicetype || 3;
	// Language has tempararily changed to EN front end need to implement fetch translated branchname
	const language = "en";
	const region_id = regionid || -1;
	const center_latitude = 0; // Default values
	const center_longitude = 0;
	const max_radius = -1; // Default values
	const max_rows = -1;
	const client_id = req?.clientid;
	const id = transactionid || utils.generateUUID();

	let branch_id = branchid;

	try {
		// const cacheKey = `${device_type}${categoryid}${language}${client_id}${region_id}${center_latitude}${center_longitude}${max_radius}${max_rows}getBranchListByCategory`;
		// let getNearestBranches = cacheManager.get('getBranchListByCategory', cacheKey) || {};

		// if (!getNearestBranches) {
		const getNearestBranches = await sqlQueries.getNearestBranchesByCategory(
			device_type,
			categoryid,
			language,
			region_id,
			center_latitude,
			center_longitude,
			max_radius,
			max_rows,
			client_id,
			null,
			suboption || null,
		);

		// 	cacheManager.set('getBranchListByCategory', cacheKey, getNearestBranches);
		// }

		if (getNearestBranches && getNearestBranches.length) {
			if (branch_id) {
				getNearestBranches = getNearestBranches.filter(
					(branch) => branch?.BranchId?.toString() === branch_id?.toString(),
				);
			}
			const data = getNearestBranches.map((item) => ({
				clientid: item.ClientId,
				branchID: item.branchID,
				branchTitle: item.BranchTitle,
				branchCode: item.BranchCode,
				address: item.Address,
				branchStartTime: item.BranchStartTime,
				branchEndTime: item.BranchEndTime,
				currentTime: item.CurrentTime,
				contactNo: item.ContactNo,
				resultant: item.Resultant,
				futureDaysForAppointment: item.FutureDaysForAppointment,
				latitude: item.Latitude,
				longitude: item.Longitude,
				distanceInKM: item.DistanceInKM,
				status: item.Status,
				langCode: language,
				regionid: region_id,
				categoryid: categoryid,
				slotDetail: {
					slotID: item.slotid,
					slotDate: item.slotdate,
					startTime: item.slotStartTime,
					endTime: item.slotEndTime,
				},
				holiday: item.Holiday,
				...(item?.branchTranslations && {
					branchTranslations: utils.parseTranslations(item.branchTranslations),
				}),
				...(item?.branchAddressTranslations && {
					branchAddressTranslations: utils.parseTranslations(
						item.branchAddressTranslations,
					),
				}),
			}));

			utils.log(
				"info",
				`getBranchListByCategory - Response sent, Transaction ID: ${transactionid}, Branches Found: ${data.length}`,
			);
			return dataFetched(
				res,
				id,
				getTranslation(
					language.toLowerCase(),
					"GetBranchListByCategoryDataFetched",
				) || "Data successfully fetched",
				data,
			);
		} else {
			utils.log(
				"info",
				`getBranchListByCategory - No branches found, Transaction ID: ${transactionid}`,
			);
			return notFound(
				res,
				id,
				getTranslation(
					language.toLowerCase(),
					"GetBranchListByCategoryNotFound",
				) || "Branch not found",
			);
		}
	} catch (err) {
		utils.log(
			"error",
			`getBranchListByCategory - Error: ${err.message}, Transaction ID: ${id}`,
		);
		return internalServerError(
			res,
			id,
			getTranslation(
				language.toLowerCase(),
				"GetBranchListByCategoryInternalServerError",
			) || "An error occurred while fetching data",
		);
	}
};

exports.cancelAppointmentTicket = async (req, res) => {
	const id = req.query.transactionid || utils.generateUUID();
	const response = await cancelAppointment(req.query, res, id);

	if (response.resp_status === "1") {
		if (req.query?.isvirtual && config.virtualAppointmentonIssue) {
			if (req.query.appointmentnumber) {
				try {
					let queryforVirtual = `EXEC master..openEncrypt SELECT VirtualID as VirtualID FROM AppointmentRecords WHERE AppointmentNumber = @apptnum exec master..closeEncrypt`;
					let parametersForVirtual = [
						{
							name: "apptnum",
							type: sql.VarChar,
							value: req.query.appointmentnumber,
						},
					];

					let resultapptnumForVirtual = await sqlQueries.executeSQLQuery(
						queryforVirtual,
						parametersForVirtual,
						DB_EQ_REPORT,
					);
					let eventIDForVirtual = resultapptnumForVirtual?.VirtualID.toString();

					if (eventIDForVirtual) {
						await cancelCalenderEvent(eventIDForVirtual);
					}
				} catch (err) {
					utils.log(
						"error",
						`Cannot Cancel Virtual Meeting For Appointment number ${req.body.prevAppointmentNumber}`,
					);
				}
			}
		}
	}

	switch (response.resp_status) {
		case "BadRequest":
			return badRequest(res, "", response.resp_message);
		case "InternalServerError":
			return internalServerError(
				res,
				id,
				getTranslation(
					req.query?.lang?.toLowerCase(),
					"CancelAppointmentInternalServerError",
				) ||
					response.resp_message ||
					"An internal server error occurred.",
			);
		case "NotFound":
			return notFound(res, id, response.resp_message);
		case "Failure":
			return forbidden(
				res,
				id,
				getTranslation(
					req.query?.lang?.toLowerCase(),
					"CancelAppointmentFailure",
				) ||
					response.resp_message ||
					"Appointment not canceled!",
				response.extras,
			);
		case "FailurePermitted":
			return forbidden(
				res,
				id,
				getTranslation(
					req.query?.lang?.toLowerCase(),
					"CancelAppointmentFailurePermitted",
				) ||
					response.resp_message ||
					"Changes to this appointment are no longer permitted.",
				response.extras,
			);
		default:
			if (
				req.query.branchid &&
				req.query.categoryid &&
				req.query.appointmentnumber &&
				req.query.appointmentdate &&
				req.query.slottime &&
				req.query.endtime &&
				req.query.agentid &&
				req.query.agentname &&
				req.query.source
			) {
				utils.transactionLog({
					branchid: req.query.branchid,
					previousapptbranchid: null,
					categoryid: req.query.categoryid,
					previousapptcategoryid: "",
					appointmentdate: req.query.appointmentdate,
					prevappointmentdate: "",
					appointmentnumber: req.query.appointmentnumber,
					prevappointmentnumber: null,
					mobilenumber: req.query.mobilenumber ? req.query.mobilenumber : "",
					emailid: req.query.emailid ? req.query.emailid : "",
					slottime: req.query.slottime,
					prevslottime: "",
					endtime: req.query.endtime,
					prevendtime: "",
					agentid: req.query.agentid,
					agentname: req.query.agentname,
					stateid: 2,
					source: req.query.source,
				});
			}

			return dataFetched(
				res,
				id,
				getTranslation(
					req.query?.lang?.toLowerCase(),
					"CancelAppointmentSuccess",
				) ||
					response.resp_message ||
					"Appointment canceled successfully!",
				response.extras,
			);
	}
};

async function cancelAppointment(req, res, id) {
	const {
		appointmentnumber,
		categoryid = "-1",
		branchid,
		phonenumber,
		emailid,
		lang = "en",
		origin,
		contingency = false,
		reschedule,
		branchname,
		cancelreasonid = null,
		skipbookslotcount = null,
		changeby = null,
		reason = null,
		agentid = null,
		devicetype = null,
	} = req;

	let { transactionid } = req;

	if (!transactionid) transactionid = id;

	const skipAlert = req.skipalert === "true" || req.skipalert === "1";
	let resolvedAppointmentNumber = appointmentnumber;
	let response = {
		resp_status: "",
		resp_message: "",
		extras: "",
	};

	// Validate parameters
	if (!resolvedAppointmentNumber && (!phonenumber || !emailid)) {
		utils.log(
			"error",
			"cancelAppointmentTicket: Missing parameters - Invalid parameters",
		);
		return {
			resp_status: "BadRequest",
			resp_message:
				getTranslation(
					lang?.toLowerCase(),
					"CancelAppointmentInvalidParameters",
				) || "Invalid parameters",
			extras: null,
		};
	}

	let result;

	try {
		const branch_id = branchid
			? branchid
			: await sqlQueries.getAppointmentBranchId(appointmentnumber);

		// Fetch appointment info based on available parameters
		result = await findAppointment(
			branch_id,
			resolvedAppointmentNumber,
			emailid,
			phonenumber,
		);

		if (!result || result.length === 0) {
			utils.log(
				"info",
				`Appointment not found, ${id} - AppointmentNumber: ${resolvedAppointmentNumber}, email: ${emailid}, phone: ${phonenumber}`,
			);
			return {
				resp_status: "NotFound",
				resp_message:
					getTranslation(lang?.toLowerCase(), "CancelAppointmentNotFound") ||
					"Appointment not found!",
				extras: null,
			};
		}

		resolvedAppointmentNumber = result?.AppointmentNumber;
		let resolveAlertTypeID = result?.AlertTypeID || null;
		const userId = result?.UserId || "";
		const appointmentDate =
			utils.formatDateTime(new Date(result?.AppointmentDate), "dd/MM/yyyy") ||
			"";
		const startTime =
			utils.formatDateTime(new Date(result?.StartTime), "hh:mm A") || "";
		utils.log(
			"info",
			`Appointment found, ${id} - AppointmentNumber: ${resolvedAppointmentNumber}, email: ${result?.Email}, phone: ${result?.PhoneNumber}`,
		);

		// Determine flag based on rescheduling
		const flag = reschedule ? "cancel_reschedule" : "cancel_new";

		// Cancel appointment
		const responseString = await sqlQueries.mbtSP_CancelAppointmentTicket(
			branch_id,
			categoryid,
			resolvedAppointmentNumber,
			userId,
			flag,
			cancelreasonid,
			skipbookslotcount,
			changeby || agentid || null,
			reason,
			devicetype,
		);
		utils.log("info", `CancelAppointmentTicket, response sent`);

		const responseArray = responseString ? responseString?.split("|") : [];
		const resp_status = responseArray[0];
		const resp_message = responseArray[3];
		const resultCategoryID = responseArray[2] || categoryid;
		const resultbranchid = responseArray[1] || branch_id;

		if (resp_status == 1 && !skipAlert) {
			if (!contingency) {
				utils.log("info", "NO CONTINGENCY SENT IN REQUEST");
			}

			const obj = {
				appointmentNumber: resolvedAppointmentNumber,
				categoryId: resultCategoryID,
				branchId: resultbranchid,
				language: lang,
				emailId: result.Email || "",
				phoneNumber: result.PhoneNumber || "",
				encryptedUserId: userId,
				contingency_Enable_Disable: contingency,
				AlertTypeID: resolveAlertTypeID,
				cancelReasonId: cancelreasonid,
			};

			utils.log(
				"info",
				`Alert Request for Appointment: ${JSON.stringify(obj)}`,
			);
			SendApptCancelledEmail(obj);
		}

		// WhatsApp notification logic
		if (
			origin?.toLowerCase() === "whatsapp" &&
			result.PhoneNumber &&
			branchname
		) {
			const LQN =
				(
					await sqlQueries.longCategoryID(
						resultCategoryID,
						resolvedAppointmentNumber,
						resultbranchid,
					)
				)?.[0]?.LQN || "";
			const templateName = config.cancel_appt_whatsapp_template;
			let cancelmsg = getTranslation(lang, "WhatsAppSystemCancelMsg")
				.replace("{0}", branchname)
				.replace("{1}", appointmentDate)
				.replace("{2}", startTime)
				.replace("{3}", LQN)
				.replace("{4}", resolvedAppointmentNumber);

			const state_id = config.ContingencyConfigurable_StateId;
			await sendApptCancelledWhatsAppSms(
				resultbranchid,
				result.PhoneNumber,
				cancelmsg,
				true,
				templateName,
				state_id,
			);
		}

		let data = "";
		if ([2, 3, 4, 5].includes(+resp_status) && responseArray.length === 5) {
			data = JSON.stringify({
				poll_id: responseArray[2],
				ticket_number: responseArray[3],
				counter_number: responseArray[4],
			});
		}

		response = {
			resp_status:
				resp_status == -6
					? "FailurePermitted"
					: resp_status <= -1
						? "Failure"
						: resp_status,
			resp_message: resp_message,
			extras: data,
		};

		utils.log("info", `cancelAppointmentTicket response sent`);
		return response;
	} catch (error) {
		utils.log("error", "Error cancelAppointmentTicket:", error);
		return {
			resp_status: "InternalServerError",
			resp_message: error.message,
			extras: null,
		};
	}
}


async function findAppointment(
    branchid,
    appointmentNumber,
    emailId,
    phoneNumber,
    _id,
    findAll = false,
) {
    if (_id) {
        return await sqlQueries.mbtAppointmentTicketInfo_mbtAppointmentUserPayloads(
            "_id",
            _id,
            branchid,
        );
    }
    if (findAll && appointmentNumber) {
        return await sqlQueries.mbtAppointmentTicketInfo_mbtAppointmentUserPayloads(
            "findAll",
            appointmentNumber,
            branchid,
        );
    }


    if (appointmentNumber) {
        return await sqlQueries.mbtAppointmentTicketInfo_mbtAppointmentUserPayloads(
            "appointment_number",
            appointmentNumber,
            branchid,
        );
    }
    if (emailId) {
        return await sqlQueries.mbtAppointmentTicketInfo_mbtAppointmentUserPayloads(
            "email",
            emailId,
            branchid,
        );
    }
    if (phoneNumber) {
        return await sqlQueries.mbtAppointmentTicketInfo_mbtAppointmentUserPayloads(
            "phone_number",
            phoneNumber,
            branchid,
        );
    }


    return [];
}