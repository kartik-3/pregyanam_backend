import React, { useState, useEffect } from "react";
import SlotForm from "./SlotForm";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../components/useTable";
import * as SlotService from "../../services/slotService";
import Controls from "../../components/controls/Controls";
import { Search, SlideshowOutlined } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import * as PlanService from "../../services/planServices";
import { getQueryString } from "../../utils/helperFunctions";
import Loader from '../../components/Loader'
import moment from 'moment'

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
  { id: "date", label: "Date" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Admins(props) {
  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [records, setRecords] = useState([]);
  const [plans, setPlans] = useState([]);
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
    fetchSlots();
    getPlans();
  }, [props, query]);

  const fetchSlots = async () => {
    let createQuery = getQueryString(query);
    setDataLoading(true)
    let result = await SlotService.getAllSlots(
      page,
      limit
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
    fetchSlots();
  }

  const getPlans = async () => {
    let plans = await PlanService.getPlans();
    if (plans.success) {
      setPlans(plans.data);
    } else {
      setPlans([]);
      setNotify({
        isOpen: true,
        message: plans.message,
        type: "error",
      });
    }
  };

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

  const addOrEdit = async (slot, resetForm) => {
    console.log(slot);
    if (slot.service != "") {
      //edit
      let data = {
        ...slot,
      };
      setLoading(true);
      let updatedData = await SlotService.updateSlot(slot.service, data);

      setLoading(false);
      if (updatedData.success == true) {
        // let ind = records.findIndex((x) => x._id == admin._id);
        // if (ind != -1) {
        //   let x = [...records];
        //   x[ind] = updatedData.data;
        //   setRecords(x);
        // }
        // setRecordForEdit(null);
        resetForm();
        fetchSlots()
        setOpenPopup(false);
      }
      setNotify({
        isOpen: true,
        message: updatedData.message,
        type: updatedData.success == true ? "success" : "error",
      });
    }else{
       //save
       let data = {
        ...slot,
      };
      console.log(data);
       setLoading(true);
       let insertedData = await SlotService.createSlot(data);
       setLoading(false);
       if (insertedData.success == true) {
        //  let x = [...records];
        //  x.unshift(insertedData.data);
        //  setRecords(x);
        //  setRecordForEdit(null);
         resetForm();
         setOpenPopup(false);
         fetchSlots()
       }
       setNotify({
         isOpen: true,
         message: insertedData.message,
         type: insertedData.success == true ? "success" : "error",
       });
    }
  };

  const openInPopup = async (slot) => {
    setRecordForEdit(slot);
    setOpenPopup(true);
    const result = await SlotService.getSlotsByService(page, 100, slot.service)
    console.log("result",result);
  };

  const onDelete = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    setLoading(true);
    let deletedResult = await SlotService.deleteSlot(id);
    setLoading(false);
    if (deletedResult.success) {
      let admins = [...records];
      let newAdmins = admins.filter((x) => x._id != id);
      setRecords(newAdmins);
    }
    setNotify({
      isOpen: true,
      message: deletedResult.message,
      type: deletedResult.success == true ? "success" : "error",
    });
  };

  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
           <Controls.Button
            text="Add New"
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          {dataloading ? (
           <Loader/>
          ) : (
          <TableBody>
            {recordsAfterPagingAndSorting().map((slot, index) => (
              <TableRow key={index}>
                <TableCell>{slot ? moment(slot.date).format('MMMM Do YYYY, h:mm a') : ""}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopup(slot);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </Controls.ActionButton>
                  <Controls.ActionButton
                    color="secondary"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "Are you sure to delete this record?",
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(slot._id);
                        },
                      });
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        
        )}</TblContainer>
        <TblPagination />
      </Paper>
      <Popup title={recordForEdit == null?"Add":"Edit"} openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <SlotForm
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          loading={loading}
          services={plans}
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
