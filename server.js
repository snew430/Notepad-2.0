const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");
// const createNewNote = require("./lib/notes");
const notes = require("./db/db.json");
const uuid = require("./helper/uuid");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => res.json(notes));

app.post("/api/notes", (req, res) => {
  req.body.id = uuid();
  notes.push(req.body);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notes, null, 2)
  );
  res.json(req.body);
});

// app.delete("/api/notes/:id", (req, res) => {
//   const newArr = notes.filter((x) => {
//     if (x.id !== req.params.id) {
//       return x;
//     }
//   });
//   fs.sendFile(
//     path.join(__dirname, "./db/db.json"),
//     JSON.stringify(newArr),
//     (err) => {
//       console.log(err);
//     }
//   );
//   res.json();
// });

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const newNotes = JSON.parse(data).filter((x) => {
        if (x.id !== req.params.id) {
          return x;
        }
      });
      console.log(newNotes);

      fs.writeFileSync("./db/db.json", JSON.stringify(newNotes), (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info("Successfully deleted note!")
      );
    }
  });
  res.json();
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
