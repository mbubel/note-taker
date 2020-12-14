const express = require("express");
const fs = require("fs");
const path = require("path");

let app = express();

let PORT = process.env.PORT || 8080;

const DB_FILE = path.join(__dirname, "./db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Goes to the notes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Returns all saved notes as JSON
app.get("/api/notes", function (req, res) {
  res.sendFile(DB_FILE);
});

app.post("/api/notes", function (req, res) {
  let jsonData = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    jsonData.push(req.body);
    fs.writeFileSync(DB_FILE, JSON.stringify(jsonData), "utf8");
    res.json(req.body);
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
