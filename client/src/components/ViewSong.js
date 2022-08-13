import React, { useState, useEffect, useContext } from "react";
import ReactContext from "../context/react.context";
// import DeleteSong from "./DeleteSong";
// import UpdateSong from "./UpdateSong";
// import UpdateSongModal from "./UpdateSongModal";
// import Button from "react-bootstrap/Button";
import SearchSongForm from "./SearchSongForm";

const ViewSong = () => {
  const reactCtx = useContext(ReactContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewSong, setViewSong] = useState([]);
  // const [deleteTitleInput, setDeleteTitleInput] = useState("");
  // moved update song modal to SearchSongForm.js
  // const [modalShow, setModalShow] = useState(false);

  const accessToken = reactCtx.loginData;

  const fetchViewSong = async () => {
    setIsLoading(true);
    setError(null);

    const url = "http://localhost:5001/songs/allsongs";
    console.log("This is url");
    console.log(url);

    const config = {
      method: "GET",
      headers: { authorization: "Bearer " + accessToken },
      "Content-Type": "application/json",
    };

    try {
      const res = await fetch(url, config);
      if (res.status !== 200) {
        throw new Error("Unable to retrieve user data.");
      }
      const data = await res.json();
      setViewSong(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };
  console.log(viewSong);

  ////////////////////////////
  // View All Songs Submit Button
  //////////////////////////
  const handleAllSongs = (event) => {
    event.preventDefault();
    fetchViewSong();
  };

  ////////////////////////////////////////////////////////
  // Delete Song Fetch API (moved to DeleteSongModal.js)
  ////////////////////////////////////////////////////////

  // const deleteSong = async () => {
  //   setIsLoading(true);
  //   setError(null);

  //   const body = {
  //     title: deleteTitleInput,
  //   };

  //   const url = "http://localhost:5001/songs/deletesong";

  //   const config = {
  //     method: "DELETE",
  //     headers: { authorization: "Bearer " + accessToken },
  //     "Content-Type": "application/json",
  //     body: JSON.stringify(body),
  //   };
  //   try {
  //     const res = await fetch(url, config);
  //     if (res.status !== 200) {
  //       throw new Error("Unable to delete song");
  //     }
  //     const data = await res.json();
  //   } catch (error) {
  //     setError(error.message);
  //   }
  //   setIsLoading(false);
  // };

  ////////////////////////
  // Delete Submit
  ////////////////////////
  // const handleDeleteSubmit = (event) => {
  //   event.preventDefault();
  //   deleteSong();
  //   console.log("this is the delete input");
  //   console.log(deleteTitleInput);
  // };

  // const handleDeleteInput = (event) => {
  //   setDeleteTitleInput(event.target.value);
  // };

  let content = "";

  if (viewSong) {
    content = viewSong.map((item) => {
      return (
        <li>
          <div className="row">
            <div className="col-sm-5">Title: </div>
            <div className="col-sm-7">{item.title}</div>
          </div>
          <div>
            <div className="row">
              <div className="col-sm-5">Lyrics: </div>
              <div className="col-sm-7"> {item.lyrics} </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-5">Chords: </div>
            <div className="col-sm-7">{item.chords}</div>
          </div>
          <div className="row">
            <div className="col-sm-5">Genre: </div>
            <div className="col-sm-7">{item.genre}</div>
          </div>
          <div className="row">
            <div className="col-sm-5">Created On: </div>
            <div className="col-sm-7">{item.created_on}</div>
          </div>
          <div className="row">
            <div className="col-sm-5">Updated On: </div>
            <div className="col-sm-7">{item.updated_on}</div>
          </div>
          <div className="row">
            <div className="col-sm-5">Email: </div>
            <div className="col-sm-7">{item.email}</div>
          </div>
          <br />
          <br />
        </li>
      );
    });
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading .. Please Wait</p>;
  }

  return (
    <>
      <SearchSongForm />
      <br />
      {/* <Button variant="primary" onClick={() => setModalShow(true)}>
        Edit Song
      </Button>

      <UpdateSongModal show={modalShow} onHide={() => setModalShow(false)} /> */}

      <div className="mt-5">
        <button onClick={handleAllSongs} className="btn btn-outline-warning">
          View All Songs
        </button>
        <div className="container mt-5">
          <ol>{content}</ol>
        </div>
      </div>
    </>
  );
};

export default ViewSong;
