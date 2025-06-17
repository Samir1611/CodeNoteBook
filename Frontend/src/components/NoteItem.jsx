// import React from "react";

const NoteItem = ({ note }) => {
  return (
    <div className="flex items-center px-4 hover:bg-slate-500 mb-2 p-2">
      <h5 className="">{note.title}</h5>
    </div>
  );
};

export default NoteItem;
