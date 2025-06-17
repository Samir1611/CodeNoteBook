import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NoteState from "./context/notes/NoteState";
import SignUp from "./components/SignUp";
import { AuthProvider } from "./context/AuthContext";
import Noteapp from "./components/Noteapp";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <>
      <AuthProvider>
        <NoteState>
          <Router>
            {/* <Alert /> */}

            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Noteapp />
                  </PrivateRoute>
                }
              />{" "}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/noteapp" element={<Noteapp />} /> */}
            </Routes>
          </Router>
        </NoteState>
      </AuthProvider>
    </>
  );
}

export default App;
