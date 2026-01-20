import axiosInstance from "../Interceptor/AxiosInterceptor";

const getPatient = async (id: any) => {
  return axiosInstance
    .get("/profile/patient/get/" + id)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const updatePatient = async (patient: any) => {
  return axiosInstance
    .put("/profile/patient/update", patient)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getAllPatients = async () => {
  return axiosInstance
    .get("/profile/patient/get-all")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export { getPatient, updatePatient, getAllPatients };
