import { proxy } from "../proxy";
import axios from "axios";
let token = localStorage.getItem("jwtToken");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };


export async function getAllAdmins(serviceId) {
  try {
    let result = await axios.get(
      `${proxy}/api/admin-service/serviceId/${serviceId}`
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Getting Admin List Failed Due to Server error",
    };
  }
}
