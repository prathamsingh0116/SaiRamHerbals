const Product = require("../models/Product");
const { cloudinary } = require("../config/cloudinary");

// ======================================
// Product List
// ======================================

module.exports.index = async (req, res) => {

    try {

        const search = (req.query.search || "").trim();

        let query = {};

        if (search) {

            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { brand: { $regex: search, $options: "i" } },
                    { sku: { $regex: search, $options: "i" } }
                ]
            };

        }

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .lean();

        res.render("admin/products/index", {

            title: "Products",

            productCSS: "product-table",

            currentPage: "products",
            pageCSS:"products",
            pageJS:"products",

            products,

            search

        });

    } catch (err) {

        console.error(err);

        req.flash(
            "error",
            "Unable to load products."
        );

        res.redirect("/admin");

    }

};


// ======================================
// Show Product
// ======================================

module.exports.showProduct = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {

            req.flash("error", "Invalid Product ID.");

            return res.redirect("/admin/products");

        }

        const product = await Product.findById(id).lean();

        if (!product) {

            req.flash("error", "Product not found.");

            return res.redirect("/admin/products");

        }

        res.render("admin/products/show", {

            title: "Product Details",

            pageCSS: false,

            productCSS: "product-card",

            currentPage: "products",

            product

        });

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to load product.");

        res.redirect("/admin/products");

    }

};

// ======================================
// Render Add Product Page
// ======================================

module.exports.renderNewForm = (req, res) => {

    res.render("admin/products/new", {

        title: "Add Product",

        productCSS: "product-table",
            
        pageCSS:"products",
        
        pageJS:"products",


        currentPage: "products"

    });

};

// ======================================
// Create Product
// ======================================

module.exports.createProduct = async (req, res) => {

    try {

        let {

    name,
    brand,
    category,
    sku,
    price,
    stock,
    discount,
    description,
    isFeatured,
    isActive

} = req.body;

        // -------------------------------
        // Required Fields Validation
        // -------------------------------

        if (!name || !category || !sku || !price) {

            req.flash(
                "error",
                "Please fill all required fields."
            );

            return res.redirect("/admin/products/new");

        }

        // -------------------------------
        // Generate Slug
        // -------------------------------

        const slug = name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");

        // -------------------------------
        // Duplicate SKU Check
        // -------------------------------

        const existingSKU = await Product.findOne({
            sku: sku.trim().toUpperCase()
        });

        if (existingSKU) {

            req.flash(
                "error",
                "SKU already exists."
            );

            return res.redirect("/admin/products/new");

        }

        // -------------------------------
        // Duplicate Slug Check
        // -------------------------------

        const existingSlug = await Product.findOne({
            slug
        });

        if (existingSlug) {

            req.flash(
                "error",
                "Product with same name already exists."
            );

            return res.redirect("/admin/products/new");

        }

        // ======================================================
// TODO : Cloudinary Migration
// Replace local upload with Cloudinary.
// ======================================================

const images = [];

if (req.files && req.files.length) {

    req.files.forEach(file => {

        images.push({

    url: file.path,

    filename: file.filename

});

    });

}

        // -------------------------------
        // Create Product
        // -------------------------------

        const product = new Product({

    name: name.trim(),

    slug,

    brand: brand?.trim(),

    category: category.trim(),

    sku: sku.trim().toUpperCase(),

    price,

    stock,

    discount,

    description,

    images,
    stock: Number(req.body.stock),

lowStockLimit: Number(req.body.lowStockLimit),

    isFeatured: isFeatured === "on",

    isActive: isActive === "on"

});

        await product.save();

       req.flash("success", "Product Added Successfully.");

return res.redirect("/admin/products");

    } catch (err) {

        console.error(err);

        req.flash(
            "error",
            "Unable to add product."
        );

        res.redirect("/admin/products/new");

    }

};

// ======================================
// Check SKU Availability
// ======================================

module.exports.checkSKU = async (req, res) => {

    try {

        let { sku } = req.query;

        // SKU Missing
        if (!sku) {

            return res.status(400).json({
                success: false,
                available: false,
                message: "SKU is required."
            });

        }

        // Clean SKU
        sku = sku.trim().toUpperCase();

        // Find Existing Product
        const existingProduct = await Product.findOne({ sku }).lean();

        if (existingProduct) {

            return res.json({
                success: true,
                available: false,
                message: "SKU already exists."
            });

        }

        return res.json({
            success: true,
            available: true,
            message: "SKU available."
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            available: false,
            message: "Something went wrong."
        });

    }

};

// ======================================
// Render Edit Product Page
// ======================================

module.exports.renderEditForm = async (req, res) => {

    try {

        const { id } = req.params;

        // -------------------------------
        // Validate Product ID
        // -------------------------------

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {

            req.flash(
                "error",
                "Invalid Product ID."
            );

            return res.redirect("/admin/products");

        }

        // -------------------------------
        // Find Product
        // -------------------------------

        const product = await Product.findById(id).lean();

        if (!product) {

            req.flash(
                "error",
                "Product not found."
            );

            return res.redirect("/admin/products");

        }

        // -------------------------------
        // Render Page
        // -------------------------------

        res.render("admin/products/edit", {

            title: "Edit Product",

            pageCSS: "editProduct",
            pageJS: "productEdit",

            productCSS: "productTable",


            currentPage: "products",

            product

        });

    } catch (err) {

        console.error(err);

        req.flash(
            "error",
            "Unable to load product."
        );

        res.redirect("/admin/products");

    }

};

// ======================================
// Update Product
// ======================================

module.exports.updateProduct = async (req, res) => {

    try {

        const { id } = req.params;

        // -------------------------------
        // Validate Product ID
        // -------------------------------

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {

            req.flash(
                "error",
                "Invalid Product ID."
            );

            return res.redirect("/admin/products");

        }

        let {
    name,
    brand,
    category,
    sku,
    price,
    stock,
    discount,
    description,
    isFeatured,
    isActive
} = req.body;

        // -------------------------------
        // Required Validation
        // -------------------------------

        if (!name || !category || !sku || !price) {

            req.flash(
                "error",
                "Please fill all required fields."
            );

            return res.redirect(`/admin/products/${id}/edit`);

        }

        if (Number(price) < 0) {

    req.flash(

        "error",

        "Price cannot be negative."

    );

    return res.redirect("/admin/products/new");

}

if (Number(stock) < 0) {

    req.flash(

        "error",

        "Stock cannot be negative."

    );

    return res.redirect("/admin/products/new");

}

        // -------------------------------
        // Clean Data
        // -------------------------------

        name = name.trim();
        brand = brand.trim();
        category = category.trim();
        sku = sku.trim().toUpperCase();

        const slug = name
            .toLowerCase()
            .replace(/\s+/g, "-");

        // -------------------------------
        // Duplicate SKU Check
        // -------------------------------

        const existingSKU = await Product.findOne({

            sku,

            _id: { $ne: id }

        });

        if (existingSKU) {

            req.flash(
                "error",
                "SKU already exists."
            );

            return res.redirect(`/admin/products/${id}/edit`);

        }

        // -------------------------------
        // Duplicate Slug Check
        // -------------------------------

        const existingSlug = await Product.findOne({

            slug,

            _id: { $ne: id }

        });

        if (existingSlug) {

            req.flash(
                "error",
                "Another product with same name already exists."
            );

            return res.redirect(`/admin/products/${id}/edit`);

        }


 

        // -------------------------------
        // Update Product
        // -------------------------------

const existingProduct = await Product.findById(id);

if (!existingProduct) {

    req.flash(
        "error",
        "Product not found."
    );

    return res.redirect(`/admin/products/${id}/edit`);

}

       // ======================================================
// TODO : Cloudinary Migration
//
// Replace local delete/upload logic with
// cloudinary.uploader.destroy()
// ======================================================

let images = existingProduct.images || [];

// Upload New Images
if (req.files && req.files.length) {

    if (images.length + req.files.length > 5) {

        req.flash(
            "error",
            "Maximum 5 images allowed."
        );

        return res.redirect(`/admin/products/${id}/edit`);

    }

    const newImages = req.files.map(file => ({

        url: file.path,

        filename: file.filename

    }));

    images.push(...newImages);

}
        await Product.findByIdAndUpdate(

            id,

            {

    name,

    slug,

    brand,

    category,

    sku,

    price,

    stock,

    discount,

    description,

    images,
    stock: Number(req.body.stock),

lowStockLimit: Number(req.body.lowStockLimit),

    isFeatured: isFeatured === "on",

    isActive: isActive === "on"

},

            {

                runValidators: true

            }

        );

        req.flash(

            "success",

            "Product Updated Successfully."

        );

        res.redirect("/admin/products");

    } catch (err) {

        console.error(err);

        req.flash(

            "error",

            "Unable to update product."

        );

        res.redirect(`/admin/products/${req.params.id}/edit`);

    }

};

module.exports.deleteProductImage = async (req, res) => {

    try {

        const { id, index } = req.params;

        const product = await Product.findById(id);

        if (!product) {

            req.flash("error", "Product not found.");

            return res.redirect("/admin/products");

        }

        if (product.images.length <= 1) {

            req.flash(
                "error",
                "At least one image is required."
            );

            return res.redirect(`/admin/products/${id}/edit`);

        }

        const image = product.images[index];

        if (!image) {

            req.flash("error", "Image not found.");

            return res.redirect(`/admin/products/${id}/edit`);

        }

        // Delete local file
        await cloudinary.uploader.destroy(image.filename);
        const result = await cloudinary.uploader.destroy(image.filename);

if (result.result !== "ok" && result.result !== "not found") {
    throw new Error("Failed to delete image from Cloudinary.");
}

        product.images.splice(index, 1);

        await product.save();

        req.flash(
            "success",
            "Image removed successfully."
        );

           return res.json({

    success:true,

    totalImages:product.images.length

});

        res.redirect(`/admin/products/${id}/edit`);
     

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to delete image.");
        return res.status(400).json({

    success:false,

    message:"Unable to delete image."

});

        res.redirect("/admin/products");

    }

};

// ======================================
// Delete Product
// ======================================

module.exports.deleteProduct = async (req, res) => {

    try {

        const { id } = req.params;

        // -------------------------------
        // Validate Product ID
        // -------------------------------

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {

            req.flash(
                "error",
                "Invalid Product ID."
            );

            return res.redirect("/admin/products");

        }

        // -------------------------------
        // Find Product
        // -------------------------------

        const product = await Product.findById(id);

        if (!product) {

            req.flash(
                "error",
                "Product not found."
            );

            return res.redirect("/admin/products");

        }

        // -------------------------------
        // Delete Product
        // -------------------------------

        for (const image of product.images) {

    if (image.filename) {

        await cloudinary.uploader.destroy(image.filename);

    }

}
        
    await Product.findByIdAndDelete(id);
    
    req.flash(
            "success",
            "Product Deleted Successfully."
        );

        res.redirect("/admin/products");

    } catch (err) {

        console.error(err);

        req.flash(
            "error",
            "Unable to delete product."
        );

        res.redirect("/admin/products");

    }

};