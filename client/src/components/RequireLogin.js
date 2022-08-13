import React, { useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireLogin = () => {
  const storageLogin = localStorage.getItem("loginAccess");
  const [accessToken, setAccessToken] = useState(storageLogin);

  // console.log(accessToken);
  const location = useLocation();
  return (
    <div>
      {accessToken ? (
        <Outlet />
      ) : (
        <Navigate to="/Login" state={{ from: location }} replace />
      )}
    </div>
  );
};

export default RequireLogin;
