const upload = require("../../config/multer");
const { prisma } = require("../../lib/prisma");
const auth = require("../../middlewares/authMiddleware");
const isAdmin = require("../../middlewares/isAdminMiddleware");
const {
  postResource,
  postResourceArray,
} = require("../../resources/postResource");
const postValidator = require("../../validators/postValidator");
const fs = require("node:fs/promises");
const { matchedData } = require("express-validator");

module.exports.index = [
  auth,
  isAdmin,
  postValidator.validateQueryString,
  async (req, res) => {
    // Filtering
    const { title, content } = req.query;
    const whereClause = {};

    if (title) {
      whereClause.title = {
        contains: title,
        mode: "insensitive",
      };
    }
    if (content) {
      whereClause.content = {
        contains: content,
        mode: "insensitive",
      };
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
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const totalItems = await prisma.post.count({ where: whereClause });
    const totalPages = Math.ceil(totalItems / limit);
    // Getting the data
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      skip: skip,
      take: limit,
      where: whereClause,
      orderBy: sortList,
    });

    res.status(200).json({
      success: true,
      data: postResourceArray(posts),
      meta: {
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
        totalItems: totalItems,
      },
    });
  },
];

module.exports.store = [
  auth,
  isAdmin,
  upload.single("bannerImage"),
  postValidator.validatePost,
  async (req, res) => {
    const { title, content, published } = matchedData(req);
    const post = await prisma.post.create({
      data: {
        title: title,
        content: content,
        bannerImage: req.file?.path,
        published: published,
        author: {
          connect: { id: req.user.id },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: postResource(post),
    });
  },
];

module.exports.show = [
  auth,
  isAdmin,
  postValidator.postExists,
  async (req, res) => {
    const post = req.post;
    res.status(200).json({
      success: true,
      data: postResource(post),
    });
  },
];

module.exports.update = [
  auth,
  isAdmin,
  postValidator.postExists,
  upload.single("bannerImage"),
  postValidator.validatePost,
  async (req, res) => {
    const { title, content, published } = matchedData(req);
    let bannerImagePath = req.post.bannerImage;
    if (req.file) {
      bannerImagePath = req.file.path;
    } else if (req.body.bannerImage === null || req.body.bannerImage === "") {
      bannerImagePath = null;
    }

    const post = await prisma.post.update({
      where: { id: req.post.id },
      data: {
        title: title,
        content: content,
        bannerImage: bannerImagePath,
        published: published,
      },
    });

    if (
      req.post.bannerImage &&
      (req.file || req.body.bannerImage === null || req.body.bannerImage === "")
    ) {
      await fs.unlink(req.post.bannerImage);
    }

    res.status(200).json({
      success: true,
      data: postResource(post),
    });
  },
];

module.exports.destroy = [
  auth,
  isAdmin,
  postValidator.postExists,
  async (req, res) => {
    const post = req.post;

    const bannerImagePath = post.bannerImage;
    await prisma.post.delete({
      where: { id: req.params.postId },
    });
    if (bannerImagePath) {
      await fs.unlink(bannerImagePath);
    }
    res.sendStatus(204);
  },
];
