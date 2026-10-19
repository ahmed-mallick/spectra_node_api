const sql = require("mssql");
const config = require("../public/config/config");
const utils = require("../utils/utils");

class MSSQLConnection {
	constructor() {
		if (!MSSQLConnection.instance) {
			this.pools = {
				eqReport: new sql.ConnectionPool(config.DB.eqReport),
				eqPortal: new sql.ConnectionPool(config.DB.eqPortal),
				Alert_Module: new sql.ConnectionPool(config.DB.Alert_Module),
			};

			MSSQLConnection.instance = this;
		}

		return MSSQLConnection.instance;
	}

	async connect(dbName) {
		let attempt = 0;
		let retries = config.DB_CONNECTION_RETRY || 1;
		let delay = utils.convertSecondAndMilliSecond(
			config.DB_CONNECTION_RETRY_DELAY || 5,
			true
		);

		while (attempt < retries) {
			try {
				if (!this.pools[dbName]._connected) {
					await this.pools[dbName].connect();
				}
				return this.pools[dbName];
			} catch (error) {
				if (error.code === "ETIMEOUT") {
					attempt++;
					utils.log(
						"error",
						`Attempt ${attempt} to connect to ${dbName} timed out.`
					);
					if (attempt < retries) {
						utils.log(
							"info",
							`Retrying connection to ${dbName} in ${delay}ms...`
						);
						await new Promise((resolve) => setTimeout(resolve, delay)); // Delay before retrying
					} else {
						utils.log("error", `All attempts to connect to ${dbName} failed.`);
						throw new Error(
							(error.message =
								"Database connection timeout. Please try again later.")
						);
					}
				} else {
					utils.log(
						"error",
						`Error connecting to MSSQL server ${JSON.stringify(error)}`
					);
					throw new Error(
						(error.message = "Error connecting to MSSQL server.")
					);
				}
			}
		}
	}

	async close(dbName) {
		try {
			if (dbName) {
				await this.pools[dbName].close();
				utils.log("info", `MSSQL Connection to ${dbName} Closed`);
			}
		} catch (error) {
			utils.log(
				"error",
				`Error closing MSSQL connection ${JSON.stringify(error)}`
			);
		}
	}
}

module.exports = new MSSQLConnection();
