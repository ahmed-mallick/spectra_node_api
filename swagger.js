const swaggerAutogen = require("swagger-autogen")();
const fs = require("fs");

const doc = {
	info: {
		title: "API Documentation",
		description: "Swagger documentation with SID and Authorization token",
	},
	host: "localhost:3001",
	basePath: "",
	schemes: ["http", "https"],
	securityDefinitions: {
		BearerAuth: {
			type: "apiKey",
			name: "Authorization",
			in: "header",
			description: "Enter your JWT token in the format: <token>",
		},
		SIDHeader: {
			type: "apiKey",
			name: "sid",
			in: "header",
			description: "Unique Session ID (GUID format)",
		},
	},
	security: [{ BearerAuth: [] }, { SIDHeader: [] }],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = [
	"./api/auth/routes/auth.js",
	"./api/otp/routes/otp.js",
	"./api/ticket/routes/ticket.js",
	"./api/spectra/routes/route.js",
];

// Define custom prefixes per route group
const customPrefixMap = {
	auth: "/auth",
	otp: "/otp",
};

// Helper to determine prefix based on route
function getPrefixForRoute(routeName) {
	return customPrefixMap[routeName] || "/api";
}

// Parse routes to route group names
function getRouteGroupName(path) {
	if (path.includes("auth") || path.includes("token")) return "auth";

	return "api";
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
	fs.readFile(outputFile, "utf8", (err, data) => {
		if (err) throw err;

		const swagger = JSON.parse(data);
		const fixedPaths = {};

		// Loop through all paths
		for (const fullPath in swagger.paths) {
			let newPath = fullPath;

			// Remove any existing /api, /auth, or /otp prefix
			newPath = newPath.replace(/^\/(api|auth|otp)/, "");

			// Identify route group (based on which file it came from)
			const group = getRouteGroupName(fullPath);

			// Add the correct prefix
			const prefix = getPrefixForRoute(group);
			newPath = prefix + newPath;

			fixedPaths[newPath] = swagger.paths[fullPath];
		}

		swagger.paths = fixedPaths;

		fs.writeFile(outputFile, JSON.stringify(swagger, null, 2), (err) => {
			if (err) throw err;
			console.log("Swagger paths updated with correct prefixes.");
		});
	});
});
