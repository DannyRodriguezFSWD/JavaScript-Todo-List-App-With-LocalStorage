const notesWrapper = document.getElementById("notes-wrapper");
const title = document.getElementById("title");
const content = document.getElementById("content");
const error = document.getElementById("form-error");

let notesData = [];

// Function to create a note element
const createNote = (uid, title, text, date) => {
  const note = document.createElement("div");
  note.className = 'note';
  note.id = uid;
  note.innerHTML = `
    <div class="note-title">${title}</div>
    <div class="note-controls">
      <button class="note-edit" onclick="editNote('${uid}')">Edit</button>
      <button class="note-save" style="display:none" onclick="saveNote('${uid}')">Save</button>
      <button class="note-delete" onclick="deleteNote('${uid}')">Delete</button>
    </div>
    <div class="note-text">${text}</div>
    <div class="note-date">${date}</div>
  `;

  notesWrapper.insertBefore(note, notesWrapper.firstChild);
};

// Function to add a new note
const addNote = () => {
  if (title.value.trim().length === 0 && content.value.trim().length === 0) {     
    error.innerText = "Note can't be empty";
    return;
  }
  
  const uid = new Date().getTime().toString(); // Fixed: Added parentheses to getTime()
  
  const noteObj = {
    uid: uid,
    title: title.value,
    text: content.value,
    date: new Date().toLocaleDateString(),
  };

  notesData.push(noteObj);
  localStorage.setItem("notes", JSON.stringify(notesData));

  createNote(noteObj.uid, noteObj.title, noteObj.text, noteObj.date);

  error.innerText = "";
  content.value = "";
  title.value = "";
};

// Function to edit a note
const editNote = (uid) => {
  const note = document.getElementById(uid);
  
  const noteTitle = note.querySelector(".note-title");
  const noteText = note.querySelector(".note-text");
  const noteSave = note.querySelector(".note-save");
  const noteEdit = note.querySelector(".note-edit");

  noteTitle.contentEditable = 'true';
  noteText.contentEditable = 'true';
  
  // Toggle button visibility
  noteEdit.style.display = 'none';
  noteSave.style.display = 'block';
  
  // Focus on the text area for editing
  noteText.focus();
};

// Function to save the edited note
const saveNote = (uid) => {
  const note = document.getElementById(uid);
  
  const noteTitle = note.querySelector(".note-title");
  const noteText = note.querySelector(".note-text");
  
  if (noteTitle.innerText.trim().length === 0 && noteText.innerText.trim().length === 0) {
    error.innerText = "Note can't be empty";
    return;
  }

  // Update the notesData array
  notesData.forEach((n) => {
    if (n.uid === uid) {
      n.title = noteTitle.innerText;
      n.text = noteText.innerText;
    }
  });

  localStorage.setItem("notes", JSON.stringify(notesData));

  // Reset contentEditable and button visibility
  noteTitle.contentEditable = 'false';
  noteText.contentEditable = 'false';
  
  // Toggle button visibility
  const noteEditButton = note.querySelector(".note-edit");
  const noteSaveButton = note.querySelector(".note-save");
  
  noteEditButton.style.display = 'block';
  noteSaveButton.style.display = 'none';

  error.innerText = '';
};

// Function to delete a note
const deleteNote = (uid) => {
  let confirmDelete = confirm("Are you sure you want to delete this?");
  
  if (!confirmDelete) {
    return;
  }

  const noteIndexToRemove = notesData.findIndex(n => n.uid === uid);
  
  if (noteIndexToRemove !== -1) {
    notesData.splice(noteIndexToRemove, 1); // Remove from array
    localStorage.setItem("notes", JSON.stringify(notesData)); // Update local storage

    const noteElement = document.getElementById(uid);
    if (noteElement) {
      notesWrapper.removeChild(noteElement); // Remove from DOM
    }
    
    error.innerText = ''; // Clear any previous errors
   }
};

// Load existing notes from local storage on page load
window.addEventListener("load", () => {
   notesData = localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];

   notesData.forEach((note) => {
       createNote(note.uid, note.title, note.text, note.date);
   });
});