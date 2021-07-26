import React from "react";
import { DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

/**
 * `DatePicker` can disable specific dates based on the return value of a callback.
 */
export const SlotCalender = (props) => {
  const { selectedDate, handleDateChange, disableDates } = props;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <FormControl variant="outlined" >
        <DatePicker
          hintText="Date"
          shouldDisableDate={disableDates}
          value={selectedDate}
          onChange={handleDateChange}
        />
      </FormControl>
    </MuiPickersUtilsProvider>
  );
};
