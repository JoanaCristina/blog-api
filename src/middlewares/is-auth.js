export function isAuth(request, replay, done) {
  const { authorization } = request.headers;

  if (authorization != "token") {
    replay.status(403).send({ message: "Unauthorized" });
  }
  done();
}
