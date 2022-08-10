import React, { useState, useEffect, useContext } from "react";
import ReactContext from "../context/react.context";

const DeleteSong = () => {
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
    <div>
      <div className="container">
        <form onSubmit={handleDeleteSubmit}>
          <div className="row">
            <div className="col-sm-9">
              <input
                name="title"
                value={deleteTitleInput}
                onChange={handleDeleteInput}
                placeholder="Choose Song to Delete"
              />
            </div>
            <div className="col-sm-1">
              <button type="submit" className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </form>
        {content}
      </div>
    </div>
  );
};

export default DeleteSong;
