import { proxy } from "../proxy";
import axios from "axios";
let token = localStorage.getItem("jwtToken");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

export async function addResource(data) {
  try {
    let result = await axios.post(`${proxy}/api/resource`, data);
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Resource Saving Failed Due to Server error",
    };
  }
}

export async function getAllResources(page, limit, query) {
  try {
    let result = await axios.get(
      `${proxy}/api/resource/admin/page/${page}/limit/${limit}?${query}`
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "getting Resources Failed Due to Server error",
    };
  }
}
