import axiosInstance from "../Interceptor/AxiosInterceptor";

const uploadMediaFile = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance
    .post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getMediaFileById = async (id: any) => {
  return axiosInstance
    .get("/media/" + id, {
      responseType: "arraybuffer",
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export { uploadMediaFile, getMediaFileById };
