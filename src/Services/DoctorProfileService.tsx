import axiosInstance from "../Interceptor/AxiosInterceptor";

const getDoctor = async (id: any) => {
  return axiosInstance
    .get("/profile/doctor/get/" + id)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const updateDoctor = async (doctor: any) => {
  return axiosInstance
    .put("/profile/doctor/update", doctor)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getDoctorDropdown = async () => {
  return axiosInstance
    .get("/profile/doctor/dropdown")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getAllDoctors = async () => {
  return axiosInstance
    .get("/profile/doctor/get-all")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export { getDoctor, updateDoctor, getDoctorDropdown, getAllDoctors };
