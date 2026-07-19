const transporter = require("../utils/sendEmail");

module.exports.contact = async (req, res) => {

    try {

        const {

            fullName,

            email,

            phone,

            subject,

            message

        } = req.body;

        if (
            !fullName ||
            !email ||
            !phone ||
            !subject ||
            !message
        ) {

            req.flash("error", "All fields are required.");

            return res.redirect("/contact");

        }

        await transporter.sendMail({

            from: `"SaiRam Herbals Website" <${process.env.EMAIL_USER}>`,

            to: process.env.CONTACT_EMAIL,

            replyTo: email,

            subject: `📩 ${subject}`,

            html: `

            <div style="font-family:Arial,sans-serif;background:#f7f7f7;padding:30px;">

                <div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #ddd;">

                    <div style="background:#2e7d32;color:#fff;padding:20px;text-align:center;">

                        <h2 style="margin:0;">🌿 SaiRam Herbals</h2>

                        <p style="margin:8px 0 0;">
                            New Contact Form Submission
                        </p>

                    </div>

                    <div style="padding:30px;">

                        <table style="width:100%;border-collapse:collapse;">

                            <tr>

                                <td style="padding:10px;font-weight:bold;">👤 Name</td>

                                <td>${fullName}</td>

                            </tr>

                            <tr>

                                <td style="padding:10px;font-weight:bold;">📧 Email</td>

                                <td>${email}</td>

                            </tr>

                            <tr>

                                <td style="padding:10px;font-weight:bold;">📱 Phone</td>

                                <td>${phone}</td>

                            </tr>

                            <tr>

                                <td style="padding:10px;font-weight:bold;">📝 Subject</td>

                                <td>${subject}</td>

                            </tr>

                        </table>

                        <hr>

                        <h3>Customer Message</h3>

                        <div style="background:#f4f4f4;padding:18px;border-radius:8px;line-height:1.8;">

                            ${message}

                        </div>

                    </div>

                    <div style="background:#f8f8f8;padding:18px;text-align:center;font-size:13px;color:#777;">

                        This email was sent from the SaiRam Herbals Contact Form.

                    </div>

                </div>

            </div>

            `

        });

        req.flash("success", "Your message has been sent successfully.");

        res.redirect("/contact");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to send message. Please try again later.");

        res.redirect("/contact");

    }

};