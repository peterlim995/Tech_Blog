const router = require('express').Router();
const { Blog, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all blogs and JOIN with user data
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
      order:[
        ['date_created','DESC' ]
      ]
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: ['comment', 'date_created', 'user_id'],
        },
        {
          model: User,
          attributes: ['name'],
        },
      ],
      order: [
        [{model: Comment}, 'date_created', 'DESC'],
      ]
    });

    const blog = blogData.get({ plain: true });
    console.log("blog", blog);

    if (blog.comments.length) {

      const users = blog.comments.map(comment => comment.user_id);

      console.log("users: ", users);

      // Getting user data for the comment
      const userNamesData = [];


      for (const id of users) {
        userNamesData.push(await User.findByPk(id, {
          attributes: { exclude: ['password'] }
        }));
      }

      const userNames = userNamesData.map((user) => user.get({ plain: true }));


      console.log('User Names: ', userNames);

      // Update blog comment object with user name
      for (let i = 0; i < blog.comments.length; i++) {
        const comment = blog.comments[i];
        const newComment = {
          name: userNames[i].name,
          ...comment
        }
        blog.comments[i] = newComment;
      }

      console.log("new Blog: ", blog);
    }
    res.render('blog-detail', {
      ...blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
      order: [
        [{model: Blog}, 'date_created', 'DESC'],
      ]
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blog/edit/:id',withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id);

    const blog = blogData.get({ plain: true });
    console.log("blog", blog);
    
    res.render('blog-edit', {
      ...blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get('/blog', withAuth, async (req, res) => {
  res.render('blog', {
    logged_in: req.session.logged_in
  });
});

// router.get('/comment', withAuth, async (req, res) => {
//   res.render('comment', {
//     logged_in: req.session.logged_in
//   });
// });

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('signup');
});

router.get('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect('/');
      return;
    });
  } else {
    res.status(404).end();
  }
});


module.exports = router;
