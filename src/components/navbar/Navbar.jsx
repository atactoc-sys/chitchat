import React, { useCallback, useContext, useEffect, useRef } from "react";
import "./Navbar.css";
import { Button, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const pRef = useRef(null);
  const { currentUser } = useContext(AuthContext);

  /* The `startHackerEffect` function is a custom callback function created using the `useCallback`
  hook in React. This function is responsible for creating a "hacker effect" animation on the text
  content of the `<p>` element referenced by `pRef`. */
  const startHackerEffect = useCallback(() => {
    let iteration = 0;
    let intervalId = null;
    clearInterval(intervalId);

    intervalId = setInterval(() => {
      if (pRef.current) {
        pRef.current.innerText = pRef.current.innerText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return pRef.current.dataset.value[index];
            }
            return letters[Math.floor(Math.random() * 52)];
          })
          .join("");

        if (iteration >= pRef.current.dataset.value.length) {
          clearInterval(intervalId);
        }

        iteration += 1 / 3;
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [letters]);

  /* The `useEffect` hook in the provided code snippet is used to run the `startHackerEffect` function
  when the component mounts or when the `startHackerEffect` function changes. */
  useEffect(() => {
    const intervalId = startHackerEffect();
    return () => clearInterval(intervalId);
  }, [startHackerEffect]);

  return (
    <div className="navbar">
      <div className="navbarComponent">
        <div className="navLogo">
          <p ref={pRef} data-value="ChatLink">
            ChitChat
          </p>
        </div>
        {/* /* This block of code is a conditional rendering in React. It checks if the `currentUser`
        object exists. If `currentUser` is truthy (meaning a user is logged in), it renders a
        `<div>` with the user's avatar image, display name, and a logout button. If `currentUser` is
        falsy (meaning no user is logged in), it renders a `<div>` with a welcome message. */}
        {currentUser ? (
          <div className="user">
            <img src={currentUser.photoURL} alt="User Avatar" />
            <Typography variant="h4">{currentUser.displayName}</Typography>
            <Button variant="contained" onClick={() => signOut(auth)}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="user">
            <Typography variant="h4">Welcome!</Typography>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
