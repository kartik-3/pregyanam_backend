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
import { SlotCalender } from "../../components/SlotCalender";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import moment from "moment";
import {
  getAllSlots,
  getAllTimeSlotsForDates,
} from "../../services/slotService";
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
  slotId: "",
  slotDate: "",
  service: "",
};

export default function AppointmentForm(props) {
  const classes = useStyles();
  const { addOrEdit, recordForEdit, loading } = props;
  const [selectedDate, handleDateChange] = React.useState(new Date());
  const [avaiableSlots, setAvailableSlots] = React.useState([]);
  const [avaiableTimes, setAvailableTimes] = React.useState([]);

  const handleChange = (event) => {
    if (event.target.value) {
      let obj = { ...values };
      obj.slotId = event.target.value;
      setValues({ ...obj });
    }
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, resetForm } = useForm(
    initialFValues,
    true,
    validate,
    recordForEdit
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (validate()) {
    addOrEdit(values, resetForm);
    // }
  };

  useEffect(() => {
    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
      });
      getTimes();
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    let service = recordForEdit.service._id;
    let result = await getAllSlots(service, 0, 100);
    if (result.success) {
      setAvailableSlots(result.data);
    } else {
    }
  };

  const getTimes = async () => {
    let result = await getAllTimeSlotsForDates(0, 100, recordForEdit.slotDate);
    if (result.success) {
      setAvailableTimes(result.data);
    }
  };

  function disableDates(date) {
    for (let i = 0; i <= avaiableSlots.length - 1; i++) {
      if (
        new Date(avaiableSlots[i].date).toDateString() === date.toDateString()
      ) {
        return false;
      }
    }
    return true;
    // return date.getDay() === 0 || date.getDay() === 6;
  }

  const handleSelectDate = async (e) => {
    handleDateChange(e);
    let obj = { ...values };
    obj.slotDate = e;
    setValues({ ...obj });
    if (e) {
      let result = await getAllTimeSlotsForDates(0, 100, e);
      if (result.success) {
        setAvailableTimes(result.data);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs>
          <h3>Change Booking Date:</h3>
          <p>Select Available Date → Select Available Time Slot → Submit</p>
          <p>
            It Will also send email to the user to notify about the Slot Change
          </p>

          <SlotCalender
            selectedDate={values.slotDate && new Date(values.slotDate)}
            handleDateChange={handleSelectDate}
            disableDates={disableDates}
          />

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">
              Select Time Slot
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={values.slotId && values.slotId}
              onChange={handleChange}
              label="Select Time Slot"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {avaiableTimes.map((one) => (
                <MenuItem key={one._id} value={one._id}>
                  {moment(one.startTime).format("hh:mm a") + " "} -
                  {" " + moment(one.endTime).format("hh:mm a")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div style={{ display: "flex", alignItems: "center" }}>
            {loading ? <CircularProgress size={20} /> : <></>}
            <Controls.Button type="submit" disabled={loading} text="Submit" />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
