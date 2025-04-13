const Joi = require('joi');
const { UserSchema } = require('../models/user');

const signupValidation = (req, res, next) => {
    console.log("sign");
    const schema = Joi.object({
        username: Joi.string().min(1).required(),
        password: Joi.string().min(2).max(20).required(),
        email: Joi.string().email().required(),  
    });
    
    const { error } = schema.validate(req.body);  
    
    if (error) {
        return res.status(400)
                 .json({ message: "bad Req", error: error.details }); 
    }
    next();
};


const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(1).required(),
        password: Joi.string().min(2).max(20).required(),
    });
    
    const { error } = schema.validate(req.body);  
    
    if (error) {
        return res.status(400)
                 .json({ message: "bad Req", error: error.details }); 
    }
    next();
};


module.exports = {signupValidation,loginValidation};