const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

app.get("/", (req, res) => {
  res.render("home", { posts: posts });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
});

app.get("/posts/:postTitle", (req, res) => {
  const requestedTitle = req.params.postTitle.toLowerCase();
  const foundPost = posts.find(p => p.title.toLowerCase() === requestedTitle);

  if (foundPost) {
    res.render("post", { title: foundPost.title, content: foundPost.content });
  } else {
    res.status(404).send("Post not found");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
