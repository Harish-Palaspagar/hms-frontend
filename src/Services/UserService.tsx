import axiosInstance from "../Interceptor/AxiosInterceptor";

const registerUser = async (user: any) => {
  return axiosInstance
    .post("/user/register", user)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const loginUser = async (user: any) => {
  return axiosInstance
    .post("/user/login", user)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getUserProfile = async (userId: any) => {
  return axiosInstance
    .get("/user/profile/" + userId)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const userRegistrationCount = async () => {
  return axiosInstance
    .get("/user/registration-count")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export { registerUser, loginUser, getUserProfile, userRegistrationCount };