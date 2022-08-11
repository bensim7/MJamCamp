import React, { useState, useContext } from "react";
import ReactContext from "../context/react.context";

const MatchUserRole = () => {
  const reactCtx = useContext(ReactContext);
  const [musicTypeInput, setMusicTypeInput] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [error, setError] = useState(false);
  const [userMatchData, setUserMatchData] = useState([]);

  const accessToken = reactCtx.loginData;

  const fetchUserMatchRole = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      musictype: musicTypeInput,
    };

    const url = "http://localhost:5001/users/getuserbyrole";

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
      setUserMatchData(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  console.log(userMatchData);

  const handleUserMatchSubmit = (event) => {
    event.preventDefault();
    fetchUserMatchRole();
  };

  const handleMusicTypeInput = (event) => {
    setMusicTypeInput(event.target.value);
  };

  let content = "";
  if (accessToken) {
    if (userMatchData) {
      content = userMatchData.map((item) => {
        return (
          <li>
            <div className="row">
              <div className="col-sm-4">User Name:</div>{" "}
              <div className="col-sm-3">{item.username}</div>
            </div>
            <div className="row">
              <div className="col-sm-4">Role:</div>{" "}
              <div className="col-sm-3"> {item.musictype}</div>
            </div>
            <div className="row">
              <div className="col-sm-4">Location - Optional:</div>
              <div className="col-sm-3"> {item.location}</div>
            </div>
            <div className="row">
              <div className="col-sm-4">Contact - Optional:</div>
              <div className="col-sm-3"> {item.contact}</div>
            </div>
            <br />
            <br />
          </li>
        );
      });
    }

    if (error) {
      content = { error };
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
        <form onSubmit={handleUserMatchSubmit}>
          <div className="row">
            <div className="col-sm-3">
              <label>Search User By Role Entered:</label>
            </div>
            <div className="col-sm-2">
              <select name="musictype" onChange={handleMusicTypeInput}>
                <option value="">None Selected</option>
                <option value="Guitarist">Guitarist</option>
                <option value="Bassist">Bassist</option>
                <option value="Drummer">Drummer</option>
                <option value="Keyboardist">Keyboardist</option>
                <option value="Vocalist">Vocalist</option>
                <option value="Wind Instruments">Wind Instruments</option>
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
      <div className="container mt-5">
        <ol>{content}</ol>
      </div>
    </>
  );
};

export default MatchUserRole;
