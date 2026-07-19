const express = require("express");

const router = express.Router();

const adminCouponController = require("../../controllers/adminCouponController");

const isAdmin = require("../../middleware/isAdmin");

router.get("/", isAdmin, adminCouponController.index);

router.get("/new", isAdmin, adminCouponController.renderNewForm);

router.post("/", isAdmin, adminCouponController.create);

router.get("/:id/edit", isAdmin, adminCouponController.renderEditForm);

router.put("/:id", isAdmin, adminCouponController.update);

router.delete("/:id", isAdmin, adminCouponController.destroy);

module.exports = router;