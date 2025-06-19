import React, { memo, useRef, useState, useContext, useEffect } from "react";
import NoteContext from "../context/notes/NoteContext";

const Txts = memo(({ noteid, notetitle, notedescription, noteStatus }) => {
  const [text, setText] = useState(notedescription || "");
  const [lineCount, setLineCount] = useState(1);

  const lineNumberRef = useRef(null);
  const textareaRef = useRef(null);

  const context = useContext(NoteContext);
  const { editNote } = context;
  useEffect(() => {
    const lines = (notedescription || "").split("\n").length;
    setLineCount(lines);
  }, [notedescription]);
  const handleTextChange = (e) => {
    e.preventDefault();
    const newDescription = e.target.value;
    setText(newDescription);
    editNote(noteid, notetitle, newDescription, "", noteStatus);
    const lines = newDescription.split("\n").length;
    setLineCount(lines);
  };

  const handleScroll = () => {
    if (lineNumberRef.current && textareaRef.current) {
      lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="flex space-x-2 p-2 sm:p-4 bg-gray-900 text-white rounded-md">
      <div
        ref={lineNumberRef}
        className="hidden md:block text-right pr-1 overflow-hidden scrollbar-hidden min-h-[76vh] sm:min-h-[76vh] xl:min-h-[80vh] max-h-0 overflow-y-auto"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="text-gray-500  ">
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        onScroll={handleScroll} // Sync scrolling with line numbers
        placeholder="Type here..."
        className="w-full min-h-[76vh]   sm:min-h-[76vh] xl:min-h-[80vh] max-h-0 scrollbar-hidden  bg-transparent px-2 text-white outline-none resize-none"
      />
    </div>
  );
});

export default Txts;
