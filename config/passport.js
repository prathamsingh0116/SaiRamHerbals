const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

passport.use(

    new GoogleStrategy(

        {

            clientID: process.env.GOOGLE_CLIENT_ID,

            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            callbackURL: process.env.GOOGLE_CALLBACK_URL

        },

        async (accessToken, refreshToken, profile, done) => {

            try {

                // ===========================
                // Get Google Data
                // ===========================

                const googleId = profile.id;

                const email = profile.emails[0].value;

                const fullName = profile.displayName;

                const photo = profile.photos?.[0]?.value || "";

                // ===========================
                // Existing Google User
                // ===========================

                let user = await User.findOne({

                    googleId

                });

                if (user) {

                    user.lastLogin = new Date();

                    await user.save();

                    return done(null, user);

                }

                // ===========================
                // Existing Email User
                // ===========================

                user = await User.findOne({

                    email

                });

                if (user) {

                    user.googleId = googleId;

                    user.lastLogin = new Date();

                    if (!user.profileImage.url) {

                        user.profileImage = {

                            url: photo,

                            filename: ""

                        };

                    }

                    await user.save();

                    return done(null, user);

                }

                // ===========================
                // New User
                // ===========================

                user = await User.create({

                    fullName,

                    email,

                    googleId,

                    password: null,

                    phone: null,

                    role: "customer",

                    isVerified: true,

                    profileImage: {

                        url: photo,

                        filename: ""

                    },

                    lastLogin: new Date()

                });

                return done(null, user);

            }

            catch (err) {

                return done(err, null);

            }

        }

    )

);

// ===========================
// Serialize
// ===========================

passport.serializeUser((user, done) => {

    done(null, user.id);

});

// ===========================
// Deserialize
// ===========================

passport.deserializeUser(async (id, done) => {

    try {

        const user = await User.findById(id);

        done(null, user);

    }

    catch (err) {

        done(err, null);

    }

});

module.exports = passport;