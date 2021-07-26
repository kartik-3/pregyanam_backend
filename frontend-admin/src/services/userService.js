import { proxy } from "../proxy";
import axios from "axios";
let token = localStorage.getItem("jwtToken");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

export const getCompaniesCollection = async () => {
  try {
    let result = await axios.get(`${proxy}/api/company/admin/page/0/limit/50`);
    return result.data;
  } catch (error) {
    return {
      success: false,
      message: "Getting Companies Failed Due to Server error",
    };
  }
};

export async function createBrand(data) {
  try {
    let result = await axios.post(`${proxy}/api/brand`, data);
    return result.data;
  } catch (error) {
    return {
      success: false,
      message: "Brand Creation Failed Due to Server error",
    };
  }
}

export async function getAllBrandsPagination(page, limit, query) {
  try {
    let result = await axios.get(
      `${proxy}/api/brand/admin/page/${page}/limit/${limit}?${query}`
    );
    return result.data;
  } catch (error) {
    return {
      success: false,
      message: "Getting Brands Failed Due to Server error",
    };
  }
}

export async function updateBrand(brandId, data) {
  try {
    let result = await axios.patch(`${proxy}/api/brand/${brandId}`, data);
    return result.data;
  } catch (error) {
    return {
      success: false,
      message: "Updation of brand Failed Due to Server error",
    };
  }
}

export async function deletebrand(brandId) {
  try {
    let result = await axios.delete(`${proxy}/api/brand/${brandId}`);
    return result.data;
  } catch (error) {
    return {
      success: false,
      message: "Deletion of Brand Failed Due to Server error",
    };
  }
}
