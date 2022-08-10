import React, { useState, useContext } from "react";
import ReactContext from "../context/react.context";
import UpdateSongModal from "./UpdateSongModal";
import Button from "react-bootstrap/Button";

const SearchSongForm = () => {
  const reactCtx = useContext(ReactContext);
  const [titleSearchInput, setTitleSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [error, setError] = useState(false);
  const [searchedSongData, setSearchedSongData] = useState("");
  const [modalShow, setModalShow] = useState(false);

  const accessToken = reactCtx.loginData;

  const fetchSearchedSong = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      title: titleSearchInput,
    };

    const url = "http://localhost:5001/songs/getsong";

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
      if (res.status !== 200) {
        throw new Error("Unable to search song");
      }
      const data = await res.json();
      setSearchedSongData(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };
  console.log(searchedSongData);

  const handleSearchedSongSubmit = (event) => {
    event.preventDefault();
    fetchSearchedSong();
  };

  const handleSearchedSongInput = (event) => {
    setTitleSearchInput(event.target.value);
  };

  let content = "";
  if (accessToken) {
    //   if (searchedSongData !== [] || searchedSongData !== "") {
    if (searchedSongData[0]) {
      content = (
        <div className="container">
          <div className="row">Title: {searchedSongData[0].title}</div>
          <br />
          <div className="row">
            <div className="col-md-6">Lyrics: {searchedSongData[0].lyrics}</div>
            <div className="col-md-6">Chords{searchedSongData[0].chords}</div>
          </div>
          <br />
          <div className="row">
            <div>Genre: {searchedSongData[0].genretag}</div>
            <div>Created On:{searchedSongData[0].created_on}</div>
            <div>Email: {searchedSongData[0].email}</div>
          </div>
        </div>
      );
    }

    // if (!searchedSongData[0]) {
    //   content = <p>Input not valid or partial name of song does not exist</p>;
    // }

    if (error) {
      content = <p>{error}</p>;
    }

    if (isLoading) {
      content = <p>Loading .. please wait</p>;
    }
  } else {
    content = <p>Search Song: Not Authorized</p>;
  }
  return (
    <>
      <div>
        <div className="container searchSong">
          <form onSubmit={handleSearchedSongSubmit}>
            <div className="row">
              <div className="col-md-3">
                <label>Search Song:</label>
              </div>
              <div className="col-md-5">
                <input
                  name="title"
                  value={titleSearchInput}
                  onChange={handleSearchedSongInput}
                  placeholder="Enter Title or Partial Title"
                />
              </div>
              <div className="col-md-1">
                <button type="submit" className="btn btn-outline-light">
                  Search
                </button>
              </div>
              <div className="col-md-3">
                <Button
                  variant="outline-warning"
                  onClick={() => setModalShow(true)}
                >
                  Edit Song
                </Button>
              </div>
            </div>
          </form>
        </div>
        <UpdateSongModal show={modalShow} onHide={() => setModalShow(false)} />
        {content}
      </div>
    </>
  );
};

export default SearchSongForm;
