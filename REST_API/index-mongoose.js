const express = require("express");

const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ path: ".env" });
const app = express();
const PORT = 8000;

//connection
mongoose
  .connect(`${process.env.MONGODB_URI}/learning-backend`)
  .then(() => console.log("mongoDB Connected"))
  .catch((err) => console.log("Mongodb connection error", err));

// //schema
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    job_title: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("user", userSchema);

//middleware-plugin
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(async (req, res, next) => {
  await fs.promises.appendFile(
    "log.txt",
    `\n${Date.now()}:${req.method}:${req.path}`,
  );
  next();
});

//routes
app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});
  const html = `
    <ul>
    ${allDbUsers.map((user) => `<li>${user.first_name} - ${user.email}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

//rest api
app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json(user);
  })
  .patch(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { last_name: "change" });
    return res.json({ status: "success" });
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "success" });
  });
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "all feilds are required" });
  }
  const result = await User.create({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title,
  });
  console.log("result", result);
  return res.status(201).json({ msg: "success" });
});

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
