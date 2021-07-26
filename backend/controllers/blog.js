const mongoose = require("mongoose");
const Blog = require("../models/Blog");

exports.uploadCover = async (req, res) => {
  try {
    if (
      req.file.cloudStoragePublicUrl &&
      req.file.cloudStoragePublicUrl != ""
    ) {
      res.status(201).json({
        success: true,
        data: req.file.cloudStoragePublicUrl,
        message: "Image Uploaded successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Image Upload Failed due to server error",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
}

exports.draftBlog = async (req, res) => {
  try {
    let { _id, title, description, content, tags, cover } = req.body;

    let user = req.userData.userId;

    if (!_id) {
      //1st time then save
      let newBlog = await new Blog({
        title,
        description,
        content,
        cover,
        creator: user,
        draft: true,
        tags,
      }).save();
      res.status(201).json({
        success: true,
        message: `Blog is draft`,
        data: newBlog,
      });
    } else {
      //update by _id

      let updatedBlog = await Blog.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(_id),
        },
        {
          $set: {
            title,
            description,
            content,
            cover,
            creator: user,
            tags,
            draft: true,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: `Blog changes Saved`,
        data: updatedBlog,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

exports.saveBlog = async (req, res) => {
  try {
    let { _id, title, description, content, tags, cover } = req.body;

    let user = req.userData.userId;

    if (!_id) {
      //1st time then save
      let newBlog = await new Blog({
        title,
        description,
        content,
        cover,
        creator: user,
        tags,
      }).save();
      res.status(201).json({
        success: true,
        message: `Blog is saved`,
        data: newBlog,
      });
    } else {
      //update by _id

      let updatedBlog = await Blog.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(_id),
        },
        {
          $set: {
            title,
            description,
            content,
            cover,
            creator: user,
            tags,
            draft: false,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: `Blog is Updated`,
        data: updatedBlog,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

/**admin api */
exports.getAllBlogs = async (req, res) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let obj = {};
    if (req.query.draft != undefined) {
      obj["draft"] = req.query.draft;
    }
    if (req.query.name) {
      obj['title'] = RegExp(req.query.name.trim(), 'i');
    }

    let blogs = await Blog.find(obj)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("creator");
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

/**admin api */
exports.getBlogsUser = async (req, res) => {
  try {
    // let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let obj = {};
    if (req.query.draft != undefined) {
      obj["draft"] = req.query.draft;
    }
    if (req.query.name) {
      obj['title'] = RegExp(req.query.name.trim(), 'i');
    }

    let blogs = await Blog.find(obj)
      .sort({ createdAt: 1 })
      // .skip(limit)
      .limit(limit)
      .populate("creator");
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    let blogId = mongoose.Types.ObjectId(req.params.blogId);

    let deleted = await Blog.findOneAndDelete({ _id: blogId });
    if (deleted) {
      res.status(200).json({ success: true, message: "Blog Deleted SuccessFully" })
    } else {
      res.status(200).json({ success: false, message: "Blog Not Found" })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
}