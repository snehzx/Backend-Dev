const express = require("express");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

//routes
app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    
    `;
  res.send(html);
});

//rest api
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .put((req, res) => {
    //todo:create new user
    return res.json({ status: "pending" });
  })
  .patch((req, res) => {
    //todo:edit the user with id
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    //todo:delete user with id
    return res.json({ status: "pending" });
  });

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
