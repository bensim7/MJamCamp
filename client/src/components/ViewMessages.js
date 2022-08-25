import React, { useState, useContext, useEffect } from "react";
import ReactContext from "../context/react.context";
import MessageForm from "./MessageForm";

const ViewMessages = () => {
  const reactCtx = useContext(ReactContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMessages, setViewMessages] = useState("");
  const [deleteData, setDeleteData] = useState("");

  const accessToken = reactCtx.loginData;

  ////////////////////////////////////////////////////
  // Display Messages
  ///////////////////////////////////////////////////
  const fetchViewMessages = async () => {
    setIsLoading(true);
    setError(null);

    const url = "http://localhost:5001/messages/allmessages";

    const config = {
      method: "GET",
      headers: { authorization: "Bearer " + accessToken },
    };

    try {
      const res = await fetch(url, config);
      if (res.status !== 200) {
        throw new Error("Unable to retrieve messages data");
      }
      const data = await res.json();
      setViewMessages(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchViewMessages();
  }, []);

  ///////////////////////////////////
  // Delete Message
  //////////////////////////////////

  const deleteMessage = async (id) => {
    setIsLoading(true);
    setError(null);

    const url = `http://localhost:5001/messages/deletemessage/${id}`;

    const config = {
      method: "DELETE",
      headers: { authorization: "Bearer " + accessToken },
    };

    try {
      const res = await fetch(url, config);
      if (res.status !== 200) {
        throw new Error("Unable to delete message");
      }
      const data = await res.json();
      setDeleteData(data);
      fetchViewMessages();
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  console.log(deleteData.command);

  ///////////////////////
  // Delete Submit Handler
  ////////////////////////////

  // const handleDeleteMessage = (id) => {
  //   deleteMessage(id);
  //   fetchViewMessages();
  // };

  let content = "";
  if (accessToken) {
    if (viewMessages) {
      content = viewMessages.map((item) => {
        return (
          <div className="row mt-3">
            <div className="col-sm-1"></div>
            <div className="col-sm-2">Username: {item.username}</div>
            <div className="col-sm-7">{item.message}</div>
            <div className="col-sm-1">
              <button
                className="btn btn-outline-info"
                onClick={() => deleteMessage(item.message_id)}
              >
                Delete
              </button>
            </div>
          </div>
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
    content = <p>Messages: Not Authorized</p>;
  }

  console.log(viewMessages);

  return (
    <>
      <ReactContext.Provider value={{ fetchViewMessages, accessToken }}>
        <MessageForm />
      </ReactContext.Provider>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-3">
            <h3>Message Chat Board</h3>
          </div>
          <div className="col-md-1">
            <button
              className="btn btn-outline-light"
              onClick={fetchViewMessages}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      <div className="container mt-5 messages">{content}</div>
    </>
  );
};

export default ViewMessages;
