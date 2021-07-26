import React from "react";
import { CircularProgress,makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({}));

export default function Loader() {
  const classes = useStyles();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "3%",
      }}
    >
      <CircularProgress color="secondary" />
    </div>
  );
}
