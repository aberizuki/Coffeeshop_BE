require("dotenv").config();

const { urlencoded, json } = require("express");
const express = require("express");
const app = express();
const router = require("./src/route/index.route");
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.static("public"));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use("/api/v1/", router);
// app.use(
//   cors({
//     origin: ["hinatazaka46.jp"],
//   })
// );

app.get("*", (req, res) => {
  return res.send({
    status: 404,
    message: "not found",
  });
});

app.listen(port, (req, res) => {
  console.log("backend successfully running on port 5000");
});

//defaultnya express js itu ga menerima semua jenis form.
// use() middleware urlencoded, json
//menerima application/x-www-form-urlencoded
//menerima json
