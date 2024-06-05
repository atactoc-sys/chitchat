import React, { useState } from "react";
import "./Login.css";
import { Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [err, setErr] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * The handleSubmit function is used to handle form submission in a React component, attempting to
   * sign in a user with the provided email and password and navigating to a new page upon successful
   * sign-in or displaying an error alert if sign-in fails.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      /* `await signInWithEmailAndPassword(auth, email, password);` is a function call that attempts to
      sign in a user with the provided email and password using Firebase authentication. The
      `signInWithEmailAndPassword` function is typically used in Firebase authentication to
      authenticate users with their email and password credentials. */
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
      setAlertOpen(true);
    }
  };

  return (
    <div className="logInContainer">
      <div className="loginBanner">
        <Typography variant="h3">Sign In</Typography>
      </div>
      <div className="loginForm">
        <form onSubmit={handleSubmit}>
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="standard"
            type="email"
            InputProps={{
              className: "customInput",
            }}
            required
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            variant="standard"
            type="password"
            InputProps={{
              className: "customInput",
            }}
            required
          />
          <Button type="submit" variant="contained" endIcon={<LoginIcon />}>
            Sign In
          </Button>
          {err && (
            /* The `<Snackbar>` component in the code snippet is used to display a temporary message or
            notification to the user. In this case, it is used to show an error alert when there is
            an error during the sign-in process. */
            <Snackbar open={alertOpen} autoHideDuration={6000}>
              <Alert onClose={() => setAlertOpen(false)} severity="error">
                Something went wrong
              </Alert>
            </Snackbar>
          )}
        </form>
        <Typography>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </Typography>
      </div>
    </div>
  );
}

export default Login;
