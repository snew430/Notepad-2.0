const fs = require("fs");
const path = require("path");

function createNewNote(body, notepad) {
  const note = body;
  console.log(note);
  console.log(notepad);
  // notepad.push(note);
  fs.writeFileSync(
    path.join(__dirname, "../db/db.json"),
    JSON.stringify({ notes: notepad }, null, 2)
  );
  return note;
}

module.exports = createNewNote;
