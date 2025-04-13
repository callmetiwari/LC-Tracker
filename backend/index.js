const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const dotenv = require("dotenv");
const User = require("./models/user.js");
const UserRouter = require("./routes/User.js");
const expressError = require("./utils/ExpressError.js");
const axios = require("axios");


dotenv.config(); 
const mongURL = process.env.MONGO_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main() {
  await mongoose.connect(mongURL);
}

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error(" Connection to DB failed:", err.message);
  });

app.get("/demo", (req, res) => {
  res.send("hi");
});

app.use("/", UserRouter);



app.get("/saveUser", async (req, res) => {
  console.log("sample saved");
  res.send("successfully tested");
});

app.listen(8080, () => {
  console.log(" Server running on port 8080");
});
