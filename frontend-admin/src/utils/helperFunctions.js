import axios from "axios";
import setAuthToken from "./setAuthToken";
const GOOGLE_API_KEY = "AIzaSyA372PcuJQKYrKADjhHTLLDVcfsoCzF-4M";

export const getRedirectUrl = (auth) => {
  switch (auth.user.role) {
    case "seller":
      return "/seller-dashboard";
    case "deliveryperson":
      return "/delivery-dashboard";
    case "admin":
      return "/admin-dashboard";
    default:
      return "/";
  }
};

export const getLatitudeLongitude = async (storeLocation) => {
  setAuthToken(null);
  let response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_API_KEY}&address=${storeLocation}`
  );
  if (response.status === 200) {
    return response.data.results[0].geometry.location;
  } else {
    return undefined;
  }
};

export const getFormattedAddress = async (lat, lng) => {
  setAuthToken(null);
  let response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
  );
  if (response.status == 200) {
    return response.data.results[0].formatted_address;
  } else {
    return undefined;
  }
};

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const formatPrice = (x) => {
  x = x.toString();
  let lastThree = x.substring(x.length - 3);
  let otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != "") lastThree = "," + lastThree;
  let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return res;
};

export const getQueryString = (query) => {
  let createQuery = "";
  for (let i = 0; i <= query.length - 1; i++) {
    if (createQuery != "") {
      createQuery = createQuery + "&&";
    }
    if (query[i].value != "") {
      createQuery = createQuery + query[i].key + "=" + query[i].value;
    }
  }
  return createQuery;
};

// const checkUserExist = async (type, value) => {
//   let exist = await checkEmailExist(type, value);
//   if (exist.success == false) {
//     let temp = { ...errors };
//     if (type == "username") {
//       temp.username = exist.message;
//     }
//     if (type == "email") {
//       temp.email = exist.message;
//     }
//     setErrors({
//       ...temp,
//     });
//   } else {
//     let temp = { ...errors };
//     if (type == "username") {
//       temp.username = "";
//     }
//     if (type == "email") {
//       temp.email == "";
//     }
//     setErrors({
//       ...temp,
//     });
//   }
// };
