import axiosInstance from "../Interceptor/AxiosInterceptor";

const scheduleAppointment = async (data: any) => {
  return axiosInstance
    .post("/appointment/schedule", data)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const cancelAppointment = async (id: any) => {
  return axiosInstance
    .put("/appointment/cancel/" + id)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const getAppointmentById = async (id: any) => {
  return axiosInstance
    .get("/appointment/get/" + id)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const getAppointmentDetails = async (appointmentId: any) => {
  return axiosInstance
    .get("/appointment/get/details/" + appointmentId)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const getAppointmentDetailsByPatient = async (patientId: any) => {
  return axiosInstance
    .get("/appointment/get-all-by-patient/" + patientId)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const getAppointmentDetailsByDoctor = async (doctorId: any) => {
  return axiosInstance
    .get("/appointment/get-all-by-doctor/" + doctorId)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const createAppointmentRecord = async (data: any) => {
  return axiosInstance
    .post("/appointment/record/create", data)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const isReportExists = async (appointmenId: any) => {
  return axiosInstance
    .get("appointment/record/is-record-exists/" + appointmenId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getReportsByPatientId = async (patientId: any) => {
  return axiosInstance
    .get("appointment/record/get-records-by-patient/" + patientId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getPrescriptionByPatientId = async (patientId: any) => {
  return axiosInstance
    .get("appointment/record/get-prescription-by-patient/" + patientId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getAllPrescriptions = async () => {
  return axiosInstance
    .get("/appointment/record/get-all-prescriptions")
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const getAllMedicinesByPrescriptionId = async (prescriptionId: any) => {
  return axiosInstance
    .get("/appointment/record/medicines-by-prescription/" + prescriptionId)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const getVisitCountByPatientId = async (patientId: any) => {
  return axiosInstance
    .get("/appointment/get-current-year-visits/" + patientId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const countReasonByPatientId = async (patientId: any) => {
  return axiosInstance
    .get("/appointment/count-reasons/" + patientId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getAllMedicinesByPatientId = async (patientId: any) => {
  return axiosInstance
    .get("/appointment/get-all-medicines-by-patient/" + patientId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getVisitCountByDoctorId = async (doctorId: any) => {
  return axiosInstance
    .get("/appointment/get-current-year-visits-by-doctor/" + doctorId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getVisitCountByAdminId = async () => {
  return axiosInstance
    .get("/appointment/get-appointment-count-admin")
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getCountReasonDoctorId = async (doctorId: any) => {
  return axiosInstance
    .get("/appointment/count-reasons-by-doctor/" + doctorId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getCountReasonAdminId = async () => {
  return axiosInstance
    .get("/appointment/count-reasons-by-admin")
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getTodayAppointment = async () => {
  return axiosInstance
    .get("/appointment/get-today-appointment")
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getPatientByDoctorId = async (doctorId: any) => {
  return axiosInstance
    .get("/appointment/patients/count/" + doctorId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

export {
  scheduleAppointment,
  cancelAppointment,
  getAppointmentById,
  getAppointmentDetails,
  getAppointmentDetailsByPatient,
  getAppointmentDetailsByDoctor,
  createAppointmentRecord,
  isReportExists,
  getReportsByPatientId,
  getPrescriptionByPatientId,
  getAllPrescriptions,
  getAllMedicinesByPrescriptionId,
  getVisitCountByPatientId,
  countReasonByPatientId,
  getAllMedicinesByPatientId,
  getVisitCountByDoctorId,
  getVisitCountByAdminId,
  getCountReasonDoctorId,
  getCountReasonAdminId,
  getTodayAppointment,
  getPatientByDoctorId,
};
