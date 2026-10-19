const sql = require("mssql");
const config = require("../public/config/config");
const db = require("../db/db");
let pool = null;
const cryptorEngine = require("../classes/CryptorEngine");
const utils = require("../utils/utils");

const DB_EQ_REPORT = config.DB.eqReport.database;
const DB_EQ_PORTAL = config.DB.eqPortal.database;
const DB_ALERT_MODULE = config.DB.Alert_Module.database; // Add this for the Alert_module database

// Object to store pool connections for each database provider
const pools = {};

async function initializetheDBConnectionOnStartup() {
	if (!pools[DB_EQ_PORTAL]) {
		let eqPortalConnection = await db.connect(DB_EQ_PORTAL);
		utils.log(
			"info",
			`DB eqReport Initialized ${eqPortalConnection._connected}`
		);
		pools[DB_EQ_PORTAL] = eqPortalConnection;
	}
	if (!pools[DB_EQ_REPORT]) {
		let eqReportConnection = await db.connect(DB_EQ_REPORT);
		utils.log(
			"info",
			`DB eqPortal Initialized ${eqReportConnection._connected}`
		);
		pools[DB_EQ_REPORT] = eqReportConnection;
	}
	if (!pools[DB_ALERT_MODULE]) {
		let alertModuleConnection = await db.connect(DB_ALERT_MODULE);
		utils.log(
			"info",
			`DB AlertModule Initialized ${alertModuleConnection._connected}`
		);
		pools[DB_ALERT_MODULE] = alertModuleConnection;
	}

	return pools;
}
// Function to get a connection pool for a specific database provider
async function getDBConnection(dbprovider) {
	if (!pools[dbprovider]) {
		// If no pool exists for this provider, create a new one
		pools[dbprovider] = await db.connect(dbprovider);
	} else {
		try {
			// Test the existing connection
			await pools[dbprovider].query("SELECT 0");
		} catch (error) {
			if (
				error.code === "ECONNRESET" ||
				error.message.includes("Connection lost")
			) {
				// Reconnect if the connection is lost
				pools[dbprovider] = await db.connect(dbprovider);
			} else {
				throw error;
			}
		}
	}
	return pools[dbprovider];
}

function mapSqlType(dataType) {
	switch (dataType) {
		case "int":
			return sql.Int;
		case "bit":
			return sql.Bit;
		case "datetime":
			return sql.DateTime;
		case "nvarchar":
		case "varchar":
			return sql.NVarChar;
		default:
			return sql.NVarChar;
	}
}

async function getBranchId(branchCode, lang = "en") {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const sqlCommand = `SELECT 
				A.ID,
				A.Name,
				ISNULL( 
					STUFF((
						SELECT  '|' + SUBSTRING(LOWER(B2.LanguageName), CHARINDEX('@', B2.LanguageName) + 1, 2)
								+ ':' + B2.Value
						FROM eqportal..eQPortal_StaticTranslation B2 WITH (NOLOCK) 
						WHERE REPLACE(A.Name, ' ', '') = B2.[key]
						FOR XML PATH(''), TYPE    
					).value('.', 'NVARCHAR(MAX)'), 1, 1, ''), ''
				) + '|' + SUBSTRING(LOWER(@lang), CHARINDEX('@', @lang) + 1, 2) + ':' + A.Name AS branchTranslations
			FROM eqportal..eQPortal_Branch A WITH (NOLOCK)
			WHERE BranchCode = @branchCode AND (A.isDeleted IS NULL OR A.isDeleted <> 1);`;
		let result = await dbPool
			.request()
			.input("branchCode", sql.VarChar, branchCode)
			.input("lang", sql.VarChar, lang)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		throw error; // Ensure errors are propagated to the caller
	}
}

async function getRabbitMQIP(branchCode) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "usp_getRabbitMQIP";
		let result = await dbPool
			.request()
			.input("branchCode", sql.VarChar, branchCode)
			.execute(sqlCommand);

		if (result.recordset.length > 0) {
			let objBranchRabbitMQIP = {
				RabbitMQIP: result.recordset[0].RabbitMQIP,
				NodeAPIUrl: result.recordset[0].NodeAPIUrl,
			};
			return objBranchRabbitMQIP;
		} else {
			console.error("Branch does not exist.");
			return null;
		}
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getBranchIP(branchId) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const sqlCommand = "getBranchIP";
		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.execute(sqlCommand);

		if (result.recordset.length > 0) {
			const row = result.recordset[0];
			if (row.IPAddress && row.IPAddress !== "") {
				return {
					state: true,
					value: row.IPAddress,
				};
			} else {
				utils.log("error", `Error in getBranchIP: Branch is not configured.`);
				return {
					state: false,
					message: "Branch is not configured.",
				};
			}
		} else {
			utils.log("error", `Error in getBranchIP: Branch does not exist.`);
			return {
				state: false,
				message: "Branch does not exist.",
			};
		}
	} catch (error) {
		utils.log("error", `Error in getBranchIP: ${error.message}`);
		return {
			state: false,
			message: "Something went wrong.",
		};
	}
}
async function getBranchCountersData(branchId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "Dashboard_getBranchCounterStatus";
		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.execute(sqlCommand);

		return result.recordsets[0];
	} catch (error) {
		utils.log("error", `Error in getBranchIP: ${error.message}`);
		return {
			state: false,
			message: "Something went wrong.",
		};
	}
}

async function getBranchCategory(branch_id, category_name) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const sqlCommand = "getBranchCategory";
		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branch_id)
			.input("categoryName", sql.VarChar, category_name)
			.execute(sqlCommand);

		if (result.recordset.length > 0) {
			const row = result.recordset[0];
			if (row.CategoryId && row.CategoryId !== "") {
				return {
					state: true,
					value: row.CategoryId,
				};
			} else {
				utils.log(
					"error",
					`Error in getBranchCategory: Category is not configured.`
				);
				return {
					state: false,
					message: "Category is not configured.",
				};
			}
		} else {
			utils.log(
				"error",
				`Error in getBranchCategory: Category is not configured.`
			);
			return {
				state: false,
				message: "Category is not configured.",
			};
		}
	} catch (error) {
		utils.log("error", `Error in getBranchCategory: ${error.message}`);
		return {
			state: false,
			message: "Something went wrong.",
		};
	}
}

async function getWaitingTicketData(branchId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand =
			"select branchId, WaitingTicketsJson, update_Time from WaitingTicketData with(nolock) where branchId = @branchId";
		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.query(sqlCommand);

		if (result.recordset.length > 0) {
			return result.recordset;
		} else {
			console.error("Data does not exist.");
			return null;
		}
	} catch (error) {
		console.error(`Error in getWaitingTicketData: `, error.message);
		throw error;
	}
}

async function getCatWaitingTicketFromCache(branchId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand =
			"select  branchId, ResultJson, updateTime from Cache_CategoryWaitingList with(nolock) where branchId = @branchId ";
		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.query(sqlCommand);

		if (result.recordset.length > 0) {
			return result.recordset;
		} else {
			console.error("Data does not exist.");
			return null;
		}
	} catch (error) {
		console.error(`Error in getCatWaitingTicketFromCache: `, error.message);
		throw error;
	}
}
async function addCatWaitingTicketinCache(
	CurrentDatetime,
	resultJson,
	branchId
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `
            INSERT INTO Cache_CategoryWaitingList(branchId , ResultJson, updateTime) VALUES( @branchId, @resultJson  , @CurrentDatetime)

        `;

		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input("resultJson", sql.NVarChar, resultJson)
			.input("CurrentDatetime", CurrentDatetime)
			.query(query);

		return result.rowsAffected[0];
	} catch (error) {
		console.error("Error in addCacheWaitingTicketsData: ", error.message);
		throw error;
	}
}

async function updateCatWaitingTicketinCache(CurrentDatetime, branchId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `
            UPDATE Cache_CategoryWaitingList SET updateTime = @CurrentDatetime Where branchId = @branchId
        `;
		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input("CurrentDatetime", CurrentDatetime)
			.query(query);

		return result.rowsAffected[0];
	} catch (error) {
		console.error("Error in updateWaitingTicketsData: ", error.message);
		throw error;
	}
}
async function updateCatWaitingTicketinCacheWithResultJson(
	CurrentDatetime,
	resultJson,
	branchId
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `
            UPDATE Cache_CategoryWaitingList SET ResultJson = @result_json, updateTime = @CurrentDatetime Where branchId = @branchId
        `;
		// console.log(resultJson);
		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input("result_json", sql.NVarChar, resultJson)
			.input("CurrentDatetime", CurrentDatetime)
			.query(query);

		return result.rowsAffected[0];
	} catch (error) {
		console.error(
			"Error in updateWaitingTicketsDatawithResultJson: ",
			error.message
		);
		throw error;
	}
}
async function getPSRWAITINGTICKETDATA(branchId, TicketsCount) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `
            SELECT TOP (@TicketsCount) ticketNumber, issueTime, actualWaitTime, positionInQueue, estWaitTime 
            FROM PSRTicketDataSimulation WITH (NOLOCK) 
            WHERE callFlag = @Flag AND branchId = @branchId 
            ORDER BY ticketid DESC
        `;

		let result = await dbPool
			.request()
			.input("Flag", sql.Int, 0)
			.input("branchId", sql.Int, branchId)
			.input("TicketsCount", sql.Int, TicketsCount)
			.query(query);

		return result.recordset.map((row) => ({
			ticketNumber: row.ticketNumber,
			issueTime: row.issueTime,
			actualWaitTime: parseInt(row.actualWaitTime),
			positionInQueue: parseInt(row.positionInQueue),
			estWaitTime: parseInt(row.estWaitTime),
		}));
	} catch (error) {
		console.error("Error in getPSRWAITINGTICKETDATA: ", error.message);
		throw error;
	}
}

async function addWaitingTicketsData(
	waitingTicketsJson,
	currentTime,
	branchId
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `
            INSERT INTO WaitingTicketData (branchId, WaitingTicketsJson, update_Time) 
            VALUES (@branchId, @waitingTicketsJson, @CurrentDatetime)
        `;

		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input(
				"waitingTicketsJson",
				sql.NVarChar,
				JSON.stringify(waitingTicketsJson)
			)
			.input("CurrentDatetime", currentTime)
			.query(query);

		return result.rowsAffected[0];
	} catch (error) {
		console.error("Error in addWaitingTicketsData: ", error.message);
		throw error;
	}
}

async function updateWaitingTicketsData(
	waitingTicketsJson,
	currentTime,
	branchId
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `
            UPDATE WaitingTicketData 
            SET WaitingTicketsJson = @waitingTicketsJson, update_Time = @CurrentDatetime 
            WHERE branchId = @branchId
        `;

		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input(
				"waitingTicketsJson",
				sql.NVarChar,
				JSON.stringify(waitingTicketsJson)
			)
			.input("CurrentDatetime", currentTime)
			.query(query);

		return result.rowsAffected[0];
	} catch (error) {
		console.error("Error in updateWaitingTicketsData: ", error.message);
		throw error;
	}
}

async function getOperatorRoleFromBranchId(branchId, username) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);

	try {
		if (branchId) {
			const sqlCommand = `
                SELECT op.Role AS RoleName
                FROM dbo.eQPortal_Operator o with(nolock)
                INNER JOIN EQPortal_OperatorRole op with(nolock) ON op.ID = o.RoleID AND op.BranchId = o.BranchId
                WHERE o.Name = @username AND o.BranchId = @branchId AND o.isDeleted = 0`;

			let result = await dbPool
				.request()
				.input("username", sql.VarChar, username)
				.input("branchId", sql.Int, branchId)
				.query(sqlCommand);

			if (result.recordset.length > 0) {
				return result.recordset[0].RoleName;
			} else {
				return "";
			}
		} else {
			return "";
		}
	} catch (error) {
		console.error(`Error in getOperatorRoleFromBranchId: `, error.message);
		return "";
	}
}

async function removeOldTransactionsFromDB(id, callingController) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	const sqlCommand = "deleteOldTransactions";

	try {
		await dbPool.request().execute(sqlCommand);
	} catch (error) {
		console.error(
			`${callingController} ${id} Error in removeOldTransactionsFromDB: ${error.message}`
		);
	}
}

async function getDateStatus(branchId, date) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	const sqlCommand = `
        SELECT TOP 1 branchid 
        FROM eqPortal..BranchScheduler WITH (NOLOCK)
        WHERE Status = 1 AND BranchID = @branchid 
        AND (CAST(@date AS date) BETWEEN CAST(StartDate AS date) AND CAST(EndDate AS date))`;

	try {
		let result = await dbPool
			.request()
			.input("branchid", sql.Int, branchId)
			.input("date", sql.VarChar, date)
			.query(sqlCommand);

		if (result.recordset.length > 0) {
			return result.recordset[0].branchid;
		} else {
			return -1;
		}
	} catch (error) {
		console.error(`Error: ${error.message}`);
		throw error;
	}
}

async function getHolidayStatus(branchId, date) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	const sqlCommand = `
        SELECT description 
        FROM eqportal..eQPortal_BranchHolidays WITH (NOLOCK)
        WHERE branchid = @branchid AND holidays = @date AND isSaved = 1`;

	try {
		let result = await dbPool
			.request()
			.input("branchid", sql.Int, branchId)
			.input("date", sql.VarChar, date)
			.query(sqlCommand);

		if (result.recordset.length > 0) {
			return result.recordset[0].description;
		} else {
			return "";
		}
	} catch (error) {
		console.error(`Error: ${error.message}`);
		throw error;
	}
}

async function getWorkflowIDByPractitionerID(
	practitionerId,
	id,
	callingController
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	let WID = 0;
	const sqlCommand = `
		SELECT w_id, Practitioner_id
		FROM WorkflowDashboardPractitionerStatus WITH (NOLOCK)
		WHERE Practitioner_id = @Practitioner_id
	  `;

	try {
		let result = await dbPool
			.request()
			.input("Practitioner_id", sql.VarChar, practitionerId)
			.query(sqlCommand);

		if (result.recordset.length > 0) {
			WID = result.recordset[0].w_id;
		} else {
			const err = {
				state: false,
				message: "Data does not exist.",
			};
			console.error(
				`${callingController} ${id} Error in getWorkflowIDByPractitionerID: ${err.message}`
			);
			return 0;
		}
	} catch (error) {
		console.error(
			`${callingController} ${id} Error in getWorkflowIDByPractitionerID: ${error.message}`
		);
		return 0;
	}

	return WID;
}

async function checkEntryInDB(
	requestId,
	requestType,
	userId,
	branchId,
	timeStamp,
	id,
	callingController
) {
	let dbPool = await getDBConnection(DB_EQ_REPORT);
	const sqlCommand = "checkTransactionEntryExists";

	try {
		let result = await dbPool
			.request()
			.input("requestID", sql.VarChar, requestId)
			.execute(sqlCommand);

		let table = result.recordset;

		if (table.length > 0) {
			if (table[0].state.toLowerCase() === "processing") {
				console.info(
					`${callingController}  ${requestId}  Request has already been processed`
				);
				return true;
			} else {
				return table[0];
			}
		} else {
			const isSaved = await saveEntryInDB(
				requestId,
				requestType,
				userId,
				branchId,
				timeStamp
			);
			if (isSaved === true) {
				return false;
			} else {
				return null;
			}
		}
	} catch (error) {
		console.error(
			`${callingController}:  ${requestId}  Error in checkEntryInDB: `,
			error.message
		);
		return null;
	}
}

async function saveEntryInDB(
	requestId,
	requestType,
	userId,
	branchId,
	timeStamp
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	const sqlCommand = "saveTransactionEntry";

	try {
		await dbPool
			.request()
			.input("requestID", sql.VarChar, requestId)
			.input("requestType", sql.VarChar, requestType)
			.input("userID", sql.VarChar, userId.toString())
			.input("branchID", sql.Int, branchId)
			.input("timeStamp", sql.DateTime, timeStamp)
			.input("state", sql.VarChar, "processing")
			.execute(sqlCommand);

		return true;
	} catch (error) {
		console.error("Error in saveEntryInDB: ", error.message);
		return null;
	}
}

async function addCustomerVisit(customerVisit) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "sp_AddCustomerVisit";
		let result = await dbPool
			.request()
			.input("customer_id", sql.VarChar, customerVisit.customer_id)
			.input("ticketId", sql.VarChar, customerVisit.ticket_id)
			.input("branch_id", sql.Int, customerVisit.branch_id)
			.input("Record_ID", sql.VarChar, customerVisit.Record_ID)

			.execute(sqlCommand);

		return result.recordset[0][""];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function checkCustomerTicketRecordExists(branchId, customerID) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	let isCustomerTicketExists = false;
	const sqlCommand = `select id from sd_CustomerVisits with(nolock) 
     where customer_id = @customerID and branch_id = @branchId`;

	try {
		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input("customerID", sql.VarChar, customerID)
			.query(sqlCommand);

		if (result != null) {
			let recordId = parseInt(result.recordset.length);
			if (recordId > 0) {
				isCustomerTicketExists = true;
			}
		}
		return isCustomerTicketExists;
	} catch (error) {
		console.error(
			` ${id} Error in checkCustomerTicketRecordExists: ${error.message}`
		);
		return 0;
	}
}

async function getCategoryListByBranchCode(branchcode, id, callingController) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	const categoryList = [];
	const sqlCommand = `
	  SELECT CategoryId, SQN, LQN
	  FROM eqportal..eQPortal_Category c WITH (NOLOCK)
	  INNER JOIN eqportal..eQPortal_Branch b WITH (NOLOCK)
	  ON c.BranchId = b.ID AND c.Active = 1
	  WHERE b.BranchCode = @branchcode AND (b.isDeleted IS NULL or b.isDeleted <> 1)
	  ORDER BY CategoryId ASC
	`;

	try {
		let result = await dbPool
			.request()
			.input("branchcode", sql.VarChar, branchcode)
			.query(sqlCommand);

		if (result.recordset.length > 0) {
			result.recordset.forEach((row) => {
				let categoryInfo = {};
				categoryInfo.CategoryID = row.CategoryId;
				categoryInfo.Category = row.SQN;
				categoryInfo.CategoryName = row.LQN;
				categoryList.push(categoryInfo);
			});
			return categoryList;
		} else {
			const err = {
				state: false,
				message: "Data does not exist.",
			};
			console.error(`${callingController} ${id} Error: ${err.message}`);
			return null;
		}
	} catch (error) {
		console.error(`${callingController} ${id} Error: ${error.message}`);
		const err = {
			state: false,
			message: "Something went wrong.",
		};
		return null;
	}
}

async function getApptCategories(lang, branchId, clientId, applicationID = null) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "mbtSP_WT_GetApptCategoryList_Param";
		let result = await dbPool
			.request()
			.input("lang", sql.VarChar, lang)
			.input("branchId", sql.Int, branchId)
			.input("clientId", sql.Int, clientId)
			// .input("applicationId",sql.Int, applicationID)
			.execute(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}
async function getApptCategoriesWithFirstAvailableDate(
	lang,
	branches,
	categories,
	client_id
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "mbtSP_GetFirstAvailableDateParam";
		let result = await dbPool
			.request()
			.input("lang", sql.VarChar, lang)
			.input("branch", sql.VarChar, branches)
			.input("CATEGORYID", sql.VarChar, categories)
			.input("clientId", sql.Int, client_id)
			.execute(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function retrieveClientId(sId) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);

	try {
		const sqlCommand = `SELECT [ClientId] FROM [eqPortal].[dbo].[eqPortal_Clients] WHERE [sId] = @sId`;
		let result = await dbPool
			.request()
			.input("sId", sql.UniqueIdentifier, sId)
			.query(sqlCommand);

		return result;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getDisabledDates(branchId, categoryId, startDate = null,lang="en") {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "mbtSP_GetDisabledDates_OffDaysInfo";
		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input("SQN", sql.NVarChar, categoryId)
			.input("CustomSlot", sql.Int, 0)
			.input("StartDate", sql.Date, startDate)
			.input("lang", sql.VarChar, lang)			
			.execute(sqlCommand);
		return result.recordsets;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getAllDaysSlotsOfBranch(branchId, categoryId, appointmentDate,hourRange = null, lang, daysAhead) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = `mbtSP_GetAllDaysSlotsOfBranch`;
		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input("dateOfAppointment", sql.DateTime, appointmentDate)
			.input("categoryId", sql.NVarChar, categoryId)
			.input("HOUR_RANGE", sql.Int, hourRange)
			.input("lang", sql.VarChar, lang)
			.input("daysAhead", sql.Int, daysAhead)			
			.execute(sqlCommand);

		return result;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getAllSlotsOfBranch(branchId, categoryId, appointmentDate) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = `mbtSP_GetAllSlotsOfBranch`;
		let result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input("dateOfAppointment", sql.DateTime, appointmentDate)
			.input("categoryId", sql.NVarChar, categoryId)
			.input("HOUR_RANGE", sql.Int, null)
			.execute(sqlCommand);

		return result;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getSlotDetail(slotId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "mbtSP_GetSlotDetail";
		let result = await dbPool
			.request()
			.input("slotId", sql.Int, slotId)
			.execute(sqlCommand);
		return result.recordset;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getBranchDaysAhead(branchId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `SELECT DaysAHead FROM eqreport..vu_mbtAppointmentConfig WHERE branchid = @branchid`;
		let result = await dbPool
			.request()
			.input("branchid", sql.Int, branchId)
			.query(query);
		return result.recordset[0]?.DaysAHead || "";
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}
async function getBranchSchedule(branchId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `select startdate, enddate from eqPortal..BranchScheduler where Status = 1 and BranchID = @branchid`;
		let result = await dbPool
			.request()
			.input("branchid", sql.Int, branchId)
			.query(query);
		return result.recordset[0] || "";
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

// deviceType,categorid,lan,regionId,center_latitude,center_longitude,search_radius,noOfRows,ClientId
async function getNearestBranchesByCategory(
    device_type,
    category_id,
    lang,
    region_id,
    center_latitude,
    center_longitude,
    search_radius,
    noOfRows,
    client_id,
    prioritylevel = null,
    subOption = null,
    filterByLanguage = 0,
    city = null            // <-- new
) {
    const dbPool = await getDBConnection(DB_EQ_REPORT);
    try {
        const sqlCommand = "mbtSP_WT_getNearestBranchesByCategory";
        let result = await dbPool
            .request()
            .input("deviceType", sql.Int, device_type)
            .input("categoryid", sql.VarChar(5), category_id)
            .input("lang", sql.VarChar(255), lang)
            .input("regionId", sql.Int, region_id)
            .input("center_latitude", sql.Float, center_latitude)
            .input("center_longitude", sql.Float, center_longitude)
            .input("search_radius", sql.Float, search_radius)
            .input("noOfRows", sql.Int, noOfRows)
            .input("ClientId", sql.Int, client_id)
            .input("prioritylevel", sql.Int, parseInt(prioritylevel, 10) || null)
            .input("subOption", sql.VarChar, subOption?.trim() || null)
            .input("filterByLanguage", sql.Bit, filterByLanguage)
            // .input("city", sql.VarChar(255), city)   // <-- new
            .execute(sqlCommand);
        return result.recordset;
    } catch (error) {
        console.error("Error: ", error.message);
        throw error;
    }
}

async function getBranchWiseCategoryTicketInfo(categoryid) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "WT_WSPSR_GetPositionandEstimatedWaitTime";
		let result = await dbPool
			.request()
			.input("categoryid", sql.NVarChar, categoryid)
			.execute(sqlCommand);
		return result.recordset;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getBranchesAgainstMultipleCategories(
	device_type,
	categorylist,
	lang,
	region_id,
	center_latitude,
	center_longitude,
	search_radius,
	noOfRows,
	client_id
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "mbtsp_getBranchListForMultipleCategories";
		let result = await dbPool
			.request()
			.input("deviceType", sql.Int, device_type)
			.input("categoryid", sql.VarChar(255), categorylist)
			.input("lang", sql.VarChar(255), lang)
			.input("regionId", sql.Int, region_id)
			.input("center_latitude", sql.Float, center_latitude)
			.input("center_longitude", sql.Float, center_longitude)
			.input("search_radius", sql.Float, search_radius)
			.input("noOfRows", sql.Int, noOfRows)
			.input("ClientId", sql.Int, client_id)
			.execute(sqlCommand);
		return result.recordset;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function mbtAppointmentTicketInfo(type, userid) {
	let query = "";
	if (type === "appointmentNumber") {
		query =
			"SELECT TOP 1 AppointmentNumber FROM mbtAppointmentTicketInfo WHERE Active = 1 AND (State = 1 OR State = 3) AND UserId = @userid ORDER BY _id DESC";
	} else if (type === "appointmentDate") {
		query =
			"SELECT TOP 1 AppointmentDate FROM eqreport..mbtAppointmentTicketInfo WHERE AppointmentNumber = @userid ORDER BY _id DESC, IssueDate ASC";
	} else if (type === "startTime") {
		query =
			"SELECT TOP 1 StartTime FROM eqreport..mbtAppointmentTicketInfo WHERE AppointmentNumber = @userid ORDER BY _id DESC, IssueDate ASC";
	} else if (type === "active") {
		query =
			"SELECT Active FROM eqreport..mbtAppointmentTicketInfo WHERE AppointmentNumber = @userid ORDER BY _id DESC, IssueDate ASC";
	}
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		// const query = `SELECT TOP 1 AppointmentNumber FROM mbtAppointmentTicketInfo WHERE Active = 1 AND (State = 1 OR State = 3) AND UserId = @userid ORDER BY _id DESC`;
		let result = await dbPool
			.request()
			.input("userid", sql.NVarChar, userid)
			.query(query);
		return result.recordsets[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function mbtAppointmentTicketInfo_mbtAppointmentUserPayloads(
	type,
	value,
	branchid,
) {
	const queries = {
		_id: `
        EXEC master..openEncrypt
		SELECT AR.Email, AR.PhoneNumber, AR.AlertTypeID, AT.*
		FROM eqreport..mbtAppointmentTicketInfo AS AT with(nolock)
			LEFT JOIN eqreport..AppointmentRecords AS AR with(nolock)
    		ON AR.AppointmentNumber = CONVERT(VARCHAR, AT.AppointmentNumber)
    		AND AR.UserId = AT.UserId 
    		AND AR.AppointmentDate = AT.AppointmentDate
		WHERE 
    		AT._id IN ({values})
    		AND AT.Active = 1 
    		AND (AT.State = 1 OR AT.State = 3)
			AND AT.branchid = @branchid
		ORDER BY AT._id DESC
		EXEC master..closeEncrypt`,
		appointment_number: `
			EXEC master..openEncrypt			
			SELECT TOP 1 AT.*, AR.Email, AR.PhoneNumber,  AR.AlertTypeID
			FROM eqreport..AppointmentRecords AS AR with(nolock)
			RIGHT JOIN eqreport..mbtAppointmentTicketInfo AS AT with(nolock)
			ON AR.AppointmentNumber = CONVERT(VARCHAR, AT.AppointmentNumber)  AND AR.UserId = AT.UserId
			WHERE AT.AppointmentNumber = @value AND AT.Active = 1 AND (AT.State = 1 OR AT.State = 3)
			ORDER BY AT._id DESC
			EXEC master..closeEncrypt			
		`,
		email: `
			EXEC master..openEncrypt			
			SELECT TOP 1 AT.AppointmentNumber, AR.Email, AR.PhoneNumber, AT.UserId, AT.AppointmentDate, AT.StartTime , AR.AlertTypeID
			FROM eqreport..AppointmentRecords AS AR with(nolock)
			RIGHT JOIN eqreport..mbtAppointmentTicketInfo AS AT with(nolock)
			ON AR.AppointmentNumber = CONVERT(VARCHAR, AT.AppointmentNumber)  AND AR.UserId = AT.UserId
			WHERE LOWER(AR.Email) = LOWER(@value) 
			AND AT.Active = 1 
			AND (AT.State = 1 OR AT.State = 3)
			AND AT.branchid = @branchid
			ORDER BY AT._id DESC
			EXEC master..closeEncrypt
		`,
		phone_number: `
			EXEC master..openEncrypt			
			SELECT TOP 1 AT.AppointmentNumber, AR.Email, AR.PhoneNumber, AT.UserId, AT.AppointmentDate, AT.StartTime , AR.AlertTypeID
			FROM eqreport..AppointmentRecords AS AR with(nolock)
			RIGHT JOIN eqreport..mbtAppointmentTicketInfo AS AT with(nolock)
			ON AR.AppointmentNumber = CONVERT(VARCHAR, AT.AppointmentNumber) AND AR.UserId = AT.UserId
			WHERE LOWER(AR.PhoneNumber) = LOWER(@value) 
			AND AT.Active = 1 
			AND (AT.State = 1 OR AT.State = 3)
			AND AT.branchid = @branchid
			ORDER BY AT._id DESC
			EXEC master..closeEncrypt			
		`,
		userid: `			
			SELECT TOP 1 AT.DeviceType , AT.AppointmentDate , AT.UserId , AT.Slotid, AT.BranchId, AT.CategoryId
			FROM eqreport..mbtAppointmentTicketInfo AS AT with(nolock)	
			WHERE AT.UserId = @value AND AT.Active = 1 AND (AT.State = 1 OR AT.State = 3) AND AT.branchid = @branchid
			order by IssueDate DESC			
		`,
		findAll: `
			EXEC master..openEncrypt			
			SELECT TOP 1 AT.*, AR.Email, AR.PhoneNumber,  AR.AlertTypeID
			FROM eqreport..AppointmentRecords AS AR with(nolock)
			RIGHT JOIN eqreport..mbtAppointmentTicketInfo AS AT with(nolock)
			ON AR.AppointmentNumber = CONVERT(VARCHAR, AT.AppointmentNumber)  AND AR.UserId = AT.UserId
			WHERE AT.AppointmentNumber = @value
			ORDER BY AT._id DESC
			EXEC master..closeEncrypt			
		`,
	};

	const dbPool = await getDBConnection(DB_EQ_REPORT);
	let inputType = type === ("appointment_number" ||  "findAll")  ? sql.Int : sql.VarChar;

	try {
		if (type === "_id" && Array.isArray(value)) {
			// Safely format the array of IDs into the query
			let query = queries[type];
			const sanitizedValues = value.map((val) => `'${val}'`).join(",");
			query = query.replace("{values}", sanitizedValues);
			const result = await dbPool
				.request()
				.input("branchid", sql.Int, parseInt(branchid, 10))
				.query(query);
			return result.recordsets[0] || [];
		}

		const result = await dbPool
			.request()
			.input("value", inputType, value || value?.trim())
			.input("branchid", sql.Int, parseInt(branchid, 10))
			.query(queries[type]);

		return result.recordset[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function mbtAppointmentUserPayloads(type, udf) {
	let query = "";
	if (type === "email") {
		query = `SELECT TOP 1 AP.UDF6 FROM mbtAppointmentUserPayloads AS AP RIGHT JOIN mbtAppointmentTicketInfo AS AT ON AP.appointmentnumber = AT.AppointmentNumber WHERE AP.UDF1 = @udf ORDER BY AT._id DESC`;
	} else if (type === "phoneNumber") {
		query = `SELECT TOP 1 UDF2 FROM mbtAppointmentUserPayloads WHERE Userid = @udf ORDER BY TimeStamp DESC`;
	} else if (type === "userid") {
		query = `SELECT TOP 1 Userid FROM mbtAppointmentUserPayloads WHERE AppointmentNumber = @udf ORDER BY TimeStamp DESC`;
	}
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		let result = await dbPool
			.request()
			.input("udf", sql.NVarChar, udf)
			.query(query);
		return result.recordset[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}
async function mbtSP_insertApptCancelAlertInAlertModule(
	emailFrom,
	emailTo,
	appointment_number,
	alertTypeId,
	language,
	templateId,
	mobileNumber,
	branchId,
	SQN,
	cancelReasonId
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "mbtSP_insertApptCancelAlertInAlertModule";
		let request = await dbPool
			.request()
			.input("emailFrom", sql.NVarChar, emailFrom)
			.input("emailTo", sql.NVarChar, emailTo)
			.input("appointment_number", sql.NVarChar, appointment_number)
			.input("alertTypeId", sql.Int, alertTypeId)
			.input("language", sql.NVarChar, language)
			.input("templateId", sql.NVarChar, templateId)
			.input("mobileNumber", sql.NVarChar, mobileNumber)
			.input("branchId", sql.NVarChar, branchId.toString())
			.input("SQN", sql.NVarChar, SQN);

		// Optional cancelReasonId
		if (cancelReasonId !== null) {
			request.input("cancelReasonId", sql.Int, cancelReasonId);
		}

		let result = await request.execute(sqlCommand);
		return result.recordset;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function longCategoryID(categoryId, appointmentNumber, branchId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const query = `SELECT TOP 1 LQN 
        FROM DFLTCategories as DFLT 
        JOIN mbtAppointmentTicketInfo as MATI 
        ON DFLT.CategoryID = MATI.CategoryId AND DFLT.BranchID = MATI.BranchID 
        WHERE MATI.CategoryId = @categoryId AND MATI.AppointmentNumber = @appointmentNumber AND DFLT.BranchID = @branchId 
        ORDER BY MATI._id DESC, MATI.IssueDate ASC`;
		let result = await dbPool
			.request()
			.input("categoryId", sql.NVarChar, categoryId)
			.input("appointmentNumber", sql.Int, appointmentNumber)
			.input("branchid", sql.Int, branchId)
			.query(query);
		return result.recordsets[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function mbtSP_CancelAppointmentTicket(
	branchId,
	categoryId,
	appointmentNumber,
	userId,
	flag,
	cancelReasonId = null,
	skipBookSlotCount = null,
	changeby,
	reason,
	deviceType = null
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "mbtSP_CancelAppointmentTicket";
		let request = await dbPool
			.request()
			.input("branchId", sql.NVarChar, branchId?.toString())
			.input("categoryId", sql.NVarChar, categoryId?.toString())
			.input("appointmentNumber", sql.NVarChar, appointmentNumber.toString())
			.input("userId", sql.NVarChar, userId.toString())
			.input("flag", sql.NVarChar, flag)
			.input("cancelReasonId", sql.Int, cancelReasonId)
			.input("skipBookSlotCount", sql.Bit, skipBookSlotCount)
			.input("ChangeBy", sql.NVarChar, changeby)
			.input("Reason", sql.NVarChar, reason)
			.input("UpdatedDeviceType", sql.Int, deviceType);

		let result = await request.execute(sqlCommand);
		return result.recordset[0][""];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

// Function to insert an alert message in the Alert_module database
async function insertAlertMessage(
	from,
	to,
	subject,
	message,
	alertTypeId,
	regionID,
	referenceId,
	type,
	isOTP = 0
) {
	const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database
	try {
		const request = dbPool.request();
		request.input("From", sql.NVarChar, from);
		request.input("To", sql.NVarChar, to);
		request.input("Subject", sql.NVarChar, subject);
		request.input("Message", sql.NVarChar, message);
		request.input("AlertTypeId", sql.Int, alertTypeId);
		request.input("Retries", sql.Int, 3); // Default retries
		request.input("StatusId", sql.Int, 1); // Default status
		request.input("attachment", sql.NVarChar, ""); // Empty attachment
		request.input("ReferenceId", sql.Int, referenceId); // Nullable reference ID
		request.input("regionId", sql.Int, regionID);
		// request.input("isOTP",sql.Bit,1);
		await request.execute("sp_InsertMessage"); // Execute in the Alert_module database

		return true;
	} catch (error) {
		throw error;
	}
}

async function getPrevAppointmentNumber(userId, branchid) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const sqlCommand = `
			SELECT TOP 1 AppointmentNumber 
			FROM mbtAppointmentTicketInfo with(nolock)
			WHERE Active = 1 AND (State = 1 OR State = 3) AND UserId = @userId 
			AND Branchid = @branchid
			ORDER BY _id DESC
		`;
		let result = await dbPool
			.request()
			.input("userId", sql.NVarChar, userId)
			.input("branchid", sql.Int, branchid)
			.query(sqlCommand);

		if (result.recordset.length > 0) {
			const row = result.recordset[0];
			return {
				state: true,
				value: row.AppointmentNumber,
			};
		} else {
			utils.log(
				"error",
				`Error in getPrevAppointmentNumber: No active appointments found.`
			);
			return {
				state: false,
				message: "No active appointments found.",
			};
		}
	} catch (error) {
		utils.log("error", `Error in getPrevAppointmentNumber: ${error.message}`);
		return {
			state: false,
			message: "Something went wrong.",
		};
	}
}

async function executeSQLQuery(sqlCommands, parameters, targetedDB) {
	const dbPool = await getDBConnection(targetedDB);

	try {
		const request = dbPool.request();

		parameters.forEach((param) => {
			request.input(param.name, param.type, param.value);
		});

		const result = await request.query(sqlCommands);
		let row = result.recordsets[0];
		return row[0];
	} catch (error) {
		throw error;
	}
}

async function executeNonScalerSQLQuery(sqlCommands, parameters, targetedDB) {
	const dbPool = await getDBConnection(targetedDB);
	try {
		const request = dbPool.request();

		parameters.forEach((param) => {
			request.input(param.name, param.type, param.value);
		});

		const result = await request.query(sqlCommands);

		return result.rowsAffected[0];
	} catch (error) {
		throw error;
	}
}

async function appointmentNumberExists(apptNumber, targetedDB) {
	if (!apptNumber) return false;

	const sqlCommands = `
        SELECT _id 
        FROM mbtAppointmentTicketInfo 
        WHERE AppointmentNumber = @apptNumber 
        AND CONVERT(date, AppointmentDate, 102) >= CONVERT(date, GETDATE(), 102) 
        AND State IN (1, 3)
    `;

	const parameters = [
		{ name: "apptNumber", type: sql.NVarChar, value: apptNumber },
	];

	try {
		const result = await executeSQLQuery(sqlCommands, parameters, targetedDB);
		return result ? true : false;
	} catch (error) {
		console.error("Error:", error.message);
		return true; // Return true in case of error to mimic C# behavior
	}
}

async function executeSPScalarValue(
	spName,
	parameterDefinitions,
	values,
	targetedDB
) {
	const dbPool = await getDBConnection(targetedDB);

	try {
		const request = dbPool.request();

		for (let i = 0; i < parameterDefinitions.length; i++) {
			const paramDef = parameterDefinitions[i];
			const value = values[i];
			request.input(paramDef.name, paramDef.type, value);
		}

		const result = await request.execute(spName);

		return result.recordset.length > 0
			? result.recordset[0][Object.keys(result.recordset[0])[0]]
			: null;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function saveAppointmentUserPayloads(
	userId,
	apptNum,
	values,
	cellPhoneNumber,
	encreferenceno
) {
	utils.log(
		"info",
		`*** saveAppointmentUserPayloads() *** cellPhoneNumber: ${cellPhoneNumber}`
	);

	const list = [];

	list.push(userId); // Encrypted userId
	list.push(parseInt(apptNum, 10)); // Appointment number as bigint
	list.push(cellPhoneNumber); // Encrypted cell phone number

	for (let i = 0; i < 12; i++) {
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

	utils.log("info", `Parameters for stored procedure: ${JSON.stringify(list)}`);

	try {
		const result = await executeSPScalarValue(
			"mbtSP_SaveAppointmentUserPayloads",
			[
				{ name: "UserId", type: sql.VarChar },
				{ name: "AppointmentNumber", type: sql.BigInt },
				{ name: "phoneNumber", type: sql.VarChar },
				{ name: "UDF1", type: sql.NVarChar },
				{ name: "UDF2", type: sql.NVarChar },
				{ name: "UDF3", type: sql.NVarChar },
				{ name: "UDF4", type: sql.NVarChar },
				{ name: "UDF5", type: sql.NVarChar },
				{ name: "UDF6", type: sql.NVarChar },
				{ name: "UDF7", type: sql.NVarChar },
				{ name: "UDF8", type: sql.NVarChar },
				{ name: "UDF9", type: sql.NVarChar },
				{ name: "UDF10", type: sql.NVarChar },
			],
			list,
			DB_EQ_REPORT
		);

		utils.log(
			"info",
			`Stored procedure executed successfully. Result: ${result}`
		);
		return result;
	} catch (error) {
		utils.log("error", `Error executing stored procedure: ${error.message}`);
		throw error;
	}
}

async function genericExecutionSPForScalarValue(spName, values, targetedDB) {
	try {
		const dbPool = await getDBConnection(targetedDB);

		const paramQuery = `
      SELECT PARAMETER_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.PARAMETERS
      WHERE SPECIFIC_NAME = @spName
      ORDER BY ORDINAL_POSITION
    `;

		console.log(values);

		// Fetch the parameters from INFORMATION_SCHEMA.PARAMETERS
		const paramResult = await dbPool
			.request()
			.input("spName", sql.NVarChar, spName)
			.query(paramQuery);

		const parameters = paramResult.recordset;

		const request = dbPool.request();

		const parameterObject = {};
		parameters.forEach((param, i) => {
			const paramName = param.PARAMETER_NAME.replace("@", "");
			const value = values[i];

			const sqlType = getSqlType(param.DATA_TYPE);

			parameterObject[paramName] = { value, sqlType };
			request.input(paramName, sqlType, value);
		});

		const result = await request.execute(spName);

		return result.recordset.length > 0
			? result.recordset[0][Object.keys(result.recordset[0])[0]]
			: null;
	} catch (err) {
		console.error("Error executing stored procedure 2:", err?.message);
		throw err;
	}
}

function getSqlType(sqlDataType) {
	switch (sqlDataType.toLowerCase()) {
		case "varchar":
		case "nvarchar":
		case "text":
			return sql.NVarChar; // Use NVarChar for variable-length strings
		case "bigint":
			return sql.BigInt; // Use BigInt for large integers
		case "int":
			return sql.Int; // Use Int for regular integers
		case "bit":
			return sql.Bit; // Use Bit for boolean values
		case "date":
		case "datetime":
		case "datetime2":
			return sql.Date; // Optionally specify precision and scale for decimals
		// Add more mappings as needed based on SQL data types
		default:
			throw new Error(`Unhandled SQL data type: ${sqlDataType}`);
	}
}

async function getAppointmentDetail(
	userid = "",
	email = "",
	cellnumber = "",
	appointmentnumber = "",
	clientid = null,
	branchid = null,
	type = "getAppointmentDetail"
) {
	const sp = {
		getAppointmentDetail: `mbtSP_GetAppointmentDetail`,
		getAppointmentDetailCategorySTimeWise: `mbtSP_GetAppointmentDetailCategorySTimeWise`,
		getAppointmentDetailCategoryWise: `mbtSP_GetAppointmentDetailCategoryWise`,
		getAppointmentDetailSTWise: `mbtSP_GetAppointmentDetailSTWise`,
	};

	console.log("sp[type]", sp[type]);
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const result = await dbPool
			.request()
			.input("userid", sql.VarChar, userid)
			.input("email", sql.VarChar, email)
			.input("cellnumber", sql.VarChar, `${cellnumber}`)
			.input("appointmentNumber", sql.VarChar, appointmentnumber)
			.input("clientid", sql.VarChar, clientid)
			.input("allowedBranchId", sql.VarChar, branchid)
			.execute(sp[type]);

		return result?.recordset?.length ? result?.recordset[0] : [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getAppointmentRecords(
	userId,
	appointmentNumber,
	appointmentDate
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = `
			exec master..openEncrypt			
			SELECT TOP 1 *
			FROM AppointmentRecords 
			WHERE UserId = @userId AND AppointmentNumber = @appointmentNumber AND AppointmentDate = @appointmentDate
			exec master..closeEncrypt			
		`;
		let result = await dbPool
			.request()
			.input("userId", sql.NVarChar, userId)
			.input("appointmentNumber", sql.NVarChar, appointmentNumber)
			.input("appointmentDate", sql.Date, appointmentDate)
			.query(sqlCommand);

		if (result.recordset.length > 0) {
			return result.recordset[0] || [];
		}
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}
async function updateAppointmentStatus(
	state,
	userid,
	appointmentNo,
	ticketNumber,
	feedbackYesOrNo,
	changeby,
	reason,
	origin,
	ticket_id,
	session_id
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const result = await dbPool
			.request()
			.input("state", sql.VarChar, state)
			.input("userid", sql.VarChar, userid)
			.input("appointmentNo", sql.VarChar, appointmentNo)
			.input("ticketNumber", sql.VarChar, ticketNumber)
			.input("feedbackYesOrNo", sql.VarChar, feedbackYesOrNo)
			.input("ChangeBy", sql.NVarChar, changeby)
			.input("Reason", sql.NVarChar, reason)
			.input("Origin", sql.NVarChar, origin?.toString())
			.input("TicketId", sql.NVarChar, ticket_id?.toString())
			.input("SessionId", sql.NVarChar, session_id?.toString())
			.execute("mbtSP_WT_UpdateAppointmentServeStatus");

		return result.recordset[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function verifyAppointment(AppointmentNumber, UserId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const query = `select top 1 AppointmentNumber from mbtAppointmentTicketInfo where Active = 1 and (State = 1 OR State = 3) and AppointmentNumber = @AppointmentNumber and UserId = @UserId order by _id desc`;
		let result = await dbPool
			.request()
			.input("AppointmentNumber", sql.Int, +AppointmentNumber)
			.input("UserId", sql.NVarChar, UserId)
			.query(query);
		return result.recordsets[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getBranchDateTime(branchID) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const query = `SELECT CONVERT(varchar(23), eqreport.dbo.[Fnc_CalculatedDateTimeOfBranch](@branchID), 121) AS BranchDateTime`;
		let result = await dbPool
			.request()
			.input("branchID", sql.Int, branchID) // Assuming BranchID is an integer
			.query(query);

		// Fetch and return the DateTime result
		if (result.recordset.length > 0) {
			return result.recordset[0].BranchDateTime || []; // The DateTime value returned from the function
		}
		return null; // In case no result is returned
	} catch (error) {
		console.error("Error fetching branch date and time:", error.message);
		throw error;
	}
}

async function getAppointmentInfoForCheckin() {
	let parameters = [];
	let sqlCommands = "mbtSP_AutoCheckinForAppointmentsInfo";
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const request = dbPool.request();

		if (parameters) {
			parameters.forEach((param) => {
				request.input(param.name, param.type, param.value);
			});
		}
		const result = await request.query(sqlCommands);
		let row = result.recordsets[0] || result.rowsAffected;
		return row;
	} catch (error) {
		throw error;
	}
}

async function executeUpdateAutoCheckinApptStatus(
	apptno,
	ticket_number,
	branchid,
	categoryid
) {
	let sqlquery = `update mbtAppointmentTicketInfo set Active = 0, State = '5', ticketnumber = @ticketnumber , TicketOrigin = 'webticket' where AppointmentNumber = @apptnum and BranchId = @BranchId and CategoryId = @CategoryId`;

	const parameters = [
		{
			name: "ticketnumber",
			type: sql.NVarChar,
			value: ticket_number,
		},
		{ name: "apptnum", type: sql.Int, value: apptno },
		{
			name: "BranchId",
			type: sql.Int,
			value: branchid,
		},
		{
			name: "CategoryId",
			type: sql.NVarChar,
			value: categoryid,
		},
	];

	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const request = dbPool.request();

		parameters.forEach((param) => {
			request.input(param.name, param.type, param.value);
		});

		const result = await request.query(sqlquery);
		let row = result.rowsAffected;
		return row;
	} catch (error) {
		throw error;
	}
}

async function getProductTypes() {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "SELECT * FROM mbtProductType";
		let result = await dbPool.request().query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getProductFamilies(productTypeId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand =
			"SELECT * FROM mbtProductFamily WHERE ProdctTypeId = @ProdctTypeId";
		let result = await dbPool
			.request()
			.input("ProdctTypeId", sql.Int, productTypeId)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getPhoneModels(productFamilyId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "SELECT * FROM mbtPhoneModel WHERE FamilyId = @FamilyId";
		let result = await dbPool
			.request()
			.input("FamilyId", sql.Int, productFamilyId)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}
async function getTimezoneForBranch(branchid) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const sqlCommand =
			"select DISTINCT b.* from eqPortal..eqPortal_Branch as a inner join eqPortal_Timezones as b on a.TimeZone=b.TimeZoneID where a.ID= @branchid AND (a.isDeleted IS NULL or a.isDeleted <> 1)";
		let result = await dbPool
			.request()
			.input("branchid", sql.Int, branchid)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getBranchCurrentDateTime(branchid) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand =
			"SELECT CONVERT(VARCHAR, [dbo].[Fnc_GetBranchDateTime](@branchid), 120) AS BranchDateTime";
		let result = await dbPool
			.request()
			.input("branchid", sql.Int, branchid)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function appointmentVerify(
	email = "",
	phoneNumber = "",
	otherId = "",
	appointmentNumber
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = `
			exec master..openEncrypt
			SELECT ISNULL(BR.ParentID,EB.RegionID) as RegionID, AT.AppointmentNumber			
			FROM eqreport..AppointmentRecords AR
			INNER JOIN eqreport..mbtAppointmentTicketInfo AT 
			ON AT.AppointmentNumber = AR.AppointmentNumber
			INNER JOIN eqPortal..eqportal_branch EB ON EB.ID = AT.BranchId
			LEFT JOIN eqreport..[vu_BranchRegion] BR ON BR.branchid = at.branchid
			${
				appointmentNumber
					? "WHERE CONVERT(VARCHAR, AT.AppointmentNumber) = @appointmentNumber"
					: ""
			}
			AND AT.ACTIVE = 1 
			AND (AT.State = 1 OR AT.State = 3) 
			AND (AR.Email = @email OR AR.PhoneNumber = @phoneNumber OR AR.OtherId = @otherId)
			ORDER BY AT._id DESC
			exec master..closeEncrypt
		`;
		let result = await dbPool
			.request()
			.input("appointmentNumber", sql.NVarChar, appointmentNumber)
			.input("email", sql.NVarChar, email)
			.input("phoneNumber", sql.NVarChar, phoneNumber)
			.input("otherId", sql.NVarChar, otherId)
			.query(sqlCommand);

		if (result.recordset.length > 0) {
			return result.recordset || [];
		}
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

// async function saveCustomerDesiredAppointments(parameters) {
// 	let parameters = [];
// 	let sqlCommands = "mbtSP_SaveCustomerDesiredAppointments";

// 	try {
// 		const dbPool = await getDBConnection(DB_EQ_REPORT);
// 		const request = dbPool.request();

// 		if (parameters) {
// 			parameters.forEach((param) => {
// 				request.input(param.name, param.type, param.value);
// 			});
// 		}
// 		const result = await request.query(sqlCommands);
// 		let row = result.recordsets[0] || result.rowsAffected;
// 		return row;
// 	} catch (error) {
// 		throw error;
// 	}
// }

async function getBranchEvolutionData(branchid, from, to, type, category) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const result = await dbPool
			.request()
			.input("id", sql.VarChar, `${branchid + "|"}`)
			.input("type", sql.VarChar, type)
			.input("from", sql.VarChar, from)
			.input("to", sql.VarChar, to)
			.input("category", sql.VarChar, category)
			.execute("cd_getBranchPerformance");

		return result.recordsets[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getBranchTicketInfo(branchid, from, to, type, category) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const result = await dbPool
			.request()
			.input("id", sql.VarChar, `${branchid + "|"}`)
			.input("type", sql.VarChar, type)
			.input("from", sql.VarChar, from)
			.input("to", sql.VarChar, to)
			.input("category", sql.VarChar, category)
			.execute("cd_getBranchTicketInfo");

		return result.recordsets[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function ticketTrackingSummary(
	branchid,
	from,
	to,
	type,
	category,
	ticketnumber,
	ticketstatus,
	userid,
	lang
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const result = await dbPool
			.request()
			.input("id", sql.VarChar, branchid.toString())
			.input("type", sql.VarChar, type)
			.input("from", sql.VarChar, from)
			.input("to", sql.VarChar, to)
			.input("category", sql.VarChar, category)
			.input("ticketnumber", sql.VarChar, ticketnumber)
			.input("ticketstatus", sql.VarChar, ticketstatus)
			.input("userid", sql.VarChar, userid)
			.input("language", sql.VarChar, lang)
			.execute("cd_rptTicketTrackingTicketTrackingSummary");

		return result.recordsets[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}
async function getCategoryTranslationFromCategoryTitle(
	categoryID,
	branchid,
	lang = "en"
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const result = await dbPool
			.request()
			.input("branchid", sql.Int, branchid)
			.input("lang", sql.VarChar, lang)
			.input("categorySQN", sql.VarChar, categoryID)
			.query(
				`SELECT 
					A.*,					
					ISNULL( 
						STUFF((
							SELECT 
								'|' + SUBSTRING(LOWER(B2.LanguageName), CHARINDEX('@', B2.LanguageName) + 1, 2)
								+ ':' + B2.Value
							FROM eqportal..eQPortal_StaticTranslation B2
							WHERE REPLACE(A.LQN, ' ', '') = B2.[key]
							FOR XML PATH(''), TYPE
						).value('.', 'NVARCHAR(MAX)'), 1, 1, ''),
						''
					) + '|'+ 'en' + ':'+  A.LQN  AS CategoryTranslations	 
				FROM 
				eqreport..vu_mbtCategories A
				where A.SQN = @categorySQN and BranchId = @branchid`
			);
		return result.recordsets[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}
async function getBranchTranslationFromBranchTitle(branchid, lang = "en") {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const result = await dbPool
			.request()
			.input("branchid", sql.Int, branchid)
			.input("lang", sql.VarChar, lang)
			.query(
				`SELECT 
					A.*,					
					ISNULL( 
						STUFF((
							SELECT 
								'|' + SUBSTRING(LOWER(B2.LanguageName), CHARINDEX('@', B2.LanguageName) + 1, 2)
								+ ':' + B2.Value
							FROM eqportal..eQPortal_StaticTranslation B2
							WHERE REPLACE(A.Name, ' ', '') = B2.[key]
							FOR XML PATH(''), TYPE
						).value('.', 'NVARCHAR(MAX)'), 1, 1, ''),
						''
					) + '|'+ 'en' + ':'+  A.Name  AS branchTranslations
				FROM 
				eqreport..vu_mbtBranches A
				where ID = @branchid`
			);
		return result.recordsets[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getBranchCode(branchID) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);

	try {
		const sqlCommand = `SELECT [BranchCode] FROM [eqPortal].[dbo].[eqportal_branch] WHERE [ID] = @branchID AND (isDeleted IS NULL or isDeleted = 0)`;
		let result = await dbPool
			.request()
			.input("branchID", sql.Int, branchID)
			.query(sqlCommand);

		return result;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getLanguageFromCode(targetLanguage) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);

	try {
		const sqlCommand = `
			SELECT LanguageName, Code
			FROM [eqPortal].[dbo].[eqportal_language]
			WHERE Active = 1 AND LOWER(Code) = LOWER(@targetLanguage)
		`;
		let result = await dbPool
			.request()
			.input("targetLanguage", sql.NVarChar, targetLanguage)
			.query(sqlCommand);

		if (result.recordset.length > 0) {
			return {
				state: true,
				value: result.recordset[0].Code, // Return Code (e.g. "En", "Sp")
				name: result.recordset[0].LanguageName,
			};
		} else {
			return {
				state: false,
				message: "Language not found or inactive.",
			};
		}
	} catch (error) {
		console.error("Error in getLanguageFromCode: ", error.message);
		throw error;
	}
}

async function getAppointmentData({
	fid,
	firstNameUdf,
	lastNameUdf,
	noOfDaysForPreviousAppointments,
	noOfDaysForFutureAppointments,
}) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		// Prepare the SQL query with parameters
		const query = `
		EXEC mbtSP_GetDataForCalendarAPI 
		  @branchIds = @fid,
		  @firstNameUdf = @firstNameUdf,
		  @lastNameUdf = @lastNameUdf,
		  @noOfDaysForPreviousAppointments = @noOfDaysForPreviousAppointments,
		  @noOfDaysForFutureAppointments = @noOfDaysForFutureAppointments
	  `;

		// Execute the query
		let result = await dbPool
			.request()
			.input("fid", sql.VarChar, fid)
			.input("firstNameUdf", sql.VarChar, firstNameUdf)
			.input("lastNameUdf", sql.VarChar, lastNameUdf)
			.input(
				"noOfDaysForPreviousAppointments",
				sql.Int,
				noOfDaysForPreviousAppointments
			)
			.input(
				"noOfDaysForFutureAppointments",
				sql.Int,
				noOfDaysForFutureAppointments
			)
			.query(query);

		// Return the dataset (assuming it's in recordset format)
		return result.recordsets;
	} catch (error) {
		console.error("Error in getAppointmentData: ", error.message);
		return null;
	}
}

async function getTicketCategories(
	lang,
	clientId,
	branchID,
	prioritylevel = 0
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "mbtSP_WT_GetTicketCategoryList";
		let result = await dbPool
			.request()
			.input("lang", sql.VarChar, lang)
			.input("clientId", sql.Int, clientId)
			.input("branchId", sql.Int, branchID ? parseInt(branchID, 10) : null)
			.input("prioritylevel", sql.Int, parseInt(prioritylevel, 10) || 0)
			.execute(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getCategoryMapping(branchId, applicationId = null) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "mbtSP_GetCategoryMapping";
		let result = await dbPool
			.request()
			.input("BranchId", sql.Int, +branchId)
			.input("ApplicationId", sql.Int, applicationId)
			.execute(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("getCategoryMapping - DB Error:", error.message);
		throw error;
	}
}

async function getTicketSnapShot(branchId, ticketNumber) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "usp_GetTicketData";
		let result = await dbPool
			.request()
			.input("BranchId", sql.Int, +branchId)
			.input("TicketNumber", sql.VarChar, ticketNumber)
			.execute(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getTicketSnapShotWhenCounterNotOpened(branchId, ticketid) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = `		
		SELECT COUNT(ticketid) AS total_tickets FROM PSRTicketDataSimulation a with(nolock) where ticketId <= @ticketid AND callFlag = 0 and CONVERT (DATE, IssueTime) = CONVERT (DATE, (SELECT dbo.[Fnc_GetBranchDateTime](@BranchId))) and branchid = @BranchId
		`;
		let result = await dbPool
			.request()
			.input("BranchId", sql.Int, +branchId)
			.input("ticketid", sql.VarChar, ticketid)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function cancel_mbtAppointmentTicketInfo(value, cancelReasonId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = `
			UPDATE mbtAppointmentTicketInfo
			SET Active = 0,
				[state] = '2'
				${
					cancelReasonId !== null
						? `,
				CancelReasonId = ISNULL((
					SELECT TOP 1 creasonid
					FROM tbl_cancelReasons
					WHERE LOWER(reasontitle) = (
						SELECT TOP 1 LOWER(reasontitle)
						FROM tbl_cancelReasons
						WHERE creasonid = ${cancelReasonId}
					)
					AND LOWER(languagename) = LOWER(mbtAppointmentTicketInfo.Language)
					AND isdeleted = 0
				), ${cancelReasonId})`
						: ""
				}
			OUTPUT INSERTED.CancelReasonId
			WHERE _id = @_id
			  AND [state] IN (1, 3)
			  AND Active = 1;
		`;

		const result = await dbPool
			.request()
			.input("_id", sql.Int, value)
			.query(sqlCommand);

		// If CancelReasonId was provided and updated, return the new one
		if (cancelReasonId !== null) {
			return result.recordset.length > 0
				? result.recordset[0].CancelReasonId
				: null;
		}

		// If no cancelReasonId was provided, just return success/failure like before
		const updatedRows = result.rowsAffected?.[0] || 0;
		return updatedRows > 0 ? true : null;
	} catch (error) {
		console.error("Error:", error.message);
		throw error;
	}
}

async function getTotalIssueAppointments(
	appointmentDate,
	slotId,
	branchId,
	categoryId
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		let sqlCommand = `SELECT total_issue_appointments 
            FROM mbtApointmentDates
            WHERE date_appointment = @appointmentDate 
            AND slotid = @SlotId
			AND branchid = @branchId
			AND SQN = @categoryId`;

		let result = await dbPool
			.request()
			.input("appointmentDate", sql.Date, appointmentDate)
			.input("SlotId", sql.Int, slotId)
			.input("branchId", sql.Int, branchId)
			.input("categoryId", sql.VarChar, categoryId)
			.query(sqlCommand);

		return result.recordset[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function decrementTotalIssueAppointments(
	appointmentDate,
	slotId,
	total_issue_appointments
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		let sqlCommand = `UPDATE mbtApointmentDates
			SET total_issue_appointments = @total_issue_appointments
			WHERE date_appointment = @appointmentDate
			AND slotid = @SlotId`;

		let result = await dbPool
			.request()
			.input("total_issue_appointments", sql.Int, total_issue_appointments)
			.input("appointmentDate", sql.Date, appointmentDate)
			.input("SlotId", sql.Int, slotId)
			.query(sqlCommand);

		return result.recordset || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function updateEqPortalVirtualDashboardStatus(branchId, ticketNumber) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "mbtSP_UpdateEqPortalVirtualDashboardStatus";
		await dbPool.request().execute(sqlCommand);
		return true;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function mattercodeList(clientId, branchId, lang) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const sqlCommand = "mbtsp_WT_GetTranslatedMatterCodes";
		let result = await dbPool
			.request()
			.input("clientId", sql.Int, +clientId)
			.input("branchId", sql.Int, +branchId)
			.input("langCode", sql.VarChar, lang)
			.execute(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function searchCustomerbyType(
	type,
	value,
	clientId,
	regionId,
	exactmatch,
	pageNumber,
	pageSize,
	orderByColumn,
	orderDirection
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "sp_GetCustomersByMultipleType";
		let result = await dbPool
			.request()
			.input("type", sql.VarChar, type)
			.input("value", sql.VarChar, value)
			.input("client_id", sql.Int, clientId)
			.input("region_id", sql.Int, regionId)
			.input("exactMatch", sql.Bit, exactmatch)
			.input("pageNumber", sql.Int, pageNumber)
			.input("pageSize", sql.Int, pageSize)
			.input("orderByColumn", sql.VarChar, orderByColumn)
			.input("orderDirection", sql.VarChar, orderDirection)

			.execute(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}
async function getCustomerList(
	clientId,
	regionId,
	pageNumber,
	pageSize,
	orderByColumn,
	orderDirection
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "sp_GetCustomerListByFilters";
		let result = await dbPool
			.request()
			.input("client_id", sql.Int, clientId)
			.input("region_id", sql.Int, regionId)
			.input("pageNumber", sql.Int, pageNumber)
			.input("pageSize", sql.Int, pageSize)
			.input("orderByColumn", sql.VarChar, orderByColumn)
			.input("orderDirection", sql.VarChar, orderDirection)

			.execute(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function fetchClientRegionData(clientId, branchId, sId) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const sqlQuery = `
            SELECT 
                b.ID AS BranchId,
                b.Name AS BranchName,
                b.RegionID,
                r.Name AS RegionName,
                r.ParentID AS ParentID,
                c.ClientId,
                c.ClientName,
                c.sId
            FROM eqportal_branch b
            LEFT JOIN eqportal_region r ON b.RegionID = r.ID
            LEFT JOIN eqportal_clients c ON b.ClientId = c.ClientId
            WHERE 
                (b.ID = @BranchId) 
                AND (@sId IS NULL OR c.sId = @sId)
                AND (@ClientId IS NULL OR c.ClientId = @ClientId)
				AND (b.isDeleted IS NULL or b.isDeleted <> 1)
        `;

		let result = await dbPool
			.request()
			.input("BranchId", sql.Int, branchId)
			.input("sId", sql.VarChar, sId || null)
			.input("ClientId", sql.Int, clientId || null)
			.query(sqlQuery);

		return result.recordset;
	} catch (error) {
		console.error("Error executing query:", error.message);
		throw error;
	}
}

async function getListOfCustomerIDsFromDB() {
	console.info("Fetching customer IDs from database...");
	try {
		const dbPool = await getDBConnection(DB_EQ_REPORT);
		let result = await dbPool
			.request()
			.query("SELECT customer_id FROM sd_Customers"); // Direct query execution

		return result.recordset.map((row) => row.customer_id);
	} catch (error) {
		console.error(
			"Exception in Getting List of customer_id from DB:",
			error.message
		);
		return [];
	}
}

async function generateUniqueCustomerId() {
	const customerIdPrefix = config.CUSTOMER_ID_PREFIX;
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	let isUnique = false;
	let customerId;

	while (!isUnique) {
		const potentialIds = Array.from(
			{ length: config.CUSTOMER_ID_BATCH_SIZE },
			() => `${customerIdPrefix}${utils.generateRandomNo5()}`
		);

		const query = `
            SELECT customer_id FROM sd_Customers WITH (NOLOCK)
            WHERE customer_id IN (${potentialIds
							.map((_, i) => `@id${i}`)
							.join(",")})
        `;

		let request = dbPool.request();
		potentialIds.forEach((id, i) => request.input(`id${i}`, sql.NVarChar, id));

		const result = await request.query(query);
		const existingIds = new Set(result.recordset.map((row) => row.customer_id));

		customerId = potentialIds.find((id) => !existingIds.has(id));
		if (customerId) isUnique = true;
	}
	return customerId;
}

async function addCustomer(customerTableFields, customer) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	let additionalData = {};
	Object.keys(customer).forEach((key) => {
		const lowerKey = key?.toLowerCase();
		if (!customerTableFields[lowerKey] && lowerKey !== "matchingkeys") {
			additionalData[key] = customer[key];
		}
	});

	let additionalDataString = Object.keys(additionalData).length
		? JSON.stringify(additionalData)
		: "";

	try {
		const sqlCommand = "sp_AddCustomerByClient";
		let request = dbPool.request();

		for (const [column, type] of Object.entries(customerTableFields)) {
			const lowerColumn = column.toLowerCase();
			if (customer[lowerColumn] !== undefined) {
				request.input(lowerColumn, mapSqlType(type), customer[lowerColumn]);
			}
		}

		request.input("AdditionalFields", sql.NVarChar, additionalDataString);

		let result = await request.execute(sqlCommand);
		return result.recordset[0]; // Returns 1 if successful
	} catch (error) {
		console.error("Error adding customer:", error.message);
		throw error;
	}
}

async function updateCustomer(customerTableFields, customer, deviceType = null) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	let additionalData = {};

	Object.keys(customer).forEach((key) => {
		const lowerKey = key?.toLowerCase();
		if (!customerTableFields[lowerKey] && lowerKey !== "matchingkeys") {
			additionalData[key] = customer[key];
		}
	});

	let additionalDataString = Object.keys(additionalData).length
		? JSON.stringify(additionalData)
		: "";

	try {
		const sqlCommand = "sp_UpdateCustomerByClient";
		let request = dbPool.request();

		for (const [column, type] of Object.entries(customerTableFields)) {
			const lowerColumn = column.toLowerCase();
			if (customer[lowerColumn] !== undefined) {
				request.input(lowerColumn, mapSqlType(type), customer[lowerColumn]);
			}
		}

		request.input("AdditionalFields", sql.NVarChar, additionalDataString);

		// Sent device type if available
		if (deviceType) {
			request.input("DeviceType", sql.INT, deviceType);
		}

		let result = await request.execute(sqlCommand);
		return result.recordset[0]; // Returns 1 if successful
	} catch (error) {
		console.error("Error updating customer:", error.message);
		throw error;
	}
}

async function checkCustomerExists(customerTableFields, customer, type) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	let orConditions = [];
	let queryParams = {
		client_id: customer?.client_id,
		region_id: customer?.region_id,
	};

	if (type !== "add" && customer?.id) {
		queryParams.id = customer.id;
	}

	if (customer?.customer_id) {
		queryParams.customer_id = customer.customer_id;
	}

	const matchingKeys = customer?.matchingkeys || [];
	if (matchingKeys.length) {
		matchingKeys.forEach((key) => {
			const lowerKey = key.toLowerCase();
			if (customerTableFields[lowerKey]) {
				orConditions.push(`${lowerKey} = @${lowerKey}`);
				queryParams[lowerKey] = customer[lowerKey] || null;
			} else {
				orConditions.push(
					`((AdditionalFields) = 1 AND JSON_VALUE(AdditionalFields, '$.${lowerKey}') = @${lowerKey})`
				);
				queryParams[lowerKey] = customer[lowerKey] || null;
			}
		});
	}

	if (orConditions.length === 0) {
		return { exists: false, matchedConditions: {} }; // No matching conditions to check
	}

	let whereClause = `(${orConditions.join(" OR ")})`;

	if (customer?.isactive != null) {
		whereClause += ` AND isactive = @isactive`;
		queryParams.isactive = customer.isactive;
	}

	if (customer?.client_id != null) {
		whereClause += ` AND client_id = @client_id`;
		queryParams.client_id = customer.client_id;
	}

	if (customer?.region_id != null) {
		whereClause += ` AND region_id = @region_id`;
		queryParams.region_id = customer.region_id;
	}

	if (type !== "add") {
		if (customer?.id) whereClause += ` AND id <> @id`;
		else if (customer?.customer_id)
			whereClause += ` AND customer_id <> @customer_id`;
	}

	const sqlQuery = `SELECT TOP 1 1 FROM sd_Customers WHERE ${whereClause}`;

	let request = dbPool.request();
	for (let param in queryParams) {
		let lowerParam = param.toLowerCase();
		request.input(
			lowerParam,
			mapSqlType(customerTableFields[lowerParam] || "nvarchar"),
			queryParams[param]
		);
	}

	let data = await request.query(sqlQuery);

	return {
		exists: data.recordset.length > 0,
		matchedConditions: data.recordset.length ? queryParams : {},
	};
}

async function getCustomerTableColumns() {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	const columnsQuery = `
        SELECT COLUMN_NAME, DATA_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'sd_customers'
    `;

	try {
		const columnsResult = await dbPool.request().query(columnsQuery);
		let columnData = {};

		columnsResult.recordset.forEach((row) => {
			columnData[row.COLUMN_NAME.toLowerCase()] = row.DATA_TYPE.toLowerCase();
		});

		return columnData; // Returns an object with column name as key and data type as value
	} catch (error) {
		console.error("Error fetching column data:", error.message);
		throw error;
	}
}

async function getCustomerById(id, customerId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		let whereClause = [];
		let request = dbPool.request();

		if (id) {
			whereClause.push("id = @id");
			request.input("id", sql.Int, id);
		}
		if (customerId) {
			whereClause.push("customer_id = @customerId");
			request.input("customerId", sql.NVarChar, customerId);
		}

		if (whereClause.length === 0) {
			return null; // No valid identifier provided
		}

		const sqlQuery = `
            SELECT * FROM sd_Customers WITH (NOLOCK)
            WHERE ${whereClause.join(" OR ")}
        `;

		let result = await request.query(sqlQuery);

		if (result.recordset.length) {
			return Object.fromEntries(
				Object.entries(result.recordset[0]).map(([key, value]) => [
					key.toLowerCase(),
					value,
				])
			);
		}

		return null; // Return null if no customer is found
	} catch (error) {
		console.error("Error fetching customer by ID:", error.message);
		throw error;
	}
}

async function getCustomersByMultipleType(
	clientId,
	regionId,
	type,
	value,
	exactMatch,
	pageNumber,
	pageSize,
	orderByColumn,
	orderDirection,
	conditionType,
	simpleLookup = false
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		if (simpleLookup) {
            const sqlParams = dbPool.request();

            let sqlQuery = `
                SELECT id, customer_id, FirstName, LastName, DOB, Email, isActive, region_id, client_id
                FROM sd_Customers
                WITH (NOLOCK)
                WHERE 1 = 1 
            `;

            // Simple filters only (indexed columns)
            if (clientId) {
                sqlQuery += " AND client_id = @client_id";
                sqlParams.input("client_id", sql.Int, clientId);
            }

            if (regionId) {
                sqlQuery += " AND region_id = @region_id";
                sqlParams.input("region_id", sql.Int, regionId);
            }

            // Simple customer lookup
            if (type && value) {
                sqlQuery +=  ` AND ${type} = @value`;
                sqlParams.input("value", sql.NVarChar, value);
            }

            const result = await sqlParams.query(sqlQuery);
            
            return result.recordset;
        }
		const validOrderDirections = ["ASC", "DESC"];
		const finalOrderDirection = validOrderDirections.includes(
			orderDirection.toUpperCase()
		)
			? orderDirection.toUpperCase()
			: "ASC";

		// Fetch table columns & data types
		const tableColumnsQuery = `
            SELECT COLUMN_NAME, DATA_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS
			WITH (NOLOCK) 
            WHERE TABLE_NAME = 'sd_Customers';
        `;
		const tableColumnsResult = await dbPool.request().query(tableColumnsQuery);

		const tableColumns = new Map(
			tableColumnsResult.recordset.map((row) => [
				row.COLUMN_NAME,
				row.DATA_TYPE,
			])
		);

		// Fetch JSON keys
		const jsonKeysQuery = `
            SELECT DISTINCT AdditionalFields 
            FROM sd_Customers
			WITH (NOLOCK)
            WHERE ISJSON(AdditionalFields) = 1 AND AdditionalFields IS NOT NULL;
        `;
		const jsonResults = await dbPool.request().query(jsonKeysQuery);

		const jsonKeys = new Set();
		jsonResults.recordset.forEach((row) => {
			try {
				const jsonObj = JSON.parse(row.AdditionalFields);
				Object.keys(jsonObj).forEach((key) => jsonKeys.add(key));
			} catch (err) {
				console.warn("Invalid JSON found, skipping...");
			}
		});

		// **Helper function to normalize values (remove +, -, (), spaces, quotes)**
		function normalizeValue(val) {
			return val.replace(/[+\-()\s"]/g, ""); // Remove +, -, (), spaces, and quotes
		}

		// **Handle type-value mapping correctly**
		const typeValuePairs = type.split(",").map((t, index) => ({
			type: t.trim(),
			values:
				value
					.split(",")
					[index]?.split("|")
					.map((v) => normalizeValue(v.trim())) || [],
		}));

		if (!tableColumns.has(orderByColumn) && !jsonKeys.has(orderByColumn)) {
			throw new Error(`Invalid order column: ${orderByColumn} does not exist.`);
		}

		// Build SQL Query with JSON validation**
		let sqlQuery = "SELECT * FROM sd_Customers WHERE 1=1";
		let sqlParams = dbPool.request();
		let paramIndex = 1;

		// Handle type-value pairs**
		for (const { type, values } of typeValuePairs) {
			if (!tableColumns.has(type) && !jsonKeys.has(type)) {
				throw new Error(`Invalid search column: ${type} does not exist.`);
			}

			const conditionParts = values.map((val) => {
				const paramName = `param_${paramIndex++}`;

				const sqlType = tableColumns.has(type)
					? mapSqlType(tableColumns.get(type))
					: sql.NVarChar;

				sqlParams.input(paramName, sqlType, exactMatch ? val : `%${val}%`);
				// **Use REPLACE for all searchable columns**
				const cleanColumn = `
				REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(${type}, '+', ''), '-', ''), '(', ''), ')', ''), ' ', ''), '"', '')`;
				// JSON check before using JSON_VALUE**
				return tableColumns.has(type)
					? exactMatch
						? `${cleanColumn} = @${paramName}`
						: `${cleanColumn} LIKE @${paramName}`
					: exactMatch
					? `(ISJSON(AdditionalFields) = 1 AND 
							REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(JSON_VALUE(NULLIF(AdditionalFields, ''), '$.${type}'), '+', ''), '-', ''), '(', ''), ')', ''), ' ', ''), '"', '') 
							= @${paramName})`
					: `(ISJSON(AdditionalFields) = 1 AND 
							REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(JSON_VALUE(NULLIF(AdditionalFields, ''), '$.${type}'), '+', ''), '-', ''), '(', ''), ')', ''), ' ', ''), '"', '') 
							LIKE @${paramName})`;
			});

			sqlQuery += ` ${conditionType} (${conditionParts.join(" OR ")})`;
		}

		// Additional filters**
		if (clientId) {
			sqlQuery += " AND client_id = @client_id";
			sqlParams.input("client_id", sql.Int, clientId);
		}

		if (regionId) {
			sqlQuery += " AND region_id = @region_id";
			sqlParams.input("region_id", sql.Int, regionId);
		}

		// Ordering with JSON validation**
		sqlQuery += tableColumns.has(orderByColumn)
			? ` ORDER BY ${orderByColumn} ${finalOrderDirection}`
			: ` ORDER BY CASE WHEN ISJSON(AdditionalFields) = 1 THEN JSON_VALUE(NULLIF(AdditionalFields, ''), '$.${orderByColumn}') ELSE NULL END ${finalOrderDirection}`;

		// Pagination**
		if (pageSize > 0) {
			sqlQuery +=
				" OFFSET (@pageNumber - 1) * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY";
			sqlParams.input("pageNumber", sql.Int, pageNumber);
			sqlParams.input("pageSize", sql.Int, pageSize);
		}

		// Execute the query**
		const result = await sqlParams.query(sqlQuery);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error in getCustomersByMultipleType:", error.message);
		throw error;
	}
}

async function insertShareInfoAlertSanDiago(customerObj, sendSms, sendEmail) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "mbtSP_insertShareInfoAlertSanDiago";
		await dbPool
			.request()
			.input("emailFrom", sql.VarChar, config.emailFrom)
			.input("customer_id", sql.VarChar, customerObj.customer_id)
			.input("FirstName", sql.VarChar, customerObj.firstname)
			.input("LastName", sql.VarChar, customerObj.lastname)
			.input("DOB", sql.VarChar, customerObj.dob)
			.input("Email", sql.VarChar, customerObj.email)
			.input("ContactNo", sql.VarChar, customerObj.contactno)
			.input("Record_ID", sql.VarChar, customerObj.record_id)
			.input("send_sms", sql.VarChar, sendSms ? "True" : "False")
			.input("send_email", sql.VarChar, sendEmail ? "True" : "False")
			.input("Password", sql.VarChar, customerObj.password)
			.execute(sqlCommand);
	} catch (error) {
		console.error("Error in insertShareInfoAlertSanDiago: ", error.message);
		throw error;
	}
}

async function checkQuotaBasedTicketIssueRestrictions(branchId, categorySQN) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "SP_WT_ValidateTicketIssuance";
		const result = await dbPool
			.request()
			.input("branchId", sql.Int, parseInt(branchId, 10))
			.input("categorySQN", sql.VarChar, categorySQN)
			.execute(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error(
			"Error in sp_wt_checkticketissuerestrictions: ",
			error.message
		);
		throw error;
	}
}

async function getTicketPositionAndEst(branchId, ticketNo) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = `select positionInQueue, estWaitTime from psrticketdatasimulation where ticketNumber = @ticketNo and branchId = @branchid`;
		const result = await dbPool
			.request()
			.input("branchid", sql.Int, parseInt(branchId, 10))
			.input("ticketNo", sql.VarChar, ticketNo)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error in getTicketPositionAndEst: ", error.message);
		throw error;
	}
}

async function getTicketPositionAndEst(branchId, ticketNo) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = `select positionInQueue, estWaitTime from psrticketdatasimulation where ticketNumber = @ticketNo and branchId = @branchid`;
		const result = await dbPool
			.request()
			.input("branchid", sql.Int, parseInt(branchId, 10))
			.input("ticketNo", sql.VarChar, ticketNo)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error in getTicketPositionAndEst: ", error.message);
		throw error;
	}
}

async function getTicketDetailsFromDB(branchId, ticketID, ticketNumberF1) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = `SELECT TOP 1 TicketId,TicketNumber,CategoryId,IssueTime,EstWaitTime,EventLog FROM eqreport..PSRTicket WITH(NOLOCK)
				WHERE StateId = 3 AND Cast(IssueTime as Date) = (select cast(dbo.[Fnc_CalculatedDateTimeOfBranch](@branchid) as date)) and BranchID = @branchid and ActualTicketId = @ticketID and TicketNumber = @TicketNumber order by IssueTime desc`;
		const result = await dbPool
			.request()
			.input("branchid", sql.Int, parseInt(branchId, 10))
			.input("ticketID", sql.VarChar, ticketID)
			.input("TicketNumber", sql.VarChar, ticketNumberF1)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error in getTicketDetailsFromDB: ", error.message);
		throw error;
	}
}

async function getTicketDetailsFromTicketNumber(branchId, ticketNumber) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = `SELECT TOP 1 * FROM eqreport..PSRTicket WITH(NOLOCK)
				WHERE Cast(IssueTime as Date) = (select cast(dbo.[Fnc_CalculatedDateTimeOfBranch](@branchid) as date)) AND BranchID = @branchid AND TicketNumber = @ticketNumber ORDER BY TicketId desc`;
		const result = await dbPool
			.request()
			.input("branchid", sql.Int, parseInt(branchId, 10))
			.input("ticketNumber", sql.VarChar, ticketNumber)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error in getTicketDetailsFromTicketNumber: ", error.message);
		throw error;
	}
}

async function getBranchWiseTicketData(branchCode, userName, stateIds, branchIds, categoryIds, currentDateOnly) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const result = await dbPool
			.request()
			.input("BranchCode", sql.VarChar, branchCode || null)
			.input("UserName", sql.VarChar, userName || null)
			.input("StateIds", sql.VarChar, stateIds || null)
			.input("BranchIds", sql.VarChar, branchIds || null)
			.input("CategoryIds", sql.VarChar, categoryIds || null)
			.input("CurrentDateOnly", sql.Bit, currentDateOnly || 0)
			.execute("mbtSP_GetBranchWiseTicketData");

		return result.recordset;
	} catch (error) {
		console.error("Error in getBranchWiseTicketData:", error.message);
		throw error;
	}
}

async function updateReissueStatus(branchId, serverticketid) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = `UPDATE eqreport..PSRTicket
		SET isSent = 0
		WHERE BranchID = @branchid AND StateId = 10 AND TicketId = @serverticketid`;
		const result = await dbPool
			.request()
			.input("branchid", sql.Int, parseInt(branchId, 10))
			.input("serverticketid", sql.VarChar, serverticketid)
			.query(sqlCommand);
		return result.rowsAffected[0];
	} catch (error) {
		console.error("Error in updateReissueStatus: ", error.message);
		throw error;
	}
}

async function ticketissueAlertHandler(
	ticketNumber,
	branchId,
	categoryName,
	requestData,
	lang = "EN",
	ticketinfoURL = "",
	issueTime,
	TicketID
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "WT_PSR_TicketIssueAlert";
		const result = await dbPool
			.request()
			.input("TicketNumber", sql.VarChar, ticketNumber)
			.input("BranchId", sql.Int, parseInt(branchId, 10))
			.input("CategoryName", sql.VarChar, categoryName)
			.input("Language", sql.VarChar, lang)
			.input("UDF1", sql.VarChar, (requestData[0] ?? "").split("|").join(" "))
			.input("UDF2", sql.VarChar, requestData[1] || "")
			.input("UDF3", sql.VarChar, requestData[2] || "")
			.input("UDF4", sql.VarChar, requestData[3] || "")
			.input("UDF5", sql.VarChar, requestData[4] || "")
			.input("UDF6", sql.VarChar, requestData[5] || "")
			.input("UDF7", sql.VarChar, requestData[6] || "")
			.input("UDF8", sql.VarChar, requestData[7] || "")
			.input("UDF9", sql.VarChar, requestData[8] || "")
			.input("UDF10", sql.VarChar, requestData[9] || "")
			.input("TicketInfoURL", sql.VarChar, ticketinfoURL || "")
			.input("TicketIssueTime", sql.DateTime, issueTime || "")
			.input("ActualTicketId", sql.Int, TicketID || null)
			.execute(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error in Ticket Issue Alert: ", error.message);
		throw error;
	}
}

async function addUserSession(sessionData) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	let request = dbPool.request();

	try {
		request
			.input("UserId", sql.NVarChar, sessionData.UserId)
			.input("ExpiryAt", sql.DateTime, sessionData.ExpiryAt);

		const sqlCommand = `
			INSERT INTO UserSessions (UserId, ExpiryAt)
			OUTPUT INSERTED.SessionId, INSERTED.UserId, INSERTED.ExpiryAt
			VALUES (@UserId, @ExpiryAt)`;

		let result = await request.query(sqlCommand);
		return result.recordset.length > 0 ? result.recordset[0] : null;
	} catch (error) {
		console.error("Error adding user session:", error.message);
		throw error;
	}
}

async function lockOrReleaseSlot(
	branchId,
	SQN,
	slotId,
	dateAppointment,
	actionType,
	language,
	startTime,
	endTime
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const result = await dbPool
			.request()
			.input("BranchId", sql.Int, parseInt(branchId, 10))
			.input("SQN", sql.VarChar, SQN)
			.input("SlotId", sql.Int, parseInt(slotId, 10))
			.input("Date_Appointment", sql.Date, dateAppointment)
			.input("ActionType", sql.VarChar, actionType.toUpperCase())
			.input("language", sql.VarChar, language)
			.input("StartTime", sql.VarChar, startTime)
			.input("endTime", sql.VarChar, endTime)
			.execute("mbtSP_LockOrReleaseSlot");

		return result.returnValue;
	} catch (error) {
		console.error("Error calling mbtSP_LockOrReleaseSlot:", error.message);
		throw error;
	}
}

async function getCustomerAppointmentsData(
	appointmentNumber,
	lookupValue,
	branchId,
	udfLocation,
	appointemntDate,
	appointmentStates,
	maxAppointmentCount,
	skipBranchCheck = false,
	lang,
	applicationId,
	IsLegacyAppointmentRecord
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	console.log(
		"getCustomerAppointmentsData Params: ",
		appointmentNumber,
		lookupValue,
		branchId,
		udfLocation,
		appointemntDate,
		appointmentStates,
		maxAppointmentCount,
		skipBranchCheck,
		applicationId
	);

	try {
		const query = `
			EXEC ${IsLegacyAppointmentRecord ? "mbtSP_GetCustomerAppointmentsData_Legacy" : "mbtSP_GetCustomerAppointmentsData"}
				@AppointmentNumber = @appointmentNumber,
				@LookupValue = @lookupValue, 
				@BranchId = @branchId, 
				@UdfLocation = @udfLocation,
				@AppointmentDate = @appointemntDate,
				@AppointmentStates = @appointmentStates,
				@MaxAppointmentCount = @maxAppointmentCount,
				@SkipBranchCheck = @skipBranchCheck,
				@Lang = @lang,
				@ApplicationId = @applicationId
		`;

		const result = await dbPool
			.request()
			.input("appointmentNumber", sql.BigInt, appointmentNumber)
			.input("lookupValue", sql.NVarChar, lookupValue)
			.input("branchId", sql.Int, branchId)
			.input("udfLocation", sql.NVarChar, udfLocation)
			.input("appointemntDate", sql.Date, appointemntDate)
			.input("appointmentStates", sql.NVarChar, appointmentStates)
			.input("maxAppointmentCount", sql.Int, maxAppointmentCount)
			.input("skipBranchCheck", sql.Bit, skipBranchCheck)
			.input("lang", sql.NVarChar, lang)
			.input("ApplicationId", sql.Int, applicationId)
			.query(query);

		return result.recordsets[0] || [];
	} catch (error) {
		console.error("Error in getCustomerAppointmentsData: ", error.message);
		throw error;
	}
}

async function getAllDaysSlotsOfBranchWithQuota(
	branchId,
	categoryId,
	dateOfAppointment,
	daysAhead,
	lang = "en"
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `
			EXEC mbtSP_GetAllDaysSlotsOfBranchWithQouta 
				@BranchId = @branchId, 
				@CategoryId = @categoryId, 
				@dateOfAppointment = @dateOfAppointment,
				@daysAhead = @daysAhead,
				@HOUR_RANGE = @hourRange,
				@lang = @lang
		`;

		const result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input("categoryId", sql.NVarChar, categoryId)
			.input("dateOfAppointment", sql.Date, dateOfAppointment)
			.input("daysAhead", sql.Int, daysAhead)
			.input("hourRange", sql.Int, null)
			.input("lang", sql.VarChar, lang)
			.query(query);

		return result.recordsets[0];
	} catch (error) {
		console.error("Error in getAllDaysSlotsOfBranchWithQuota:", error.message);
		throw error;
	}
}

async function getBranchTicketServedData(
	branchId,
	ticketNumber = "",
	id = "",
	callingController = ""
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "usp_TrashList";
		const result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input("ticketNumber", sql.VarChar, ticketNumber)
			.execute(sqlCommand);

		if (result.recordset && result.recordset.length > 0) {
			const objLst = [];

			for (const row of result.recordset) {
				if (row.ticketnumber) {
					objLst.push({
						branch_name: row.branchname?.toString() || "",
						counter_title: row.CounterTitle?.toString() || "",
						ticket_number: row.ticketnumber?.toString() || "",
						operator_name: row.tellername?.toString() || "",
						category_title: row.Service?.toString() || "",
						customer_name: row.ClientName?.toString() || "",
						customer_id: row.ID?.toString() || "",
						status: row.Status?.toString() || "",
						service_time: row.ServiceTime?.toString() || "",
						issue_time: row.IssueTime?.toString() || "",
						call_time: row.calltime?.toString() || "",
						end_time: row.endtime?.toString() || "",
						notes: row.Notes?.toString() || "",
						order: row.order?.toString() || "",
						counter_no: row.CounterNo?.toString() || "",
						type: row.Type?.toString() || "",
						transaction_type: row.TransactionType?.toString() || "",
						record_id: row.RecordId?.toString() || "",
						noshow_duration_time: row.NoshowDurationTime?.toString() || "",
						noshow_time: row.noshowtime?.toString() || "",
						noshow_count: row.noshowcount?.toString() || "",
						contact_no: row.contactNo?.toString() || "",
						SQN: row.SQN?.toString() || "",
					});
				} else {
					utils.log(
						"error",
						`${callingController} ${id} Error in getBranchTicketServedData: Branch is not configured.`
					);
					return null;
				}
			}

			return { branchserveticket: objLst };
		} else {
			utils.log(
				"error",
				`${callingController} ${id} Error in getBranchTicketServedData: Branch does not exist.`
			);
			return null;
		}
	} catch (error) {
		utils.log(
			"error",
			`${callingController} ${id} Error in getBranchTicketServedData: ${error.message}`
		);
		throw error;
	}
}

async function getCustomerTodateHistory(
	customer_id,
	clientid,
	regionid,
	branchid
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		utils.log("info", "Executing sp_getCustomerTodayHistory");

		const result = await dbPool
			.request()
			.input("customer_id", sql.VarChar, customer_id)
			.input("client_id", sql.Int, clientid)
			.input("region_id", sql.Int, regionid)
			.input("branchID", sql.Int, branchid)
			.execute("sp_getCustomerTodayHistory");

		if (result.recordset && result.recordset.length > 0) {
			return result.recordset.map((row) => ({
				customer_id: row.customer_id?.toString() || "",
				ServiceOption: row.ServiceOption?.toString() || "",
				ServiceQueues: row.ServiceQueues?.toString() || "",
				ServiceType: row.ServiceType?.toString() || "",
				TicketNumber: row.TicketNumber?.toString() || "",
				VisitPurpose: row.VisitPurpose?.toString() || "",
				Visit_Date: row.VisitDate?.toString() || "",
				Record_ID: row.Record_ID?.toString() || "",
				Notes: row.Notes?.toString() || "",
				CompletePayloads: row.CompletePayloads?.toString() || "",
				branchId: row.BranchId?.toString() || "",
				actualTicketId: row.ActualTicketId?.toString() || "",
				Status: row.Status?.toString() || "",
				StatusDescription: row.StatusDescription?.toString() || "",
				// Include additional fields if they exist in the result
				...(row.AdditionalFields
					? parseAdditionalFields(row.AdditionalFields)
					: {}),
			}));
		}
		return [];
	} catch (error) {
		utils.log("error", `Error in getCustomerTodateHistory: ${error.message}`);
		throw error;
	}
}

async function getCustomerHistory(customerId, clientid, regionid) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		utils.log("info", "Executing sp_getCustomerHistory");

		const result = await dbPool
			.request()
			.input("customer_id", sql.VarChar, customerId)
			.input("client_id", sql.Int, clientid)
			.input("region_id", sql.Int, regionid)
			.execute("sp_getCompleteCustomerHistory");

		if (result.recordset && result.recordset.length > 0) {
			return result.recordset.map((row) => ({
				customer_id: row.customer_id?.toString() || "",
				SQN: row.SQN?.toString() || "",
				ServiceOption: row.ServiceOption?.toString() || "",
				ServiceQueues: row.ServiceQueues?.toString() || "",
				ServiceType: row.ServiceType?.toString() || "",
				TicketNumber: row.TicketNumber?.toString() || "",
				VisitPurpose: row.VisitPurpose?.toString() || "",
				Visit_Date: row.VisitDate?.toString() || "",
				Record_ID: row.Record_ID?.toString() || "",
				Notes: row.Notes?.toString() || "",
				CompletePayloads: row.CompletePayloads?.toString() || "",
				Status: row.Status?.toString() || "",
				StatusDescription: row.StatusDescription?.toString() || "",
				// Include additional fields if they exist in the result
				...(row.AdditionalFields
					? parseAdditionalFields(row.AdditionalFields)
					: {}),
			}));
		}
		return [];
	} catch (error) {
		utils.log("error", `Error in getCustomerHistory: ${error.message}`);
		throw error;
	}
}

async function getUser(username, password, moduleName) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const query = `SELECT eU.ID as user_id,eU.LoginID as user_name,eU.RoleId as role_id,eMD.name as module_name 
        FROM eQPortal_User as eU 
        JOIN eQPortal_Role as eR ON eU.RoleID = eR.ID
		JOIN eQPortal_RolePages as eRP ON eR.ID = eRP.RoleID
		JOIN eQPortal_ModuleDetail as eMD ON eMD.ID = eRP.ModuleID 
		JOIN eQPortal_Module as eM ON  eM.ID = eMD.ModuleID
        WHERE eU.Active = 1 AND eU.LoginID = @username AND eU.password = @password and eMD.Name=@moduleName and eM.Active=1 and eRP.Active=1`;
		let result = await dbPool
			.request()
			.input("username", sql.NVarChar, username)
			.input("password", sql.NVarChar, password)
			.input("moduleName", sql.NVarChar, moduleName.trim())
			.query(query);
		return result.recordsets[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

// Helper function to parse additional fields
function parseAdditionalFields(additionalFields) {
	try {
		return JSON.parse(additionalFields);
	} catch (error) {
		utils.log("error", `Failed to parse AdditionalFields: ${error.message}`);
		return {};
	}
}

function extractMobileNumber(payloads, index) {
	const cleanedMobileRegex = /^\+?\d{8,15}$/;

	if (!Array.isArray(payloads) || index < 0 || index >= payloads.length) {
		return false;
	}

	const item = payloads[index - 1];
	if (!item) return false;

	const cleaned = item.replace(/[\s\-()]/g, "");

	return cleanedMobileRegex.test(cleaned) ? cleaned : false;
}

function extractEmailAddress(payloads, index) {
	if (!Array.isArray(payloads) || index < 0 || index >= payloads.length) {
		return false;
	}

	const item = payloads[index - 1];
	if (!item) return null;

	return item ? item : false;
}

async function isTicketAlreadyIssue_validate(payloads, branchId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	const mobileNumberUDF = config.TICKET_RESTRICT_ON_UNIQUE_PAYLOAD.PHONE_NO_UDF;
	const emailUDF = config.TICKET_RESTRICT_ON_UNIQUE_PAYLOAD.EMAIL_UDF;
	const mobileNumberIndex = mobileNumberUDF
		? parseInt(mobileNumberUDF.substring(3), 10)
		: 1;
	const emailIndex = emailUDF ? parseInt(emailUDF.substring(3), 10) : 2;

	const mobileNumber = extractMobileNumber(payloads, mobileNumberIndex);
	const emailAddress = extractEmailAddress(payloads, emailIndex);

	if (!mobileNumber && !emailAddress) {
		return { Result: "1" }; // No info, assume ticket doesn't exist
	}

	try {
		const request = dbPool.request();
		let conditions = [];

		if (mobileNumber) {
			const cleanMobileExpr = `REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LTRIM(RTRIM(A.${mobileNumberUDF})), '+', ''), '(', ''), ')', ''), '-', ''), ' ', '')`;
			conditions.push(`${cleanMobileExpr} = @cleanMobile`);
			request.input(
				"cleanMobile",
				sql.VarChar,
				mobileNumber.replace(/[\s+\-()]/g, "")
			);
		}

		if (emailAddress) {
			const cleanEmailExpr = `LTRIM(RTRIM(A.${emailUDF}))`;
			conditions.push(`${cleanEmailExpr} = @cleanEmail`);
			request.input("cleanEmail", sql.VarChar, emailAddress.trim());
		}

		const whereCondition =
			conditions.length > 0 ? `(${conditions.join(" OR ")})` : "1=0";

		const query = `
			EXEC master..openEncrypt;

			SELECT 
				CASE 
					WHEN EXISTS (
						SELECT 1
						FROM eqreport..psrpayload A WITH(NOLOCK)
						INNER JOIN eqreport..psrticket B WITH(NOLOCK) ON A.ticketid = B.ticketid 
						WHERE 
							${whereCondition}
							AND B.StateId IN (3)
							AND CAST(B.IssueTime AS DATE) = (
								SELECT CAST(dbo.[Fnc_CalculatedDateTimeOfBranch](@branchId) AS DATE)
							)
							AND B.BranchID = @branchId
					)
					THEN '0'
					ELSE '1'
				END AS Result;

			EXEC master..closeEncrypt;
		`;

		request.input("branchId", sql.Int, branchId);
		const result = await request.query(query);
		return result.recordset[0];
	} catch (error) {
		console.error("Error in Check Already Exist Ticket or Not:", error.message);
		throw error;
	}
}

async function importAppointmentData({
	UserId,
	AppointmentNumber,
	AppointmentDate,
	BranchId,
	StartTime,
	EndTime,
	CategoryId,
	Language,
	UDFs = [],
}) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		utils.log("info", "Executing mbtSP_ImportAppointmentData");

		const request = dbPool
			.request()
			.input("UserId", sql.VarChar(50), UserId)
			.input("AppointmentNumber", sql.Int, AppointmentNumber)
			.input("AppointmentDate", sql.Date, AppointmentDate)
			.input("BranchId", sql.Int, BranchId)
			.input("StartTime", sql.DateTime, StartTime)
			.input("EndTime", sql.DateTime, EndTime)
			.input("CategoryId", sql.VarChar(50), CategoryId)
			.input("Language", sql.VarChar(10), Language);

		// Add UDFs as UDF1 to UDF10
		for (let i = 0; i < 10; i++) {
			request.input(`UDF${i + 1}`, sql.NVarChar(255), UDFs[i] || null);
		}

		const result = await request.execute("mbtSP_ImportAppointmentData");

		if (result.recordset.length > 0) {
			return result.recordset[0];
		} else {
			return null;
		}
	} catch (error) {
		utils.log("error", `Error in importAppointmentData: ${error.message}`);
		throw error;
	}
}

// In sqlQueries.js, add a new function or modify existing one
async function importAppointmentDataV2({
	UserId,
	AppointmentNumber,
	AppointmentDate,
	BranchId,
	StartTime,
	EndTime,
	CategoryId,
	Language,
	UDFs,
}) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	const request = dbPool
		.request()
		.input("UserId", sql.VarChar(50), UserId)
		.input("AppointmentNumber", sql.Int, AppointmentNumber)
		.input("AppointmentDate", sql.Date, AppointmentDate)
		.input("BranchId", sql.Int, BranchId)
		.input("StartTime", sql.VarChar(5), StartTime)
		.input("EndTime", sql.VarChar(5), EndTime)
		.input("CategoryId", sql.VarChar(50), CategoryId)
		.input("Language", sql.VarChar(10), Language);

	// Add UDF parameters (1-10)
	for (let i = 0; i < 10; i++) {
		request.input(`UDF${i + 1}`, sql.NVarChar, UDFs[i] || null);
	}

	try {
		const result = await request.execute("mbtSP_ImportAppointmentData_V2");
		return result.recordset[0];
	} catch (error) {
		console.error("Error executing mbtSP_ImportAppointmentData_V2:", error);
		throw error;
	}
}

async function update_mbtAppointmentTicketInfo(appointmentNumber, value) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		let sqlCommand = `UPDATE mbtAppointmentTicketInfo
    		SET isReminderSent = ${value}
    		WHERE AppointmentNumber = ${appointmentNumber}`;

		let result = await dbPool.request().query(sqlCommand);

		return result.rowsAffected[0] || [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function insertAppointmentMessage(appointmentNumber, appMsgId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "mbtSP_InsertAppointmentMessage";

		const result = await dbPool
			.request()
			.input("AppointmentNumber", sql.BigInt, appointmentNumber)
			.input("AppMsgId", sql.Int, appMsgId)
			.execute(sqlCommand);

		return result.recordset?.[0] || null;
	} catch (error) {
		console.error(
			"Error in insertLocalizedAppointmentMessage: ",
			error.message
		);
		throw error;
	}
}

async function mbtSP_insertApptMessageAlertInAlertModule(
	emailFrom,
	emailTo,
	appointment_number,
	alertTypeId,
	language,
	templateId,
	mobileNumber,
	branchId,
	SQN,
	appointmentMessageId
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "mbtSP_insertApptMessageAlertInAlertModule";
		let request = await dbPool
			.request()
			.input("emailFrom", sql.NVarChar, emailFrom)
			.input("emailTo", sql.NVarChar, emailTo)
			.input("appointment_number", sql.NVarChar, appointment_number)
			.input("alertTypeId", sql.Int, alertTypeId)
			.input("language", sql.NVarChar, language)
			.input("templateId", sql.NVarChar, templateId)
			.input("mobileNumber", sql.NVarChar, mobileNumber)
			.input("branchId", sql.NVarChar, branchId.toString())
			.input("SQN", sql.NVarChar, SQN)
			.input("appMsgId", sql.Int, appointmentMessageId);

		let result = await request.execute(sqlCommand);
		return result.recordset;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function insertApptAuditLogs(
	branchid,
	previousapptbranchid,
	categoryid,
	previousapptcategoryid,
	appointmentDate,
	prevAppointmentDate,
	appointmentNumber,
	prevappointmentnumber,
	mobileNumber,
	emailId,
	slotTime,
	prevSlotTime,
	endtime,
	prevendtime,
	agentId,
	agentName,
	stateId,
	source
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const result = await dbPool
			.request()
			.input("branchID", sql.Int, branchid)
			.input("prevBranchID", sql.Int, previousapptbranchid)
			.input("categoryID", sql.NVarChar, categoryid)
			.input("prevCategoryID", sql.NVarChar, previousapptcategoryid)
			.input("appointmentDate", sql.NVarChar, appointmentDate)
			.input("prevAppointmentDate", sql.NVarChar, prevAppointmentDate)
			.input("appointmentNumber", sql.Int, appointmentNumber)
			.input("prevAppointmentNumber", sql.Int, prevappointmentnumber)
			.input("phoneNumber", sql.NVarChar, mobileNumber)
			.input("email", sql.NVarChar, emailId)
			.input("startTime", sql.NVarChar, slotTime)
			.input("prevStartTime", sql.NVarChar, prevSlotTime)
			.input("endTime", sql.NVarChar, endtime)
			.input("prevEndTime", sql.NVarChar, prevendtime)
			.input("agentId", sql.Int, agentId)
			.input("agentName", sql.NVarChar, agentName)
			.input("stateId", sql.Int, stateId)
			.input("source", sql.NVarChar, source)
			.execute("mbtSP_insertApptAuditLogs");

		return result?.recordset?.length ? result?.recordset[0] : [];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getApptAuditLogs(param) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand =
			"SELECT * FROM mbtAppointmentAuditLog WHERE branchID = @branchID AND categoryID = @categoryID";
		const result = await dbPool
			.request()
			.input("branchID", sql.Int, param.branchid)
			.input("categoryID", sql.NVarChar, param.categoryid)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function findticketwithpayload(branchid, payloadArray) {
	try {
		const dbPool = await getDBConnection(DB_EQ_REPORT);

		const request = dbPool.request();
		// Add branchid parameter
		request.input("branchid", sql.Int, branchid);

		// Construct dynamic UDF conditions
		let udfConditions = [];
		let paramCounter = 0;

		payloadArray.forEach((udfObj) => {
			const [udfKey, udfValue] = Object.entries(udfObj)[0] || [];

			if (
				udfKey &&
				/^UDF([1-9]|10)$/i.test(udfKey) &&
				udfValue &&
				udfValue.toString().trim() !== ""
			) {
				const paramName = `param${paramCounter++}`;
				udfConditions.push(`A.${udfKey} = @${paramName}`);
				request.input(paramName, sql.NVarChar, udfValue.toString().trim());
			}
		});

		if (udfConditions.length === 0) {
			return res.status(400).json({ message: "No valid UDF filters provided" });
		}

		// Combine final WHERE clause
		const whereClause = `
      ${udfConditions.join(" AND ")}
      AND B.BranchID = @branchid
      AND CAST(B.IssueTime AS DATE) = CAST(dbo.Fnc_CalculatedDateTimeOfBranch(@branchid) AS DATE)
    `;

		let query = `
		EXEC master..openEncrypt
		SELECT
		B.BranchID as branchId,
		B.ticketnumber as ticketNumber,
		A.PayloadCompleteText as 'payloadArray',
		A.ticketid as 'ticketId',
		B.IssueTime as issueTime,
		B.TicketOrigin as ticketOrigin,
		B.CounterId as counterNumber,
		B.StateId as stateId,
		C.StateName as stateName,
		B.ActualTicketId as actualTicketId
		FROM eqreport..psrpayload A WITH(NOLOCK)
		INNER JOIN eqreport..psrticket B WITH(NOLOCK) ON A.ticketid = B.ticketid
		LEFT JOIN eqreport..psrstate C WITH(NOLOCK) ON C.stateid = B.stateid
		WHERE ${whereClause}
		ORDER BY TICKETID DESC
		EXEC master..closeEncrypt
		`;
		const result = await request.query(query);
		return result.recordsets[0] || null;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function updateAllENCAppointments(url) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const getAllAppointmentsSql = `
			SELECT 
				a.appointmentnumber
			FROM 
				eqreport..mbtappointmentticketinfo a WITH (NOLOCK)
			WHERE 
				CAST(a.appointmentdate AS DATE) >= CAST(GETDATE() AS DATE)
				AND a.active = 1
			ORDER BY 
				a.issueDate DESC;
        `;

		const appointmentsResult = await dbPool
			.request()
			.query(getAllAppointmentsSql);

		if (appointmentsResult.recordset.length === 0) {
			return { message: "No appointments found" };
		}

		console.log(
			`Found ${appointmentsResult.recordset.length} appointments to update`
		);

		// Process in batches of 10-20 to avoid overwhelming the connection pool
		const batchSize = 10;
		let successCount = 0;
		let errorCount = 0;

		for (let i = 0; i < appointmentsResult.recordset.length; i += batchSize) {
			const batch = appointmentsResult.recordset.slice(i, i + batchSize);
			console.log(
				`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
					appointmentsResult.recordset.length / batchSize
				)}`
			);

			const batchPromises = batch.map(async (row) => {
				try {
					const appointmentNumber = row.appointmentnumber;

					const encryptedAppointmentNo = await cryptorEngine.EncryptForURL(
						appointmentNumber,
						true,
						process.env.APPOINTMENT_SECRET_KEY
					);

					console.log(
						`Encrypted appointment ${appointmentNumber}: ${encryptedAppointmentNo}`
					);

					const updateSql = `
                        UPDATE eqreport..mbtAppointmentUserPayloadss  
                        SET UDF9 = @udf9Value
                        WHERE appointmentnumber = @appointmentno 
                    `;

					const udf9Value = `ModifyCancelURL:${url}=${encryptedAppointmentNo}&lang=en`;

					const result = await dbPool
						.request()
						.input("appointmentno", sql.NVarChar, appointmentNumber)
						.input("udf9Value", sql.NVarChar, udf9Value)
						.query(updateSql);

					successCount++;
					return { success: true, appointmentNumber };
				} catch (err) {
					console.error(
						`Error updating appointment ${row.appointmentnumber}:`,
						err.message
					);
					errorCount++;
					return {
						success: false,
						appointmentNumber: row.appointmentnumber,
						error: err.message,
					};
				}
			});

			// Wait for this batch to complete before processing the next
			await Promise.all(batchPromises);

			// Optional: Add a small delay between batches to reduce load
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		console.log(
			`Update completed: ${successCount} successful, ${errorCount} failed`
		);

		return {
			message: "All appointments processed",
			successCount,
			errorCount,
			totalProcessed: appointmentsResult.recordset.length,
		};
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getBranchandCategoryCurrentStatus(
	branchids,
	categoryid,
	PriorityLevel
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "mbtsp_WT_getBranchandCategoryCurrentStatus";
		let request = await dbPool
			.request()
			.input("branchids", sql.NVarChar, branchids)
			.input("categoryid", sql.NVarChar, categoryid)
			.input("PriorityLevel", sql.Int, PriorityLevel);

		let result = await request.execute(sqlCommand);
		return result.recordset;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getBranchTicketCancelData(
	branchId,
	ticketNumber = "",
	id = "",
	callingController = ""
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "usp_CancelList";
		const result = await dbPool
			.request()
			.input("branchId", sql.Int, branchId)
			.input("ticketNumber", sql.VarChar, ticketNumber)
			.execute(sqlCommand);

		if (result.recordset && result.recordset.length > 0) {
			const objLst = [];

			for (const row of result.recordset) {
				if (row.ticketnumber) {
					objLst.push({
						branch_name: row.branchname?.toString() || "",
						counter_title: row.CounterTitle?.toString() || "",
						ticket_number: row.ticketnumber?.toString() || "",
						operator_name: row.tellername?.toString() || "",
						category_title: row.Service?.toString() || "",
						customer_name: row.ClientName?.toString() || "",
						customer_id: row.ID?.toString() || "",
						status: row.Status?.toString() || "",
						service_time: row.ServiceTime?.toString() || "",
						issue_time: row.IssueTime?.toString() || "",
						call_time: row.calltime?.toString() || "",
						end_time: row.endtime?.toString() || "",
						notes: row.Notes?.toString() || "",
						order: row.order?.toString() || "",
						counter_no: row.CounterNo?.toString() || "",
						type: row.Type?.toString() || "",
						transaction_type: row.TransactionType?.toString() || "",
						record_id: row.RecordId?.toString() || "",
						noshow_duration_time: row.NoshowDurationTime?.toString() || "",
						noshow_time: row.noshowtime?.toString() || "",
						noshow_count: row.noshowcount?.toString() || "",
						contact_no: row.contactNo?.toString() || "",
						SQN: row.SQN?.toString() || "",
					});
				} else {
					utils.log(
						"error",
						`${callingController} ${id} Error in getBranchTicketCancelData: Branch is not configured.`
					);
					return null;
				}
			}

			return { branchcancelticket: objLst };
		} else {
			utils.log(
				"error",
				`${callingController} ${id} Error in getBranchTicketCancelData: Branch does not exist.`
			);
			return null;
		}
	} catch (error) {
		utils.log(
			"error",
			`${callingController} ${id} Error in getBranchTicketCancelData: ${error.message}`
		);
		throw error;
	}
}

async function checkDeltaCounterStatus(branchId, sqn) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const sqlCommand =
			"IF EXISTS(select top 1 StateId from eqreport..PSRCounter WITH(NOLOCK) where BranchId = @branchId and StateId = 1  and CounterId in (select CounterId from eqreport..DeltaConsiderCountersList WITH (NOLOCK) where branchId = @branchId and categoryid=@SQN)) BEGIN SELECT '1|Counter open' as counterStatus END ELSE BEGIN SELECT '0|Counter closed' as counterStatus END";
		let result = await dbPool
			.request()
			.input("branchId", sql.VarChar, branchId)
			.input("SQN", sql.VarChar, sqn)
			.query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		utils.log("error", `Error in checkDeltaCounterStatus: ${error.message}`);
		return null;
	}
}
async function getTicketTrackingSummary(
	branchId,
	type,
	fromDate,
	toDate,
	category,
	ticketNumber,
	ticketStatus,
	userId,
	lang
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const result = await dbPool
			.request()
			.input("id", sql.VarChar, branchId)
			.input("type", sql.VarChar, type)
			.input("from", sql.VarChar, fromDate)
			.input("to", sql.VarChar, toDate)
			.input("category", sql.VarChar, category)
			.input("ticketNumber", sql.VarChar, ticketNumber)
			.input("ticketStatus", sql.NVarChar, ticketStatus)
			.input("userId", sql.VarChar, userId)
			.input("language", sql.VarChar, lang)
			.execute("cd_PSRTicketTracking");

		return result.recordset;
	} catch (error) {
		console.error(
			"Error executing ticket tracking summary SP: ",
			error.message
		);
		throw error;
	}
}

async function getAllOperatorsForBranch(branchid) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const sqlCommand =
			"SELECT OperatorId, Name, Active, isDeleted FROM eqportal..eqportal_operator WHERE branchid = @branchid";
		const result = await dbPool
			.request()
			.input("branchid", sql.Int, branchid)
			.query(sqlCommand);
		return result.recordset;
	} catch (error) {
		console.error("Error fetching operators for branch: ", error.message);
		throw error;
	}
}

async function getAllCountersForBranch(branchid) {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const sqlCommand =
			"SELECT CounterID, CounterTitle, isDeleted, isActive FROM eqportal..eqportal_counter WHERE branchid = @branchid";
		const result = await dbPool
			.request()
			.input("branchid", sql.Int, branchid)
			.query(sqlCommand);
		return result.recordset;
	} catch (error) {
		console.error("Error fetching counters for branch: ", error.message);
		throw error;
	}
}

// Keep your existing functions...
async function activateSdCustomer(customerId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = `UPDATE eqreport..sd_customers
		SET isActive = 1, AdditionalFields = ''
		WHERE customer_id = @customerId`;
		const result = await dbPool
			.request()
			.input("customerId", sql.VarChar, customerId)
			.query(sqlCommand);
		return result.rowsAffected[0];
	} catch (error) {
		console.error("Error in activateSdCustomer: ", error.message);
		throw error;
	}
}

async function appointmentNotes(action, params) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const result = await dbPool
			.request()
			.input("Action", sql.NVarChar, action)
			.input("Id", sql.Int, params.Id || null)
			.input("AppointmentId", sql.Int, params.AppointmentId || null)
			.input("AppointmentHistoryId", sql.Int, params.AppointmentHistoryId || null)
			.input("Note", sql.NVarChar, params.Note || null)
			.input("UserId", sql.Int, params.UserId || null)
			.input("ChangeBy", sql.NVarChar, params.ChangeBy || null)
			.input("Reason", sql.NVarChar, params.Reason || null)
			.execute("mbtSP_AppointmentNotes");

		return result.recordset;
	} catch (error) {
		console.error("Error in appointmentNotes:", error.message);
		throw error;
	}
}

async function validateAppointmentRecord({
	udfField,
	udfValue,
	filters = {},
	lastAppointmentId = null,
	returnFullRecord = false,
}) {
	if (!udfField || !udfValue) {
		throw new Error("udfField and udfValue are required parameters.");
	}

	//  SQL expression to extract the value after key
	const udfExtractExpr = `
		LTRIM(RTRIM(
			SUBSTRING(
				AUP.${udfField},
				CHARINDEX(':', AUP.${udfField}) + 1,
				CASE 
					WHEN CHARINDEX('|', AUP.${udfField}) > 0 
					THEN CHARINDEX('|', AUP.${udfField}) - CHARINDEX(':', AUP.${udfField}) - 1
					ELSE LEN(AUP.${udfField}) - CHARINDEX(':', AUP.${udfField})
				END
			)
		))
	`;

	let query = `
		EXEC master..openEncrypt

		SELECT TOP 1 *
		FROM mbtAppointmentUserPayloads AS AUP
		INNER JOIN mbtAppointmentTicketInfo AS ATI
			ON AUP.AppointmentNumber = ATI.AppointmentNumber
		WHERE AUP.CustomerID = @udfValue`;

	// Optional filters
	if (filters.branchId) {
		query += ` AND ATI.BranchId = @branchId`;
	}
	if (filters.startDate && filters.endDate) {
		query += ` AND ATI.AppointmentDate BETWEEN @startDate AND @endDate`;
	}
	if (filters.excludeCancelled) {
		query += ` AND ATI.Status <> 2`;
	}
	if (filters.onlyActive) {
		query += ` AND ATI.Active = 1`;
	}
	if (lastAppointmentId) {
		query += ` AND ATI._id > @lastAppointmentId`;
	}	

	query += ` ORDER BY ATI._id DESC
			   EXEC master..closeEncrypt	
			`;

	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const request = dbPool.request().input("udfValue", sql.NVarChar, udfValue);

		// Add optional parameters dynamically
		if (filters.branchId) request.input("branchId", sql.Int, filters.branchId);
		if (filters.startDate) request.input("startDate", sql.DateTime, filters.startDate);
		if (filters.endDate) request.input("endDate", sql.DateTime, filters.endDate);
		if (lastAppointmentId) request.input("lastAppointmentId", sql.Int, lastAppointmentId);
		
		const result = await request.query(query);

		if (returnFullRecord) {
			return result.recordset[0] || null;
		}

		return result.recordset.length > 0;
	} catch (error) {
		console.error("Error validating appointment:", error.message);
		throw error;
	}
}

async function lockOrReleaseSlotRecord(
	action,
	branchId,
	referenceNumber = null,
	customerId,
	slotId,
	startTime,
	endTime,
	language,
	expiryTime,
	lockId = null,
	categoryId = null
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		if (action === "LOCK") {

			// If lockId provided -> UPDATE ONLY
			if (lockId) {
				const updateResult = await dbPool
					.request()
					.input("LockId", sql.Int, lockId)
					.query(`
						UPDATE mbtAppointmentSlotLockRelease
						SET ExpiryTime =  GETDATE()
						WHERE LockId = @LockId
						AND IsReleased = 0
						AND ExpiryTime > GETDATE()
				`);
			}

			const query = `
				INSERT INTO mbtAppointmentSlotLockRelease 
					(BranchId, CustomerId, SlotId, StartTime, EndTime, Language, LockTime, ExpiryTime, IsReleased, CategoryId)
				OUTPUT inserted.LockId
				VALUES 
					(@BranchId, @CustomerId, @SlotId, @StartTime, @EndTime, @Language, GETDATE(), DATEADD(MINUTE, @ExpiryTime, GETDATE()), 0, @CategoryId)
			`;

			const result = await dbPool
				.request()
				.input("BranchId", sql.Int, branchId)
				.input("CustomerId", sql.NVarChar(50), customerId)
				.input("SlotId", sql.Int, slotId)
				.input("StartTime", sql.DateTime, startTime)
				.input("EndTime", sql.DateTime, endTime)
				.input("Language", sql.NVarChar(5), language)
				.input("ExpiryTime", sql.Int, expiryTime) // minutes, not datetime
				.input("CategoryId", sql.NVarChar(5), categoryId)
				.query(query);

			return result.recordset?.[0]?.LockId;
		} else if (action === "RELEASE") {
			if (lockId && referenceNumber) {
				// Case 1: Release by LockId
				// If lockId provided update it first before releasing
				const releaseResult = await dbPool
						.request()
						.input("ReferenceNumber", sql.NVarChar(50), referenceNumber)
						.input("LockId", sql.Int, lockId)
						.query(`
							UPDATE mbtAppointmentSlotLockRelease
							SET ReferenceNumber = @ReferenceNumber
							WHERE LockId = @LockId AND IsReleased != 1
						`);

					return {
						rowsAffected: releaseResult.rowsAffected[0],
						message: "Slot released by LockId (only if not already released)."
					};
			} else {
				// Case 2: Release for expired locks
				const releaseResult = await dbPool
					.request()
					.input("LockId", sql.Int, lockId)
					.query(`
						UPDATE mbtAppointmentSlotLockRelease
						SET IsReleased = 1, ReleasedAt = GETDATE()
						WHERE LockId = @LockId AND IsReleased = 0
					`);

				return { rowsAffected: releaseResult.rowsAffected[0], message: "Slot released for expired LockId." };
			}
		}
	} catch (error) {
		console.error("Error in lockOrReleaseSlotRecord:", error.message);
		throw error;
	}
}

async function extendLockExpiry(lockId, expiryMinutes, slotDetails) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	const result = await dbPool.request()
		.input("LockId", sql.Int, lockId)
		.input("SlotId", sql.Int, slotDetails.slotid)
		.input("BranchId", sql.Int, slotDetails.branchid)
		.input("StartTime", sql.DateTime, slotDetails.starttime)
		.input("EndTime", sql.DateTime, slotDetails.endtime)
		.input("Language", sql.NVarChar(5), slotDetails.lang)
		.input("CategoryId", sql.NVarChar(5), slotDetails.sqn)
		.input("ExpiryTime", sql.Int, expiryMinutes)
		.query(`
			UPDATE mbtAppointmentSlotLockRelease
			SET ExpiryTime = DATEADD(MINUTE, @ExpiryTime, GETDATE())
			WHERE LockId = @LockId
			  AND SlotId = @SlotId
			  AND BranchId = @BranchId
			  AND StartTime = @StartTime
			  AND EndTime = @EndTime
			  AND Language = @Language
			  AND CategoryId = @CategoryId
			  AND IsReleased = 0
			  AND ExpiryTime > GETDATE()
		`);

	return result.rowsAffected[0];
}

async function mbtGetExpiredUnreleasedSlots() {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = `
			SELECT LockId, BranchId, SlotId, CustomerId, StartTime, EndTime, Language, CategoryId
			FROM mbtAppointmentSlotLockRelease WITH (NOLOCK)
			WHERE ReferenceNumber IS NULL AND IsReleased = 0 AND ExpiryTime <= GETDATE()
		`;

		const result = await dbPool.request().query(sqlCommand);

		if (!result.recordset.length) {
			utils.log("info", "No expired locked slots found for auto-release.");
			return [];
		}

		return result.recordset;
	} catch (error) {
		console.error("Error fetching expired unreleased slots:", error.message);
		throw error;
	}
}

async function getCategoryAvgWaitTime(branchId, categoryIds = null) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		let sqlCommand = `
			SELECT 
				CategoryId, 
				CategoryName, 
				CASE
				WHEN (TotalWaitingWaitTime / NULLIF(WaitingTickets, 0)) <= 0 THEN 0
				ELSE ISNULL(
					TotalWaitingWaitTime / NULLIF(WaitingTickets, 0),
					0
				)
			END AS AvgWaitTimeInSec
			FROM DashboardBranchCategoryStatus WITH (NOLOCK)
			WHERE BranchID = @BranchID
		`;

		// Add optional filter for CategoryId
		if (categoryIds) {
			const ids = categoryIds.split(/[|,]/).map(x => `'${x.trim()}'`).join(",");
			sqlCommand += ` AND CategoryId IN (${ids})`;
		}

		const request = dbPool.request().input("BranchID", sql.Int, branchId);

		if (categoryIds) {
			request.input("CategoryId", sql.VarChar, categoryIds);
		}

		const result = await request.query(sqlCommand);

		return result.recordset;
	} catch (error) {
		console.error("Error fetching average wait time:", error.message);
		throw error;
	}
}

async function getAppointmentUDFData(appointmentId) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		let sqlCommand = `
		EXEC master..openEncrypt;
			SELECT TOP 1
				B.udf1, B.udf2, B.udf3, B.udf4, B.udf5,
				B.udf6, B.udf7, B.udf8, B.udf9, B.udf10
			FROM mbtAppointmentTicketInfo A WITH (NOLOCK)
			JOIN mbtAppointmentUserPayloads B WITH (NOLOCK)
				ON A._id = B.AppointmentId
			WHERE A._id = @appointmentId
		EXEC master..closeEncrypt;
		`;

		let result = await dbPool
			.request()
			.input("appointmentId", sql.Int, appointmentId)
			.query(sqlCommand);

		return result.recordset[0] || null;
	} catch (error) {
		console.error("Error getting UDF data: ", error.message);
		throw error;
	}
}

async function logAppointmentChange(auditData) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "dbo.usp_LogAppointmentChange";

		const request = dbPool
			.request()
			.input("AppointmentId", sql.Int, parseInt(auditData.appointmentId))
			.input("AppointmentKey", sql.NVarChar, auditData.appointmentKey)
			.input("AppointmentNumber", sql.VarChar, auditData.appointmentNumber)
			.input("AppointmentDate", sql.Date, auditData.appointmentDate)
			.input("CategoryId", sql.VarChar, auditData.categoryId)
			.input("BranchId", sql.Int, parseInt(auditData.branchId))
			.input("SlotId", sql.Int, parseInt(auditData.slotId))
			.input("IssueDate", sql.DateTime, auditData.issueDate)
			.input("Active", sql.Bit, auditData.active)
			.input("DeviceType", sql.VarChar, auditData.deviceType)
			.input("State", sql.Int, parseInt(auditData.state))
			.input("TicketId", sql.VarChar, auditData?.ticketId ?? null)
			.input("CounterNumber", sql.Int, parseInt(auditData.counterNumber))
			.input("TicketServedTimeStamp", sql.DateTime, null)
			.input("Language", sql.VarChar, auditData.language)
			.input("StartTime", sql.DateTime, auditData.startTime)
			.input("EndTime", sql.DateTime, auditData.endTime)
			.input("TicketOrigin", sql.VarChar, auditData?.ticketOrigin ?? null)
			.input("CancelReasonId", sql.Int, parseInt(auditData.cancelReasonId))
			.input("NotesId", sql.Int, null)
			.input("ChangeBy", sql.VarChar, auditData.changeBy)
			.input("Reason", sql.VarChar, auditData.reason)
			.input("UserPayloads", sql.NVarChar, auditData.userPayloads)
			.input("ActionType", sql.VarChar, auditData.actionType)
			.input("SessionID", sql.VarChar, auditData?.sessionID ?? null)
			.input("ShortTicketID", sql.VarChar, auditData?.shortTicketID?.toString() ?? null);

		await request.execute(sqlCommand);
		return true;
	} catch (error) {
		console.error(
			"Error in Appointment Log: ",
			error.message
		);
		throw error;
	}
}

async function getClientIdAndValidateBranch(branchId, targetedDB) {
	const sqlCommands = `
        SELECT ClientId 
        FROM eqPortal..eqportal_branch 
        WHERE ID = @branchId 
        AND (isDeleted IS NULL OR isDeleted = 0)
    `;

	const parameters = [{ name: "branchId", type: sql.Int, value: branchId }];

	try {
		const result = await executeSQLQuery(sqlCommands, parameters, targetedDB);
		if (result && result.length > 0) {
			return result[0].ClientId;
		} else {
			throw new Error("Branch not found or inactive");
		}
	} catch (error) {
		utils.log("error", `Error validating branch: ${error.message}`);
		throw error;
	}
}

async function generateAppointmentNumberSP(clientId, targetedDB) {
	const sqlCommands = `
        DECLARE @GeneratedNumber VARCHAR(7);
        EXEC dbo.usp_GenerateUniqueAppointmentNumber 
            @ClientId = @clientId, 
            @GeneratedNumber = @GeneratedNumber OUTPUT;
        SELECT @GeneratedNumber as GeneratedNumber;
    `;

	const parameters = [{ name: "clientId", type: sql.Int, value: clientId }];

	try {
		const result = await executeSQLQuery(sqlCommands, parameters, targetedDB);
		return result && Object.keys(result).length > 0
			? result.GeneratedNumber
			: null;
	} catch (error) {
		console.error("Error generating appointment number via SP:", error.message);
		throw error;
	}
}

// Add this new function to remove appointment number
async function removeAppointmentNumberSP(
	clientId,
	appointmentNumber,
	targetedDB
) {
	const sqlCommands = `
        EXEC dbo.usp_RemoveAppointmentNumber 
            @ClientId = @clientId, 
            @AppointmentNumber = @AppointmentNumber;
    `;

	const parameters = [
		{ name: "clientId", type: sql.Int, value: clientId },
		{ name: "AppointmentNumber", type: sql.Int, value: appointmentNumber },
	];

	try {
		await executeSQLQuery(sqlCommands, parameters, targetedDB);
		return true;
	} catch (error) {
		console.error("Error removing appointment number via SP:", error.message);
		return false;
	}
}

//change Appointment Status
async function changeAppointmentStatus(branchID, state, appointmentNumber,ticketNumber,ticketOrigin) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `
			UPDATE eqReport..mbtAppointmentTicketInfo
			SET Active = @active, state = @state, 
			TicketNumber = CASE WHEN TicketNumber IS NULL AND @ticketNumber IS NOT NULL THEN @ticketNumber ELSE TicketNumber END,
    		TicketOrigin = CASE WHEN TicketOrigin IS NULL AND @ticketOrigin IS NOT NULL THEN @ticketOrigin ELSE TicketOrigin END
			OUTPUT INSERTED._id AS UpdatedId
			WHERE appointmentnumber = @appointmentNumber and branchid = @branchID`;
		const result = await dbPool
			.request()
			.input("branchID", sql.Int, branchID)
			.input("appointmentNumber", sql.VarChar, appointmentNumber)
			.input("ticketNumber", sql.VarChar, ticketNumber)
			.input("ticketOrigin", sql.VarChar, ticketOrigin)			
			.input("active", sql.Bit, state == 1 || state == 3 ? 1 : 0)
			.input("state", sql.Int, state)
			.query(query);

		// return both row count and updated _id if available
		return {
			rowsAffected: result.rowsAffected[0],
			_id: result.recordset?.[0]?.UpdatedId || null
		};
	} catch (error) {
		console.error("Error in update Appointment Status:", error.message);
		throw error;
	}
}

async function getImplicitlyCancelledAppointments(udfField) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = `
		EXEC master..openencrypt;
		SELECT
			ATI.AppointmentNumber,
			ATI.AppointmentDate,
			ATI.StartTime,
			ATI.Language,
			ATI.State,
			ATI.BranchId,
			CM.CategoryId,
			CM.CategoryCode,
			AUP.CustomerId
		FROM mbtAppointmentTicketInfo AS ATI WITH (NOLOCK)
		INNER JOIN mbtAppointmentUserPayloads AS AUP WITH (NOLOCK)
			ON AUP.AppointmentNumber = ATI.AppointmentNumber
		INNER JOIN CategoryMapping AS CM WITH (NOLOCK)
			ON ATI.CategoryId = CM.CategoryId AND CM.BranchId = ATI.BranchId
		WHERE ATI.AppointmentDate IN (CAST(GETDATE() AS DATE))
			AND AUP.CustomerId IS NOT NULL
			AND ATI.State IN (4)
			AND NOT EXISTS (
				SELECT 1
				FROM ProcessExecutionLog PEL WITH (NOLOCK)
				WHERE PEL.AppointmentNumber = ATI.AppointmentNumber
			);
		EXEC master..closeencrypt;
		`;

		const result = await dbPool.request().query(sqlCommand);

		if (!result.recordset.length) {
			utils.log(
				"info",
				"No implicitly cancelled appointments found for today."
			);
			return [];
		}

		return result.recordset;
	} catch (error) {
		console.error(
			"Error fetching implicitly cancelled appointments:",
			error.message
		);
		throw error;
	}
}

async function getAppointmentBranchId(appointmentNumber) {
  const dbPool = await getDBConnection(DB_EQ_REPORT);
  try {
    const branchQuery = `
      SELECT TOP 1 BranchId 
      FROM mbtAppointmentTicketInfo WITH (NOLOCK)
      WHERE AppointmentNumber = @appointmentNumber
    `;
    const branchResult = await dbPool
      .request()
      .input("appointmentNumber", sql.VarChar, appointmentNumber)
      .query(branchQuery);

    if (branchResult.recordset.length === 0) {
      throw new Error("No branch found for given appointment number");
    }

    return branchResult.recordset[0].BranchId;
  } catch (error) {
    console.error("Error fetching branch: ", error.message);
    throw error;
  }
}

async function getCustomerSessionCount(userId) {
  const dbPool = await getDBConnection(DB_EQ_REPORT);

  try {
    const sessionQuery = `
      SELECT COUNT(UserId) AS SessionCount
      FROM UserSessions
	  WITH (NOLOCK)
      WHERE UserId = @userId
        AND CAST(CreatedAt AS DATE) = CAST(GETDATE() AS DATE)
    `;

    const result = await dbPool
      .request()
      .input("userId", sql.VarChar, userId)
      .query(sessionQuery);

    return result.recordset[0]?.SessionCount ?? 0;
  } catch (error) {
    console.error("Error fetching customer session count:", error.message);
    throw error;
  }
}

// 	Insert Api Transaction Log
async function insertApiTransactionLog({
	sessionid,
	transnumber,
	customerid,
	language = null,
	page = null,
	licenseclass = null,
	suboption = null,
	endorsement = null,
	branchid = null,
	dateslot = null,
	starttime = null,
	endtime = null,
	slotid = null,
	internalapistatus = null,
	internalapiresponse = null,
	externalapistatus = null,
	externalapiresponse = null,
	ipaddress = null,
	bookingdevice = null,
	bookingbrowser = null,
	paymentrequired = null,
	appointmentnumber = null,
	paymenttransactionid = null
}) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `
			INSERT INTO dbo.ApiTransactionLog (
				SessionId, LogTimestamp, TransNumber, CustomerId, Language,
				Page, LicenseClass, SubOption, Endorsement, BranchId, DateSlot, StartTime,
				EndTime, SlotId, InternalApiStatus, InternalApiResponse, ExternalApiStatus,
				ExternalApiResponse, IpAddress, BookingDevice, BookingBrowser,
				PaymentRequired, AppointmentNumber, PaymentTransactionId
			)
			VALUES (
				@SessionId, GETDATE(), @TransNumber, @CustomerId, @Language,
				@Page, @LicenseClass, @SubOption, @Endorsement, @BranchId, @DateSlot, @StartTime,
				@EndTime, @SlotId, @InternalApiStatus, @InternalApiResponse, @ExternalApiStatus,
				@ExternalApiResponse, @IpAddress, @BookingDevice, @BookingBrowser,
				@PaymentRequired, @AppointmentNumber, @PaymentTransactionId
			)
		`;

		const paymenttransactionidValue = paymenttransactionid ? String(paymenttransactionid) : null;
		const request = dbPool.request()
			.input("SessionId", sql.UniqueIdentifier, sessionid)
			.input("TransNumber", sql.VarChar(50), transnumber)
			.input("CustomerId", sql.VarChar(15), customerid)
			.input("Language", sql.VarChar(5), language)
			.input("Page", sql.VarChar(50), page)
			.input("LicenseClass", sql.VarChar(5), licenseclass)
			.input("SubOption", sql.VarChar(5), suboption)
			.input("Endorsement", sql.VarChar(5), endorsement)
			.input("BranchId", sql.Int, branchid)
			.input("DateSlot", sql.Date, dateslot)
			.input("StartTime", sql.DateTime, starttime)
			.input("EndTime", sql.DateTime, endtime)
			.input("SlotId", sql.Int, slotid)
			.input("InternalApiStatus", sql.VarChar(5), String(internalapistatus))
			.input("InternalApiResponse", sql.VarChar(sql.MAX), internalapiresponse)
			.input("ExternalApiStatus", sql.VarChar(5), String(externalapistatus))
			.input("ExternalApiResponse", sql.VarChar(sql.MAX), externalapiresponse)
			.input("IpAddress", sql.VarChar(45), ipaddress)
			.input("BookingDevice", sql.VarChar(20), bookingdevice)
			.input("BookingBrowser", sql.VarChar(50), bookingbrowser)
			.input("PaymentRequired", sql.Bit, paymentrequired)
			.input("AppointmentNumber", sql.BigInt, appointmentnumber)
			.input("PaymentTransactionId", sql.VarChar(50), paymenttransactionidValue);

		const result = await request.query(query);
		return result.rowsAffected[0];
	} catch (error) {
		console.error("Error in insertApiTransactionLog:", error.message);
		throw error;
	}
}

async function closeCounterLogging(
	branchid,
	counterid,
	applicationtype,
	targetusername,
	ticketstateataction,
	ticketnumber,
	requestedbyuser,
	requestedbyrole,
	actiontype,
	reason
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const sqlCommand = "dbo.sp_insertlogsForceCounterLogoutAudit";

		const request = dbPool
			.request()
			.input("BranchId", sql.Int, parseInt(branchid))
			.input("CounterNumber", sql.NVarChar, counterid)
			.input("ApplicationType", sql.VarChar, applicationtype)
			.input("TargetUsername", sql.VarChar, targetusername)
			.input("TicketStateAtAction", sql.VarChar, ticketstateataction)
			.input("TicketNumber", sql.VarChar, ticketnumber)
			.input("RequestedByUser", sql.VarChar, requestedbyuser)
			.input("RequestedByRole", sql.VarChar, requestedbyrole)
			.input("ActionType", sql.VarChar, actiontype)
			.input("Reason", sql.VarChar, reason);

		await request.execute(sqlCommand);
		return true;
	} catch (error) {
		console.error("Error in close Counter Logging: ", error.message);
		// throw error;
	}
}

async function getTransferSlotQuotaConfiguration(branchIds = '',categoryids = '',clientid,lang) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "sp_getTransferQuotaConfiguration";
		let result = await dbPool
			.request()			
			.input("branchIds", sql.VarChar, branchIds)
			.input("categoryIds", sql.VarChar, categoryids)
			.input("clientId",sql.Int, clientid)
			.input("lang", sql.VarChar, lang)			
			.execute(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function appointmentReasons(action, params) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		if (action === "Add") {
			// Use stored procedure
			const request = dbPool.request();
			request.input("AppointmentId", params.AppointmentId);
			request.input("AppointmentHistoryId", params.AppointmentHistoryId);
			request.input("ReasonId", params.ReasonId); // "1|2|3"
			request.input("BusinessRuleIds", params.BusinessRuleIds); 
			request.input("Language", params.Language);

			const result = await request.execute("mbtSP_InsertOrUpdateAppointmentReasons");
			return result.recordset || [];
		}

		if (action === "Get") {
			const sqlQuery = `
				SELECT 
					ar.ReasonId,
					r.reasontitle,
					r.reasons,
					r.ruleName,
					ar.CreatedAt,
					ar.UpdatedAt
				FROM mbtAppointmentReasons ar WITH (NOLOCK)
				INNER JOIN tbl_cancelreasons r WITH (NOLOCK)
					ON ar.ReasonId = r.creasonid
				WHERE ar.AppointmentId = @AppointmentId
				  AND ar.AppointmentHistoryId = @AppointmentHistoryId
				  AND ISNULL(r.isdeleted, 0) = 0
				ORDER BY ar.CreatedAt DESC
			`;

			const request = dbPool.request();
			request.input("AppointmentId", params.AppointmentId);
			request.input("AppointmentHistoryId", params.AppointmentHistoryId);

			const result = await request.query(sqlQuery);
			return result.recordset || [];
		}

		return [];
	} catch (error) {
		console.error("Error in appointmentReasons:", error);
		throw error;
	}
}

async function saveTransferSlotsQuotaConfig(params) {
  const {
    id = null,
    branchids,
    categoryids,
    clientid,
    fromlanguage,
    tolanguage,
    noofdays
  } = params;


  const dbPool = await getDBConnection(DB_EQ_REPORT);

  try {
    // ✔️ Step 1: Prevent Duplicate Configuration
    const duplicateCheckQuery = `
      SELECT TOP 1 id
      FROM transferSlotQuotaScheduler      
      WHERE (@Id IS NULL OR Id <> @Id) AND ISNULL(isDeleted, 0)=0 
	  AND (EXISTS(SELECT * FROM fnPipeSplit(BranchIds,'|') WHERE Items in (SELECT * FROM fnPipeSplit(@BranchIds,'|')))) 	  
        ${id ? "AND id <> @Id" : ""}
    `;

    const duplicateResult = await dbPool
      .request()
      .input("Id", sql.Int, id)
      .input("BranchIds", sql.VarChar, branchids)
      .input("CategoryIds", sql.VarChar, categoryids)
      .input("FromLanguage", sql.VarChar, fromlanguage)
      .input("ToLanguage", sql.VarChar, tolanguage)
      .input("NoOfDays", sql.Int, noofdays)
      .query(duplicateCheckQuery);

    if (duplicateResult.recordset.length > 0) {
      return {
        duplicate: true,
        rowsAffected: 0,
        UpdatedId: null
      };
    }

    // ✔️ Step 2: Insert or Update  
    let query = "";
    if (id) {
      // ------------ UPDATE QUERY --------------
      query = `
        UPDATE transferSlotQuotaScheduler
        SET 
          branchids = @BranchIds,
          categoryids = @CategoryIds,
          noOfDays = @NoOfDays,
          fromLanguage = @FromLanguage,
          toLanguage = @ToLanguage,
          modifiedOn = GETDATE()
        WHERE id = @Id AND isDeleted = 0        
      `;
    } else {
      // ------------ INSERT QUERY --------------
      query = `
        INSERT INTO transferSlotQuotaScheduler
        (branchids, categoryids, noOfDays, fromLanguage, toLanguage, isDeleted, modifiedOn)
        OUTPUT INSERTED.id AS UpdatedId
        VALUES (@BranchIds, @CategoryIds, @NoOfDays, @FromLanguage, @ToLanguage, 0, GETDATE());
      `;
    }

    const result = await dbPool
      .request()
      .input("Id", sql.Int, id)
      .input("BranchIds", sql.VarChar, branchids)
      .input("CategoryIds", sql.VarChar, categoryids)
      .input("FromLanguage", sql.VarChar, fromlanguage)
      .input("ToLanguage", sql.VarChar, tolanguage)
      .input("NoOfDays", sql.Int, noofdays)
      .query(query);

    return {
      duplicate: false,
      rowsAffected: result.rowsAffected[0],
      UpdatedId: result.recordset?.[0]?.UpdatedId || null
    };

  } catch (error) {
    console.error("Error saving Transfer Slots Quota Config:", error.message);
    throw error;
  }
}

async function deleteTransferSlotsQuotaConfig(id) {
  const dbPool = await getDBConnection(DB_EQ_REPORT);

  try {
    const query = `      
      UPDATE transferSlotQuotaScheduler
      SET 
        isDeleted = 1,
        modifiedOn = GETDATE()
      WHERE id = @Id AND isDeleted = 0;
	        
      SELECT @Id AS UpdatedId;
    `;

    const result = await dbPool
      .request()
      .input("Id", sql.Int, id)
      .query(query);

    return {
      rowsAffected: result.rowsAffected[0],
      UpdatedId: result.recordset?.[0]?.UpdatedId || null
    };
  } catch (error) {
    console.error("Error in deleteTransferSlotsQuotaConfig:", error.message);
    throw error;
  }
}

async function isUserWithinBranchRadius(
	branchId,
	userLatitude,
	userLongitude,
	search_radius
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const sqlCommand = "mbtSP_IsUserWithinBranchRadius";
		let result = await dbPool
			.request()
			.input("branchId", sql.VarChar, branchId)
			.input("userLatitude", sql.Float, userLatitude)
			.input("userLongitude", sql.Float, userLongitude)
			.input("search_radius", sql.Float, search_radius)
			.execute(sqlCommand);

		// Assuming the SP returns a single row with IsWithinRadius column
		if (
			result.recordsets &&
			result.recordsets[0] &&
			result.recordsets[0].length > 0
		) {
			const row = result.recordsets[0][0];
			const isWithinRadius = row.IsWithinRadius;

			return isWithinRadius === 1 || isWithinRadius === true;
		}

		return false;
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getNotificationEvents() {
	try {
		const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database
		const request = dbPool.request();
		const result = await request.execute("sp_getNotificationEvents"); // Execute in the Alert_module database
		return result.recordset.length ? result.recordset : [];
	} catch (error) {
		throw error;
	}
}

async function getNotificationChannels() {
	try {
		const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database
		const request = dbPool.request();
		const result = await request.execute("sp_getNotificationChannels"); // Execute in the Alert_module database
		return result.recordset.length ? result.recordset : [];
	} catch (error) {
		throw error;
	}
}

async function getNotificationTags(type) {
	const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database
	try {
		const request = dbPool.request();
		request.input("eventtype", sql.NVarChar, type);
		const result = await request.execute("sp_getNotificationTagsByEventType"); // Execute in the Alert_module database
		return result.recordset.length ? result.recordset : [];
	} catch (error) {
		throw error;
	}
}

async function saveNotificationTemplate(
    title,
    description,
    eventType,
    channelType,
    languages,
    clientId,
    createdBy
) {
	try {
		const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database

		let result;

		for (const item of languages) {
			const request = dbPool.request();

            request.input("TemplateTitle", sql.NVarChar, title);
            request.input("Templatedescription", sql.NVarChar, description);
            request.input("EventType", sql.Int, eventType);
            request.input("ChannelType", sql.Int, channelType);
            request.input("LanguageCode", sql.NVarChar, item.languageCode);
            request.input("MessageTemplateText", sql.NVarChar, item.templateText);
            request.input("ClientID", sql.Int, clientId);
            request.input("CreatedBy", sql.Int, createdBy);

			result = await request.execute("sp_SaveNotificationTemplate");
		}

		return result.recordset[0].StatusCode;
	} catch (error) {
		throw error;
	}
}

async function updateNotificationTemplate(
    templateId,
    languages,
    description
) {
    try {
        const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database

		let result;

		for (const item of languages) {
			const request = dbPool.request();

            request.input("TemplateId", sql.Int, templateId);
            request.input("TID", sql.Int, item.TID);
            request.input("MessageTemplateText", sql.NVarChar, item.templateText);
            request.input("Templatedescription", sql.NVarChar, description);

            result = await request.execute("sp_UpdateNotificationTemplate");
        }

		return result.rowsAffected[0];
	} catch (error) {
		throw error;
	}
}

async function getNotificationTemplates(clientId) {
	const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database
	try {
		const request = dbPool.request();
		request.input("ClientID", sql.Int, clientId);
		const result = await request.execute(
			"sp_GetNotificationTemplateByClientId"
		); // Execute in the Alert_module database
		return result.recordset.length ? result.recordset : [];
	} catch (error) {
		throw error;
	}
}

async function deleteNotificationTemplate(templateid) {
	const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database
	try {
		const request = dbPool.request();
		request.input("TemplateId", sql.Int, templateid);
		const result = await request.execute(
			"sp_deleteNotificationTemplatebytemplateid"
		); // Execute in the Alert_module database
		return result.recordset[0].StatusCode;
	} catch (error) {
		throw error;
	}
}

async function saveNotificationMapping(
	templateid,
	branchid,
	categoryid,
	recipients,
	clientid,
	createdby
) {
	const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database
	try {
		const cats = categoryid.split("|");
		let result;

		for (const cat of cats) {
			const request = dbPool.request();
			request.input("TemplateId", sql.Int, templateid);
			request.input("BranchId", sql.Int, branchid);
			request.input("CategoryId", sql.NVarChar, cat);
			request.input("Notification_recipient", sql.NVarChar, recipients);
			request.input("ClientID", sql.Int, clientid);
			request.input("CreatedBy", sql.Int, createdby);
			result = await request.execute("sp_SaveNotificationMapping"); // Execute in the Alert_module database
		}
		return result.recordset[0].StatusCode;
	} catch (error) {
		throw error;
	}
}

async function getNotificationMapping(
	clientid,
	categoryId,
	branchId,
	language
) {
	const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database
	try {
		const request = dbPool.request();
		request.input("ClientID", sql.Int, clientid);
		request.input("CategoryId", sql.NVarChar, categoryId);
		request.input("BranchId", sql.NVarChar, branchId.toString());
		request.input("language", sql.NVarChar, language);
		const result = await request.execute("sp_GetNotificationMapping"); // Execute in the Alert_module database

		return result.recordset;
	} catch (error) {
		throw error;
	}
}

async function updateNotificationMapping(
    templateid,
    recipients,
    isenabled,
    branchId
) {
	const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database
	try {         
		const request = dbPool.request();
        request.input("TemplateId", sql.Int, templateid);  
        request.input("Notification_recipient", sql.NVarChar, recipients);
        request.input("isEnabled", sql.Int, isenabled);
        request.input("BranchId", sql.Int, branchId);
		const result = await request.execute("sp_updateNotificationMapping"); // Execute in the Alert_module database
		return result.rowsAffected[0];
	} catch (error) {
		throw error;
	}
}

async function deleteNotificationMapping(
    templateid,
    branchId
) {
	const dbPool = await getDBConnection(DB_ALERT_MODULE); // Connect to Alert_module database
	try {
		const request = dbPool.request();
        request.input("TemplateId", sql.Int, templateid);
        request.input("BranchId", sql.Int, branchId);
		const result = await request.execute("sp_deleteNotificationMapping"); // Execute in the Alert_module database
		return result.rowsAffected[0];
	} catch (error) {
		throw error;
	}
}

async function getAllLanguages() {
	const dbPool = await getDBConnection(DB_EQ_PORTAL);
	try {
		const sqlCommand = "SELECT * FROM EQPortal_Language";
		let result = await dbPool.request().query(sqlCommand);
		return result.recordsets[0];
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function createUptimeConfig(
        branchid,
        branchtemplatedescription,
        branchtemplatename,
        branchtemplatetype,
        startdate,
        enddate,
        clientid,
        createdby,
        days

) {
	const dbPool = await getDBConnection(DB_EQ_REPORT)
	try {
		const sqlCommand = "select * from tbl_branchuptimescheduler"
		let schedulerList = await dbPool.request().query(sqlCommand)

        const templateId = schedulerList.recordset.length > 0 ? schedulerList.recordset[schedulerList.recordset.length-1].branchtemplateid+1 : 1        

        let checkdays = ''

        days.forEach(item => {
            checkdays = checkdays ? checkdays + '|' + item.dayid : item.dayid.toString()
        })

        const request = dbPool.request()
        request.input("branchtemplateid", sql.Int, templateId)
        request.input("branchtemplatename", sql.NVarChar, branchtemplatename)
        request.input("branchtemplatedescription", sql.NVarChar, branchtemplatedescription)
        request.input("branchtemplatetype", sql.Int, branchtemplatetype)
        request.input("startdate", sql.NVarChar, startdate)
        request.input("enddate", sql.NVarChar, enddate)
        request.input("branchid", sql.NVarChar, branchid.toString())
        request.input("clientid", sql.Int, clientid)
        request.input("createdby", sql.Int, createdby)
        request.input("checkdays", sql.NVarChar, checkdays)

		const result = await request.execute("sp_savebranchuptimescheduler")

        let finalResult

        if (result.recordset[0].StatusCode == 1) {

            for (const day of days) {
                const request = dbPool.request()
                request.input("branchtemplateid", sql.Int, templateId)
                request.input("dayid", sql.Int, day.dayid)
                request.input("fshiftstarttime", sql.NVarChar, day.fshiftstarttime)
                request.input("fshiftendtime", sql.NVarChar, day.fshiftendtime)
                request.input("sshiftstarttime", sql.NVarChar, day.sshiftstarttime)
                request.input("sshiftendtime", sql.NVarChar, day.sshiftendtime)
                request.input("breakhours", sql.Decimal(3, 2), day.breakhours)
                request.input("totalworkinghours", sql.Decimal(4, 2), day.totalworkinghours)
    
                finalResult = await request.execute("sp_savebranchuptimeschedulerdays")
            }

            return finalResult.rowsAffected[0] ? 1 : 0      
        }
        else {
            return result.recordset[0].StatusCode
        }
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function updateUptimeConfig(
    branchtemplateid,
    days,
    branchid,
    startdate,
    enddate
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT)
    try {

        const request = dbPool.request()
        request.input("branchtemplateid", sql.Int, branchtemplateid)
        request.input("branchid", sql.NVarChar, branchid.toString())
        request.input("startdate", sql.NVarChar, startdate)
        request.input("enddate", sql.NVarChar, enddate)

		const result = await request.execute("sp_updateupcomingbranchuptimescheduler") 

        let finalResult

        if (result.recordset[0].StatusCode == 1) {

            for (const day of days) {
                const request = dbPool.request()
                request.input("branchtemplateid", sql.Int, branchtemplateid)
                request.input("dayid", sql.Int, day.dayid)
                request.input("fshiftstarttime", sql.NVarChar, day.fshiftstarttime)
                request.input("fshiftendtime", sql.NVarChar, day.fshiftendtime)
                request.input("sshiftstarttime", sql.NVarChar, day.sshiftstarttime)
                request.input("sshiftendtime", sql.NVarChar, day.sshiftendtime)
                request.input("breakhours", sql.Decimal(3, 2), day.breakhours)
                request.input("totalworkinghours", sql.Decimal(4, 2), day.totalworkinghours)
    
                finalResult = await request.execute("sp_savebranchuptimeschedulerdays")
            }

            return finalResult.rowsAffected[0] ? 1 : 0      
        }
        else {
            return result.recordset[0].StatusCode
        }
    }
    catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getAllUptimeConfig(
    fromdate,
    todate,
    checkdays,
    branchid,
    language
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT)
	try {

        const request = dbPool.request()
        request.input("FromDate", sql.NVarChar, fromdate)
        request.input("ToDate", sql.NVarChar, todate)
        request.input("checkdays", sql.NVarChar, checkdays)
        request.input("branchid", sql.NVarChar, branchid.toString())
        request.input("language", sql.NVarChar, language)

		const result = await request.execute("sp_getbranchuptimescheduler")

        return result.recordset;
        
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function getSingleUptimeConfig(
    branchtemplateid,
    language
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT)
	try {

        const request = dbPool.request()
        request.input("branchtemplateid", sql.Int, branchtemplateid)
        request.input("language", sql.NVarChar, language)

		const result = await request.execute("sp_getbranchuptimeschedulerbyid")

        return result.recordset;
        
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function deleteUptimeConfig(
    branchtemplateid
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT)
	try {

        const request = dbPool.request()
        request.input("branchtemplateid", sql.Int, branchtemplateid)

		const result = await request.execute("sp_deletebranchuptimescheduler")

        return result.rowsAffected[0] ? 1 : 0
        
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function checkSlotDateQuota(
    branchid,
    categoryId,
	appointmentDate,
	daysahead,
    langauge
) {
	try {     
	const dbPool = await getDBConnection(DB_EQ_REPORT);               
		const request = dbPool.request();
        request.input("BRANCHID", sql.Int, branchid);
        request.input("dateOfAppointment", sql.DateTime, appointmentDate);
        request.input("CATEGORYID", sql.NVarChar, categoryId.toString());
        request.input("HOUR_RANGE", sql.Int, 0);
		request.input("daysAhead", sql.Int, daysahead);
		request.input("lang", sql.NVarChar, langauge);
		await request.execute("job_disabledSlotDatesOnQuota"); 
		//return result.recordset;
	} catch (error) {
		console.log("error on check Slot Quota",error?.message);
	}
}

async function updateActiveUptimeConfig(
    branchtemplateid,
    days,
    branchid,
    startdate,
    enddate
) {
	const dbPool = await getDBConnection(DB_EQ_REPORT)
	try {

        const request = dbPool.request()
        request.input("branchtemplateid", sql.Int, branchtemplateid)
        request.input("branchid", sql.NVarChar, branchid.toString())
        request.input("startdate", sql.NVarChar, startdate)
        request.input("enddate", sql.NVarChar, enddate)

		const result = await request.execute("sp_updateactivebranchuptimescheduler")

        let finalResult

        if (result.recordset[0].StatusCode == 1 && days.length > 0) {

            for (const day of days) {
                const request = dbPool.request()
                request.input("branchtemplateid", sql.Int, branchtemplateid)
                request.input("dayid", sql.Int, day.dayid)
                request.input("fshiftstarttime", sql.NVarChar, day.fshiftstarttime)
                request.input("fshiftendtime", sql.NVarChar, day.fshiftendtime)
                request.input("sshiftstarttime", sql.NVarChar, day.sshiftstarttime)
                request.input("sshiftendtime", sql.NVarChar, day.sshiftendtime)
                request.input("breakhours", sql.Decimal(3, 2), day.breakhours)
                request.input("totalworkinghours", sql.Decimal(4, 2), day.totalworkinghours)
    
                finalResult = await request.execute("sp_savebranchuptimeschedulerdays")
            }

            return finalResult.rowsAffected[0] ? 1 : 0      
        }
        else {
            return result.recordset[0].StatusCode
        }
	} catch (error) {
		console.error("Error: ", error.message);
		throw error;
	}
}

async function updateAppointmentHistory(appointmentId) {
  const dbPool = await getDBConnection(DB_EQ_REPORT);

  try {
    const query = `
      UPDATE mbtAppointmentHistory
      SET IsVerified = 1
      WHERE Id IN (
        SELECT TOP (2) Id
        FROM mbtAppointmentHistory WITH (NOLOCK)
        WHERE AppointmentId = @AppointmentId
        ORDER BY Id DESC
      );
    `;

    const result = await dbPool
      .request()
      .input("AppointmentId", sql.Int, appointmentId)
      .query(query);

    return {
      rowsAffected: result.rowsAffected[0]
    };
  } catch (error) {
    console.error("updateAppointmentHistory error:", error.message);
    throw error;
  }
}

async function insertOTPAuditLog({
	event,
	cacheKey,
	source       = null,
	detail       = "",
	ticketNumber = null,
	tellerID     = null,
	regionID     = null,
	branchID     = null,
	clientID     = null,
	counterNumber = null,
}) {
	try {
		const dbPool = await getDBConnection(DB_EQ_REPORT);
		const sqlCommand = `
			EXEC sp_InsertOTPAuditLog 
				@Event = @event,
				@CacheKey = @cacheKey,
				@Source = @source,
				@Detail = @detail,
				@TicketNumber = @ticketNumber,
				@TellerID = @tellerID,
				@RegionID = @regionID,
				@BranchID = @branchID,
				@ClientID = @clientID,
				@CounterNumber = @counterNumber
		`;  // ← Removed semicolons and fixed comma
		
		await dbPool
			.request()
			.input("event",         sql.NVarChar(20),  event)
			.input("cacheKey",      sql.NVarChar(255), cacheKey)
			.input("source",        sql.NVarChar(100), source       || null)
			.input("detail",        sql.NVarChar(500), detail       || null)  // Changed to 500 to match table
			.input("ticketNumber",  sql.NVarChar(100), ticketNumber || null)
			.input("tellerID",      sql.NVarChar(100), tellerID     || null)
			.input("regionID",      sql.Int,           regionID     || null)
			.input("branchID",      sql.Int,           branchID     || null)
			.input("clientID",      sql.Int,           clientID     || null)
			.input("counterNumber", sql.Int,           counterNumber|| null)
			.query(sqlCommand);
	} catch (error) {
		// Swallow — audit must never break OTP flow
		utils.log("error", `insertOTPAuditLog failed: ${error.message}`);
	}
}

// Insert or Update Process Execution Log
async function insertOrUpdateProcessExecutionLog({
	processname,
	appointmentnumber,
	customerid,
	branchid = null,
	categoryid = null,
	licenseclass = null,
	endorsement = null,
	appointmentdatetime = null,
	appointmentstate = null,

	apistatus = null,
	apiresponse = null,
	executionstatus = null,
}) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);

	try {
		const query = `
		-- Try update first
		UPDATE dbo.ProcessExecutionLog
		SET
			AttemptTimestamp = GETDATE(),
			RetryCount = ISNULL(RetryCount,0) + 1,
			ExecutionStatus = @ExecutionStatus,
			APIStatus = @APIStatus,
			APIResponse = @APIResponse
		WHERE
			AppointmentNumber = @AppointmentNumber
			AND ProcessName = @ProcessName;

		-- If nothing updated -> insert
		IF @@ROWCOUNT = 0
		BEGIN
			INSERT INTO dbo.ProcessExecutionLog (
				ProcessName,
				CustomerId,
				BranchId,
				CategoryId,
				LicenseClass,
				Endorsement,
				AppointmentDateTime,
				AppointmentState,
				AttemptTimestamp,
				RetryCount,
				ExecutionStatus,
				APIStatus,
				APIResponse,
				AppointmentNumber,
				CreatedOn
			)
			VALUES (
				@ProcessName,
				@CustomerId,
				@BranchId,
				@CategoryId,
				@LicenseClass,
				@Endorsement,
				@AppointmentDateTime,
				@AppointmentState,
				GETDATE(),
				0,
				@ExecutionStatus,
				@APIStatus,
				@APIResponse,
				@AppointmentNumber,
				GETDATE()
			)
		END
		`;

		const request = dbPool
			.request()
			.input("ProcessName", sql.VarChar(50), processname)
			.input("AppointmentNumber", sql.BigInt, appointmentnumber)
			.input("CustomerId", sql.VarChar(15), customerid)
			.input("BranchId", sql.Int, branchid)
			.input("CategoryId", sql.VarChar(10), categoryid)
			.input("LicenseClass", sql.VarChar(5), licenseclass)
			.input("Endorsement", sql.VarChar(5), endorsement)
			.input("AppointmentDateTime", sql.DateTime, appointmentdatetime)
			.input("AppointmentState", sql.BigInt, appointmentstate)
			.input("ExecutionStatus", sql.VarChar(50), executionstatus)
			.input("APIStatus", sql.VarChar(5), String(apistatus))
			.input("APIResponse", sql.VarChar(sql.MAX), apiresponse);

		await request.query(query);
	} catch (error) {
		console.error("Error in insertOrUpdateProcessExecutionLog:", error.message);
		throw error;
	}
}


async function getBranchInfoOffSetAddress(
    branchid,
    categoryid,    
    language
) {
    try {
        const dbPool = await getDBConnection(DB_EQ_REPORT);

        const query = `
		DECLARE @OffSiteBranchAddress NVARCHAR(MAX) = NULL;
        DECLARE @branchAddress NVARCHAR(MAX) = NULL;
		DECLARE @branchTitle NVARCHAR(MAX) = NULL;
        DECLARE @eqPortalLang NVARCHAR(10) = 'ltr@English';		


		SELECT @eqPortalLang  = convert(varchar(10),CSS)+'@'+Convert(varchar(50),LanguageName)
		FROM [eqPortal].[dbo].[EQPortal_Language] where Code = @lang

		select @branchAddress = [Address],@branchTitle = Name  from eqportal..eQPortal_Branch with(nolock) where id = @BranchId and isnull(isdeleted,0) = 0
		PRINT @branchAddress

        SELECT @OffSiteBranchAddress = [Address]
        FROM eqreport..BranchOffsiteAddress with(nolock)
        WHERE BranchId = @BranchId
          AND CategoryId = @SQN
          AND IsDeleted = 0;		

        SET @branchAddress = ISNULL(@OffSiteBranchAddress, @branchAddress);
		
		IF (@eqPortalLang <> 'en')
		BEGIN			
			SELECT @branchTitle = ISNULL(value, @branchTitle)
			FROM eqportal..eQPortal_StaticTranslation with (nolock)
			WHERE [key] = REPLACE(@branchTitle, ' ', '')
			AND LanguageName = @eqPortalLang;			
		END

        IF (@OffSiteBranchAddress IS NULL)
        BEGIN
            IF (@eqPortalLang <> 'en')
            BEGIN			
                SELECT @branchAddress = ISNULL(value, @branchAddress)
                FROM eqportal..eQPortal_StaticTranslation with (nolock)
                WHERE [Key] = REPLACE('BranchAddress' + CAST(@BranchId AS VARCHAR), ' ', '')
                AND LanguageName = @eqPortalLang;			
            END
        END
        ELSE
        BEGIN
            SELECT @branchAddress = ISNULL(value, @branchAddress)
            FROM eqportal..eQPortal_StaticTranslation with (nolock)
            WHERE [Key] = REPLACE('BranchAddress' + CAST(@BranchId AS VARCHAR) + '_' + CAST(@SQN AS VARCHAR), ' ', '')
              AND LanguageName = @eqPortalLang;
        END

        SELECT @branchTitle As branchTitle, @branchAddress AS OffSiteBranchAddress;
        `;

        const request = dbPool.request();

        request.input("BranchId", sql.NVarChar, branchid.toString());
        request.input("SQN", sql.NVarChar, categoryid);        
        request.input("lang", sql.NVarChar, language);

        const result = await request.query(query);

        return result.recordset[0]; // { OffSiteBranchAddress, FinalAddress }

    } catch (error) {
        console.log(
            "error on fetching branchTitle and Address For ICS",
            error?.message
        );
        throw error;
    }
}


async function processCustomerAppointmentData(customerId, userid) {
	const dbPool = await getDBConnection(DB_EQ_REPORT);
	try {
		const result = await dbPool
			.request()
			.input("CustomerId", sql.NVarChar, customerId)
			.input("UserId", sql.NVarChar, userid)
			.execute("mbtSP_ProcessCustomerAppointmentData");
		const spResult = result.recordset[0] || [];
		if (spResult?.status?.toLowerCase() === "error") {
			console.error("processCustomerAppointmentData SP Error: ", spResult.message);
		}
		return spResult;
	} catch (error) {
		console.error("Error in processCustomerAppointmentData: ", error.message);
		throw error;
	}
}

module.exports = {
	getBranchId,
	getRabbitMQIP,
	getBranchCategory,
	getWaitingTicketData,
	getCatWaitingTicketFromCache,
	addCatWaitingTicketinCache,
	updateCatWaitingTicketinCache,
	updateCatWaitingTicketinCacheWithResultJson,
	getPSRWAITINGTICKETDATA,
	addWaitingTicketsData,
	updateWaitingTicketsData,
	getOperatorRoleFromBranchId,
	getBranchIP,
	removeOldTransactionsFromDB,
	getDateStatus,
	getHolidayStatus,
	getWorkflowIDByPractitionerID,
	checkEntryInDB,
	saveEntryInDB,
	addCustomerVisit,
	checkCustomerTicketRecordExists,
	getCategoryListByBranchCode,
	getApptCategories,
	retrieveClientId,
	getDisabledDates,
	getAllDaysSlotsOfBranch, // for normal appointment flow
	getAllSlotsOfBranch, // for desired slots appointment flow
	getSlotDetail,
	getBranchDaysAhead,
	getBranchSchedule,
	getNearestBranchesByCategory,
	getPrevAppointmentNumber,
	mbtAppointmentTicketInfo,
	mbtAppointmentUserPayloads,
	longCategoryID,
	mbtSP_CancelAppointmentTicket,
	insertAlertMessage,
	mbtSP_insertApptCancelAlertInAlertModule,
	executeSQLQuery,
	mbtAppointmentTicketInfo_mbtAppointmentUserPayloads,
	executeSPScalarValue,
	appointmentNumberExists,
	saveAppointmentUserPayloads,
	genericExecutionSPForScalarValue,
	getAppointmentDetail,
	updateAppointmentStatus,
	verifyAppointment,
	getBranchDateTime,
	executeNonScalerSQLQuery,
	getAppointmentRecords,
	getAppointmentInfoForCheckin,
	executeUpdateAutoCheckinApptStatus,
	getApptCategoriesWithFirstAvailableDate,
	getProductTypes,
	getProductFamilies,
	getPhoneModels,
	getTimezoneForBranch,
	appointmentVerify,
	getBranchCurrentDateTime,
	getBranchEvolutionData,
	getBranchTicketInfo,
	ticketTrackingSummary,
	getCategoryTranslationFromCategoryTitle,
	getBranchCode,
	getLanguageFromCode,
	getAppointmentData,
	getTicketCategories,
	getTicketSnapShot,
	initializetheDBConnectionOnStartup,
	getBranchesAgainstMultipleCategories,
	cancel_mbtAppointmentTicketInfo,
	getTotalIssueAppointments,
	decrementTotalIssueAppointments,
	updateEqPortalVirtualDashboardStatus,
	mattercodeList,
	searchCustomerbyType,
	getCustomerList,
	fetchClientRegionData,
	addCustomer,
	getListOfCustomerIDsFromDB,
	updateCustomer,
	checkCustomerExists,
	getCustomerTableColumns,
	generateUniqueCustomerId,
	getCustomerById,
	getCustomersByMultipleType,
	insertShareInfoAlertSanDiago,
	getBranchWiseCategoryTicketInfo,
	checkQuotaBasedTicketIssueRestrictions,
	getTicketDetailsFromDB,
	getTicketPositionAndEst,
	ticketissueAlertHandler,
	getTicketDetailsFromTicketNumber,
	updateReissueStatus,
	addUserSession,
	lockOrReleaseSlot,
	getCustomerAppointmentsData,
	getBranchTranslationFromBranchTitle,
	getAllDaysSlotsOfBranchWithQuota,
	getCategoryMapping,
	getBranchCountersData,
	getBranchTicketServedData,
	getCustomerTodateHistory,
	getCustomerHistory,
	isTicketAlreadyIssue_validate,
	getUser,
	importAppointmentData,
	update_mbtAppointmentTicketInfo,
	insertAppointmentMessage,
	mbtSP_insertApptMessageAlertInAlertModule,
	getTicketSnapShotWhenCounterNotOpened,
	insertApptAuditLogs,
	getApptAuditLogs,
	getBranchWiseTicketData,
	findticketwithpayload,
	getBranchTicketCancelData,
	updateAllENCAppointments,
	getBranchandCategoryCurrentStatus,
	checkDeltaCounterStatus,
	getAllOperatorsForBranch,
	getAllCountersForBranch,
	getTicketTrackingSummary,
	activateSdCustomer,
	appointmentNotes,
	logAppointmentChange,
	getAppointmentUDFData,
	getClientIdAndValidateBranch,
	generateAppointmentNumberSP,
	removeAppointmentNumberSP,
	validateAppointmentRecord,
	lockOrReleaseSlotRecord,
	mbtGetExpiredUnreleasedSlots,
	getCategoryAvgWaitTime,
	changeAppointmentStatus,
	getImplicitlyCancelledAppointments,
	getAppointmentBranchId,
	getCustomerSessionCount,
	insertApiTransactionLog,
	closeCounterLogging,
	getTransferSlotQuotaConfiguration,
	appointmentReasons,
	saveTransferSlotsQuotaConfig,
	deleteTransferSlotsQuotaConfig,
	isUserWithinBranchRadius,
	getNotificationEvents,
	getNotificationTags,
	getNotificationChannels,
	saveNotificationTemplate,
	updateNotificationTemplate,
	getNotificationTemplates,
	deleteNotificationTemplate,
	saveNotificationMapping,
	getNotificationMapping,
	deleteNotificationMapping,
	updateNotificationMapping,
	getAllLanguages,
	importAppointmentDataV2,
    createUptimeConfig,
    getAllUptimeConfig,
    getSingleUptimeConfig,
    deleteUptimeConfig,
    updateUptimeConfig,
	checkSlotDateQuota,
    updateActiveUptimeConfig,
	updateAppointmentHistory,
	insertOTPAuditLog,
	insertOrUpdateProcessExecutionLog,
	getBranchInfoOffSetAddress,
	extendLockExpiry,
	processCustomerAppointmentData
};
