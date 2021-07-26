import { proxy } from "../proxy";
import axios from "axios";
let token = localStorage.getItem("jwtToken");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };


export async function getAdmins(page,limit,query) {
  try {
    let result = await axios.get(
      `${proxy}/api/admin/page/${page}/limit/${limit}?${query}`
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Login Failed Due to Server error",
    };
  }
}

export async function createAdmin(data) {
  try {
    let result = await axios.post(
      `${proxy}/api/admin/`,data
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Login Failed Due to Server error",
    };
  }
}

export async function deleteAdmin(id) {
  try {
    let result = await axios.delete(
      `${proxy}/api/admin/adminId/${id}`
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Login Failed Due to Server error",
    };
  }
}

export async function updateAdmin(id, data) {
  try {
    let result = await axios.patch(
      `${proxy}/api/admin/adminId/${id}`,data
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Login Failed Due to Server error",
    };
  }
}