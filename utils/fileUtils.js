const fs = require("fs").promises;
const path = require("path");

/**
 * Reads the content of a file given its relative or absolute path.
 * @param {string} filePath - The path to the file, relative to the directory of this script or an absolute path.
 * @param {string} baseDir - The base directory to resolve relative paths.
 * @returns {Promise<string>} - A promise that resolves with the file content.
 */
async function readFileContent(filePath) {
	// Resolve relative paths to absolute paths
	const absolutePath = path.isAbsolute(filePath)
		? filePath
		: path.join(__dirname, filePath);
	try {
		// Read file content
		const data = await fs.readFile(absolutePath, "utf8");
		return data;
	} catch (error) {
		console.error(`Error reading the file at ${absolutePath}:`, error.message);
		throw error;
	}
}

module.exports = {
	readFileContent,
};
