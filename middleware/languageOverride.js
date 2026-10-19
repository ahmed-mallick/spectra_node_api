const { runWithContext } = require("../context");

function languageOverrideMiddleware(req, res, next) {
	let langOverride = null;

	const clientType = req.headers["x-client-type"];
	const clientLang = req.headers["x-client-lang"];

	if (clientType === "branch-internal" && clientLang) {
		langOverride = clientLang;
	}

	runWithContext({ langOverride }, () => next());
}

module.exports = languageOverrideMiddleware;