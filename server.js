const express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");
var cors = require("cors");
const config = require("./public/config/config");
const utils = require("./utils/utils");
const sqlQueries = require("./sql/sqlQueries");
const transactionContext = require('./middleware/transactionContext');

// Load SSL certificate and private key for HTTPS
var privateKey = fs.readFileSync("./private/server.key", "utf8");
var certificate = fs.readFileSync("./private/server.crt", "utf8");

// Import routes
const authRoutes = require("./api/auth/routes/auth");

// Import controllers
const spectraRoutes = require("./api/spectra/routes/route");


const languageOverrideMiddleware = require("./middleware/languageOverride");

const db = require("./db/db");

// Import middleware for JWT verification
const { verifyJWT } = require("./utils/jwt");

// Import middleware
const {
	normalizePath,
	lowercaseRequestBodyKeys,
	lowercaseRequestQueryKeys,
} = require("./middleware/caseInsensitive");
const errorHandler = require("./middleware/errorHandler");


// Initialize Express application
const app = express();
// app.use(express.json()); // Middleware to parse JSON bodies
app.set('trust proxy', true);

app.use(languageOverrideMiddleware);

app.use(express.json({ limit: "50mb" })); // small global limit
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors()); // Middleware to enable Cross-Origin Resource Sharing

// Apply case-insensitivity middleware
app.use(normalizePath);
app.use(lowercaseRequestBodyKeys);
app.use(lowercaseRequestQueryKeys);
app.use(transactionContext); // This must come before your routes

// Create HTTP and HTTPS servers
var httpServer = http.createServer(app);

const httpsOptions = {
	key: privateKey,
	cert: certificate,
	minVersion: "TLSv1.2", // Minimum TLS version
	maxVersion: "TLSv1.3", // Maximum TLS version
};

var httpsServer = https.createServer(httpsOptions, app);

// Set up authentication routes
app.use("/auth", authRoutes);

// Set up other routes
app.use("/api", verifyJWT, spectraRoutes);

// Define a basic route to check server status
app.get("/", (req, res) => {
	// Extract the app version from package.json file
	const appVersion = require("./package.json").version;

	res.send(`Spectra Backend Service Version ${appVersion}`);
});

// Global error handling middleware
app.use(errorHandler);

//Connect DB on Service Start
async function getDBConnection() {
	if (config?.DB_CONNECTION_INITIAL_STARTUP) {
		utils.log("info", `DB Innitization Started`);
		await sqlQueries.initializetheDBConnectionOnStartup();
	}
}
if (process.env?.TIMEZONE) {
	process.env.TZ = process.env.TIMEZONE;
	utils.log("info", `TZ: ${process.env.TZ}`);
}

getDBConnection();

if (config.HTTP_PORT_ENABLE) {
	// Start the HTTP server
	httpServer.listen(config.HTTP_PORT, () => {
		utils.log("info", `HTTP listening on port ${config.HTTP_PORT}`);
	});
}
// Start the HTTPS server
httpsServer.listen(config.HTTPS_PORT, () => {
	utils.log("info", `HTTPS listening on port ${config.HTTPS_PORT}`);
});

// Cleanup function to close connections and perform cleanup on exit
async function cleanup() {
	try {
		await rmq.closeResources(); // Close RabbitMQ connection
		await db.close(config.DB.eqReport.database); // Close EQ Report database connection
		await db.close(config.DB.eqPortal.database); // Close EQ Portal database connection
		await db.close(config.DB.Alert_Module.database); // Close EQ Portal database connection	
	} catch (error) {
		utils.log("error", `Error on application exit ${JSON.stringify(error)}`);
	}
}

// Handle process exit
process.on("exit", async (code) => {
	console.log("Closed");
	await cleanup();
	utils.log("info", `Process exiting with code ${code}`);
});

// Handle SIGINT (Ctrl+C) for graceful shutdown
process.on("SIGINT", async () => {
	utils.log("info", "Received SIGINT. Shutting down...");
	await cleanup();
	process.exit(0);
});

// Handle SIGTERM for graceful shutdown
process.on("SIGTERM", async () => {
	utils.log("info", "Received SIGTERM. Shutting down...");
	await cleanup();
	process.exit(0);
});

// Global error handler for uncaught exceptions
process.on("uncaughtException", async (err) => {
	if (err?.message?.toLowerCase() === "heartbeat timeout") {
		utils.log("error", `RMQ Connection: ${err.message}`);
	} else {
		utils.log("error", `Uncaught Exception: ${err.message}`);
		utils.log("error", `Stack: ${err.stack}`);
		if (err?.message?.toLowerCase() === "read econnreset") {			
			await rmq
				.createChannelPool(true)
				.catch((err) =>
					utils.log("error", `Error initializing channel pool: ${err.message}`)
				);
		}
	}
});

// Global error handler for unhandled promise rejections
process.on("unhandledRejection", async (reason, promise) => {
	utils.log("error", `Unhandled Rejection at: ${promise}, reason: ${reason}`);		
});
