// Inbox.js
import { ArrowDownAZ, ArrowUpAZ, Filter, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Newnotemodal from "./Newnotemodal";

const NoteTitles = ({
  ext,
  notes,
  clickedNote,
  drop,
  setDrop,
  setShowMainContent,
  setShowNoteTitles,
  isModalOpen,
  setIsModalOpen,
  currentFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByTitle, setSortByTitle] = useState(true);
  const [isTitleSortAsc, setIsTitleSortAsc] = useState(true);
  const [isDateSortAsc, setIsDateSortAsc] = useState(false);

  const toggleSortMode = () => setSortByTitle(!sortByTitle);
  const toggleTitleSort = () => setIsTitleSortAsc(!isTitleSortAsc);
  const toggleDateSort = () => setIsDateSortAsc(!isDateSortAsc);

  const filteredNotes = notes.filter((note) =>
    note.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortByTitle) {
      const titleA = a.title?.toLowerCase() || "";
      const titleB = b.title?.toLowerCase() || "";
      return isTitleSortAsc
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    } else {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return isDateSortAsc ? dateA - dateB : dateB - dateA;
    }
  });

  return (
    <div
      className={`${
        ext ? "hidden sm:block" : "block"
      } bg-gray-800 text-white lg:p-4  lg:block lg:w-72 flex-shrink-0 relative h-full overflow-hidden`}
    >
      <div className="flex justify-between items-center space-x-4 text-xl mx-2 md:mx-4">
        <div className="pt-3 flex  items-center gap-2 flex-shrink-0">
          {/* <button onClick={toggleTitleSort} title="Sort by title">
            {isTitleSortAsc ? <ArrowDownAZ /> : <ArrowUpAZ />}
          </button> */}
          <div className="text-white cursor-default">Notes</div>
        </div>
        <div className="flex-1 min-w-0 items-end flex justify-end pt-[0.6rem]">
          <div className="cursor-default  text-sm truncate whitespace-nowrap overflow-hidden text-right">
            {currentFilter}
          </div>
        </div>
      </div>
      <div className="relative md:w-full mt-3 px-3 md:px-4 mb-[0.65rem]">
        <span className="absolute inset-y-0 left-6 flex items-center text-gray-400">
          <Search />
        </span>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-10 py-1 border rounded-md pl-10 bg-slate-800 focus:outline-none"
        />
      </div>
      {notes.length > 1 && (
        <div
          className="text-sm cursor-pointer px-4 mb-2  text-gray-300"
          // onClick={toggleSortMode}
          title="Toggle title/date sort"
        >
          Sort by Date:
          {/* {!sortByTitle && ( */}
          <span
            className="text-sm text-gray-400 px-4 mb-2 cursor-pointer "
            onClick={() => {
              toggleDateSort();
              toggleSortMode();
            }}
          >
            {isDateSortAsc ? "Oldest First" : "Newest First"}
          </span>
          {/* )} */}
        </div>
      )}
      <div className="overflow-y-auto max-h-[80.7vh]  lg:max-h-[calc(100vh-170px)] scrollbar-hidden px-2  pr-1">
        {notes && sortedNotes.length > 0 ? (
          <div className="parerent">
            {sortedNotes.map((note) => (
              <div
                key={note._id || note.title}
                className="flex items-center  hover:bg-slate-500  p-2 rounded-lg w-full max-w-full  "
                onClick={() => {
                  clickedNote(note);
                  setDrop(false);
                  if (window.innerWidth < 1024) {
                    setShowMainContent(true);
                    setShowNoteTitles(false);
                  }
                }}
              >
                <div className="min-w-0 w-full  ">
                  <h5 className="text-white truncate mb-2 cursor-default">
                    {note.title || "Untitled Note"}
                  </h5>
                  <div className="border-b-2 border-[#41455d] w-full" />
                </div>
              </div>
            ))}
            <div className=" fixed z-40 right-[78vw]  top-[50vh] sm:right-[60vw] ">
              <Newnotemodal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-white">No notes</div>
              <div className="opacity-40 text-white mt-2">Add a new note.</div>

              <div className=" fixed z-40 right-[78vw]  top-[50vh] sm:right-[60vw] ">
                <Newnotemodal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteTitles;
