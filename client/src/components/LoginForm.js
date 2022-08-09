import React, { useState, useContext } from "react";
import ReactContext from "../context/react.context";

const LoginForm = () => {
  const reactCtx = useContext(ReactContext);

  let content = "";
  console.log(reactCtx.loginData);

  if (reactCtx.loginData) {
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
    content = <p>Logging in .. please wait</p>;
  }
  return (
    <>
      <div className="container mt-3">
        <div className="centered">
          <h2>Login Form</h2>
        </div>
        <form onSubmit={reactCtx.handleLoginSubmit}>
          <div className="row">
            <div className="col-md-4">
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
              ></input>
            </div>
          </div>
          <p>{reactCtx.loginInvalid.email}</p>

          <div>
            <div className="row">
              <div className="col-md-4">
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
            <div className="col-md-4">
              {reactCtx.validFields ? (
                <h6>All inputs are filled</h6>
              ) : (
                <h6>Please enter your email and password to log in</h6>
              )}
            </div>
            <div className="col-md-8">
              <button className="btn btn-success" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-5">{content}</div>
    </>
  );
};

export default LoginForm;
