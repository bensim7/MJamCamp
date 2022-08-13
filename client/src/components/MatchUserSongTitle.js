import React, { useState, useContext } from "react";
import ReactContext from "../context/react.context";

const MatchUserSongTitle = () => {
  const reactCtx = useContext(ReactContext);
  const [titleInput, setTitleInput] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [error, setError] = useState(false);
  const [userMatchTitleData, setUserMatchTitleData] = useState([]);

  const accessToken = reactCtx.loginData;

  const fetchUserMatchSongTitle = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      title: titleInput,
    };

    const url = "http://localhost:5001/users/getuserbysongtitle";

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
      setUserMatchTitleData(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  console.log(userMatchTitleData);

  const handleUserMatchTitleSubmit = (event) => {
    event.preventDefault();
    fetchUserMatchSongTitle();
  };

  const handleTitleInput = (event) => {
    setTitleInput(event.target.value);
  };

  let content = "";
  if (accessToken) {
    if (userMatchTitleData) {
      content = userMatchTitleData.map((item) => {
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
        <form onSubmit={handleUserMatchTitleSubmit}>
          <div className="row">
            <div className="col-sm-6">
              <label>Search User By Song Title:</label>
            </div>
            <div className="col-sm-5">
              <input
                name="title"
                value={titleInput}
                onChange={handleTitleInput}
                placeholder="Enter Song Title or Partial Title"
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

export default MatchUserSongTitle;
