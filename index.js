require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");

const port = 4000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use("/post", postsRouter);
app.use("/user", usersRouter);

const server = app.listen(port, () => {
  console.log(`Backend successfully started on port ${port}`);
});
