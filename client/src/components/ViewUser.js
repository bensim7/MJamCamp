import React, { useState, useEffect, useContext } from "react";
import ReactContext from "../context/react.context";
import UpdateLoggedInUserModal from "./UpdateLoggedInUserModal";
import Button from "react-bootstrap/Button";

const ViewUser = () => {
  const reactCtx = useContext(ReactContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewData, setViewData] = useState({});
  const [modalShow, setModalShow] = useState(false);

  //   const handleUserSubmit = (event) => {
  //     event.preventDefault();
  //     fetchViewUser();
  //   };

  const accessToken = reactCtx.loginData;

  const fetchViewUser = async () => {
    setIsLoading(true);
    setError(null);

    const url = "http://localhost:5001/users/getuser";
    console.log("This is url");
    console.log(url);

    const config = {
      method: "GET",
      headers: { authorization: "Bearer " + accessToken },
    };

    try {
      const res = await fetch(url, config);
      if (res.status !== 200) {
        throw new Error("Unable to retrieve user data.");
      }
      const data = await res.json();
      setViewData(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  // Auto fetch Logged In User's detail when accessToken is populated with useContexat
  useEffect(() => {
    fetchViewUser();
  }, [accessToken]);

  let content = "";
  console.log(viewData);

  if (viewData) {
    content = (
      <div className="container left">
        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-3">User Name:</div>
          <div className="col-sm-2">{viewData.username}</div>
        </div>
        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-3">Instrument:</div>
          <div className="col-sm-2">{viewData.musictype}</div>
        </div>
        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-3">Optional Contact Info:</div>
          <div className="col-sm-2"> {viewData.contact}</div>
        </div>
        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-3">Optional Location:</div>
          <div className="col-sm-2"> {viewData.location}</div>
        </div>

        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-3">Account Created On:</div>
          <div className="col-sm-2">{viewData.created_on}</div>
        </div>
        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-3">Last Login On:</div>
          <div className="col-sm-2">{viewData.last_login}</div>
        </div>
      </div>
    );
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading .. Please Wait</p>;
  }

  return (
    <>
      <div className="mt-4 container">
        {/* <button onClick={handleUserSubmit}>View User</button> */}

        <h5>User Account Details:</h5>
        <div className="row left mb-3">
          <div className="col-sm-4"></div>
          <div className="col-sm-4"></div>
          <div className="col-sm-2">
            <Button
              variant="outline-warning"
              onClick={() => setModalShow(true)}
            >
              Update Details
            </Button>
          </div>
        </div>
      </div>
      {content}
      <ReactContext.Provider value={{ accessToken, fetchViewUser }}>
        <UpdateLoggedInUserModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </ReactContext.Provider>
    </>
  );
};

export default ViewUser;
