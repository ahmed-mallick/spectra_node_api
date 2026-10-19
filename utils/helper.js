const { translationMsg } = require("../public/locale");
const { getContext } = require("../context");

const DEFAULT_LANG = "en";

/**
 * Fetch a specific translation key for a language.
 * @param {string} language - Language code (e.g., 'en', 'es').
 * @param {string} key - Translation key to retrieve.
 * @return {string} - The translated string.
 */
function getTranslation(language, key) {
	const context = getContext();
	const effectiveLang = (context && context.langOverride) || language || DEFAULT_LANG;

	const lang = translationMsg[effectiveLang] || translationMsg[DEFAULT_LANG];
	return (lang && lang[key]) || null;
}

// Export the function
module.exports = { getTranslation };