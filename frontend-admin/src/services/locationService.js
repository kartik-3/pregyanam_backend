import { proxy } from "../proxy";
import axios from "axios";
let token = localStorage.getItem("jwtToken");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

export async function getAllSalesmanLocation(page, limit) {
  try {
    let result = await axios.get(
      `${proxy}/api/location/page/${page}/limit/${limit}`
    );
    return result.data;
  } catch (error) {
    return {
      success: false,
      message: "Getting location failed",
    };
  }
}
