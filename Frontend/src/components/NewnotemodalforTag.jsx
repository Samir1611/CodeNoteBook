import { Airplay } from "lucide-react";
import React, { useContext, useState } from "react";
import NoteContext from "../context/notes/NoteContext";

const NewnotemodalforTag = ({
  noteid,
  notetitle,
  notedescription,
  noteStatus,
  isOpen,
  onClose,
}) => {
  const context = useContext(NoteContext); ///contains note and setnotes
  const { addNote, editNote } = context;
  const [note, setnote] = useState({
    title: "",
    description: "",
    tag: "",
    status: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;
  const handleClick = (e) => {
    if (isCreating) return;
    setIsCreating(true);

    e.preventDefault();
    try {
      editNote(noteid, notetitle, notedescription, note.tag, noteStatus);
      onClose();
    } catch (error) {
      console.error("Error creating tag:", err);
    } finally {
      setIsCreating(false);
    }
  };
  const onchange = (e) => {
    setnote({ ...note, [e.target.name]: e.target.value }); //any changes set name to value in note
  };
  return (
    <>
      <div className="z-20 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-60 md:w-80  flex  flex-col rounded-md    justify-center  bg-slate-600 py-4">
        <div className="flex items-center px-2 sm:px-4 ">
          <Airplay size={20} />
          <div className="text-white pl-2 text-sm">Add New Tag</div>
        </div>
        <div className="py-[1px] px-4 my-4  bg-slate-400"> </div>
        <input
          type="text"
          name="tag"
          className="   py-2 ml-2 sm:ml-4 pl-2 mb-2  text-white bg-slate-600 rounded-md border-2 border-blue-100 outline-none w-56 sm:w-48 md:w-72 "
          placeholder="Add your tag here..."
          onChange={onchange}
          value={note.tag}
          minLength={5}
          required
        />
        <div className="py-[1px] px-4 mt-3 bg-slate-400"> </div>

        <div className="mx-4 mt-4 flex justify-between">
          <button
            className="text-white py-2 px-6 md:px-11 bg-black rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`text-white py-2 px-6 md:px-11 bg-slate-400 rounded-md ${
              note.tag.length < 3 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleClick}
            disabled={note.tag.length < 3 && isCreating}
          >
            Create
          </button>
        </div>
      </div>
    </>
  );
};

export default NewnotemodalforTag;
