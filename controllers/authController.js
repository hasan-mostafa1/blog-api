const { matchedData } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { prisma } = require("../lib/prisma");
const auth = require("../middlewares/authMiddleware");
const userValidator = require("../validators/userValidator");
const utils = require("../lib/utils");

module.exports.signup = [
  userValidator.validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password } = matchedData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      },
    });

    const jwt = utils.issueJwt(user);
    res.status(200).json({
      success: true,
      user,
      token: jwt.token,
      expiresIn: jwt.expiresIn,
    });
  },
];

module.exports.login = [
  userValidator.validateLogin,
  async (req, res) => {
    const { email, password } = matchedData(req);
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "email or password is incorrect.",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const jwt = utils.issueJwt(user);
      return res.status(200).json({
        success: true,
        user,
        token: jwt.token,
        expiresIn: jwt.expiresIn,
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "email or password is incorrect.",
      });
    }
  },
];

module.exports.profile = [
  auth,
  (req, res) => res.status(200).json({ user: req.user }),
];
