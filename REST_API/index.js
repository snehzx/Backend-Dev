const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 8000;

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
app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

//rest api
app.get("/api/users", (req, res) => {
  res.setHeader("X-myName", "xyz"); //custom header
  // always add X to custom headers
  console.log(req.headers);
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const user = users.find((u) => {
      return u.id === id;
    });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    Object.assign(user, body);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ message: "error writing file" });
      }

      return res.json({ message: "user updated", user });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((u) => {
      return u.id === id;
    });
    if (index === -1) {
      return res.status(404).json({ message: "user not found" });
    }
    users.splice(index, 1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ message: "error writing file" });
      }

      return res.json({ message: "user deleted", index });
    });
  });
app.post("/api/users", (req, res) => {
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
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error writting file" });
    } else {
      return res.status(201).json({ status: "success", id: users.length });
    }
  });
  //todo create new user
});

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
