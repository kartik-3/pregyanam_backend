const router = require("express").Router();
const authCheckAdmin = require("../middleware/check-auth-admin");
const images = require("../config/cloud-storage-setup");

/**controller funtions of user */
const {
  draftBlog,
  saveBlog,
  deleteBlog,
  getAllBlogs,
  getBlogsUser,
  uploadCover,
} = require("../controllers/blog");

/**
 * @description   this route is used to upload brand image
 * @route   POST      /blog/upload-image
 * @access  Public
 */
router.post(
  "/upload-image",
  authCheckAdmin,
  images.multer.single("image"),
  images.sendUploadToGCS,
  uploadCover
);

/**
 * @description   this route is used to create a new user
 * @route   POST      /blog/draft
 * @access  Private
 */
router.post(
  "/draft",
  authCheckAdmin,
  images.multer.single("image"),
  images.sendUploadToGCS,
  draftBlog
);

/**
 * @description   this route is used to create a new user
 * @route   POST      /blog/draft
 * @access  Private
 */
router.post(
  "/",
  authCheckAdmin,
  images.multer.single("image"),
  images.sendUploadToGCS,
  saveBlog
);

/**admin api */
/**
 * @description   this route is used to get loggedin user info
 * @route   GET      /blog/admin/page/:page/limit/:limit/draft/:draft
 * @access  Private
 */
router.get("/admin/page/:page/limit/:limit", authCheckAdmin, getAllBlogs);
router.get("/allblogs/:limit", getBlogsUser);

/**
 * @description   this route is used to delete blog
 * @route   DELETE      /blog/admin/blogId/:blogId
 * @access  Private
 */

router.delete("/admin/blogId/:blogId", authCheckAdmin, deleteBlog);

module.exports = router;
