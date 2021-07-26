import React, { useEffect, useState } from "react";
import {
  Grid,
  CircularProgress,
  Chip,
  makeStyles,
  Paper,
} from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";

import { validateEmail } from "../../utils/helperFunctions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const initialFValues = {
  _id: "",
  name: "",
  email: "",
  password: "",
  serviceId: "",
};

export default function AdminForm(props) {
  const classes = useStyles();
  const [services, setServices] = useState(props.services);
  const { addOrEdit, recordForEdit, loading } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("email" in fieldValues)
      temp.email = fieldValues.email ? "" : "This field is required.";
    if ("email" in fieldValues && fieldValues.email != "")
      temp.email =
        validateEmail(fieldValues.email) == false
          ? "Incorrect Email Format"
          : "";
    if ("password" in fieldValues)
      temp.password = fieldValues.password ? "" : "This field is required.";
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required.";
    if ("serviceId" in fieldValues)
      temp.serviceId = fieldValues.serviceId ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFValues, true, validate, recordForEdit);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
      });
    }
  }, [recordForEdit]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={6}>
          <Controls.Input
            name="email"
            label="Email*"
            value={values.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          <Controls.InputPassword
            name="password"
            label="Password*"
            value={values.password}
            onChange={handleInputChange}
            error={errors.password}
          />
          <Controls.Input
            name="name"
            label="Name*"
            value={values.name}
            onChange={handleInputChange}
            error={errors.name}
          />
          <Controls.Select
            name="serviceId"
            label="Service*"
            value={values.serviceId}
            onChange={handleInputChange}
            options={services}
            error={errors.serviceId}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            {loading ? <CircularProgress size={20} /> : <></>}
            <Controls.Button type="submit" disabled={loading} text="Submit" />
            {recordForEdit != null ? (
              <div></div>
            ) : (
              <Controls.Button
                text="Reset"
                disabled={loading}
                color="default"
                onClick={() => {
                  resetForm();
                }}
              />
            )}
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
