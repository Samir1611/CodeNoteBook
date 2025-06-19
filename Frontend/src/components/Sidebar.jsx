// Sidebar.js
import React, { useState } from "react";
import {
  NotebookPen,
  Notebook,
  FileChartLine,
  Tags,
  Route as LucideRoute,
  CirclePlus,
  ChevronDown,
  ChevronUp,
  CirclePause,
  CircleCheckBig,
  CircleCheck,
  CircleX,
  Menu,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({
  notes,
  ext,
  setExt,
  setIsModalOpen,
  setCurrentFilter,
  onAllNotesClick,
}) => {
  const obj = [
    {
      title: "All Notes",
      icon: <NotebookPen />,
      path: "/",
      sideitems: notes.length,
    },
    {
      title: "Notebooks",
      icon: <Notebook />,
      path: "/about",
      sideitems: <CirclePlus />,
    },
    {
      title: "Status",
      icon: <FileChartLine />,
      path: "/banker",
      sideitems: "chevron",
      submenu: [
        {
          title: "Active",
          count: notes.filter((note) => note.status === "Active").length,
          icons: <CirclePause color="#ffea00" />,
        },
        {
          title: "On Hold",
          count: notes.filter((note) => note.status === "On Hold").length,
          icons: <CircleCheckBig color="#00ffb3" />,
        },
        {
          title: "Completed",
          count: notes.filter((note) => note.status === "Completed").length,
          icons: <CircleCheck color="#00c244" />,
        },
        {
          title: "Dropped",
          count: notes.filter((note) => note.status === "Dropped").length,
          icons: <CircleX color="#ff0000" />,
        },
      ],
    },
    {
      title: "Tags",
      icon: <Tags />,
      path: "/ecommerce",
      sideitems: "chevron",
      submenu: [
        ...[...new Set(notes.map((note) => note.tag))] // Convert Set to Array
          .filter((tag) => tag) // Ensure tags are not null or undefined
          .map((tag) => ({
            title: tag,
            count: notes.filter((note) => note.tag === tag).length,
          })),
      ],
    },
  ];
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    console.log("User logged out");
  };

  const handleItemClick = (title, parentTitle) => {
    if (title === "All Notes") {
      setCurrentFilter("All Notes");
    } else if (parentTitle === "Status") {
      setCurrentFilter(`Status: ${title}`);
    } else if (parentTitle === "Tags") {
      setCurrentFilter(`Tag: ${title}`);
    } else {
      setCurrentFilter(title);
    }
    if (window.innerWidth < 640) {
      setExt(false);
    }
    console.log("Tag Clicked:", title, "Parent Title:", parentTitle);
  };
  const [select, setSelect] = useState({ Status: false, Tags: false });
  const toggleSelect = (key) => {
    setSelect((prevSelect) => ({
      ...prevSelect,
      [key]: !prevSelect[key],
    }));

    if (key === "Notebooks") {
      setIsModalOpen(true);
      if (window.innerWidth < 640) {
        setExt(false);
      }
    }
  };
  return (
    <div
      className={`inline-flex flex-col bg-[#2C3D5A] h-screen relative cursor-default ${
        ext && "w-full"
      } sm:w-auto`}
    >
      <div className="flex items-center justify-between gap-9 py-2 px-3 sm:px-4">
        {ext && (
          <span
            onClick={() => {
              window.location.reload();
            }}
            className="logo text-md text-white"
          >
            CodeNotebook
          </span>
        )}
        <button
          className="cursor-pointer text-white flex items-center gap-2"
          onClick={() => setExt(!ext)}
          // onMouseOut={() => setExt(!ext)}
        >
          <Menu className="h-[2rem]" />
          {/* {ext && <Settings className="h-[2rem]" />} */}
        </button>
      </div>

      <div className="line absolute top-[3.4rem] left-0 w-full h-[0.1px] bg-white"></div>

      <ul className="space-y-2 mt-8 sm:mt-6">
        {/* <div className="lg:hidden flex mt-2 text-white  px-3 sm:px-4">
          <Inbox />
          {ext && <span className="ml-2">Notes</span>}
        </div> */}
        {obj.map((f) => (
          <li className="text-white rounded-lg py-2 px-4" key={f.title}>
            <div className="flex justify-between items-center">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  if (f.title === "All Notes") {
                    handleItemClick(f.title);
                    setCurrentFilter("All Notes");
                    setIsModalOpen(false);
                    onAllNotesClick && onAllNotesClick();
                    if (window.innerWidth < 640) {
                      setExt(false);
                    }
                  } else if (f.title === "Notebooks") {
                    setIsModalOpen(true);
                  } else if (f.title === "Status") {
                    toggleSelect(f.title);
                    setIsModalOpen(false);

                    onAllNotesClick && onAllNotesClick();
                    if (window.innerWidth < 640) {
                      setExt(false);
                    }
                    setExt(true);
                  } else if (f.title === "Tags") {
                    toggleSelect(f.title);
                    setIsModalOpen(false);

                    onAllNotesClick && onAllNotesClick();
                    if (window.innerWidth < 640) {
                      setExt(false);
                    }
                    setExt(true);
                  }
                }}
              >
                {f.icon}
                {ext && <span className="pl-2 text-sm">{f.title}</span>}
              </div>
              {ext && (
                <a
                  className="place-content-center cursor-pointer"
                  onClick={() => toggleSelect(f.title)}
                >
                  {f.sideitems === "chevron" ? (
                    select[f.title] ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )
                  ) : (
                    f.sideitems
                  )}
                </a>
              )}
            </div>
            {ext && f.submenu && select[f.title] && (
              <ul className="ml-6 mt-2 space-y-1 overflow-hidden transition-all duration-200 ease-in-out">
                {f.submenu.map((sub) => (
                  <li
                    key={sub.title}
                    onClick={() => handleItemClick(sub.title, f.title)}
                    className="flex justify-between text-sm text-white py-1"
                  >
                    {/* {console.log(f.submenu)} */}
                    <span className="flex gap-2">
                      {sub.icons} {sub.title}
                    </span>
                    <span>{sub.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div
        className={`bottom flex flex-row items-center gap-3  ${
          ext ? "ml-5" : "ml-1"
        }  sm:justify-start  mt-auto pb-4`}
      >
        <div className="profile w-12 h-12 items-center border border-blue-700 rounded-full">
          <img
            src="/Fanny.jpg"
            className="object-cover w-full h-full rounded-full"
            alt="Profile"
          />
        </div>

        {ext ? (
          <div className="flex  flex-col items-start text-white cursor-pointer  whitespace-nowrap">
            <h3 className="text-sm font-medium">{user.name}</h3>
            <button onClick={handleLogout} className="text-xs">
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Sidebar;
