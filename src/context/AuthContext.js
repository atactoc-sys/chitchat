import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  /* The `useEffect` hook in the provided code snippet is responsible for setting up a listener for
  authentication state changes using Firebase Authentication. Here's a breakdown of what the
  `useEffect` hook is doing: */
  useEffect(() => {
    /* The `const unsub = onAuthStateChanged(auth, (user) => { setCurrentUser(user); console.log(user);
    });` code is setting up a listener for authentication state changes using Firebase
    Authentication. */
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log(user);
    });

    /* The `return () => { unsub(); };` code is a cleanup function that is returned from the
    `useEffect` hook. This function is responsible for unsubscribing or cleaning up any resources or
    event listeners that were set up in the `useEffect` hook when the component unmounts or when the
    dependencies of the `useEffect` hook change. */
    return () => {
      unsub();
    };
  }, []);

  return (
    // /* The `<AuthContext.Provider value={{ currentUser }}> {children} </AuthContext.Provider>` block is
    // responsible for providing the `currentUser` state value to all components that are descendants
    // of the `AuthContextProvider` component. */
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
