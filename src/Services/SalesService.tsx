import axiosInstance from "../Interceptor/AxiosInterceptor";

const addSale = async (sale: any) => {
  return axiosInstance
    .post("/pharmacy/sales/create", sale)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getSaleById = async (id: any) => {
  return axiosInstance
    .get("/pharmacy/sales/get/" + id)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getSaleItem = async (saleId: any) => {
  return axiosInstance
    .get("/pharmacy/sales/get-sale-item/" + saleId)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const updateSale = async (sale: any) => {
  return axiosInstance
    .put("/pharmacy/sales/update", sale)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getSaleBySaleId = async (saleId: any) => {
  return axiosInstance
    .get("/pharmacy/sales/sales/" + saleId)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getAllSales = async () => {
  return axiosInstance
    .get("/pharmacy/sales/get-all")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export {
  addSale,
  getSaleById,
  getSaleItem,
  getSaleBySaleId,
  updateSale,
  getAllSales,
};
