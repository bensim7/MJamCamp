import React, { useState, useContext } from "react";
import ReactContext from "../context/react.context";
import AddSongForm from "./AddSongForm";

const AddSongMain = () => {
  const reactCtx = useContext(ReactContext);
  const [titleInput, setTitleInput] = useState("");
  const [lyricsInput, setLyricsInput] = useState("");
  const [chordsInput, setChordsInput] = useState("");
  const [genreTagInput, setGenreTagInput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addedSong, setAddedSong] = useState("");
  // const [viewSong, setViewSong] = useState([]);
  const accessToken = reactCtx.loginData;

  /////////////////////////////////
  // Add Song
  ////////////////////////////////

  const addSong = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      title: titleInput,
      lyrics: lyricsInput,
      chords: chordsInput,
      genretag: genreTagInput,
    };
    console.log(body);

    const url = "http://localhost:5001/songs/addsong";

    const config = {
      method: "POST",
      headers: {
        authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    try {
      const res = await fetch(url, config);
      console.log(res);
      if (res.status !== 200) {
        throw new Error("Unable to add song");
      }
      const data = await res.json();
      setAddedSong(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  console.log(addedSong);

  ///////////////////////////////
  // Add Song Submit Function
  ///////////////////////////////

  const handleAddSongSubmit = (event) => {
    event.preventDefault();
    addSong(titleInput, lyricsInput, chordsInput);
  };

  const handleTitleInput = (event) => {
    setTitleInput(event.target.value);
  };

  const handleLyricsInput = (event) => {
    setLyricsInput(event.target.value);
  };

  const handleChordsInput = (event) => {
    setChordsInput(event.target.value);
  };

  const handleGenreTagInput = (event) => {
    setGenreTagInput(event.target.value);
  };

  return (
    <div>
      <ReactContext.Provider
        value={{
          titleInput,
          lyricsInput,
          chordsInput,
          genreTagInput,
          handleAddSongSubmit,
          handleTitleInput,
          handleLyricsInput,
          handleChordsInput,
          handleGenreTagInput,
          isLoading,
          error,
          addedSong,
          accessToken,
        }}
      >
        <AddSongForm />
      </ReactContext.Provider>
      {/* <form onSubmit={handleAddSongSubmit}>
        <label>
          <h5>Enter Song Title</h5>
        </label>
        <input
          name="title"
          value={titleInput}
          onChange={handleTitleInput}
          type="text"
          placeholder="Enter Song Title"
        ></input>
        <label>
          <h5>Enter Lyrics</h5>
        </label>
        <input
          name="title"
          value={lyricsInput}
          onChange={handleLyricsInput}
          type="text"
          placeholder="Enter Lyrics"
        ></input>
        <label>
          <h5>Enter Chords</h5>
        </label>
        <input
          name="chords"
          value={chordsInput}
          onChange={handleChordsInput}
          type="text"
          placeholder="Enter Chords"
        ></input>
        <button type="submit">submit</button>
      </form> */}
    </div>
  );
};

export default AddSongMain;
