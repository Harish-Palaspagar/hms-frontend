import React, { useState, useEffect, use } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { ProgressBar } from "primereact/progressbar";
import { Calendar } from "primereact/calendar";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { Tag } from "primereact/tag";
import {
  ActionIcon,
  Button,
  LoadingOverlay,
  Modal,
  SegmentedControl,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconEdit,
  IconEye,
  IconLayoutGrid,
  IconPlus,
  IconSearch,
  IconTable,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  cancelAppointment,
  getAppointmentDetailsByDoctor,
  getAppointmentDetailsByPatient,
  scheduleAppointment,
} from "../../../Services/AppointmentService";
import { getDoctorDropdown } from "../../../Services/DoctorProfileService";
import { useSelector } from "react-redux";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { appointmentReasons } from "../../../Data/DropdownData";
import { randomBytes } from "crypto";
import {
  errorNotification,
  successNotification,
} from "../../../Utility/Notifications";
import { formatDate, formatDateTime } from "../../../Utility/DateUtility";
import { modals } from "@mantine/modals";
import { log } from "console";
import { Toolbar } from "primereact/toolbar";
import { useNavigate } from "react-router";
import ApCard from "./ApCard";

interface Country {
  name: string;
  code: string;
}

interface Representative {
  name: string;
  image: string;
}

interface Customer {
  id: number;
  name: string;
  country: Country;
  company: string;
  date: string | Date;
  status: string;
  verified: boolean;
  activity: number;
  representative: Representative;
  balance: number;
}

const Appointment = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<string>("table");
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("Today");
  const user = useSelector((state: any) => state.user);
  const [appointment, setAppointment] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    reason: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    status: { value: null, matchMode: FilterMatchMode.IN },
    notes: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [statuses] = useState<string[]>([
    "unqualified",
    "qualified",
    "new",
    "negotiation",
    "renewal",
  ]);

  const getSeverity = (status: string) => {
    switch (status) {
      case "CANCELLED":
        return "danger";

      case "COMPLETED":
        return "success";

      case "SCHEDULED":
        return "info";

      case "negotiation":
        return "warning";

      case "renewal":
        return null;

      default:
        return null;
    }
  };

  useEffect(() => {
    fetchData();
    getDoctorDropdown()
      .then((data) => {
        setDoctors(
          data.map((doctor: any) => ({
            value: "" + doctor.id,
            label: doctor.name,
          })),
        );
      })
      .catch((error) => {
        console.error("Error fetching doctors :", error);
      });
  }, []);

  const fetchData = () => {
    setLoading(true);
    getAppointmentDetailsByDoctor(user.profileId)
      .then((data) => {
        setAppointment(data);
      })
      .catch((error) => {})
      .finally(() => setLoading(false));
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const form = useForm({
    initialValues: {
      doctorId: "",
      patientId: user.profileId,
      appointmentTime: new Date(),
      reason: "",
      notes: "",
    },

    validate: {
      doctorId: (value: any) => (!value ? "Doctor is required" : null),
      appointmentTime: (value: any) =>
        !value ? "Appointment time is required" : null,
      reason: (value: any) =>
        !value ? "Reason for appointment is required" : null,
    },
  });

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <Button onClick={open} leftSection={<IconPlus size={16} />}>
          Schedule Appointment
        </Button>
        <TextInput
          leftSection={<IconSearch size={16} />}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData: Customer) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const handleDelete = (rowData: any) => {
    modals.openConfirmModal({
      title: (
        <Text fw={600} size="lg">
          Confirm Appointment Cancellation
        </Text>
      ),
      children: (
        <Text size="sm">
          Are you sure you want to cancel the appointment for patient{" "}
          <strong>{rowData.patientName}</strong> scheduled on{" "}
          <strong>{formatDateTime(rowData.appointmentTime)}</strong>?
          <br />
          <br />
          The patient will be notified about this cancellation. This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },

      onConfirm: () => {
        cancelAppointment(rowData.id)
          .then((response) => {
            setLoading(true);
            successNotification(
              "The appointment has been cancelled successfully.",
            );
            setAppointment(
              appointment.map((a) =>
                a.id == rowData.id ? { ...a, status: "CANCELLED" } : a,
              ),
            );
          })
          .catch((error) => {
            errorNotification(
              "Failed to cancel appointment. Please try again.",
            );
          });
      },
    });
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <ActionIcon onClick={() => navigate("" + rowData.id)} color="neutral.6">
          <IconEye size={16} stroke={1.6} />
        </ActionIcon>
        <ActionIcon onClick={() => handleDelete(rowData)}>
          <IconTrash size={16} stroke={1.6} />
        </ActionIcon>
      </div>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <Button onClick={open} leftSection={<IconPlus size={16} />}>
        Schedule Appointment
      </Button>
    );
  };

  const rightToolbarTemplate = () => {
    return (
       <div className="md:flex hidden flex-gap-5 items-center">
        <SegmentedControl
          color="primary"
          value={view}
          onChange={setView}
          data={[
            { label: <IconTable />, value: "table" },
            { label: <IconLayoutGrid />, value: "card" },
          ]}
        />
        {!matches && 
          <TextInput
          leftSection={<IconSearch size={16} />}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />}
      </div>
    );
  };
  const centerToolbarTemplate = () => {
    return (
      <SegmentedControl
        value={tab}
        variant="filled"
        color={tab === "Today" ? "red" : tab === "Upcoming" ? "blue" : "black"}
        onChange={setTab}
        data={["Today", "Upcoming", "Past"]}
      />
    );
  };

  const header = renderHeader();

  const handleSubmit = (values: any) => {
    setLoading(true);
    const payload = {
      ...values,
      appointmentTime: toBackendDateTime(values.appointmentTime),
    };
    scheduleAppointment(payload)
      .then(() => {
        close();
        form.reset();
        fetchData();
        successNotification("The appointment has been scheduled successfully.");
      })
      .catch(() => {
        errorNotification("Failed to schedule appointment. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const timeTemplate = (rowData: any) => {
    return <span>{formatDateTime(rowData.appointmentTime)}</span>;
  };

  const toBackendDateTime = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds(),
    )}`;
  };

  const filteredAppointments = appointment.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentTime);
    const today = new Date();
    const appointmentDay = new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate(),
    );
    const todayDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    if (tab === "Today") {
      return appointmentDay.getTime() === todayDay.getTime();
    } else if (tab === "Upcoming") {
      return appointmentDay.getTime() > todayDay.getTime();
    } else if (tab === "Past") {
      return appointmentDay.getTime() < todayDay.getTime();
    }
    return true;
  });
    const matches = useMediaQuery("(max-width: 768px)");

  return (
    <div className="card">
      <Toolbar
        className="mb-4"
        end={rightToolbarTemplate}
        start={centerToolbarTemplate}
      ></Toolbar>

      {view === "table" && !matches ?(
        <DataTable
          stripedRows
          size="small"
          value={filteredAppointments}
          paginator
          rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[10, 25, 50]}
          dataKey="id"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["patientName", "reason", "notes", "status"]}
          emptyMessage="No appointments found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column
            field="patientName"
            header="Patient Name"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="patientPhoneNumber"
            header="Patient Number"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="patientEmail"
            header="Patient Email"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="appointmentTime"
            header="Appointment Time"
            sortable
            body={timeTemplate}
            filterPlaceholder="Search by name"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="reason"
            header="Reason"
            sortable
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="notes"
            header="Notes"
            sortable
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="status"
            header="Status"
            sortable
            style={{ minWidth: "12rem" }}
            body={statusBodyTemplate}
          />

          <Column
            headerStyle={{ width: "5rem", textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={actionBodyTemplate}
          />
        </DataTable>
      ) : (
        <div>
          {filteredAppointments?.map((appointment) => (
            <ApCard
              key={appointment.id}
              {...appointment}
              onDelete={handleDelete} 
            />
          ))}
          {filteredAppointments.length === 0 && (
            <div className="text-center text-neutral-500">
              No appointments found.
            </div>
          )}
        </div>
      )}
      <Modal
        opened={opened}
        size="lg"
        onClose={close}
        title={
          <div className="text-xl font-semibold text-primary-500">
            Schedule Appointment
          </div>
        }
        centered
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="grid grid-cols-1 gap-4"
        >
          <Select
            withAsterisk
            {...form.getInputProps("doctorId")}
            data={doctors}
            label="Doctor"
            placeholder="Select Doctor"
          />
          <DateTimePicker
            withAsterisk
            minDate={new Date()}
            {...form.getInputProps("appointmentTime")}
            label="Enter appointment time"
            placeholder="Pick date and time"
          />
          <Select
            withAsterisk
            {...form.getInputProps("reason")}
            label="Appointment Reason"
            data={appointmentReasons}
            placeholder="Select reason for visit"
          />
          <Textarea
            {...form.getInputProps("notes")}
            label="Additional notes"
            placeholder="Enter any additional notes"
          />
          <Button type="submit">Schedule Appointment</Button>
        </form>
      </Modal>
    </div>
  );
};
export default Appointment;
