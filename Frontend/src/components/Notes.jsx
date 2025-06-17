import React, { useContext, useState, useEffect } from "react";
import NoteContext from "../context/notes/NoteContext";
import Noteapp from "./Noteapp";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Notes = () => {
  const { authToken } = useAuth();
  const context = useContext(NoteContext); ///contains note and setnotes
  const { notes, getNotes, editNote } = context;
  let navigate = useNavigate();
  useEffect(() => {
    if (!authToken) {
      console.log("No token found, navigating to login");
      navigate("/login");
    } else {
      getNotes();
    }
  }, [authToken, navigate, getNotes]);

  const [note, setnote] = useState({
    eid: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const updateNote = (currentNote) => {
    ref.current.click();
    setnote({
      eid: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  return (
    <>
      <Noteapp />
    </>
  );
};

export default Notes;
