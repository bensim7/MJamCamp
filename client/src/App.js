import React, { useState, useContext, useEffect } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import "./App.css";
import ReactContext from "./context/react.context";
import LoginForm from "./components/LoginForm";
import ViewUser from "./components/ViewUser";
import CreateSongMain from "./components/CreateSongMain";
import ViewSong from "./components/ViewSong";
import MatchUser from "./components/MatchUser";

function App() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [validFields, setValidFields] = useState(false);
  const [loginInvalid, setLoginInvalid] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginData, setLoginData] = useState("");

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
  console.log(loginData);
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
        <h1 className="pt-3 pb-3">MJC</h1>
        <NavBar />
      </header>

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
                <MatchUser />
              </ReactContext.Provider>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
