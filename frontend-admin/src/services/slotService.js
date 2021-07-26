import { proxy } from "../proxy";
import axios from "axios";
let token = localStorage.getItem("jwtToken");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };


export async function getAllSlots(page, limit) {
  try {
    let result = await axios.get(
      `${proxy}/api/slot/admin/page/${page}/limit/${limit}`
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Getting Available slots Failed Due to Server error",
    };
  }
}
export async function getSlotsByService(page, limit, service) {
  try {
    let result = await axios.get(
      `${proxy}/api/slot/service/${service}/page/${page}/limit/${limit}`
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Getting Available slots Failed Due to Server error",
    };
  }
}
export async function getAllTimeSlotsForDates(page, limit, date) {
  try {
    let result = await axios.get(
      `${proxy}/api/slot/admin/page/${page}/limit/${limit}/date/${date}`
    );
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Getting Available slots Failed Due to Server error",
    };
  }
}

export async function createSlot(data) {
  try {
    let result = await axios.post(`${proxy}/api/slot/`, data);
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Creating Slot Failed Due to Server error",
    };
  }
}


export async function updateSlot(id, data) {
    try {
      let result = await axios.patch(`${proxy}/api/slot/${id}`, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Creating Slot Failed Due to Server error",
      };
    }
  }

export async function deleteSlot(id) {
  try {
    let result = await axios.delete(`${proxy}/api/slot/${id}`);
    return result.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Creating Slot Failed Due to Server error",
    };
  }
}