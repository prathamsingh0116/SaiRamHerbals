const ExpressError = require("../utils/ExpressError");

const { addressSchema } = require("../schemas/addressSchema");

module.exports.validateAddress = (req,res,next)=>{

    const { error } = addressSchema.validate(req.body);

    if(error){

        const message = error.details.map(el=>el.message).join(",");

        throw new ExpressError(400,message);

    }

    next();

};