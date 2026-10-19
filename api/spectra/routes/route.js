const router = require("express").Router();
const appointmentController = require("../controllers/appointmentController");

router.get("/getapptcategories", appointmentController.getApptCategories);
router.get(
	"/getalldaysslotsofbranch",
	appointmentController.getAllDaysSlotsOfBranch,
);
router.get("/getdisableddates", appointmentController.getDisabledDates);
router.get("/getslotdetail", appointmentController.getSlotDetail);
router.get("/getnearestbranches", appointmentController.getNearestBranches);
router.get("/getbranchlist", appointmentController.getBranchList);
router.post("/getvirtualbranchlist", appointmentController.getVirtualBranchList);
router.get(
	"/getbranchlistbycategory",
	appointmentController.getBranchListByCategory,
);
router.get(
	"/cancelappointmentticket",
	appointmentController.cancelAppointmentTicket,
);

module.exports = router;