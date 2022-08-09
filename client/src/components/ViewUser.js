import React, { useState, useEffect, useContext } from "react";
import ReactContext from "../context/react.context";

const ViewUser = () => {
  const reactCtx = useContext(ReactContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewData, setViewData] = useState({});

  //   const handleUserSubmit = (event) => {
  //     event.preventDefault();
  //     fetchViewUser();
  //   };

  const accessToken = reactCtx.loginData;

  const fetchViewUser = async () => {
    setIsLoading(true);
    setError(null);

    const url = "http://localhost:5001/users/getuser";
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
      setViewData(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchViewUser();
  }, [accessToken]);

  let content = "";
  console.log(viewData);

  if (viewData) {
    content = (
      <>
        <div>User Name: {viewData.username}</div>
        <div>Instrument: {viewData.musictype}</div>
        <div>Location: {viewData.location}</div>
        <div>Account created:{viewData.created_on}</div>
        <div>Last Login:{viewData.last_login}</div>
      </>
    );
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Data is loading .. please wait</p>;
  }

  return (
    <>
      <div className="mt-5">
        {/* <button onClick={handleUserSubmit}>View User</button> */}
        <h4>User Account Details:</h4>
        {content}
      </div>
    </>
  );
};

export default ViewUser;
