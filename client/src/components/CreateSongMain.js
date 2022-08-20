import React, { useState, useContext, useEffect } from "react";
import ReactContext from "../context/react.context";
import CreateSongForm from "./CreateSongForm";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-SG";

const CreateSongMain = () => {
  const reactCtx = useContext(ReactContext);
  const [titleInput, setTitleInput] = useState("");
  const [lyricsTextInput, setLyricsTextInput] = useState("");
  const [savedLyrics, setSavedLyrics] = useState([]);
  const [chordsInput, setChordsInput] = useState("");
  const [genreInput, setGenreInput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addedSong, setAddedSong] = useState("");
  const [validFields, setValidFields] = useState(false);
  const [inputsCheck, setInputsCheck] = useState("");
  // const [viewSong, setViewSong] = useState([]);
  const accessToken = reactCtx.loginData;

  const handleSaveLyrics = () => {
    setSavedLyrics([...savedLyrics, lyricsTextInput]);
    setLyricsTextInput("");
  };

  //////////////////////////////////////////////////////
  // Speech to Text
  //////////////////////////////////////////////////////
  const [isListening, setIsListening] = useState(false);
  const [speechLyric, setSpeechLyric] = useState(null);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleStartStopToggle = () => {
    setIsListening((prevState) => !prevState);
  };

  const handleListen = () => {
    if (isListening) {
      mic.start(); // part of voice API
      mic.onend = () => {
        console.log("continue ...");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("Mic is on");
    };

    mic.onresult = (event) => {
      // make an array from event.results, map the array of results, take first row of array and map that to form transcript and join back into string
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      console.log(transcript);
      setSpeechLyric(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleSaveSpeechLyric = () => {
    setSavedLyrics([...savedLyrics, speechLyric]);
    setSpeechLyric("");
  };

  const handleSpeechLyricManual = (event) => {
    setSpeechLyric(event.target.value);
  };

  console.log(savedLyrics);

  /////////////////////////////////
  // Add Song
  ////////////////////////////////

  const CreateSong = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      title: titleInput,
      lyrics: savedLyrics,
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

  ///////////////////////////////////
  // Create Add Song Submit Function
  ///////////////////////////////////

  useEffect(() => {
    setValidFields(titleInput !== "" && savedLyrics[0] && genreInput !== "");
  }, [titleInput, savedLyrics, chordsInput, genreInput]);

  const handleAddSongSubmit = (event) => {
    event.preventDefault();
    if (validFields) {
      CreateSong();
      setInputsCheck("");
    } else {
      setInputsCheck("Please fill all required fields marked with *");
    }
  };

  //////////////////////////////////////////

  const handleTitleInput = (event) => {
    setTitleInput(event.target.value);
  };

  const handleLyricsTextInput = (event) => {
    setLyricsTextInput(event.target.value);
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
          lyricsTextInput,
          chordsInput,
          genreInput,
          handleAddSongSubmit,
          handleTitleInput,
          handleLyricsTextInput,
          handleChordsInput,
          handleGenreInput,
          isLoading,
          error,
          addedSong,
          accessToken,
          inputsCheck,
          handleSaveLyrics,
          savedLyrics,
          isListening,
          speechLyric,
          handleStartStopToggle,
          handleSaveSpeechLyric,
          handleSpeechLyricManual,
        }}
      >
        <CreateSongForm />
      </ReactContext.Provider>
    </div>
  );
};

export default CreateSongMain;
