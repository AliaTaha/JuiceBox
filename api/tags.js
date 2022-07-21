const express = require("express");
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next(); // THIS IS DIFFERENT
});

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags,
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const tagName = req.params.tagName;
  // read the tagname from the params
  try {
    const allPosts = await getPostsByTagName(tagName);

    const posts = allPosts.filter((post) => {
      if (req.user) {
        let postOwner = false;
        if (req.user.id === post.author.id) {
          postOwner = true;
        }
        return (
          (post.active && post.author.active) ||
          (req.user && post.author.id === req.user.id) ||
          postOwner
        );
      }
      return (
        (post.active && post.author.active) ||
        (req.user && post.author.id === req.user.id)
      );
    });

    // use our method to get posts by tag name from the db
    res.send({ posts: posts });
    // send out an object to the client { posts: // the posts }
  } catch ({ name, message }) {
    next({ name, message });
    // forward the name and message to the error handler
  }
});

module.exports = tagsRouter;
