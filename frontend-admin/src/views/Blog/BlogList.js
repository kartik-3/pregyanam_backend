import React, { useState, useEffect } from "react";
import BlogForm from "./BlogForm";
import {
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../components/useTable";
import * as BlogService from "../../services/blogService";
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
  { id: "title", label: "Title" },
  { id: "description", label: "Description" },
  { id: "cover", label: "Cover Image" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Blogs(props) {
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
    fetchBlogs();
  }, [props, query]);

  const fetchBlogs = async () => {
    let createQuery = getQueryString(query);
    setDataLoading(true);
    let result = await BlogService.getAllBlogs(page, limit, createQuery);
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
    fetchBlogs();
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

  const addOrEdit = async (blog, resetForm) => {
    if (blog._id != "") {
      //edit
      // let data = {
      //   ...blog,
      // };
      let data = new FormData();
      data.append("_id", blog._id);
      data.append("title", blog.title);
      data.append("description", blog.description);
      data.append("content", blog.content);
      data.append("tags", blog.tags);
      data.append("cover", blog.cover);

      setLoading(true);
      let updatedData = await BlogService.saveBlog(data);

      setLoading(false);
      if (updatedData.success == true) {
        let ind = records.findIndex((x) => x._id == blog._id);
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
    } else {
      //save
      let data = new FormData();
      data.append("_id", blog._id);
      data.append("title", blog.title);
      data.append("description", blog.description);
      data.append("content", blog.content);
      data.append("tags", blog.tags);
      data.append("cover", blog.cover);

      setLoading(true);
      let insertedData = await BlogService.saveBlog(data);
      setLoading(false);
      if (insertedData.success == true) {
        let x = [...records];
        x.unshift(insertedData.data);
        setRecords(x);
        resetForm();
        setRecordForEdit(null);
        setOpenPopup(false);
      }
      setNotify({
        isOpen: true,
        message: insertedData.message,
        type: insertedData.success == true ? "success" : "error",
      });
    }
  };

  const openInPopup = (blog) => {
    let restructure = {};

    // if (blog._id) {
    //   restructure._id = blog._id;
    // }
    // if (blog.title) {
    //   restructure.title = blog.title;
    // }
    // if (blog.description) {
    //   restructure.description = blog.description;
    // }
    // if (blog.content) {
    //   restructure.content = blog.content;
    // }
    // if (blog.tags) {
    //   restructure.tags = blog.tags;
    // }
    setRecordForEdit(blog);
    setOpenPopup(true);
  };

  const onDelete = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    setLoading(true);
    let deletedResult = await BlogService.deleteBlog(id);
    setLoading(false);
    if (deletedResult.success) {
      let blogs = [...records];
      let newBlogs = blogs.filter((x) => x._id != id);
      setRecords(newBlogs);
    }
    setNotify({
      isOpen: true,
      message: deletedResult.message,
      type: deletedResult.success == true ? "success" : "error",
    });
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader>
              <Toolbar>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6} lg={6}>
                    <Controls.Input
                      label="Search Blog by Title"
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
                  <GridItem xs={12} sm={12} md={6} lg={6}>
                    <Controls.Button
                      text="Add New"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      // className={classes.newButton}
                      onClick={() => {
                        setOpenPopup(true);
                        setRecordForEdit(null);
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </Toolbar>
            </CardHeader>
            <CardBody>
              <TblContainer>
                <TblHead />
                {dataloading ? (
                  <Loader />
                ) : (
                  <TableBody>
                    {recordsAfterPagingAndSorting().map((blog, index) => (
                      <TableRow key={index}>
                        <TableCell>{blog.title}</TableCell>
                        <TableCell>{blog.description}</TableCell>
                        <TableCell>
                          {blog.cover ? (
                            <img
                              src={blog.cover}
                              style={{ width: "80px", height: "80px" }}
                            />
                          ) : (
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
                              style={{ width: "80px", height: "80px" }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Controls.ActionButton
                            color="primary"
                            onClick={() => {
                              openInPopup(blog);
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
                                  onDelete(blog._id);
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
                )}
              </TblContainer>
              <TblPagination />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <Popup
        title={recordForEdit == null ? "Add" : "Edit"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <BlogForm
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
