const express = require("express");
const fs = require("fs");
const path = require("path");

let app = express();

let PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Goes to the notes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Sends static assets that exist or falls back to the index.html
app.get("*", function (req, res) {
  let requestedFilePath = path.join(__dirname, "./public" + req.path);
  if (fs.existsSync(requestedFilePath)) {
    res.sendFile(requestedFilePath);
  } else {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  }
});

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
