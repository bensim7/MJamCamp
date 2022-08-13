import React, { useState, useContext } from "react";
import ReactContext from "../context/react.context";

const MatchUserSongLyrics = () => {
  const reactCtx = useContext(ReactContext);
  const [lyricsInput, setLyricsInput] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [error, setError] = useState(false);
  const [userMatchLyricsData, setUserMatchLyricsData] = useState([]);

  const accessToken = reactCtx.loginData;

  const fetchUserMatchSongLyrics = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      lyrics: lyricsInput,
    };

    const url = "http://localhost:5001/users/getuserbysonglyrics";

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
      setUserMatchLyricsData(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  console.log(userMatchLyricsData);

  const handleUserMatchLyricsSubmit = (event) => {
    event.preventDefault();
    fetchUserMatchSongLyrics();
  };

  const handleLyricsInput = (event) => {
    setLyricsInput(event.target.value);
  };

  let content = "";
  if (accessToken) {
    if (userMatchLyricsData) {
      content = userMatchLyricsData.map((item) => {
        return (
          <li>
            <div className="row">
              <div className="col-sm-6">User Name:</div>
              <div className="col-sm-6">{item.username}</div>
            </div>
            <div className="row">
              <div className="col-sm-6">Title:</div>
              <div className="col-sm-6"> {item.title}</div>
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
      content = <p>Loading .. Please Wait</p>;
    }
  } else {
    content = <p>Search Not Authorized</p>;
  }

  return (
    <>
      <div className="container matchSearch mt-5">
        <form onSubmit={handleUserMatchLyricsSubmit}>
          <div className="row">
            <div className="col-sm-6">
              <label>Search User By Song Lyrics</label>
            </div>
            <div className="col-sm-5">
              <input
                name="lyrics"
                value={lyricsInput}
                onChange={handleLyricsInput}
                placeholder="Enter part of lyrics here"
              />
            </div>
            <div className="col-sm-1">
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

export default MatchUserSongLyrics;
