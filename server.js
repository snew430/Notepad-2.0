const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");
const uuid = require("./helper/uuid");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Goes to index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Goes to notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// API link to json file
app.get("/api/notes", (req, res) => res.json(notes));

// Create a new note
app.post("/api/notes", (req, res) => {
  req.body.id = uuid();
  notes.push(req.body);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notes, null, 2)
  );
  res.json(req.body);
});

// Delete a note
app.delete("/api/notes/:id", (req, res) => {
  // Find the index of the id
  const index = notes
    .map(function (item) {
      return item.id;
    })
    .indexOf(req.params.id); //find the index of :id
  if (index === -1) {
    res.status(404);
    return;
  }
  // Splice the note out of the json file
  const result = notes.splice(index, 1);
  // Write a new file
  fs.writeFile("./db/db.json", JSON.stringify(result), (err) => {
    if (err) throw err;
    res.json(true);
  });
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
