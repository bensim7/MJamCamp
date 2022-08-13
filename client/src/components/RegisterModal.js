import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function RegisterModal(props) {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [password1Input, setPassword1Input] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const [musicTypeInput, setMusicTypeInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [contactInput, setContactInput] = useState("");

  const [validFields, setValidFields] = useState(false);
  const [registerInvalid, setRegisterInvalid] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registerData, setRegisterData] = useState("");

  /////////////////////////////////
  // Register User
  ////////////////////////////////
  const registerNewUser = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      email: emailInput,
      username: userNameInput,
      password: passwordInput,
      password1: password1Input,
      musictype: musicTypeInput,
      contact: contactInput,
      location: locationInput,
    };

    const url = "http://localhost:5001/users/createuser";

    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };

    try {
      const res = await fetch(url, config);
      if (res.status !== 200) {
        throw new Error(
          "Please check if all inputs are filled correctly. User name may be taken."
        );
      }

      const data = await res.json();
      setRegisterData(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  // console.log(registerData);

  //////////////////////////////////////
  // Submit Button
  /////////////////////////////////////

  useEffect(() => {
    setValidFields(
      emailInput !== "" &&
        userNameInput !== "" &&
        passwordInput !== "" &&
        password1Input !== "" &&
        musicTypeInput !== ""
    );
  }, [
    emailInput,
    userNameInput,
    passwordInput,
    password1Input,
    musicTypeInput,
  ]);

  const handleRegistrationSubmit = (event) => {
    event.preventDefault();

    const emailCheck =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (validFields) {
      if (
        emailInput.match(emailCheck) &&
        passwordInput.length >= 12 &&
        passwordInput === password1Input
      ) {
        registerNewUser();
        setEmailInput("");
        setUserNameInput("");
        setPasswordInput("");
        setPassword1Input("");
        setMusicTypeInput("");
        setContactInput("");
        setLocationInput("");
      } else if (!emailInput.match(emailCheck)) {
        setRegisterInvalid({ email: "Please enter a valid email" });
      } else if (passwordInput.length < 12) {
        setRegisterInvalid({ password: "Password is not valid" });
      } else if (passwordInput !== password1Input) {
        setRegisterInvalid({
          passwordMatch: "The 2 password inputs do not match",
        });
      }
    }
  };

  const handleEmailInput = (event) => {
    setEmailInput(event.target.value);
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
  if (registerData[0]) {
    content = <p>Registration Successful!</p>;
  }
  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading .. Please Wait</p>;
  }
  return (
    <Modal
      className="modalRegister"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      color="black"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Registration Form
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <h4>Registration Form</h4> */}
        <>
          {content}
          <div className="container">
            <form onSubmit={handleRegistrationSubmit}>
              <div className="row">
                <div className="col-sm-3">
                  <label>*Email Address: </label>
                </div>
                <div className="col-sm-7">
                  <input
                    name="email"
                    value={emailInput}
                    onChange={handleEmailInput}
                    type="text"
                    placeholder="Enter Email Here"
                  />
                </div>
              </div>
              {registerInvalid.email}
              <br />
              <div className="row">
                <div className="col-sm-3">
                  <label>*User Name: </label>
                </div>
                <div className="col-sm-7">
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
                  <label>*Password: </label>
                </div>
                <div className="col-sm-7">
                  <input
                    name="password"
                    value={passwordInput}
                    onChange={handlePasswordInput}
                    type="password"
                    placeholder="Enter Password Here"
                  />
                </div>
              </div>
              {registerInvalid.password}
              <br />

              <div className="row">
                <div className="col-sm-3">
                  <label>*Re-enter Password: </label>
                </div>
                <div className="col-sm-7">
                  <input
                    name="password1"
                    value={password1Input}
                    onChange={handlePassword1Input}
                    type="password"
                    placeholder="Re-enter Password Here"
                  />
                </div>
              </div>
              {registerInvalid.passwordMatch}
              <br />

              <div className="row">
                <div className="col-sm-3">
                  <label>*Role: </label>
                </div>
                <div className="col-sm-7">
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
              <br />
              <div className="row">
                <div className="col-sm-3">
                  <label>Optional Location: </label>
                </div>
                <div className="col-sm-7">
                  <select name="location" onChange={handleLocationInput}>
                    {/* value not required for drop down list*/}
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
}

// function App() {
//   const [modalShow, setModalShow] = React.useState(false);

//   return (
//     <>
//       <Button variant="primary" onClick={() => setModalShow(true)}>
//         Launch vertically centered modal
//       </Button>

//       <MyVerticallyCenteredModal
//         show={modalShow}
//         onHide={() => setModalShow(false)}
//       />
//     </>
//   );
// }

// render(<App />);
export default RegisterModal;
