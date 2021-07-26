import React, { useState, useEffect } from "react";
import AppointmentForm from "./AppointmentForm";
import {
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../components/useTable";
import * as AppointmentService from "../../services/appointmentService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getQueryString } from "../../utils/helperFunctions";
import Loader from "../../components/Loader";
import moment from "moment";

//new styles
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));

const headCells = [
  { id: "slot.date", label: "Date" },
  { id: "slot.startIme", label: "Time" },
  { id: "user.name", label: "Customer" },
  { id: "slot.admin.name", label: "Assigned To" },
  { id: "service.name", label: "Service" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Appointments(props) {
  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [records, setRecords] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: (brands) => {
      return brands;
    },
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [loading, setLoading] = useState(false);
  const [dataloading, setDataLoading] = useState(false);
  const [query, setQuery] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, [props, query]);

  const fetchBookings = async () => {
    let createQuery = getQueryString(query);
    setDataLoading(true);
    let result = await AppointmentService.getAppointments(
      page,
      limit,
      createQuery
    );
    setDataLoading(false);
    if (result.success) {
      let prevRecords = [...records];
      for (let i = 0; i <= result.data.length - 1; i++) {
        prevRecords.push(result.data[i]);
      }
      setRecords(prevRecords);
      setPage(page + 1);
    } else {
      setNotify({
        isOpen: true,
        message: result.message,
        type: "error",
      });
    }
  };

  function fetchDataFromDb() {
    fetchBookings();
  }

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    resetPage,
  } = useTable(records, headCells, filterFn, fetchDataFromDb);

  const handleSearch = (e) => {
    let target = e.target;
    if (target.value == "") {
      let q = [...query];
      let index = q.findIndex((one) => one.key == "name");
      if (index != -1) {
        q.splice(index, 1);
        setQuery(q);
        setPage(0);
        setRecords([]);
        resetPage();
        return;
      }
    }

    let q = [...query];

    let index = q.findIndex((one) => one.key == "name");
    if (index != -1) {
      q[index] = {
        key: "name",
        value: e.target.value,
      };
    } else {
      q.push({ key: "name", value: e.target.value });
    }
    setQuery(q);
    setPage(0);
    setRecords([]);
    resetPage();
  };

  const addOrEdit = async (booking, resetForm) => {
    if (booking._id != "") {
      //edit
      let data = {
        slot: booking.slotId,
      };
      setLoading(true);
      let updatedData = await AppointmentService.updateBooking(
        booking._id,
        data
      );

      setLoading(false);
      if (updatedData.success == true) {
        let ind = records.findIndex((x) => x._id == booking._id);
        if (ind != -1) {
          let x = [...records];
          x[ind] = updatedData.data;
          setRecords(x);
        }
        setRecordForEdit(null);
        resetForm();
        setOpenPopup(false);
      }
      setNotify({
        isOpen: true,
        message: updatedData.message,
        type: updatedData.success == true ? "success" : "error",
      });
    }
  };

  const openInPopup = (booking) => {
    let restructure = {};
    if (booking._id) {
      restructure._id = booking._id;
    }
    if (booking.slot) {
      restructure.slotId = booking.slot._id;
      restructure.slotDate = booking.slot.date;
    }
    if (booking.service) {
      restructure.service = booking.service;
    }
    setRecordForEdit(restructure);
    setOpenPopup(true);
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader>
              {/* <Toolbar> */}
              <GridContainer>
                <GridItem xs={12} sm={12} md={8} lg={8}>
                  <Controls.Input
                    label="Search by customer,service, etc."
                    // className={classes.searchInput}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    onChange={handleSearch}
                  />
                </GridItem>
              </GridContainer>
              {/* </Toolbar> */}
            </CardHeader>
            <CardBody>
              <TblContainer>
                <TblHead />
                {dataloading ? (
                  <Loader />
                ) : (
                  <TableBody>
                    {recordsAfterPagingAndSorting().map((booking, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {moment(booking.slot.date).format("MMMM Do YYYY")}
                        </TableCell>
                        <TableCell>
                          {moment(booking.slot.startTime).format("h:mm a")}
                        </TableCell>
                        <TableCell>{booking.user.name}</TableCell>
                        <TableCell>{booking.slot.admin.name}</TableCell>
                        <TableCell>{booking.service.name}</TableCell>
                        <TableCell>
                          <Controls.ActionButton
                            color="primary"
                            onClick={() => {
                              openInPopup(booking);
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </Controls.ActionButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </TblContainer>
              <TblPagination />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <Popup title="Edit" openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <AppointmentForm
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          loading={loading}
        />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
