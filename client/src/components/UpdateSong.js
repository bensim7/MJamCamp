import React, { useState, useContext } from "react";

import ReactContext from "../context/react.context";

const UpdateSong = () => {
  const reactCtx = useContext(ReactContext);
  const [callTitle, setCallTitle] = useState("");
  const [updateLyrics, setUpdateLyrics] = useState("");
  const [updateChords, setUpdateChords] = useState("");
  const [updateGenre, setUpdateGenre] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [error, setError] = useState(false);
  const [updatedSongData, setUpdatedSongData] = useState("");

  const accessToken = reactCtx.loginData;

  const UpdateForSong = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      title: callTitle,
      lyrics: updateLyrics,
      chords: updateChords,
      update: updateGenre,
    };

    const url = "http://localhost:5001/songs/updatesong";

    const config = {
      method: "PUT",
      headers: {
        authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    };

    try {
      const res = await fetch(url, config);
      if (res.status !== 200) {
        throw new Error("Unable to update song");
      }

      const data = await res.json();
      setUpdatedSongData(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  console.log(updatedSongData);

  const handleUpdateSongSubmit = (event) => {
    event.preventDefault();
    UpdateForSong();
  };

  const handleCallTitleInput = (event) => {
    setCallTitle(event.target.value);
  };

  const handleUpdateLyricsInput = (event) => {
    setUpdateLyrics(event.target.value);
  };

  const handleUpdateChordsInput = (event) => {
    setUpdateChords(event.target.value);
  };

  const handleUpdateGenreInput = (event) => {
    setUpdateGenre(event.target.value);
  };

  let content = "";
  if (accessToken) {
    if (updatedSongData.rowCount === 1) {
      content = <p>Song is Updated</p>;
    }

    if (updatedSongData.rowCount === 0) {
      content = <p>Wrong Input or No input</p>;
    }

    if (error) {
      content = <p>{error}</p>;
    }

    if (isLoading) {
      content = <p>{isLoading}</p>;
    }
  } else {
    content = <p>Edit Song: Not Authorized</p>;
  }
  return (
    <>
      <div className="container">
        <form onSubmit={handleUpdateSongSubmit}>
          <div>
            <label>Enter Title:</label>
            <input
              name="callTitle"
              type="text"
              value={callTitle}
              onChange={handleCallTitleInput}
              placeholder="Enter Title of Song to update"
            ></input>
          </div>
          <div>
            <label>Update Lyrics:</label>
            <input
              name="updateLyrics"
              type="textarea"
              value={updateLyrics}
              onChange={handleUpdateLyricsInput}
              placeholder="Update Lyrics Here"
            ></input>
          </div>
          <div>
            <label>Update Chords:</label>
            <input
              name="updateChords"
              type="textarea"
              value={updateChords}
              onChange={handleUpdateChordsInput}
              placeholder="Update Chords Here"
            ></input>
          </div>
          <div>
            <label>Update Genre:</label>
            <select
              name="genre1"
              onChange={handleUpdateGenreInput}
              value={updateGenre}
            >
              <option value="">None Selected</option>
              <option value="Classic Rock">Classic Rock</option>
              <option value="Alternative Rock">Alternative Rock</option>
              <option value="Indie">Indie</option>
              <option value="Pop">Pop</option>
              <option value="Grunge">Grunge</option>
              <option value="Metal">Metal</option>
              <option value="Nu Metal">Nu Metal</option>
              <option value="Blues">Blues</option>
              <option value="Funk">Funk</option>
              <option value="Hip Hop">Hip Hop</option>
            </select>
          </div>
          <button type="submit" className="btn btn-warning">
            Edit
          </button>
        </form>
        {content}
      </div>
    </>
  );
};

export default UpdateSong;
