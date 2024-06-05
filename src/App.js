import "./App.css";
import Login from "./components/login/Login";
import Navbar from "./components/navbar/Navbar";
import Signup from "./components/signup/Signup";
import Home from "./components/home/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { currentUser } = useContext(AuthContext);

  /**
   * The ProtectedRoute function checks if there is a currentUser and redirects to the login page if
   * not.
   * @returns The ProtectedRoute component is returning the children components if there is a
   * currentUser logged in. If there is no currentUser, it will return a Navigate component redirecting
   * to the "/login" route.
   */
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
