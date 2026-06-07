const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectDb } = require("./connection");
const { authMiddleware, checkAuth } = require("./middlewares/authMiddleware");
const staticRoute = require("./routes/staticRoutes");
const userRoute = require("./routes/userRoutes");
const urlRoute = require("./routes/urlRoutes");
const URL = require("./models/urls");
const app = express();
const PORT = 4000;

dotenv.config({ path: ".env" });

connectDb(`${process.env.MONGODB_URI}/url-shortener`)
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use("/url", authMiddleware, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
  );
  if (!entry) {
    return res.status(404).send("URL not found");
  }
  res.redirect(entry.redirectUrl);
});
