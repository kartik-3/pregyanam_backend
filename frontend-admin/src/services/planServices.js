import { proxy } from "../proxy";
import axios from "axios";
let token = localStorage.getItem("jwtToken");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };


export async function getPlans() {
  try {
    let result = await axios.get(
      `${proxy}/api/service/page/0/limit/50`
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
