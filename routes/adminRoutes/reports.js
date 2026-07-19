const express = require("express");

const router = express.Router();

const wrapAsync = require("../../utils/wrapAsync");

const { isLoggedin, isAdmin } = require("../../middleware");

const reportController = require("../../controllers/adminReportController");

router.get(
    "/",
    isLoggedin,
    isAdmin,
    wrapAsync(reportController.index)
);

router.get(
    "/export/pdf",
    isLoggedin,
    isAdmin,
    wrapAsync(reportController.exportPDF)
);

module.exports = router;