const express = require("express");
const dotenv = require("dotenv").config({ path: ".env" });
const { connectDb } = require("./connection");

const userRouter = require("./routes/user");

const { logReqRes } = require("./middlewares/index");
const app = express();
const PORT = 8000;

//connection
connectDb(`${process.env.MONGODB_URI}/learning-backend`)
  .then(() => {
    console.log("MongoDb connected!!");
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("mongodb connection failed", err);
    process.exit(1);
  });

//middleware-plugin
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logReqRes("log.txt"));
//routes
app.use("/api/users", userRouter);
