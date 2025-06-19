// MainContent.js
import { useContext, useState, useRef, useEffect } from "react";
import Newnotemodal from "./Newnotemodal";
import { ChevronDown, CircleCheckBig, Trash } from "lucide-react";
import Txts from "./Txts";
import NoteContext from "../context/notes/NoteContext";
import NewnotemodalforTag from "./NewnotemodalforTag";
import { format } from "timeago.js";

const MainContent = ({
  ext,
  notes,
  clicknote,
  isModalOpen,
  setIsModalOpen,
  drop,
  setDrop,
}) => {
  const selectedNote = notes.find((note) => note._id === clicknote);
  const [status, setStatus] = useState("Active");
  const [inputTitle, setInputTitle] = useState(selectedNote?.title || "");

  useEffect(() => {
    setInputTitle(selectedNote?.title || "");
  }, [selectedNote?._id]);
  // const [currentNoteId, setCurrentNoteId] = useState(null); // Tracks the current note ID
  const dropdownRef = useRef(null);

  const context = useContext(NoteContext);
  const { deleteNote, editNote } = context;

  const deletefunc = (delete_id) => {
    deleteNote(delete_id);
  };
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);

    editNote(
      selectedNote._id,
      selectedNote.title,
      selectedNote.description,
      selectedNote.tag,
      newStatus
    );
  };
  const [IsModalOpenforTag, setIsModalOpenforTag] = useState(false);
  const addTag = () => {
    setIsModalOpenforTag(true);
  };
  const editTitle = (title) => {
    editNote(
      selectedNote._id,
      title,
      selectedNote.description,
      selectedNote.tag,
      selectedNote.status
    );
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDrop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`${
        ext && window.innerWidth < 640 ? "hidden sm:block" : "block"
      } flex-1 bg-gray-900 text-white sm:pl-4 h-screen relative`}
    >
      {selectedNote ? (
        <>
          <div className="max-w-2xl pl-4 pt-6 relative cursor-default">
            <div className="text-sm sm:text-xl font-bold  sm:w-72 md:w-[22rem] lg:w-[80rem] scrollbar-hidden xl:w-full  max-w-full">
              <input
                type="text"
                className="bg-transparent outline-none w-full break-words resize-none max-h-[4.2vh] truncate overflow-hidden whitespace-nowrap  scrollbar-hidden"
                value={inputTitle}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (
                    newValue.length >= 4 ||
                    newValue.length >= inputTitle.length
                  ) {
                    setInputTitle(newValue);
                  }
                }}
                onBlur={() => {
                  if (
                    inputTitle.trim().length >= 4 &&
                    inputTitle !== selectedNote.title
                  ) {
                    editTitle(inputTitle.trim());
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.target.blur(); // triggers onBlur to save
                  }
                }}
              />
            </div>

            <p className="text-gray-400 mb-2 text-sm">
              {format(selectedNote.date)}{" "}
            </p>
          </div>
          <div className="flex space-x-1 pl-4 md:gap-3 items-center justify-start text-sm cursor-default px-1">
            {/* <div className="flex items-center">
              <Inbox className="mr-[4px]" size={16} />
              Inbox
              <ChevronDown size={16} />
            </div> */}
            <div className="flex items-center">
              <CircleCheckBig className="mr-[4px]" size={16} />
              {selectedNote.status}

              <ChevronDown size={16} onClick={() => setDrop(!drop)} />
            </div>
            <div className="" onClick={addTag}>
              Add Tags{" "}
            </div>

            <Trash
              className="sm:w-5 sm:h-5 w-4 h-4"
              onClick={() => {
                {
                  const confirmDelete = window.confirm(
                    "Do you really want to delete?"
                  );
                  console.log(confirmDelete);

                  if (confirmDelete) {
                    deletefunc(selectedNote._id);
                  }
                }
              }}
            />
          </div>
          {drop ? (
            <>
              <div
                ref={dropdownRef}
                className="absolute bg-gray-800 p-2  rounded shadow-lg  inline-flex flex-col w-auto mt-1 ml-[11vh] z-20 "
              >
                <ul className="flex flex-col space-y-3  cursor-default ">
                  <li
                    className="hover:bg-gray-600 px-2 rounded-md"
                    onClick={() => {
                      handleStatusChange("Active");
                      setDrop(!drop);
                    }}
                  >
                    Active
                  </li>
                  <li
                    className="hover:bg-gray-600 px-2 rounded-md"
                    onClick={() => {
                      handleStatusChange("On Hold");
                      setDrop(!drop);
                    }}
                  >
                    On Hold
                  </li>
                  <li
                    className="hover:bg-gray-600 px-2 rounded-md"
                    onClick={() => {
                      handleStatusChange("Completed");
                      setDrop(!drop);
                    }}
                  >
                    Completed
                  </li>
                  <li
                    className="hover:bg-gray-600 px-2 rounded-md"
                    onClick={() => {
                      handleStatusChange("Dropped");
                      setDrop(!drop);
                    }}
                  >
                    Dropped
                  </li>
                </ul>
              </div>
            </>
          ) : (
            ""
          )}
          <div className=" fixed z-40 right-[78vw]  top-[50vh] sm:right-[60vw] ">
            <Newnotemodal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
            <NewnotemodalforTag
              key={selectedNote._id} // Unique key for each Txts instance
              noteid={selectedNote._id}
              notetitle={selectedNote.title}
              notedescription={selectedNote.description}
              noteStatus={selectedNote.status}
              isOpen={IsModalOpenforTag}
              onClose={() => setIsModalOpenforTag(false)}
            />
          </div>
          <Txts
            key={selectedNote._id} // Unique key for each Txts instance
            noteid={selectedNote._id}
            notetitle={selectedNote.title}
            notedescription={selectedNote.description}
            noteStatus={selectedNote.status}
          />
        </>
      ) : (
        <div className="flex flex-col h-full items-center justify-center">
          <div className="opacity-20">
            <img
              src="./c2.png"
              className="h-48 w-48 md:h-30 sm:w-48 lg:w-64 lg:h-50"
            />
          </div>
          <Newnotemodal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          <div className="hidden sm:block opacity-40 text-white">
            Press CTRL-M to create new note
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
