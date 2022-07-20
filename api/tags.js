const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next(); // THIS IS DIFFERENT
});


tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
  
    res.send({
      tags
    });
  });

  tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const tagName = req.params.tagName;
    // read the tagname from the params
    try {
        
       const allPosts = await getPostsByTagName(tagName);
      
        const posts = allPosts.filter(post => {
           
        if (post.active) {

            return true;
          }
        
        //   the post is not active, but it belogs to the current user
          if (req.user && post.author.id === req.user.id) {
            return true;
          }
        
          // none of the above are true
          return false;
        // keep a post if it is either active, or if it belongs to the current user
      });
      // use our method to get posts by tag name from the db
      res.send({posts:posts})
      // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {

        next({ name, message });
      // forward the name and message to the error handler
    }
  });

module.exports = tagsRouter;