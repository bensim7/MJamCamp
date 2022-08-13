import React, { useState, useContext, useEffect } from "react";
import ReactContext from "../context/react.context";
import CreateSongForm from "./CreateSongForm";

const CreateSongMain = () => {
  const reactCtx = useContext(ReactContext);
  const [titleInput, setTitleInput] = useState("");
  const [lyricsInput, setLyricsInput] = useState("");
  const [chordsInput, setChordsInput] = useState("");
  const [genreInput, setGenreInput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addedSong, setAddedSong] = useState("");
  const [validFields, setValidFields] = useState(false);
  const [inputsCheck, setInputsCheck] = useState("");
  // const [viewSong, setViewSong] = useState([]);
  const accessToken = reactCtx.loginData;

  /////////////////////////////////
  // Add Song
  ////////////////////////////////

  const CreateSong = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      title: titleInput,
      lyrics: lyricsInput,
      chords: chordsInput,
      genre: genreInput,
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
      alert("Song Successfully Added!");
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  console.log(addedSong);

  ///////////////////////////////
  // Create Add Song Submit Function
  ///////////////////////////////

  useEffect(() => {
    setValidFields(
      titleInput !== "" &&
        lyricsInput !== "" &&
        chordsInput !== "" &&
        genreInput !== ""
    );
  }, [titleInput, lyricsInput, chordsInput, genreInput]);

  const handleAddSongSubmit = (event) => {
    event.preventDefault();
    if (validFields) {
      CreateSong();
      setInputsCheck("");
    } else {
      setInputsCheck("Please fill in all input fields");
    }
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

  const handleGenreInput = (event) => {
    setGenreInput(event.target.value);
  };

  return (
    <div>
      <ReactContext.Provider
        value={{
          titleInput,
          lyricsInput,
          chordsInput,
          genreInput,
          handleAddSongSubmit,
          handleTitleInput,
          handleLyricsInput,
          handleChordsInput,
          handleGenreInput,
          isLoading,
          error,
          addedSong,
          accessToken,
          inputsCheck,
        }}
      >
        <CreateSongForm />
      </ReactContext.Provider>
    </div>
  );
};

export default CreateSongMain;
