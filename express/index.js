const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("hello this is sneha");
});
app.get("/about", (req, res) => {
  res.write(`hello ${req.query.name}`);
  res.end();
});

app.listen(3000, () => console.log("server started"));

//app is basically myHandler function
