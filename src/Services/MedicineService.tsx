import axiosInstance from "../Interceptor/AxiosInterceptor";

const addMedicine = async (medicine: any) => {
  return axiosInstance
    .post("/pharmacy/medicines/add", medicine)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const updateMedicine = async (medicine: any) => {
  return axiosInstance
    .put("/pharmacy/medicines/update", medicine)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getMedicineById = async (id: any) => {
  return axiosInstance
    .get("/pharmacy/medicines/get/" + id)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getAllMedicines = async () => {
  return axiosInstance
    .get("/pharmacy/medicines/get-all")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export { addMedicine, updateMedicine, getMedicineById, getAllMedicines };
