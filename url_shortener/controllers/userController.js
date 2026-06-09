const user = require("../models/users");
const { v4: uuid4 } = require("uuid");
const { setUser, getUser } = require("../service/auth");
async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  await user.create({
    name,
    email,
    password,
  });
  return res.redirect("/login");
}
async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const findUser = await user.findOne({ email, password });
  if (!findUser) {
    return res.render("login", {
      error: "invalid username or password",
    });
  }
  const sessionId = uuid4();
  setUser(sessionId, findUser);
  res.cookie("uid", sessionId);

  return res.redirect("/");
}
module.exports = {
  handleUserSignup,
  handleUserLogin,
};
