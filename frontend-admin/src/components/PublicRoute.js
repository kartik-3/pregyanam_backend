import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRouteUser = ({ component: Component, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  let isAuthenticated = auth.isAuthenticated ? true : false;
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/admin" />
        )
      }
    />
  );
};

export default PublicRouteUser;
