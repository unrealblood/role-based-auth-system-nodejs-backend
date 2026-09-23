import { body, validationResult } from "express-validator";

function validateClientData(req, res, next) {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    next();
}

export const registerUserValidationRules = [
    body("username")
        .isString()
        .withMessage("username field should be a string")
        .isLength({min: 3, max: 10})
        .withMessage("username field should be at least 3 and max 10 characters long"),

    body("email")
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .isLength({min: 3})
        .withMessage("Password should be at least 3 characters long"),
    validateClientData
];