const router = require("express").Router();
const appointmentController = require("../controllers/appointmentController");
const controller = require("../controllers/ticketController");
const customerController = require("../controllers/customerController");

// Define routes with lowercase paths to match normalized request paths
router.post("/issueticket", controller.ticketIssue);
router.post("/getbranchid", controller.getBranchId);
router.post("/getrabbitmqip", controller.getRabbitMQIP);
router.post("/getwaitingtickets", controller.getWaitingTicketData);
router.post("/getoperatorrole", controller.getOperatorRoleFromBranchId);
router.post("/opencounter", controller.openCounter);
router.post("/closecounter", controller.closeCounter);
router.post("/noshowticket", controller.noShowTicket);
router.post("/randomcallticket", controller.randomCallTicket);
router.post("/setprofileid", controller.setProfileId);
router.get("/getcategorywaitinglist", controller.getCategoryWaitingList);
router.post("/postprocessingticket", controller.postProcessingTicket);
router.post("/startpostprocessingticket", controller.postProcessingTicket);
router.post("/endpostprocessingticket", controller.postProcessingTicket);
router.post("/getcounterinfo", controller.getCounterInfo);
router.post("/issueticketwithjourney", controller.issueTicketWithJourney);
router.post("/editticket", controller.editTicket);
router.post("/getcategories", controller.getCategories);
router.post("/transfercategoryticket", controller.transferCategoryTicket);
router.post("/transferuserticket", controller.transferUserTicket);
router.post("/transfercounterticket", controller.transferCounterTicket);
router.post("/transferbulkticket", controller.transferBulkTicket);
router.post("/addmatterticket", controller.addMatterTicket);
router.post("/callticket", controller.callTicket);
router.post("/serveticket", controller.serveTicket);
router.post("/waitticket", controller.waitTicket);
router.post("/recallticket", controller.recallTicket);
router.post("/activecountersdata", controller.activeCountersData);
router.post("/cancelticket", controller.cancelTicket);
router.post("/getclientregiondata", controller.getClientRegionData);
router.get("/insertcustomervisit", controller.insertCustomerVisit);
router.get("/checkcustomervisit", controller.checkCustomerVisit);
router.post("/setpayload", controller.setPayload);
router.get(
	"/getticketdetailsbyticketnumber",
	controller.getTicketDetailByTicketNumber
);
router.get("/updatereissuestatus", controller.updateReissueStatus);
router.post("/userbranchtransfer", controller.userBranchTransfer);
router.post("/getengineconfiguration", controller.getEngineConfiguration);
router.post("/silentrandomcallticket", controller.silentRandomCallTicket);
router.post("/getbranchip", controller.getBranchIP);
router.get("/getcountersdata", controller.getBranchCountersData);
router.get("/getcounters", controller.getBranchCounters);
router.post("/counterstartactivity", controller.counterStartActivity);
router.post("/counterendactivity", controller.counterEndActivity);
router.post("/ticketsetpriority", controller.ticketSetPriority);
router.post("/getbranchcanceldata", controller.getBranchCancelData);
router.post("/startservingticket", controller.startServingTicket);
router.post("/gettickettrackingsummary", controller.getTicketTrackingSummary);

//appointment
router.get("/getapptcategories", appointmentController.getApptCategories);
router.get("/getslotdetail", appointmentController.getSlotDetail);
router.get(
	"/getalldaysslotsofbranch",
	appointmentController.getAllDaysSlotsOfBranch
);
router.get("/getdisableddates", appointmentController.getDisabledDates);
router.get("/getnearestbranches", appointmentController.getNearestBranches);
router.get("/getbranchlist", appointmentController.getBranchList);
router.get(
	"/getbranchlistbycategory",
	appointmentController.getBranchListByCategory
);
router.post(
	"/rescheduleappointmentticket",
	appointmentController.rescheduleAppointmentTicket
);
//Issue Appointment Generic Method used by lobby leader and dashboard.
router.post(
	"/issueappointmentticket",
	appointmentController.IssueAppointmentTicket
);
// Wrapper for Appointment Issue User facing applications with extra validation and captcha verification per request.
router.post("/requestappointment", appointmentController.requestappointment);
router.get(
	"/cancelappointmentticket",
	appointmentController.cancelAppointmentTicket
);
router.post(
	"/cancelbulkappointmentticket",
	appointmentController.cancelBulkAppointmentTicket
);
router.get(
	"/verifyappointmentinfo",
	appointmentController.verifyAppointmentInfo_Json
);

router.get("/appointmentserved", appointmentController.appointmentServed);

router.post("/generateotp", appointmentController.generateOTP);
router.post("/validateotp", appointmentController.validateOTP);

router.get("/getproducttypes", appointmentController.getProductTypes);
router.get("/getproductfamilies", appointmentController.getProductFamilies);
router.get("/getphonemodels", appointmentController.getPhoneModels);
router.post("/branchevolution", appointmentController.branchEvolution);
router.post("/branchticketinfo", appointmentController.branchTicketInfo);
router.post(
	"/tickettrackingsummary",
	appointmentController.ticketTrackingSummary
);

router.get("/getallslotsofbranch", appointmentController.getAllSlotsOfBranch);
router.post(
	"/savecustomerdesiredappointments",
	appointmentController.saveCustomerDesiredAppointments
);
router.post("/getappointmentdata", appointmentController.getAppointmentData);
router.post(
	"/getvirtualbranchlist",
	appointmentController.getVirtualBranchList
);

//customer

// router.get("/searchcustomerbytype", customerController.searchCustomerbyType);
router.get("/getcustomerlist", customerController.getCustomerList);
router.post("/addcustomer", customerController.addCustomer);
router.post("/updatecustomer", customerController.updateCustomer);
router.get(
	"/searchcustomerbytype",
	customerController.getCustomersByMultipleType
);
router.post("/sharecustomerinfo", customerController.shareCustomerInfo);
router.post("/sendThirdPartyAlert", appointmentController.sendThirdPartyAlert);
router.post("/validateTicketIssuance", controller.validateTicketIssuance);
router.post("/encodeURLQuery", appointmentController.encodeURLQuery);
router.post("/decodeURLQuery", appointmentController.decodeURLQuery);
router.get("/getcustomerticketbyid", customerController.getCustomerTicketById);
router.get("/getcustomerhistory", customerController.getCustomerHistory);

// Drive Test routes
router.post("/addusersession", customerController.addUserSession);
router.post("/verifylicense", customerController.verifyLicense);
router.post("/lockslot", customerController.lockSlot);
router.post("/releaseslot", customerController.releaseSlot);
router.post(
	"/getcustomerappointmentsdata",
	customerController.getCustomerAppointmentData
);
router.post(
	"/getappointmentavailability",
	customerController.getAppointmentAvailability
);
router.get(
	"/appointment/density/service/:serviceID/:year/:month",
	customerController.getAppointmentDensity
);
router.post("/getbranchservesdata", controller.getBranchServesData);
router.post("/repeatcallticket", controller.repeatCallTicket);

router.post(
	"/sendbulkappointmentmessage",
	appointmentController.sendBulkAppointmentMessage
);
router.get("/fetchbranchconfiguration", controller.fetchBranchConfiguration);

router.post(
	"/getappointmentsauditlogs",
	appointmentController.getAppointmentsAuditLogs
);

router.get("/getcounterlist", controller.getCounterList);

router.post("/getticketagainstpayload", controller.getTicketAgainstPayload);

router.get("/getbranchwiseticketdata", controller.getBranchWiseTicketData);
router.get("/validatephoneno", controller.validatephoneno);
router.get("/checkdeltacounterstatus", controller.checkDeltaCounterStatus);

router.post("/verifyemailtoken", customerController.verifyEmailToken);

router.get("/gettransactionid", controller.getTransactionID);

router.post("/appointmentnotes", appointmentController.appointmentNotes);

router.get("/getappointmentnumber", appointmentController.getAppointmentNumber);

router.post("/getavgwaittimes", controller.getCategoryAvgWaitTimes);

router.post("/changeappointmentstate",appointmentController.changeAppointmentState);

router.post("/logapitransaction", appointmentController.logApiTransaction);

module.exports = router;
