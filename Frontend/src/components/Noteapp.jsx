// Noteapp.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import NoteContext from "../context/notes/NoteContext";
import Sidebar from "./Sidebar";
import NoteTitles from "./NoteTitles";
import MainContent from "./MainContent";

const Noteapp = () => {
  const context = useContext(NoteContext);
  const { notes, getNotes } = context;
  const navigate = useNavigate();
  const { authToken, loading } = useAuth();
  const [ext, setExt] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clicknote, setclicknote] = useState("");
  const [drop, setDrop] = useState(false); // Controls modal visibility
  const [showNoteTitles, setShowNoteTitles] = useState(false);
  const [showMainContent, setShowMainContent] = useState(true); // initially true

  useEffect(() => {
    if (!loading && !authToken) {
      navigate("/login");
    } else if (authToken) {
      getNotes();
    }
  }, [authToken, loading, navigate, getNotes]);

  const clickedNote = (note) => setclicknote(note._id);
  const [currentFilter, setCurrentFilter] = useState("All Notes");
  const filterNotes = () => {
    if (!Array.isArray(notes)) return []; // 💡 avoid crashes

    switch (true) {
      case currentFilter === "All Notes":
        return notes;
      case currentFilter.includes("Status:"):
        const status = currentFilter.split(": ")[1];
        return notes.filter((note) => note.status === status);
      case currentFilter.includes("Tag:"):
        const tag = currentFilter.split(": ")[1];
        return notes.filter((note) => note.tag === tag);
      default:
        return notes;
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "m") {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1024) {
        window.location.reload();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const filteredNotes = filterNotes();

  return (
    <div className="flex h-screen">
      <Sidebar
        notes={notes}
        ext={ext}
        setExt={setExt}
        setIsModalOpen={setIsModalOpen}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        className="w-16 md:w-20 flex-shrink-0"
        onAllNotesClick={() => {
          if (window.innerWidth < 1024) {
            setShowNoteTitles(true);
            setShowMainContent(false);
          }
        }}
      />
      <div className="hidden lg:block flex-shrink-0">
        <NoteTitles
          notes={filteredNotes}
          clickedNote={clickedNote}
          drop={drop}
          setDrop={setDrop}
          currentFilter={currentFilter}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>

      {/* Show NoteTitles on small screens */}
      {showNoteTitles && (
        <div
          className={`block lg:hidden ${
            ext && window.innerWidth < 640 ? "hidden " : "w-full"
          } `}
        >
          <NoteTitles
            ext={ext}
            notes={filteredNotes}
            clickedNote={clickedNote}
            drop={drop}
            setDrop={setDrop}
            setShowMainContent={setShowMainContent}
            setShowNoteTitles={setShowNoteTitles}
            currentFilter={currentFilter}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      )}

      {/* MainContent */}
      {showMainContent && (
        <div className="flex-grow min-w-0">
          <MainContent
            ext={ext}
            notes={notes}
            clicknote={clicknote}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            drop={drop}
            setDrop={setDrop}
          />
        </div>
      )}
    </div>
  );
};

export default Noteapp;
