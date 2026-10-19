// middleware/transactionContext.js
const { runWithContext } = require('../utils/context');
const utils = require('../utils/utils');

module.exports = (req, res, next) => {
    // Use existing transactionid or generate a new one
    const tid = req.body?.transactionid || req.query?.transactionid || utils.generateUUID();
    req.transactionId = tid;
    req.transactionid = tid;
    req.body.transactionid = tid;
    req.query.transactionid = tid;
    res.locals.transactionId = tid;

    // Run the rest of the request processing inside the context
    runWithContext(tid, () => {
        next();
    });
};