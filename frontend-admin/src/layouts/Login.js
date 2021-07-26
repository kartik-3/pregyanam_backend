import React, { useState } from "react";
import Controls from "../components/controls/Controls";
import Notification from "../components/Notification";
import { useDispatch } from "react-redux";
import {
  Grid,
  Paper,
  makeStyles,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Form } from "../components/useForm";

import { loginAdmin } from "../services/authService";
import { setCurrentUser } from "../actions/authActions";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    flexGrow:1,
    minHeight:"500px",
    minWidth:"500px",
    margin: theme.spacing(5),
    padding: theme.spacing(2),
  },
  pageContent: {
    // margin: theme.spacing(5),
    // padding: theme.spacing(5),
  },
}));

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "email") {
      setEmail(value);
    }
    if (name == "password") {
      setPassword(value);
    }
  };

  const validate = () => {
    let temp = { ...errors };

    temp.email = email ? "" : "This field is required.";

    temp.password = password ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x == "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      let data = {
        email: email.trim(),
        password: password.trim(),
      };
      setLoading(true);
      let result = await loginAdmin(data);
      setLoading(false);
      if (result.success) {
        setNotify({
          isOpen: true,
          message: result.message,
          type: "success",
        });
        dispatch(setCurrentUser(result.token));
        window.location.href = "/admin";
      } else {
        setNotify({
          isOpen: true,
          message: result.message,
          type: "error",
        });
      }
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setErrors({});
  };

  return (
    <Paper className={classes.root}>
      <Form onSubmit={handleSubmit}>
        <Typography variant="h5" style={{ textAlign: "center" }}>
          Login
        </Typography>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item>
            <Controls.Input
              name="email"
              label="Email*"
              value={email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <Controls.InputPassword
              name="password"
              label="Password"
              value={password}
              onChange={handleInputChange}
              error={errors.password}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              {loading ? <CircularProgress size={20} /> : <></>}

              <Controls.Button type="submit" disabled={loading} text="Submit" />

              <Controls.Button
                text="Reset"
                disabled={loading}
                color="default"
                onClick={resetForm}
              />
            </div>
          </Grid>
        </Grid>
      </Form>
      <Notification notify={notify} setNotify={setNotify} />
    </Paper>
  );
}
