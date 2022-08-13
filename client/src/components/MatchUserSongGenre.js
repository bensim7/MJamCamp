import React, { useState, useContext } from "react";
import ReactContext from "../context/react.context";

const MatchUserSongGenre = () => {
  const reactCtx = useContext(ReactContext);
  const [genreInput, setGenreInput] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [error, setError] = useState(false);
  const [userMatchGenreData, setUserMatchGenreData] = useState([]);

  const accessToken = reactCtx.loginData;

  const fetchUserMatchSongGenre = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      genre: genreInput,
    };

    const url = "http://localhost:5001/users/getuserbysonggenre";

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
        throw new Error("Unable to find users");
      }
      const data = await res.json();
      setUserMatchGenreData(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  console.log(userMatchGenreData);

  const handleUserMatchGenreSubmit = (event) => {
    event.preventDefault();
    fetchUserMatchSongGenre();
  };

  const handleGenreInput = (event) => {
    setGenreInput(event.target.value);
  };

  let content = "";
  if (accessToken) {
    if (userMatchGenreData) {
      content = userMatchGenreData.map((item) => {
        return (
          <li>
            <div className="row">
              <div className="col-sm-6">User Name:</div>
              <div className="col-sm-6">{item.username}</div>
            </div>
            <div className="row">
              <div className="col-sm-6">Genre of song:</div>
              <div className="col-sm-6"> {item.genre}</div>
            </div>
            <div className="row">
              <div className="col-sm-6">Location - Optional:</div>
              <div className="col-sm-6"> {item.location}</div>
            </div>
            <div className="row">
              <div className="col-sm-6">Contact - Optional:</div>
              <div className="col-sm-6"> {item.contact}</div>
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
      content = <p>Loading .. Please wait</p>;
    }
  } else {
    content = <p>Search Not Authorized</p>;
  }

  return (
    <>
      <div className="container matchSearch mt-5">
        <form onSubmit={handleUserMatchGenreSubmit}>
          <div className="row">
            <div className="col-sm-6">
              <label>Search User By Song Genre:</label>
            </div>
            <div className="col-sm-2">
              <select name="genre" onChange={handleGenreInput}>
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
            <div className="col-sm-3">
              <button type="submit" className="btn btn-outline-light">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="container searchResults mt-5">
        <ol>{content}</ol>
      </div>
    </>
  );
};

export default MatchUserSongGenre;
