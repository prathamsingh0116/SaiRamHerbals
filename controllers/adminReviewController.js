const Review = require("../models/Review");
// ======================================
// Review List
// ======================================

module.exports.index = async (req, res) => {

    try {
        

        const search = req.query.search || "";

let reviews = [];

if (search) {

    reviews = await Review.find()

        .populate({

            path: "user",

            match: {

                $or: [

                    { fullName: { $regex: search, $options: "i" } },

                    { email: { $regex: search, $options: "i" } }

                ]

            }

        })

        .populate({

            path: "product",

            match: {

                name: {

                    $regex: search,

                    $options: "i"

                }

            }

        })

        .sort({

            createdAt: -1

        });

    // Comment search bhi add karo

    reviews = reviews.filter(review =>

        review.user ||

        review.product ||

        review.comment.toLowerCase().includes(search.toLowerCase())

    );

} else {

    reviews = await Review.find()

        .populate("user")

        .populate("product")

        .sort({

            createdAt: -1

        });

}

 
        const rating = req.query.rating || "";
        const total = await Review.countDocuments();

        const verified = await Review.countDocuments({

            isVerifiedPurchase: true

        });

        const oneStar = await Review.countDocuments({

            rating: 1

        });


        let query = {};

if(rating){

    query.rating = Number(rating);

}

if(verified){

    query.isVerifiedPurchase = verified==="true";

}
        const avg = await Review.aggregate([

            {

                $group: {

                    _id: null,

                    average: {

                        $avg: "$rating"

                    }

                }

            }

        ]);

        const stats = {

            total,

            verified,

            oneStar,

            average: avg.length ? avg[0].average.toFixed(1) : "0.0"

        };

        res.render("admin/reviews/index", {

           title: "Reviews",

            pageCSS: "review",
            pageJS: false,
            productCSS: false,
            currentPage: "reviews",

            reviews,
            rating,
            verified,

            stats,

            search

        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to load reviews.");

        res.redirect("/admin");

    }

};



// ======================================
// Single Review
// ======================================

module.exports.show = async (req, res) => {

    try {

        const review = await Review.findById(req.params.id)

            .populate("user")

            .populate("product");

        if (!review) {

            req.flash("error", "Review not found.");

            return res.redirect("/admin/reviews",{
                

           title: "Reviews",

            pageCSS: "review",
            pageJS: false,
            productCSS: false,
            currentPage: "Review",
            });

        }

        res.render("admin/reviews/show", {
            
           title: "Reviews",

            pageCSS: "review",
            pageJS: false,
            productCSS: false,
            currentPage: "Review",
            review

        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        res.redirect("/admin/reviews",{
            
           title: "Reviews",

            pageCSS: "adminReview",
            pageJS: false,
            productCSS: false,
            currentPage: "Review",
        });

    }

};



// ======================================
// Delete Review
// ======================================

module.exports.destroy = async (req, res) => {

    try {

        const review = await Review.findById(req.params.id);

        if (!review) {

            req.flash("error", "Review not found.");

            return res.redirect("/admin/reviews");

        }

        const Product = require("../models/Product");

        await Product.findByIdAndUpdate(

            review.product,

            {

                $pull: {

                    reviews: review._id

                }

            }

        );

        await Review.findByIdAndDelete(review._id);

        req.flash(

            "success",

            "Review deleted successfully."

        );

        res.redirect("/admin/reviews");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to delete review.");

        res.redirect("/admin/reviews");

    }

};