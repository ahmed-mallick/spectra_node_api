const crypto = require("crypto");
const utils = require("../utils/utils");

const STATIC_KEY = Buffer.from([
	92, 72, 203, 160, 44, 236, 144, 214, 128, 64, 221, 0, 157, 64, 239, 195,
]);

// Function to generate key from a passphrase using MD5 hashing
function generateKeyFromPassphrase(passphrase) {
	const hash = crypto.createHash("md5");
	hash.update(passphrase);
	return hash.digest();
}

// Encryption function
function Encrypt(toEncrypt, useHashing = false, key = "") {
	try {
		const keyArray = useHashing ? generateKeyFromPassphrase(key) : STATIC_KEY;

		const key24Bytes = Buffer.concat([keyArray, keyArray.slice(0, 8)]); // Extend to 24 bytes

		const cipher = crypto.createCipheriv("des-ede3", key24Bytes, null);
		cipher.setAutoPadding(true);

		let encrypted = cipher.update(toEncrypt, "utf8", "base64");
		encrypted += cipher.final("base64");

		return encrypted;
	} catch (error) {
		utils.log("error", `Encryption Failed For ${toEncrypt}`);
		utils.log("error", error.message);
		return toEncrypt;
	}
}
function EncryptForURL(toEncrypt, useHashing = false, key = "") {
	try {
		const keyArray = useHashing ? generateKeyFromPassphrase(key) : STATIC_KEY;

		const key24Bytes = Buffer.concat([keyArray, keyArray.slice(0, 8)]); // Extend to 24 bytes

		const cipher = crypto.createCipheriv("des-ede3", key24Bytes, null);
		cipher.setAutoPadding(true);

		let encrypted = cipher.update(toEncrypt, "utf8", "base64");
		encrypted += cipher.final("base64");

		encrypted = encrypted
			.replace(/\+/g, "-")  // URL-safe replacement for `+`
			.replace(/\//g, ".")  // Change `_` to `.` to prevent SMS conversion
			.replace(/=+$/, ""); // Remove padding `=`

			
		return encrypted;
	} catch (error) {
		utils.log("error", `Encryption Failed For ${toEncrypt}`);
		utils.log("error", error.message);
		return toEncrypt;
	}
}

// Decryption function
function Decrypt(cipherString, useHashing = false, key = "") {
	try {
		const keyArray = useHashing ? generateKeyFromPassphrase(key) : STATIC_KEY;
		const key24Bytes = Buffer.concat([keyArray, keyArray.slice(0, 8)]);
		const decipher = crypto.createDecipheriv("des-ede3", key24Bytes, null); // TripleDES (3DES) with ECB mode, no IV
		decipher.setAutoPadding(true);

		cipherString = cipherString.replace(/-/g, "+").replace(/\./g, "/"); // Convert `.` back to `/`
		let decrypted = decipher.update(cipherString, "base64", "utf8");
		decrypted += decipher.final("utf8");

		return decrypted;
	} catch (error) {
		utils.log("error", `Decryption Failed For ${cipherString}`);
		utils.log("error", error.message);
		return cipherString;
	}
}

module.exports = { Encrypt, Decrypt, EncryptForURL };
