import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconEye,
  IconFileDescription,
  IconInfoCircle,
  IconLayoutGrid,
  IconMedicineSyrup,
  IconPill,
  IconPrescription,
  IconRoute,
  IconSearch,
  IconTable,
} from "@tabler/icons-react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { getPrescriptionByPatientId } from "../../../Services/AppointmentService";
import { formatDateTime } from "../../../Utility/DateUtility";
import { useNavigate } from "react-router-dom";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Toolbar } from "primereact/toolbar";
import PresCard from "./PresCard";

const Prescriptions = ({ appointment }: any) => {
  const [view, setView] = useState("table");
  const [medicineData, setMedicineData] = useState<any>([]);
  const [opened, { open, close }] = useDisclosure();
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleMedicine = (medicine: any[]) => {
    console.log("medicine", medicine);

    open();
    setMedicineData(medicine);
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <ActionIcon
          onClick={() =>
            navigate("/doctor/appointments/" + rowData.appointmentId)
          }
          color="neutral.6"
        >
          <IconEye size={16} stroke={1.6} />
        </ActionIcon>
        <ActionIcon
          onClick={() => handleMedicine(rowData.medicines)}
          color="primary.5"
        >
          <IconMedicineSyrup size={16} stroke={1.6} />
        </ActionIcon>
      </div>
    );
  };

  useEffect(() => {
    getPrescriptionByPatientId(appointment?.patientId)
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.error("Error fetching prescriptions:", error);
      });
  }, [appointment]);

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        {!matches && (
          <SegmentedControl
            color="primary"
            value={view}
            onChange={setView}
            data={[
              { label: <IconTable />, value: "table" },
              { label: <IconLayoutGrid />, value: "card" },
            ]}
          />
        )}
      </div>
    );
  };
  const matches = useMediaQuery("(max-width: 768px)");

  const header = renderHeader();
  return (
    <div>
      <Toolbar className="!p-5" end={header}></Toolbar>
      {view == "table" && !matches ? (
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
          emptyMessage="No appointments found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column
            field="doctorName"
            header="Doctor Name"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="prescriptionDate"
            header="Prescription Date"
            sortable
            style={{ minWidth: "14rem" }}
            body={(rowData) => formatDateTime(rowData.prescriptionDate)}
          />
          <Column
            body={(rowData) => rowData.medicines?.length ?? 0}
            header="Medicines"
            style={{ minWidth: "14rem" }}
          />
          <Column field="notes" header="Notes" style={{ minWidth: "14rem" }} />

          <Column
            headerStyle={{ width: "5rem", textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={actionBodyTemplate}
          />
        </DataTable>
      ) : (
        <div>
          {data?.map((prescription) => (
            <PresCard
              key={prescription.id}
              {...prescription}
              onView={() =>
                navigate("/doctor/appointments/" + prescription.appointmentId)
              }
              onMed={() => handleMedicine(prescription.medicines)}
            />
          ))}

          {data.length === 0 && (
            <div className="text-center text-neutral-500">
              No prescriptions found.
            </div>
          )}
        </div>
      )}

      <Modal
        opened={opened}
        onClose={close}
        radius="lg"
        title={
          <Group gap="sm">
            <ThemeIcon size={32} radius="xl" color="teal">
              <IconPrescription size={18} />
            </ThemeIcon>
            <Text fw={700} c="teal">
              Prescription
            </Text>
          </Group>
        }
        size="lg"
        centered
      >
        {medicineData?.length > 0 ? (
          <Stack gap="sm">
            {medicineData.map((med: any, index: number) => (
              <Paper
                key={index}
                radius="lg"
                p="lg"
                style={{
                  background: "white",
                  border: "1px solid var(--mantine-color-gray-3)",
                }}
              >
                <Group justify="space-between" mb="xs">
                  <Text fw={700} size="lg">
                    {med.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    #{med.medicineId}
                  </Text>
                </Group>

                {/* Chips */}
                <Group gap="xs" mt="sm">
                  <Badge
                    radius="xl"
                    size="lg"
                    variant="outline"
                    color="teal"
                    leftSection={<IconPill size={14} />}
                  >
                    {med.dosage}
                  </Badge>

                  <Badge
                    radius="xl"
                    size="lg"
                    variant="outline"
                    color="violet"
                    leftSection={<IconClock size={14} />}
                  >
                    {med.frequency}
                  </Badge>

                  <Badge
                    radius="xl"
                    size="lg"
                    variant="outline"
                    color="green"
                    leftSection={<IconCalendar size={14} />}
                  >
                    {med.duration} days
                  </Badge>

                  <Badge
                    radius="xl"
                    size="lg"
                    variant="outline"
                    color="orange"
                    leftSection={<IconRoute size={14} />}
                  >
                    {med.route}
                  </Badge>
                </Group>

                {/* Instructions */}
                {med.instructions && (
                  <Paper
                    mt="md"
                    p="md"
                    radius="md"
                    style={{
                      background: "var(--mantine-color-gray-0)",
                      borderLeft: "4px solid var(--mantine-color-teal-6)",
                    }}
                  >
                    <Group gap="xs">
                      <IconInfoCircle size={16} />
                      <Text size="sm" fw={600}>
                        Doctor’s Instructions
                      </Text>
                    </Group>
                    <Text size="sm" mt={4}>
                      {med.instructions}
                    </Text>
                  </Paper>
                )}
              </Paper>
            ))}
          </Stack>
        ) : (
          <Stack align="center" gap="md" py="xl">
            <ThemeIcon size={72} radius="xl" variant="light" color="gray">
              <IconFileDescription size={36} />
            </ThemeIcon>
            <Text size="lg" c="dimmed">
              No medicines prescribed
            </Text>
          </Stack>
        )}
      </Modal>
    </div>
  );
};

export default Prescriptions;
