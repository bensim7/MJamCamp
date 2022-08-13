import React, { useState, useContext } from "react";
import ReactContext from "../context/react.context";
import RegisterModal from "./RegisterModal";
import Button from "react-bootstrap/Button";

const LoginForm = () => {
  const reactCtx = useContext(ReactContext);
  const [modalShow, setModalShow] = useState(false);

  const accessToken = reactCtx.loginData;
  let content = "";

  if (accessToken) {
    content = (
      <div>
        <h3>Login Successful</h3>
      </div>
    );
  }

  if (reactCtx.error) {
    content = <p>{reactCtx.error}</p>;
  }

  if (reactCtx.isLoading) {
    content = <p>Loading .. Please Wait</p>;
  }
  return (
    <>
      <div className="container mt-3">
        <div className="centered">
          <h2>Login Form</h2>
        </div>
        <form onSubmit={reactCtx.handleLoginSubmit}>
          <div className="row">
            <div className="col-md-5">
              <label>
                <h5>Enter Email Address:</h5>
              </label>
            </div>
            <div className="col-md-5">
              <input
                name="email"
                value={reactCtx.emailInput}
                onChange={reactCtx.handleEmailInput}
                type="text"
                placeholder="Enter Email Here"
              />
            </div>
          </div>
          <p>{reactCtx.loginInvalid.email}</p>

          <div>
            <div className="row">
              <div className="col-md-5">
                <label>
                  <h5>Enter Password:</h5>
                </label>
              </div>
              <div className="col-md-5">
                <input
                  name="password"
                  value={reactCtx.passwordInput}
                  onChange={reactCtx.handlePasswordInput}
                  type="password"
                  placeholder="Enter Password Here"
                ></input>
              </div>
            </div>
            <p>{reactCtx.loginInvalid.password}</p>
          </div>
          <div className="row">
            <div className="col-md-6">
              {reactCtx.validFields ? (
                <h6>All inputs are filled</h6>
              ) : (
                <h6>Please fill both email and password:</h6>
              )}
            </div>
            <div className="col-md-3">
              <Button
                variant="outline-warning"
                onClick={() => setModalShow(true)}
              >
                Register New User
              </Button>
            </div>
            <div className="col-md-1">
              <button className="btn btn-outline-light" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>

      <RegisterModal show={modalShow} onHide={() => setModalShow(false)} />
      <div className="mt-5">{content}</div>
    </>
  );
};

export default LoginForm;
