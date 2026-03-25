const { prisma } = require("../../lib/prisma");
const auth = require("../../middlewares/authMiddleware");
const isAdmin = require("../../middlewares/isAdminMiddleware");
const {
  userResource,
  userResourceArray,
} = require("../../resources/userResource");
const userValidator = require("../../validators/userValidator");

module.exports.index = [
  auth,
  isAdmin,
  userValidator.validateQueryString,
  async (req, res) => {
    // Filtering
    const { firstName, lastName, email, role } = req.query;
    const whereClause = {};

    if (firstName) {
      whereClause.firstName = {
        contains: firstName,
        mode: "insensitive",
      };
    }
    if (lastName) {
      whereClause.lastName = {
        contains: lastName,
        mode: "insensitive",
      };
    }
    if (email) {
      whereClause.email = email;
    }
    if (role) {
      whereClause.role = role;
    }

    // Sorting
    let sortList = [
      {
        id: "asc",
      },
    ];
    if (req.query.sort) {
      sortList = [];
      const sortQuery = req.query.sort;
      sortQuery.split(",").forEach((item) => {
        let order;
        if (item.at(0) === "-") {
          order = "desc";
        } else {
          order = "asc";
        }
        sortList.push({
          [item.slice(1)]: order,
        });
      });
      req.query.page = 1;
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    const totalItems = await prisma.user.count({ where: whereClause });
    const totalPages = Math.ceil(totalItems / limit);

    // Getting the data
    const users = await prisma.user.findMany({
      skip: skip,
      take: limit,
      where: whereClause,
      orderBy: sortList,
    });

    res.status(200).json({
      success: true,
      data: userResourceArray(users),
      meta: {
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
        totalItems: totalItems,
      },
    });
  },
];

module.exports.show = [
  auth,
  isAdmin,
  async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: +req.params.userId },
    });

    if (!user) {
      res.status(404).json({ msg: "User not found!" });
    }
    res.status(200).json({
      success: true,
      data: userResource(user),
    });
  },
];

module.exports.destroy = [
  auth,
  isAdmin,
  async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: +req.params.userId },
    });
    if (!user) {
      res.status(404).json({ msg: "User not found!" });
    }

    await prisma.user.delete({
      where: { id: +req.params.userId },
    });

    res.sendStatus(204);
  },
];
