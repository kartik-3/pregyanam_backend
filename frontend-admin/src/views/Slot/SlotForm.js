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
import AddIcon from "@material-ui/icons/Add";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { getAllAdmins } from "../../services/adminPlanService";

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
  service: "",
  servicename: "",
  slotDays: [
    {
      date: new Date(),
      slots: [
        {
          startTime: new Date(),
          endTime: new Date(),
          admins: [],
        },
      ],
    },
  ],
};

export default function SlotForm(props) {
  const classes = useStyles();
  // const [services, setServices] = useState(props.services);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmins,setSelectedAdmins] = useState([])
  const { addOrEdit, recordForEdit, loading } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("service" in fieldValues)
      temp.service = fieldValues.service ? "" : "This field is required.";

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
    // getAdmins();
  }, [recordForEdit]);

  const getAdmins = async () => {
    if (values.service != "") {
      let result = await getAllAdmins(values.service);
      if (result.success) {
        setAdmins(result.data);
      }
    }
  };

  const handleDateChange = (date, i) => {
    let obj = { ...values };
    obj.slotDays[i].date = date;
    setValues({ ...obj });
  };

  const handleTimeChange = (type, date, i, j) => {
    console.log(date);
    let obj = { ...values };
    if (type == "startTime") {
      obj.slotDays[i].slots[j].startTime = date;
    } else {
      obj.slotDays[i].slots[j].endTime = date;
    }

    setValues({ ...obj });
  };

  const addDateRow = () => {
    let obj = { ...values };
    obj.slotDays.push({
      date: new Date(),
      slots: [
        {
          startTime: new Date(),
          endTime: new Date(),
          admins: [],
        },
      ],
    });
    setValues({ ...obj });
  };
  const addTimeRow = (index) => {
    let obj = { ...values };
    obj.slotDays[index].slots.push({
      startTime: new Date(),
      endTime: new Date(),
      admins: [],
    });
    setValues({ ...obj });
  };

  const handleChangeService = (e) => {
    let obj = { ...values };
    obj.service = e.target.value;
    setValues({ ...obj });
    //call api to fetch all admins for that specific plans
    getAdmins();
  };

  const handleSelectAdmin = (i,j,adminId) => {
    console.log(i,j,adminId,admins)
    let selected = selectedAdmins;
    for(let ind = 0; ind<= admins.length - 1; ind++){
      if(admins[i].id.toString() == adminId.toString()){
        selected.push({
          i,
          j,
          id:adminId,
          title:admins[i].title
        });
        admins.splice(i,)
      }
    }
    setSelectedAdmins(selected);
    console.log(selectedAdmins)
  };

  const handleDelete = (data)=>{
    console.log(data);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <p>Select Service </p>
      <p>
        Select Date → Select Start Time → Select Finish Time → Select All Admins
        one by one
      </p>
      <p>Add new Date and Repeat all above steps</p>
      <Grid Container direction="row" justify="center" alignItems="center">
        <Grid item container>
          <Grid items xs={12} md={6} lg={6}>
            <Controls.Select
              name="service"
              label="Service*"
              value={values.service}
              onChange={handleChangeService}
              options={props.services}
              error={errors.service}
            />
          </Grid>
          <Grid items xs={12} md={6} lg={6}>
            <Controls.Button
              variant="outlined"
              text="Add New Date"
              startIcon={<AddIcon />}
              className={classes.newButton}
              onClick={() => {
                addDateRow();
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs container>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {values.slotDays.map((oneDay, index) => (
              <>
                <Grid item md={6}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Select Date"
                    format="MM/dd/yyyy"
                    value={oneDay.date}
                    onChange={(date) => handleDateChange(date, index)}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
                <Grid item md={12} container>
                  {oneDay.slots.map((slot, ind) => (
                    <>
                      <Grid items md={4}>
                        <KeyboardTimePicker
                          margin="normal"
                          id="time-picker"
                          label="Start At"
                          value={slot.startTime}
                          onChange={(date) =>
                            handleTimeChange("startTime", date, index, ind)
                          }
                          KeyboardButtonProps={{
                            "aria-label": "change time",
                          }}
                        />
                      </Grid>
                      <Grid items md={4}>
                        <KeyboardTimePicker
                          margin="normal"
                          id="time-picker"
                          label="Finish At"
                          value={slot.endTime}
                          onChange={(date) =>
                            handleTimeChange("endTime", date, index, ind)
                          }
                          KeyboardButtonProps={{
                            "aria-label": "change time",
                          }}
                        />
                      </Grid>
                      <Grid md={4}></Grid>
                      {/* <Grid items md={4}>
                        <Controls.Select
                          name="adminId"
                          label="Select Admins(Multiple Possible)"
                          onChange={(e) => handleSelectAdmin(index,ind,e.target.value)}
                          options={admins}
                        />
                      </Grid> */}
                    </>
                  ))}
                  <Controls.Button
                    text="Add New Time Slot"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    className={classes.newButton}
                    onClick={() => {
                      addTimeRow(index);
                    }}
                  />
                </Grid>
              </>
            ))}
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs container>
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
