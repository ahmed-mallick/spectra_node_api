// Function to generate random number within a range
const randomInRange = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate random OTP based on options
const generatingOTP = (length, options) => {
	const characters = generateCharacterSet(options);
	let otp = "";
	for (let i = 0; i < length; i++) {
		otp += characters.charAt(randomInRange(0, characters.length - 1));
	}

	return otp;
};

// Function to generate character set based on options
const generateCharacterSet = (options) => {
	const charSets = [];
	if (options.digits) charSets.push("0123456789");
	if (options.alphabets) charSets.push("abcdefghijklmnopqrstuvwxyz");
	if (options.upperCase) charSets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
	if (options.specialChars) charSets.push("!@#$%^&*()-_=+[]{}|;:,.<>?");

	return charSets.join("");
};

module.exports = generatingOTP;
