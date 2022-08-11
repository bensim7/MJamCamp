import React, { useState, useEffect, useContext } from "react";
import ReactContext from "../context/react.context";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const DeleteSongModal = (props) => {
  const reactCtx = useContext(ReactContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTitleInput, setDeleteTitleInput] = useState("");

  const [deleteSuccessFetched, setDeleteSuccessFetched] = useState("");

  const accessToken = reactCtx.loginData;
  ////////////////////////////////////
  // Delete Song Fetch API
  ///////////////////////////////////

  const deleteSong = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      title: deleteTitleInput,
    };

    const url = "http://localhost:5001/songs/deletesong";

    const config = {
      method: "DELETE",
      headers: {
        authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    };
    try {
      const res = await fetch(url, config);
      if (res.status !== 200) {
        throw new Error("Unable to delete song");
      }
      const data = await res.json();
      setDeleteSuccessFetched(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
    // if (deleteSuccessFetched.rowCount === 1) {
    //   alert(`Song Title: ${deleteTitleInput} has been deleted`);
    // } else if (deleteSuccessFetched.rowCount === 0) {
    //   alert("Wrong Input or no input");
    // }

    // if (deleteSuccessFetched.rowCount === 1) {
    //   alert(`Song Title: ${deleteTitleInput} has been deleted`);
    // }
  };

  console.log(deleteSuccessFetched.rowCount);

  ////////////////////////
  // Delete Submit
  ////////////////////////
  const handleDeleteSubmit = (event) => {
    event.preventDefault();
    deleteSong();
    console.log("this is the delete input");
    console.log(deleteTitleInput);
    setDeleteTitleInput("");
  };

  const handleDeleteInput = (event) => {
    setDeleteTitleInput(event.target.value);
  };

  let content = "";
  if (accessToken) {
    if (deleteSuccessFetched.rowCount === 1) {
      content = <p>Song is deleted</p>;
    }

    if (deleteSuccessFetched.rowCount === 0) {
      content = <p>Wrong Input or No input</p>;
    }
    if (error) {
      content = <p>{error}</p>;
    }

    if (isLoading) {
      content = <p>Loading .. please wait</p>;
    }
  } else {
    content = <p>Delete Song: Not Authorized</p>;
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
          Delete a song
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {content}
          <div className="container">
            <form onSubmit={handleDeleteSubmit}>
              <div className="row">
                <div className="col-md-3">
                  <label>Delete Song: </label>
                </div>
                <div className="col-md-7">
                  <input
                    name="title"
                    value={deleteTitleInput}
                    onChange={handleDeleteInput}
                    placeholder="Choose Song to Delete"
                  />
                </div>
                <div className="col-md-1">
                  <button type="submit" className="btn btn-outline-danger">
                    Delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-outline-dark" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteSongModal;
