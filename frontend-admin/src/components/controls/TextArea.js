import React from "react";
import { TextField } from "@material-ui/core";

export default function TextArea(props) {
  const { name, label, value, error = null, onChange, ...other } = props;
  return (
    <TextField
      variant="outlined"
      multiline
      rows={4}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
}
