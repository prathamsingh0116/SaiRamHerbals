const express = require("express");
const router = express.Router();


const adminOrderController = require("../../controllers/adminOrderController");

// Orders List
router.get("/", adminOrderController.index);

router.get("/:id", adminOrderController.show);

router.put(
    "/:id/status",
    adminOrderController.updateStatus
);

router.delete(
    "/:id",
    adminOrderController.deleteOrder
);

router.patch(
"/:id/mark-paid",
adminOrderController.markPaid
);




module.exports = router;