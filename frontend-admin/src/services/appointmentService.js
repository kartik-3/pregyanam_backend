import { proxy } from "../proxy";
import axios from "axios";
let token = localStorage.getItem("jwtToken");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };


export async function getAppointments(page, limit, query) {
  try {
    let result = await axios.get(
      `${proxy}/api/slot-book/page/${page}/limit/${limit}?${query}`
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "get Bookings Failed Due to Server error",
    };
  }
}

export async function updateBooking(id, data) {
  try {
    let result = await axios.patch(
      `${proxy}/api/slot-book/bookingId/${id}`,
      data
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "update Bookings Failed Due to Server error",
    };
  }
}