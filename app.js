const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");
const path = require("path");

const app = express();
const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  const posts = postBank.list();
  const html = `<!DOCTYPE html>
        <html lang="en">
            <head>
                <title>Wizard News</title>
                <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
                <div class="news-list">
                    <header>
                        <img src="/logo.png"/>
                        Wizard News
                    </header>
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

app.get("/posts/:id", (req, res, next) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
  } else {
    const html = `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>Wizard News</title>
                    <link rel="stylesheet" href="/style.css" />
                </head>
                <body>
                    <div class="news-list">
                        <header>
                            <img src="/logo.png"/>
                            Wizard News
                        </header>
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
                        </div>
                    </div>
                </body>
            </html>`;
    res.send(html);
  }
});

const { PORT = 1337 } = process.env;
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
