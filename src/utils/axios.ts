import axios from 'axios';

// ----------------------------------------------------------------------
// Use this instance anywhere in the app and all calls will have the base URL set
// Additionally, there's no need to pass Authorization headers because they are automatically added when the user has a valid session
//    See src/redux/slices/authJwt.tsx for how those are set.
const axiosInstance = axios.create({
  baseURL: `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}`
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    )
);

export default axiosInstance;
