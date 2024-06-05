import React, { useState } from "react";
import "./Signup.css";
import {
  Button,
  TextField,
  Typography,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { auth, storage, db } from "./../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [fileName, setFileName] = useState("");
  const [err, setErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErr(false);
    setIsLoading(true);
    setProgress(0);

    const formData = new FormData(event.target);
    const displayName = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const file = formData.get("upload");

    /* This code block is checking if any of the required fields for signing up a new user are empty.
    If any of the fields (display name, email, password, or file) are empty, it sets an error flag
    (`setErr(true)`), stops the loading state (`setIsLoading(false)`), and returns early from the
    function to prevent further execution of the signup process. This ensures that the user provides
    all the necessary information before attempting to sign up. */
    if (!displayName || !email || !password || !file) {
      setErr(true);
      setIsLoading(false);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        /* This code block is setting up an event listener for tracking the upload progress of a file
        to Firebase storage. */
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed", error);
          setErr(true);
          setAlertOpen(true);
          setIsLoading(false);
        },
        /* This code block is an asynchronous function that is executed after a file has been
        successfully uploaded to Firebase storage. Here's a breakdown of what it does: */
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          /* The `await updateProfile(res.user, { displayName, photoURL: downloadURL })` code is
          updating the user profile information in Firebase Authentication. */
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });
          /* The code `await setDoc(doc(db, "users", res.user.uid), { uid: res.user.uid, displayName,
          email, photoURL: downloadURL });` is creating a new document in the "users" collection in
          Firestore with the following fields: */
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });
          await setDoc(doc(db, "userChats", res.user.uid), {});
          setIsLoading(false);
          setProgress(0);

          navigate("/");
        }
      );
    } catch (err) {
      console.error("Error signing up", err);
      setErr(true);
      setAlertOpen(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="signUpPageContainer">
      <div className="signUpBanner">
        <Typography variant="h3">Sign Up</Typography>
      </div>
      <div className="formSection">
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Name"
            variant="standard"
            type="text"
            InputProps={{
              className: "customInput",
            }}
            required
          />
          <TextField
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
            name="password"
            label="Password"
            variant="standard"
            type="password"
            InputProps={{
              className: "customInput",
            }}
            required
          />
          <input
            type="file"
            name="upload"
            id="upload"
            onChange={handleFileChange}
            required
          />
          {/* /* The code snippet you provided is responsible for displaying the file upload functionality
          and showing the progress of the file upload process.  */}
          <label htmlFor="upload" className="lb">
            {fileName ? fileName : "Upload Image"}
          </label>
          {isLoading && (
            <LinearProgress variant="determinate" value={progress} />
          )}
          <Button
            type="submit"
            variant="contained"
            endIcon={<HowToRegIcon />}
            disabled={isLoading}
          >
            Sign Up
          </Button>
          {err && (
            <Snackbar open={alertOpen} autoHideDuration={6000}>
              <Alert onClose={() => setAlertOpen(false)} severity="error">
                Something went wrong
              </Alert>
            </Snackbar>
          )}
        </form>
        <Typography>
          Not a new User? <Link to="/login">Sign In</Link>
        </Typography>
      </div>
    </div>
  );
}

export default Signup;
