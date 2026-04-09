const { matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");
const {
  postResource,
  postResourceArray,
} = require("../resources/postResource");
const postValidator = require("../validators/postValidator");

module.exports.index = [
  postValidator.validateQueryString,
  async (req, res) => {
    // Filtering
    const { title, content, sort, page, limit } = matchedData(req);
    const whereClause = { published: true };

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
    if (sort) {
      sortList = [];
      const sortQuery = sort;
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
    const currentPage = page || 1;
    const recordsLimit = limit || 10;
    const skip = (currentPage - 1) * recordsLimit;
    const totalItems = await prisma.post.count({ where: whereClause });
    const totalPages = Math.ceil(totalItems / recordsLimit);
    // Getting the data
    const posts = await prisma.post.findMany({
      skip: skip,
      take: recordsLimit,
      where: whereClause,
      orderBy: sortList,
      include: {
        author: true,
      },
    });

    res.status(200).json({
      success: true,
      data: postResourceArray(posts),
      meta: {
        currentPage: currentPage,
        totalPages: totalPages,
        itemsPerPage: recordsLimit,
        totalItems: totalItems,
      },
    });
  },
];

module.exports.show = [
  postValidator.publishedPostExists,
  async (req, res) => {
    const post = req.post;
    res.status(200).json({
      success: true,
      data: postResource(post),
    });
  },
];

module.exports.increaseLikes = [
  postValidator.publishedPostExists,
  async (req, res) => {
    await prisma.post.update({
      where: { id: req.post.id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
    res.sendStatus(200);
  },
];

module.exports.decreaseLikes = [
  postValidator.publishedPostExists,
  async (req, res) => {
    if (req.post.likes > 0) {
      await prisma.post.update({
        where: { id: req.post.id },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });
    }
    res.sendStatus(200);
  },
];
