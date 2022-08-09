import React, { useState, useEffect, useContext } from "react";
import ReactContext from "../context/react.context";

const ViewSong = () => {
  const reactCtx = useContext(ReactContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewSong, setViewSong] = useState([]);
  const [showSongList, setShowSongList] = useState(false);
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
      //   content = viewSong.map((item, i) => {
      //     return (
      //       <li>
      //         {item.title}
      //         {item.lyrics}
      //         {item.chords}
      //         {item.genretag}
      //         {item.created_on}
      //       </li>
      //     );
      //   });
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };
  console.log(viewSong);
  const handleAllSongs = (event) => {
    fetchViewSong();
    setShowSongList(true);
  };

  let content = "";

  if (viewSong) {
    content = viewSong.map((item) => {
      return (
        <li>
          <div>Title: {item.title}</div>
          <div>Lyrics: {item.lyrics}</div>
          <div>Chords: {item.chords}</div>
          <div>Genre: {item.genretag}</div>
          <div>Created On: {item.created_on}</div>
          <div>email: {item.email}</div>
          <br />
          <br />
        </li>
      );
    });
  }
  return (
    <div className="mt-5">
      <button onClick={handleAllSongs}>View All Songs</button>
      <div className="mt-5">
        <ol>{content}</ol>
      </div>
    </div>
  );
};

export default ViewSong;
