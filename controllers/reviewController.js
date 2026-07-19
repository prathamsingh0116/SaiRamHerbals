const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ================================
// Add Review
// ================================

module.exports.createReview = async (req, res) => {

    try {

        const { id } = req.params;

        const { rating, comment } = req.body;

        const product = await Product.findOne({

    slug: id

});


        if (!rating || rating < 1 || rating > 5) {

    req.flash("error", "Please select a valid rating.");

    return res.redirect(`/products/${product.slug}`);

}

if (!comment || comment.trim().length < 10) {

    req.flash("error", "Review must be at least 10 characters.");

    return res.redirect(`/products/${product.slug}`);

}


        if (!product) {

            req.flash("error", "Product not found.");

            return res.redirect("/products");

        }

        // Already Reviewed
        const alreadyReviewed = await Review.findOne({

            product: product._id,

            user: req.user._id

        });

        if (alreadyReviewed) {

            req.flash("error", "You already reviewed this product.");

            return res.redirect(`/products/${id}`);

        }

        // Verified Purchase
      const purchased = await Order.findOne({

    user: req.user._id,

    "items.product": product._id,

    status: "Delivered"

});

        const review = new Review({

            rating,

            comment,

            user: req.user._id,

            product: product._id,

            isVerifiedPurchase: !!purchased

        });

        await review.save();

        product.reviews.push(review._id);

        await product.save();

        req.flash("success", "Review added successfully.");

        return res.redirect(`/products/${product.slug}`);

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to add review.");

        res.redirect("back");

    }

};


module.exports.updateReview = async (req, res) => {

    res.send("Update Review");

};

module.exports.deleteReview = async (req, res) => {

    try {

        const { id, reviewId } = req.params;

        const product = await Product.findOne({ slug: id });

        if (!product) {

            req.flash("error", "Product not found.");

            return res.redirect("/products");

        }

        const review = await Review.findById(reviewId);

        if (!review) {

            req.flash("error", "Review not found.");

            return res.redirect(`/products/${product.slug}`);

        }

        // Sirf review owner ya admin delete kar sakta hai
        if (
            review.user.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {

            req.flash("error", "You are not authorized.");

            return res.redirect(`/products/${product.slug}`);

        }

        await Product.findByIdAndUpdate(product._id, {

            $pull: {

                reviews: review._id

            }

        });

        await Review.findByIdAndDelete(review._id);

        req.flash("success", "Review deleted successfully.");

        return res.redirect(`/products/${product.slug}`);

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to delete review.");

        return res.redirect("back");

    }

};