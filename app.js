const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");

const app = express();

app.get("/", (req, res) => {
  const posts = postBank.list();
  express.static(__dirname + "/public");
  app.use(morgan("dev"));
  app.use(express.static("public"));

  const html = `<!DOCTYPE html>
  
  <head>
  <title>Wizard News</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="news-list">
    <header><img src="/logo.png"/>Wizard News</header>
    ${posts
      .map(
        (post) => `
      <div class='news-item'>
        <p>
          <span class="news-position">${post.id}. ▲</span>
          <a href="/posts/${post.id}">${post.title}</a>
          <small>(by ${post.name})</small>
        </p>
        <small class="news-info">
          ${post.upvotes} upvotes | ${post.date}
        </small>
      </div>`
      )
      .join("")}
  </div>
</body>
</html>`;

  res.send(html);
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(req.params.id);
  express.static(__dirname + "/public");
  app.use(morgan("dev"));
  app.use(express.static("public"));
  if (!post.id) {
    throw new Error("Not Found");
  }
  res.send(`<!DOCTYPE html>
  
  <head>
  <title>Wizard News</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="news-list">
    <header><img src="/logo.png"/>Wizard News</header>
   
      <div class='news-item'>
        <p>
          <span class="news-position">${post.id}. ▲</span>
          ${post.title}
          <p class="post-content">${post.content}</p>
          <small>(by ${post.name})</small>
        </p>
        <small class="news-info">
          ${post.upvotes} upvotes | ${post.date}
        </small>
      </div>`);

  // res.send(post);
});
const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
