import { proxy } from "../proxy";
import axios from "axios";
let token = localStorage.getItem("jwtToken");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

export async function saveDraft(data) {
  try {
    let result = await axios.post(`${proxy}/api/blog/draft`, data);
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Draft Saving Failed Due to Server error",
    };
  }
}

export async function saveBlog(data) {
  try {
    let result = await axios.post(`${proxy}/api/blog`, data);
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Blog Saving Failed Due to Server error",
    };
  }
}

export async function getAllBlogs(page, limit, query) {
  try {
    let result = await axios.get(
      `${proxy}/api/blog/admin/page/${page}/limit/${limit}?${query}`
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "getting Blog Failed Due to Server error",
    };
  }
}

export async function uploadBlogCover(data) {
  try {
    let result = await axios.post(`${proxy}/api/blog/upload-image`, data);
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Blog cover image upload Failed Due to Server error",
    };
  }
}

export async function deleteBlog(blogId) {
  try {
    let result = await axios.delete(`${proxy}/api/blog/admin/blogId/${blogId}`);
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Blog Deletion Failed Due to Server error",
    };
  }
}
