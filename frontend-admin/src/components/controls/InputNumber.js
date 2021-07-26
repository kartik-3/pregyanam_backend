import React from "react";
import { TextField } from "@material-ui/core";

export default function InputNumber(props) {
  const { name, label, value, error = null, onChange, ...other } = props;
  return (
    <TextField
      type="number"
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
}
