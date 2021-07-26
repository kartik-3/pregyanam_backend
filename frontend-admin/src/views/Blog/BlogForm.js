import React, { useEffect, useState } from "react";
import {
  Grid,
  CircularProgress,
  Chip,
  makeStyles,
  Paper,
  TextField,
  Button,
} from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import { Editor } from "./Editor";

import * as blogService from "../../services/blogService";
import Notification from "../../components/Notification";

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
  title: "",
  description: "",
  content: "",
  tags: "",
  cover: "",
};

export default function BlogForm(props) {
  const classes = useStyles();
  const [services, setServices] = useState(props.services);
  const { addOrEdit, recordForEdit, loading } = props;
  const [imageLoading, setImageLoading] = useState(false);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("title" in fieldValues)
      temp.title = fieldValues.title ? "" : "This field is required.";

    if ("description" in fieldValues)
      temp.description = fieldValues.description
        ? ""
        : "This field is required.";
    if ("content" in fieldValues)
      temp.content = fieldValues.content ? "" : "This field is required.";
    if ("tags" in fieldValues)
      temp.tags = fieldValues.tags ? "" : "This field is required.";

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

  const handleContentChange = (newData) => {
    let x = { ...values };
    x.content = newData;
    setValues(x);
  };

  useEffect(() => {
    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
      });
    }
  }, [recordForEdit]);

  const handleCoverImage = async (e) => {
    if (e.target.files.length == 0) {
      return;
    }
    let coverData = new FormData();
    coverData.append("image", e.target.files[0], e.target.files[0].name);
    setImageLoading(true);
    let result = await blogService.uploadBlogCover(coverData);
    setImageLoading(false);
    if (result.success) {
      let x = { ...values };
      x.cover = result.data;
      setValues({ ...x });
    }
    setNotify({
      isOpen: true,
      message: result.message,
      type: result.success == true ? "success" : "error",
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={4}>
          <Button variant="contained" component="label">
            Upload Cover
            <input type="file" onChange={(e) => handleCoverImage(e)} hidden />
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Controls.Input
            name="cover"
            label="Cover Image Url "
            value={values.cover}
            onChange={handleInputChange}
            error={errors.cover}
          />
        </Grid>
        <Grid item xs={4}>
          {imageLoading && <CircularProgress />}
          <img src={values.cover} style={{ width: "100px", height: "100px" }} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Controls.Input
            name="title"
            label="Title*"
            value={values.title}
            onChange={handleInputChange}
            error={errors.title}
          />
          <Controls.TextArea
            name="description"
            label="Description*"
            value={values.description}
            onChange={handleInputChange}
            error={errors.description}
          />

          <Editor
            content={values.content}
            handleContentChange={handleContentChange}
          />
          {/* <Controls.TextArea
            name="content"
            label="Content*"
            value={values.content}
            onChange={handleInputChange}
            error={errors.content}
          /> */}
          <Controls.Input
            name="tags"
            label="Tags(tag1,tag2 etc)*"
            value={values.tags}
            onChange={handleInputChange}
            error={errors.tags}
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
        <Notification notify={notify} setNotify={setNotify} />
      </Grid>
    </Form>
  );
}
