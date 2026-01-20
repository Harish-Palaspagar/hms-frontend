import axiosInstance from "../Interceptor/AxiosInterceptor";

const addStock = async (item: any) => {
  return axiosInstance
    .post("pharmacy/inventory/add", item)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const updateStock = async (item: any) => {
  return axiosInstance
    .put("pharmacy/inventory/update", item)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getStock = async (id: any) => {
  return axiosInstance
    .get("pharmacy/inventory/get/" + id)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getAllStocks = async () => {
  return axiosInstance
    .get("pharmacy/inventory/get-all")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const deleteStock = async (id: any) => {
  return axiosInstance
    .delete("pharmacy/inventory/delete/" + id)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export { addStock, updateStock, getStock, getAllStocks, deleteStock };
