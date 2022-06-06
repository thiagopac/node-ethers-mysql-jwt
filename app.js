require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

app.use(morgan("short"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

require("./passport");
require("./routes/api")(app);

app.listen(port, () => console.log(`Services API listening on port ${port}!`));