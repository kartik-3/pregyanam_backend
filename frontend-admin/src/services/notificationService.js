import { proxy } from "../proxy";
import axios from "axios";
let token = localStorage.getItem("jwtToken");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

export async function updateNotification(notificationId, data) {
  try {
    let result = await axios.patch(
      `${proxy}/api/notification/notificationId/${notificationId}`,
      data
    );
    return result.data;
  } catch (error) {
    if (error.response.data && error.response.data.success == false) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }
    return {
      success: false,
      message: "Updation Notification Failed Due to Server error",
    };
  }
}

export async function getAllNotifications(page, limit) {
  try {
    let result = await axios.get(
      `${proxy}/api/notification/page/${page}/limit/${limit}`
    );
    return result.data;
  } catch (error) {
    if (error.response.data && error.response.data.success == false) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }
    return {
      success: false,
      message: "Fetching Notification Failed Due to Server error",
    };
  }
}
