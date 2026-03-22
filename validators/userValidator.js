const { body, validationResult } = require("express-validator");

const validateSignup = [
  body("firstName")
    .exists()
    .withMessage("first name is required")
    .trim()
    .notEmpty()
    .withMessage("first name can't be empty")
    .isString()
    .withMessage("first name must be a string"),
  body("lastName")
    .exists()
    .withMessage("last name is required")
    .trim()
    .notEmpty()
    .withMessage("last name can't be empty")
    .isString()
    .withMessage("last name must be a string"),
  body("email")
    .exists()
    .withMessage("email is required")
    .trim()
    .notEmpty()
    .withMessage("email can't be empty")
    .isEmail()
    .withMessage("email is not a valid email address")
    .custom(async (value) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: value },
      });
      if (existingUser) {
        throw new Error("A user already exists with this email address!");
      }
      return true;
    }),
  body("password")
    .exists()
    .withMessage("password is required")
    .trim()
    .notEmpty()
    .withMessage("password can't be empty")
    .isLength({ min: 8 })
    .withMessage("password must contain at least 8 characters"),
  body("passwordConfirmation")
    .exists()
    .withMessage("password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation must match the password field!");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  body("email")
    .exists()
    .withMessage("email is required")
    .trim()
    .notEmpty()
    .withMessage("email can't be empty")
    .isEmail()
    .withMessage("email is not a valid email address"),
  body("password")
    .exists()
    .withMessage("password is required")
    .trim()
    .notEmpty()
    .withMessage("password can't be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateSignup, validateLogin };
