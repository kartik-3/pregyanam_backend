import { proxy } from "../proxy";
import axios from "axios";
let token = localStorage.getItem("jwtToken");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };


export async function loginAdmin(data) {
  try {
    let result = await axios.post(
      `${proxy}/api/authentication/admin/login`,
      data
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
