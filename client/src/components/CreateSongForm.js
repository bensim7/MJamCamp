import React, { useState, useContext } from "react";
import ReactContext from "../context/react.context";

const CreateSongForm = () => {
  const reactCtx = useContext(ReactContext);

  //   console.log(reactCtx.accessToken);
  let content = "";
  console.log("View Added Song");
  console.log(reactCtx.addedSong);

  if (reactCtx.accessToken) {
    if (reactCtx.addedSong.rowCount === 1) {
      content = <div>Created Song Successfully!</div>;
    }

    if (reactCtx.error) {
      content = <p>{reactCtx.error}</p>;
    }

    if (reactCtx.isLoading) {
      content = <p>Loading .. please wait</p>;
    }
  } else {
    content = <p>Create/Add Song: Not Authorized</p>;
  }
  return (
    <>
      <div className="centered">
        <div className="container">
          <span>
            <h2>Create/Add Song</h2> {content}
          </span>

          <form onSubmit={reactCtx.handleAddSongSubmit}>
            <div className="row mt-3">
              <div className="col-md-5">
                <label>
                  <h5>Enter Song Title</h5>
                </label>
              </div>
              <div className="col-md-5">
                <input
                  name="title"
                  value={reactCtx.titleInput}
                  onChange={reactCtx.handleTitleInput}
                  type="text"
                  placeholder="Enter Song Title"
                ></input>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-5">
                <label>
                  <h5>Enter Lyrics</h5>
                </label>
              </div>
              <div className="col-md-5">
                <textarea
                  rows="18"
                  cols="70"
                  name="lyrics"
                  value={reactCtx.lyricsInput}
                  onChange={reactCtx.handleLyricsInput}
                  placeholder="Enter Lyrics Here"
                ></textarea>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-5">
                <label>
                  <h5>Enter Chords</h5>
                </label>
              </div>
              <div className="col-md-5">
                <textarea
                  rows="5"
                  cols="70"
                  name="chords"
                  value={reactCtx.chordsInput}
                  onChange={reactCtx.handleChordsInput}
                  placeholder="Enter Chords Details Here"
                ></textarea>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-5">
                <label>
                  <h5>Select Genre</h5>
                </label>
              </div>
              <div className="col-md-5">
                <select name="genre" onChange={reactCtx.handleGenreInput}>
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
            </div>
            <div className="row mt-3">
              <div className="col-md-7"></div>
              <div className="col-md-2">
                <h6>{reactCtx.inputsCheck}</h6>
              </div>
              <div className="col-md-3">
                <button className="btn btn-success" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSongForm;
