// ======================================
// Imports
// ======================================

const express = require("express");
const router = express.Router();

const adminProductController = require("../../controllers/adminProductController");
const uploadProductImage = require("../../middleware/uploadProductImage");

// ======================================
// Product Routes
// ======================================

// Product List
router.get("/", adminProductController.index);

// SKU Availability
router.get("/check-sku", adminProductController.checkSKU);

// Add Product
router.get("/new", adminProductController.renderNewForm);
router.post(
    "/",
    uploadProductImage.array("images",5),
    adminProductController.createProduct
);

// Edit Product
router.get("/:id/edit", adminProductController.renderEditForm);
router.put(
    "/:id",
    uploadProductImage.array("images",5),
    adminProductController.updateProduct
);

router.delete(
    "/:id/image/:index",
    adminProductController.deleteProductImage
);

// Product Details
router.get("/:id", adminProductController.showProduct);

// Delete Product
router.delete("/:id", adminProductController.deleteProduct);




// ======================================
// Export
// ======================================

module.exports = router;