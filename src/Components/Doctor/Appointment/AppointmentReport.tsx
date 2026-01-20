import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  MultiSelect,
  NumberInput,
  SegmentedControl,
  Select,
  SelectProps,
  Textarea,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import {
  medicineFrequencies,
  medicineTypes,
  symptoms,
  tests,
} from "../../../Data/DropdownData";
import {
  IconCheck,
  IconLayoutGrid,
  IconSearch,
  IconTable,
  IconTrash,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
  createAppointmentRecord,
  getReportsByPatientId,
  isReportExists,
} from "../../../Services/AppointmentService";
import {
  errorNotification,
  successNotification,
} from "../../../Utility/Notifications";
import { useNavigate } from "react-router-dom";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { formatDateTime } from "../../../Utility/DateUtility";
import { getAllMedicines } from "../../../Services/MedicineService";
import { Toolbar } from "primereact/toolbar";
import ReportCard from "./ReportCard";
import { useMediaQuery } from "@mantine/hooks";

type Medicine = {
  name: string;
  medicineId?: string | number | undefined;
  dosage: string;
  frequency: string;
  duration: number;
  type: string;
  instructions: string;
  prescriptionId?: number;
};

const AppointmentReport = ({ appointment }: any) => {
  const [view, setView] = useState<string>("table");
  const [medicineData, setMedicineData] = useState<any[]>([]);
  const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      symptoms: [],
      tests: [],
      diagnosis: "",
      referral: "",
      notes: "",
      prescription: {
        notes: "",
        medicines: [] as Medicine[],
      },
    },
    validate: {
      symptoms: (value: any) =>
        value.length === 0 ? "Please select at least one symptom" : null,
      diagnosis: (value: any) =>
        !value.trim() ? "Diagnosis is required" : null,

      prescription: {
        medicines: {
          name: (value: any) =>
            !value?.trim() ? "Medicine name is required" : null,
          dosage: (value: any) =>
            !value?.trim() ? "Dosage is required" : null,
          frequency: (value: any) => (!value ? "Frequency is required" : null),
          duration: (value: any) =>
            !value || value <= 0 ? "Duration must be greater than 0" : null,
          // route: (value: any) => (!value ? "Route is required" : null),
          type: (value: any) => (!value ? "Type is required" : null),
        },
      },
    },
  });

  const insertMedicine = () => {
    form.insertListItem("prescription.medicines", {
      name: "",
      dosage: "",
      frequency: "",
      duration: 0,
      type: "",
      instructions: "",
    });
  };

  const removeMedicine = (index: number) => {
    form.removeListItem("prescription.medicines", index);
  };

  useEffect(() => {
    fetchData();
  }, [appointment?.patientId, appointment.id]);

  const fetchData = () => {
    getReportsByPatientId(appointment.patientId)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to fetch reports",
        );
      });
    isReportExists(appointment.id)
      .then((res) => {
        setAllowAdd(!res);
      })
      .catch((err) => {
        console.error("Error checking report existence : ", err);
        setAllowAdd(true);
      });
  };

  useEffect(() => {
    getAllMedicines()
      .then((res) => {
        setMedicineData(res);
        setMedicineMap(
          res.reduce(
            (acc: any, med: any) => {
              acc[med.id] = med;
              return acc;
            },
            {} as Record<string, any>,
          ),
        );
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to fetch medicines",
        );
      });
  }, []);

  const handleSubmit = (values: typeof form.values) => {
    let data = {
      ...values,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      prescription: {
        notes: values.prescription.notes,
        medicines: values.prescription.medicines.map((med) => ({
          ...med,
          medicineId: med.medicineId === "OTHER" ? null : med.medicineId,
        })),
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        appointmentId: appointment.id,
      },
    };

    setLoading(true);
    createAppointmentRecord(data)
      .then((res) => {
        successNotification("Report generated successfully");
        form.reset();
        setEdit(false);
        setAllowAdd(false);
        fetchData();
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Report generation failed",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const [data, setData] = useState<any[]>([]);
  const [allowAdd, setAllowAdd] = useState<boolean>(false);

  const actionBodyTemplate = (rowData: any) => {
    return <div className="flex gap-2"></div>;
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        {!matches && 
          <SegmentedControl
          color="primary"
          value={view}
          onChange={setView}
          data={[
            { label: <IconTable />, value: "table" },
            { label: <IconLayoutGrid />, value: "card" },
          ]}
        />}
      </div>
    );
  };
  const matches = useMediaQuery("(max-width: 768px)");

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }: any) => (
    <Group gap="xs">
      <span style={{ fontWeight: 500 }}>{option.label}</span>

      {option.dosage && (
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 500,
            color: "#22c55e",
          }}
        >
          {option.dosage}
        </span>
      )}

      {option.manufacturer && (
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 500,
            color: "#fb7185",
          }}
        >
          ({option.manufacturer})
        </span>
      )}

      {checked && <IconCheck size={16} />}
    </Group>
  );

  const handleChangeMed = (value: any, index: number) => {
    form.setFieldValue(`prescription.medicines.${index}.medicineId`, value);

    if (value && value !== "OTHER") {
      const selectedMed = medicineMap[value];
      if (selectedMed) {
        form.setFieldValue(
          `prescription.medicines.${index}.name`,
          selectedMed.name || "",
        );
        form.setFieldValue(
          `prescription.medicines.${index}.dosage`,
          selectedMed.dosage || "",
        );
        form.setFieldValue(
          `prescription.medicines.${index}.type`,
          selectedMed.type || "",
        );
      }
    } else if (value === "OTHER") {
      form.setFieldValue(`prescription.medicines.${index}.name`, "");
      form.setFieldValue(`prescription.medicines.${index}.medicineId`, "OTHER");
      form.setFieldValue(`prescription.medicines.${index}.dosage`, "");
      form.setFieldValue(`prescription.medicines.${index}.type`, "");
    }
  };

  useEffect(() => {}, []);

  const header = renderHeader();

  const startToolbar = () => {
    return (
      <div className="flex justify-between items-center">
        {allowAdd && (
          <Button onClick={() => setEdit(true)} variant="filled">
            Add Report
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      <Toolbar start={startToolbar} end={header}></Toolbar>
      {!edit ? (
        view === "table" && !matches ? (
          <DataTable
            stripedRows
            size="small"
            value={data}
            paginator
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="id"
            filterDisplay="menu"
            globalFilterFields={["doctorName", "notes"]}
            emptyMessage="No reports found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column
              field="doctorName"
              header="Doctor Name"
              style={{ minWidth: "14rem" }}
            />
            <Column field="diagnosis" header="Diagnosis" />
            <Column
              header="Report Date"
              body={(rowData) => formatDateTime(rowData.createdAt)}
            />
            <Column field="notes" header="Notes" />
          </DataTable>
        ) : (
          <div className="grid gap-4">
            {data.map((report) => (
              <ReportCard key={report.id} {...report} />
            ))}

            {data.length === 0 && (
              <div className="text-center text-gray-500">No reports found.</div>
            )}
          </div>
        )
      ) : (
        edit && (
          <form onSubmit={form.onSubmit(handleSubmit)} className="grid gap-5">
            <Fieldset
              className="grid gap-4 grid-cols-2"
              legend={
                <span className="text-lg font-medium text-primary-500">
                  "Personal information"
                </span>
              }
              variant="filled"
              radius="md"
            >
              <MultiSelect
                withAsterisk
                label="Symptoms"
                className="col-span-2"
                placeholder="Select symptoms"
                {...form.getInputProps("symptoms")}
                data={symptoms}
              />
              <MultiSelect
                withAsterisk
                label="Tests"
                className="col-span-2"
                placeholder="Select tests"
                {...form.getInputProps("tests")}
                data={tests}
              />
              <TextInput
                withAsterisk
                label="Diagnosis"
                placeholder="Enter diagnosis"
                {...form.getInputProps("diagnosis")}
              />
              <TextInput
                label="Referral"
                {...form.getInputProps("referral")}
                placeholder="Enter referral"
              />
              <Textarea
                label="Notes"
                placeholder="Enter any additional notes"
                className="col-span-2"
                {...form.getInputProps("notes")}
              />
            </Fieldset>

            <Fieldset
              className="grid gap-5"
              legend={
                <span className="text-lg font-medium text-primary-500">
                  "Prescription"
                </span>
              }
              variant="filled"
              radius="md"
            >
              <Textarea
                label="Prescription Notes"
                placeholder="Enter any additional prescription notes"
                className=""
                {...form.getInputProps("prescription.notes")}
              />

              {form.values.prescription.medicines.map(
                (med: Medicine, index: number) => (
                  <Fieldset
                    legend={
                      <div className="flex justify-center items-center gap-5">
                        <h1 className="text-lg font-medium">
                          Medicine {index + 1}
                        </h1>
                        <ActionIcon
                          onClick={() => removeMedicine(index)}
                          variant="filled"
                          color="primary"
                          size="lg"
                          radius="md"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </div>
                    }
                    className="grid gap-4 grid-cols-2 cols-span-2"
                    key={index}
                  >
                    <Select
                      data={[
                        ...medicineData
                          .filter(
                            (med: any) =>
                              !form.values.prescription.medicines.some(
                                (item, i) =>
                                  i !== index &&
                                  String(item.medicineId) === String(med.id),
                              ),
                          )
                          .map((med: any) => ({
                            value: String(med.id),
                            label: med.name || "Unknown Medicine",
                            manufacturer: med.manufacturer || "Unknown",
                            dosage: med.dosage || "N/A",
                          })),
                        {
                          value: "OTHER",
                          label: "Other (Not in list)",
                          manufacturer: "",
                          dosage: "",
                        },
                      ]}
                      renderOption={renderSelectOption}
                      label="Medicine"
                      withAsterisk
                      placeholder="Select Medicine"
                      {...form.getInputProps(
                        `prescription.medicines.${index}.medicineId`,
                      )}
                      onChange={(value: any) => {
                        form
                          .getInputProps(
                            `prescription.medicines.${index}.medicineId`,
                          )
                          .onChange(value);
                        handleChangeMed(value, index);
                      }}
                    />

                    {med.medicineId == "OTHER" && (
                      <TextInput
                        withAsterisk
                        label="Medicine"
                        {...form.getInputProps(
                          `prescription.medicines.${index}.name`,
                        )}
                        placeholder="Enter medicine name"
                      />
                    )}
                    <TextInput
                      withAsterisk
                      disabled={med.medicineId !== "OTHER"}
                      {...form.getInputProps(
                        `prescription.medicines.${index}.dosage`,
                      )}
                      label="Dosage"
                      placeholder="Enter dosage"
                    />
                    <Select
                      withAsterisk
                      label="Frequency"
                      {...form.getInputProps(
                        `prescription.medicines.${index}.frequency`,
                      )}
                      placeholder="Select frequency"
                      data={medicineFrequencies}
                    />
                    <NumberInput
                      withAsterisk
                      {...form.getInputProps(
                        `prescription.medicines.${index}.duration`,
                      )}
                      label="Duration (days)"
                      placeholder="Enter duration in days"
                    />
                    <Select
                      withAsterisk
                      disabled={med.medicineId !== "OTHER"}
                      label="Type"
                      {...form.getInputProps(
                        `prescription.medicines.${index}.type`,
                      )}
                      placeholder="Select type"
                      data={medicineTypes}
                    />
                    <Textarea
                      label="Instructions"
                      {...form.getInputProps(
                        `prescription.medicines.${index}.instructions`,
                      )}
                      className="col-span-2"
                      placeholder="Enter any additional instructions"
                    />
                  </Fieldset>
                ),
              )}
              <div className="items-center flex justify-center">
                <Button className="col-span-2" onClick={insertMedicine}>
                  Add Medicine
                </Button>
              </div>
            </Fieldset>

            <div className="flex justify-end gap-4">
              <Button loading={loading} color="primary" type="submit">
                Submit Report
              </Button>
              <Button
                loading={loading}
                color="black"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setEdit(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )
      )}
    </div>
  );
};

export default AppointmentReport;
