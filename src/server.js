import fastify from "fastify";
import { postsRouters } from "./routers/posts.js";

const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

app.register(postsRouters);

app.listen({
  host: "0.0.0.0",
  port: 3000,
});
