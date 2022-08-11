import React, { useState, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ReactContext from "../context/react.context";

const UpdateLoggedInUserModal = (props) => {
  const reactCtx = useContext(ReactContext);

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [password1Input, setPassword1Input] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const [musicTypeInput, setMusicTypeInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [contactInput, setContactInput] = useState("");

  const [validFields, setValidFields] = useState(false);
  const [updateUserInvalid, setUpdateUserInvalid] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateUserData, setUpdateUserData] = useState("");

  /////////////////////////////////////////
  // Update User
  /////////////////////////////////////////

  const updateUserToDb = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      username: userNameInput,
      password: passwordInput,
      password1: password1Input,
      musictype: musicTypeInput,
      contact: contactInput,
      location: locationInput,
    };

    const url = "http://localhost:5001/users/updateuser";

    const config = {
      method: "PUT",
      headers: {
        authorization: "Bearer " + reactCtx.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    try {
      const res = await fetch(url, config);
      if (res.status !== 200) {
        throw new Error(
          "Something went wrong. Please check if all inputs are filled correctly"
        );
      }
      const data = await res.json();
      setUpdateUserData(data);
      reactCtx.fetchViewUser(); // refresh Logged in user's detail after update
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  };

  console.log(updateUserData);

  //////////////////////////////////////
  // Submit Button
  /////////////////////////////////////

  useEffect(() => {
    setValidFields(
      userNameInput !== "" &&
        passwordInput !== "" &&
        password1Input !== "" &&
        musicTypeInput !== ""
    );
  }, [userNameInput, passwordInput, password1Input, musicTypeInput]);

  const handleUpdateUserSubmit = (event) => {
    event.preventDefault();

    if (validFields) {
      if (passwordInput.length >= 12 && passwordInput === password1Input) {
        updateUserToDb();
        setUserNameInput("");
        setPasswordInput("");
        setPassword1Input("");
        setMusicTypeInput("");
        setContactInput("");
        setLocationInput("");
      } else if (passwordInput.length < 12) {
        setUpdateUserInvalid({ password: "Password is not valid" });
      } else if (passwordInput !== password1Input) {
        setUpdateUserInvalid({
          passwordMatch: "The 2 password inputs do not match",
        });
      }
    }
  };

  const handleUserNameInput = (event) => {
    setUserNameInput(event.target.value);
  };
  const handlePasswordInput = (event) => {
    setPasswordInput(event.target.value);
  };

  const handlePassword1Input = (event) => {
    setPassword1Input(event.target.value);
  };

  const handleMusicTypeInput = (event) => {
    setMusicTypeInput(event.target.value);
  };

  const handleContactInput = (event) => {
    setContactInput(event.target.value);
  };

  const handleLocationInput = (event) => {
    setLocationInput(event.target.value);
  };

  let content = "";
  if (updateUserData) {
    content = <p>Update Successful!</p>;
  }
  if (error) {
    content = { error };
  }

  if (isLoading) {
    content = <p>Loading .. Please wait</p>;
  }

  return (
    <Modal
      className="modalUpdateUser"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      color="black"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Your Details:
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          {content}
          <div className="container">
            <form onSubmit={handleUpdateUserSubmit}>
              <div className="row">
                <div className="col-sm-3">
                  <label>*User Name: </label>
                </div>
                <div className="col-sm-5">
                  <input
                    name="username"
                    value={userNameInput}
                    onChange={handleUserNameInput}
                    type="text"
                    placeholder="Enter Name Here"
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-sm-3">
                  <label>*Update Password: </label>
                </div>
                <div className="col-sm-5">
                  <input
                    name="password"
                    value={passwordInput}
                    onChange={handlePasswordInput}
                    type="password"
                    placeholder="Enter Password Here"
                  />
                </div>
              </div>
              {updateUserInvalid.password}
              <br />

              <div className="row">
                <div className="col-sm-3">
                  <label>*Re-enter Password: </label>
                </div>
                <div className="col-sm-5">
                  <input
                    name="password1"
                    value={password1Input}
                    onChange={handlePassword1Input}
                    type="password"
                    placeholder="Re-enter Password Here"
                  />
                </div>
              </div>
              {updateUserInvalid.passwordMatch}
              <br />

              <div className="row">
                <div className="col-sm-3">
                  <label>*Role: </label>
                </div>
                <div className="col-sm-5">
                  <select
                    name="musictype"
                    value={musicTypeInput}
                    onChange={handleMusicTypeInput}
                  >
                    <option value="">None Selected</option>
                    <option value="Guitarist">Guitarist</option>
                    <option value="Bassist">Bassist</option>
                    <option value="Drummer">Drummer</option>
                    <option value="Keyboardist">Keyboardist</option>
                    <option value="Vocalist">Vocalist</option>
                    <option value="Wind Instruments">Wind Instruments</option>
                  </select>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-sm-3">
                  <label>Optional Contact Info : </label>
                </div>
                <div className="col-sm-7">
                  <input
                    name="contact"
                    value={contactInput}
                    onChange={handleContactInput}
                    type="text"
                    placeholder="Leave empty if you do not want it to appear in User Match"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <label>Optional Location: </label>
                </div>
                <div className="col-sm-5">
                  <select name="location" onChange={handleLocationInput}>
                    <option value="">None Selected</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
              </div>
              <br />
              <div>
                <div>
                  {validFields
                    ? "All Required Fields Filled"
                    : "Please Enter All Required Fields Marked with *"}
                </div>
                <br />
                <div className="row">
                  <div className="col-sm-3"></div>
                  <div className="col-sm-5">
                    <button type="submit" className="btn btn-outline-dark">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-outline-dark" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateLoggedInUserModal;
