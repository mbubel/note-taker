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

// Create a new note
app.post("/api/notes", function (req, res) {
  let jsonData = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  let newNote = req.body;
  newNote.id = jsonData.length + 1;
  jsonData.push(newNote);
  fs.writeFileSync(DB_FILE, JSON.stringify(jsonData), "utf8");
  res.json(newNote);
});

// Delete a note
app.delete("/api/notes/:id", function (req, res) {
  let jsonData = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  let filterJsonData = jsonData.filter((note) => note.id != req.params.id);
  fs.writeFileSync(DB_FILE, JSON.stringify(filterJsonData), "utf8");
  res.json({
    id: req.params.id,
  });
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
