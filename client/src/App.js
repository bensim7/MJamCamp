import React, { useState, useContext, useEffect } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import "./App.css";
import ReactContext from "./context/react.context";
import LoginForm from "./components/LoginForm";
import ViewUser from "./components/ViewUser";
import CreateSongMain from "./components/CreateSongMain";
import ViewSong from "./components/ViewSong";
import MatchUserRole from "./components/MatchUserRole";
import MatchUserSongTitle from "./components/MatchUserSongTitle";
import MatchUserSongLyrics from "./components/MatchUserSongLyrics";
import MatchUserSongGenre from "./components/MatchUserSongGenre";
import MessageForm from "./components/MessageForm";
import ViewMessages from "./components/ViewMessages";
import RequireLogin from "./components/RequireLogin";

function App() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [validFields, setValidFields] = useState(false);
  const [loginInvalid, setLoginInvalid] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const initialState = localStorage.getItem("loginAccess")
    ? localStorage.getItem("loginAccess")
    : "";
  const [loginData, setLoginData] = useState(initialState);

  const fetchLogin = async () => {
    setIsLoading(true);
    setError(null);
    const body = { email: emailInput, password: passwordInput };
    const url = "http://localhost:5001/users/login";

    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };

    try {
      const res = await fetch(url, config);
      if (res.status !== 200) {
        throw new Error(
          "Something went wrong. Please check if all inputs are valid or if you are authorized"
        );
      }

      const data = await res.json();
      setLoginData(data.access);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Local Storage (Frontend side in addition to backend jwt token + useContext)
  ///////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    localStorage.setItem("loginAccess", loginData);
  }, [loginData]);

  ////////////////////////////////////////////
  // Logout
  ////////////////////////////////////////////
  const logOut = () => {
    localStorage.setItem("loginAccess", "");
    window.location.href = "/";
    // window.location.href refreshes redirects the page to login screen so that if logged out is pressed while user is in hidden pages, user does not remain the page
    alert("Logged out");
  };

  ///////////////////////
  // Submit Function
  ///////////////////////

  useEffect(() => {
    setValidFields(emailInput !== "" && passwordInput !== "");
  }, [emailInput, passwordInput]);

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    const emailCheck =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (validFields) {
      if (emailInput.match(emailCheck) && passwordInput.length >= 12) {
        fetchLogin();
        setEmailInput("");
        setPasswordInput("");
      } else if (!emailInput.match(emailCheck)) {
        setLoginInvalid({ email: "Please enter a valid email" });
      } else if (passwordInput.length < 12) {
        setLoginInvalid({ password: "Password is not valid" });
      }
    }
  };

  const handleEmailInput = (event) => {
    setEmailInput(event.target.value);
  };

  const handlePasswordInput = (event) => {
    setPasswordInput(event.target.value);
  };

  return (
    <div className="App">
      <header>
        <div className="container pt-3 pb-3 headerAlign">
          <div className="row">
            <div className="col-sm-3">
              <h1>MJC</h1>
            </div>
            <div className="col-sm-9 pt-2 pb-3">
              <h5>Song Tracker and User Match</h5>
            </div>
          </div>
        </div>
        {/* <button className="btn btn-outline-light logOut" onClick={logOut}>
          Log Out
        </button> */}
      </header>
      <ReactContext.Provider value={{ logOut }}>
        <NavBar />
      </ReactContext.Provider>
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to="/Login" />} />
          <Route
            path="/Login"
            element={
              <ReactContext.Provider
                value={{
                  emailInput,
                  passwordInput,
                  handleLoginSubmit,
                  handleEmailInput,
                  handlePasswordInput,
                  loginData,
                  error,
                  isLoading,
                  validFields,
                  loginInvalid,
                }}
              >
                <LoginForm /> {loginData ? <ViewUser /> : ""}
              </ReactContext.Provider>
            }
          />
          {/* Using RequireLogin to reroute all the below links to login page */}
          <Route element={<RequireLogin />}>
            <Route
              path="/Createsong"
              element={
                <ReactContext.Provider value={{ loginData }}>
                  <CreateSongMain />
                </ReactContext.Provider>
              }
            />
            <Route
              path="/Searchsong"
              element={
                <ReactContext.Provider value={{ loginData }}>
                  <ViewSong />
                </ReactContext.Provider>
              }
            />
            <Route
              path="/Usermatch"
              element={
                <ReactContext.Provider value={{ loginData }}>
                  <MatchUserRole /> <MatchUserSongGenre />
                  <MatchUserSongTitle /> <MatchUserSongLyrics />
                </ReactContext.Provider>
              }
            />
            <Route
              path="/Chatarea"
              element={
                <ReactContext.Provider value={{ loginData }}>
                  <ViewMessages />
                </ReactContext.Provider>
              }
            />
            {/* end of redirect */}
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
