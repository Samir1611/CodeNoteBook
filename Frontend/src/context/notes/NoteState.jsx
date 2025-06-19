import NoteContext from "./NoteContext";
import { useState } from "react";
import { useAuth } from "../AuthContext";
//notecontext is created through createcontext()
const NoteState = (props) => {
  const { authToken } = useAuth();
  const host = "https://codenotebook-backend.onrender.com";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  //get all note
  const getNotes = async () => {
    //fetch
    try {
      const response = await fetch(`${host}/notes/fetchallnotes`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error("Fetch failed:", response.status);
        setNotes([]);
        return;
      }
      const json = await response.json();
      // console.log(json);
      // setNotes(json);
      if (Array.isArray(json)) {
        setNotes(json);
      } else {
        console.error("Invalid response (not an array):", json);
        setNotes([]); // fallback to empty array
      }
    } catch (err) {
      console.error("Error while fetching notes:", err);
      setNotes([]);
    }
  };
  //add note
  const addNote = async (title, description, tag, status) => {
    try {
      const response = await fetch(`${host}/notes/addnotes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // "auth-token": authToken,
        },
        body: JSON.stringify({ title, description, tag, status }),
      });

      if (!response.ok) {
        console.error("Failed to add note:", response.statusText);
        return;
      }

      const note = await response.json();
      console.log("Added note:", note); // Debug log
      setNotes(notes.concat(note));
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/notes/deletenotes/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // "auth-token": authToken,
      },
    });
    const json = await response.json();

    // console.log("Deleting note with id" + id);
    const newNotes = notes.filter((note) => {
      return note._id != id;
    });
    setNotes(newNotes);
  };
  //edit note
  const editNote = async (id, title, description, tag, status) => {
    //fetch
    try {
      const response = await fetch(`${host}/notes/updatenotes/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // "auth-token": authToken,
        },
        body: JSON.stringify({ title, description, tag, status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const json = await response.json();

      //logic to edit
      let newNotes = JSON.parse(JSON.stringify(notes));
      for (let index = 0; index < newNotes.length; index++) {
        const element = notes[index];
        if (element._id === id) {
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          newNotes[index].status = status;

          break;
        }
      }

      console.log("Edited note:", newNotes);
      setNotes(newNotes);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  return (
    //one for js and one for objcreated where state:state
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
