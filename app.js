const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/rest_blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

//Adding a pattern or schema
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

// Restful Routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// INDEX
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { blogs: blogs });
    }
  });
});

// NEW
app.get('/new', (req, res) => {
  res.render('new');
});
// CREATE
app.post('/blogs', (req, res) => {
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render('/new');
    } else {
      res.redirect('/blogs');
    }
  });
});

// SHOW Route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('show', { blog: foundBlog });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
