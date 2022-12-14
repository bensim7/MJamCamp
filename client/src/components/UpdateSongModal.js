import React, { useState, useContext, useEffect } from "react";
import ReactContext from "../context/react.context";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function UpdateSongModal(props) {
  const reactCtx = useContext(ReactContext);
  const [callTitle, setCallTitle] = useState("");
  const [updateLyrics, setUpdateLyrics] = useState("");
  const [savedLyrics, setSavedLyrics] = useState([]);
  const [updateChords, setUpdateChords] = useState("");
  const [updateGenre, setUpdateGenre] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [error, setError] = useState(false);
  const [updatedSongData, setUpdatedSongData] = useState("");
  const [validFields, setValidFields] = useState(false);
  const [inputsCheck, setInputsCheck] = useState("");

  const accessToken = reactCtx.loginData;

  const handleSaveLyrics = () => {
    setSavedLyrics([...savedLyrics, updateLyrics]);
    setUpdateLyrics("");
  };

  const UpdateForSong = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      title: callTitle,
      lyrics: savedLyrics,
      chords: updateChords,
      genre: updateGenre,
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

  /////////////////////////////////////////////
  // Submit Update Song
  ////////////////////////////////////////////
  useEffect(() => {
    setValidFields(callTitle !== "" && savedLyrics[0] && updateGenre !== "");
  }, [callTitle, savedLyrics, updateChords, updateGenre]);

  const handleUpdateSongSubmit = (event) => {
    event.preventDefault();
    if (validFields) {
      UpdateForSong();
      setInputsCheck("");
    } else {
      setInputsCheck("Please fill all required fields marked with *");
    }
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
      content = <p>Song Is Updated</p>;
    }

    if (updatedSongData.rowCount === 0) {
      content = <p>Wrong Input Or No Input</p>;
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
    <Modal
      className="modalUpdateSong"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update/Edit Song
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <h4>Centered Modal</h4> */}
        <>
          {content}
          <div className="container">
            <form onSubmit={handleUpdateSongSubmit}>
              <div className="row">
                <div className="col-sm-3">
                  <label>*Enter Title:</label>
                </div>
                <div className="col-sm-7">
                  <input
                    name="callTitle"
                    type="text"
                    value={callTitle}
                    onChange={handleCallTitleInput}
                    placeholder="Please key in full title of song to update"
                  ></input>
                </div>
              </div>

              <br />
              <div>
                <label>Update Lyrics:</label>
              </div>
              <div>
                <textarea
                  name="updateLyrics"
                  rows="15"
                  cols="82"
                  value={updateLyrics}
                  onChange={handleUpdateLyricsInput}
                  placeholder="Enter each paragraph/line of lyrics and save"
                ></textarea>
              </div>
              <button
                type="button"
                onClick={handleSaveLyrics}
                disabled={!updateLyrics}
              >
                Save Updated Lyrics
              </button>
              <br />
              <br />
              <div>
                <div>
                  <label>
                    <h5>*Saved Lyrics</h5>
                  </label>
                </div>
                <div className="boxContain">
                  {savedLyrics.map((lyric) => (
                    <p>{lyric}</p>
                  ))}
                </div>

                <label>Update Chords:</label>
              </div>
              <div>
                <textarea
                  name="updateChords"
                  rows="6"
                  cols="82"
                  value={updateChords}
                  onChange={handleUpdateChordsInput}
                  placeholder="Update Chords Here"
                ></textarea>
              </div>
              <br />
              <div className="row">
                <div className="col-sm-3">
                  <label>*Update Genre:</label>
                </div>
                <div className="col-sm-5">
                  <select
                    name="genre"
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
              </div>
              <br />
              <div className="row">
                <div className="col-sm-9">{inputsCheck}</div>
                <div className="col-sm-3">
                  <button type="submit" className="btn btn-outline-dark">
                    Submit Edit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-outline-dark" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateSongModal;
