import React, { useState, useContext, useEffect } from "react";
import ReactContext from "../context/react.context";
// import ViewMessages from "./ViewMessages";

const MessageForm = () => {
  const reactCtx = useContext(ReactContext);
  const [messageInput, setMessageInput] = useState("");
  const [messageData, setMessageData] = useState("");

  const [isLoading, setIsLoading] = useState("");
  const [error, setError] = useState(null);
  const [validFields, setValidFields] = useState(false);
  const [inputsCheck, setInputsCheck] = useState("");

  // const accessToken = reactCtx.loginData;

  const CreateMessage = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      message: messageInput,
    };
    console.log(body);

    const url = "http://localhost:5001/messages/createmessage";

    const config = {
      method: "POST",
      headers: {
        authorization: "Bearer " + reactCtx.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    try {
      const res = await fetch(url, config);
      if (res.status !== 200) {
        throw new Error("Unable to create message");
      }
      const data = await res.json();
      setMessageData(data);
      reactCtx.fetchViewMessages();
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  console.log(messageData);

  ///////////////////////////////////////////
  // Create Enter Message Submit Function
  ///////////////////////////////////////////

  useEffect(() => {
    setValidFields(messageInput !== "");
  }, [messageInput]);

  const handleSubmitMessage = (event) => {
    event.preventDefault();
    if (validFields) {
      CreateMessage();
      setInputsCheck("");
      setMessageInput("");
      // reactCtx.fetchViewMessages();
    } else {
      setInputsCheck("Please type in a message to submit");
    }
  };

  const handleMessageInput = (event) => {
    setMessageInput(event.target.value);
  };

  //   let content = "";
  //   if (accessToken) {
  //     if (messageData) {
  //       content = messageData.map((item) => {
  //         <div className="row">
  //           <div className="col-sm-5">{item.username}</div>
  //           <div className="col-sm-5">{item.message}</div>
  //         </div>;
  //       });
  //     }

  //     if (error) {
  //       content = <p>{error}</p>;
  //     }

  //     if (isLoading) {
  //       content = <p>Loading .. Please wait </p>;
  //     }
  //   }

  return (
    <>
      <div className="container mt-5">
        <form onSubmit={handleSubmitMessage}>
          <div className="row">
            <div className="col-md-3">{inputsCheck}</div>
            <div className="col-md-5">
              <input
                name="message"
                value={messageInput}
                onChange={handleMessageInput}
                placeholder="Enter Message here"
              ></input>
            </div>
            <div className="col-md-1">
              <button className="btn btn-outline-light">Submit</button>
            </div>
          </div>
        </form>
      </div>
      {/* <ReactContext.Provider value={{ messageInput, accessToken }}>
        <ViewMessages />
      </ReactContext.Provider> */}
    </>
  );
};

export default MessageForm;
