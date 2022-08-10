import React, { useState, useEffect, useContext } from "react";
import ReactContext from "../context/react.context";
import DeleteSong from "./DeleteSong";
import SearchSongForm from "./SearchSongForm";
import UpdateSong from "./UpdateSong";

const ViewSong = () => {
  const reactCtx = useContext(ReactContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewSong, setViewSong] = useState([]);
  const [showSongList, setShowSongList] = useState(false);
  const [deleteTitleInput, setDeleteTitleInput] = useState("");

  const accessToken = reactCtx.loginData;

  //   let content = "";
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

  ////////////////////////////////////
  // Delete Song Fetch API
  ///////////////////////////////////

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
        <div className="container">
          <li>
            <div className="row">
              <div className="col-sm-3">Title: </div>{" "}
              <div className="col-sm-9">{item.title}</div>
            </div>
            <div>
              <div className="row">
                <div className="col-sm-3">Lyrics: </div>
                <div className="col-sm-9"> {item.lyrics} </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">Chords: </div>
              <div className="col-sm-9">{item.chords}</div>
            </div>
            <div className="row">
              <div className="col-sm-3">Genre: </div>
              <div className="col-sm-9">{item.genretag}</div>
            </div>
            <div className="row">
              <div className="col-sm-3">Created On: </div>
              <div className="col-sm-9">{item.created_on}</div>
            </div>
            <div className="row">
              <div className="col-sm-3">email: </div>
              <div className="col-sm-9">{item.email}</div>
            </div>
            <br />
            <br />
          </li>
        </div>
      );
    });
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading .. please wait</p>;
  }

  // if (!viewSong[0]) {
  //   content = <p>No songs yet, please add some songs!</p>;
  // }
  return (
    <>
      {/* <div className="container">
        <form onSubmit={handleDeleteSubmit}>
          <input
            name="deletesong"
            value={deleteTitleInput}
            onChange={handleDeleteInput}
            placeholder="Choose Song to Delete"
          />
          <button type="submit" className="btn btn-danger">
            Delete
          </button>
        </form>
      </div> */}
      <div className="deleteSong">
        <DeleteSong />
      </div>

      <SearchSongForm />
      <UpdateSong />
      <div className="mt-5">
        <button onClick={handleAllSongs} className="btn btn-warning">
          View All Songs
        </button>
        <div className="mt-5">
          <ol>{content}</ol>
        </div>
      </div>
    </>
  );
};

export default ViewSong;
