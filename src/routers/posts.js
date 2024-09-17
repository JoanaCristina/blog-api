import { isAuth } from "../middlewares/is-auth.js";

const posts = [];

export async function postsRouters(app) {
  app.get("/posts", { onRequest: [isAuth] }, (request, replay) => {
    return replay.status(200).send(posts);
  });

  app.post("/posts", { onRequest: [isAuth] }, (request, replay) => {
    const { username, title, content } = request.body;
    const post = {
      id: posts.length + 1,
      owner: username,
      title,
      content,
      date: new Date().toISOString(),
      comments: [],
      likes: [],
    };
    posts.push(post);
    return replay.status(201).send(post);
  });

  app.post("/posts/:id/comment", { onRequest: [isAuth] }, (request, replay) => {
    const { id } = request.params;

    const postIndex = posts.findIndex((post) => post.id === +id);

    if (postIndex === -1) {
      return replay.status(404).send({ message: "Post not found" });
    }
    const { username, content } = request.body;

    const comment = {
      owner: username,
      content,
      date: new Date().toISOString(),
    };
    posts[postIndex].comments.push(comment);
    return replay.status(201).send(posts[postIndex]);
  });

  app.patch("/posts/:id/like", { onRequest: [isAuth] }, (request, replay) => {
    const { id } = request.params;

    const postIndex = posts.findIndex((post) => post.id === +id);

    if (postIndex === -1) {
      return replay.status(404).send({ message: "Post not found" });
    }
    const { username } = request.body;

    const likeIndex = posts[postIndex].likes.findIndex(
      (item) => item === username
    );

    if (likeIndex >= 0) {
      posts[postIndex].likes.splice(likeIndex, 1);
      return replay.status(200).send(posts[postIndex]);
    }
    posts[postIndex].likes.push(username);
    return replay.status(200).send(posts[postIndex]);
  });

  app.delete("/posts/:id", { onRequest: [isAuth] }, (request, replay) => {
    const { id } = request.params;

    const postIndex = posts.findIndex((post) => post.id === +id);

    if (postIndex === -1) {
      return replay.status(404).send({ message: "Post not found" });
    }

    const { username } = request.body;
    if (username !== posts[postIndex].owner) {
      return replay
        .status(400)
        .send({ message: "User is not the post owner." });
    }
    posts.splice(postIndex, 1);
    return replay.status(204).send();
  });
}
