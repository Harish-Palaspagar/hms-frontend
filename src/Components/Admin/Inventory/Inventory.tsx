import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  SelectProps,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import {
  IconCheck,
  IconEdit,
  IconLayoutGrid,
  IconTable,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { getAllMedicines } from "../../../Services/MedicineService";
import { DateInput } from "@mantine/dates";
import {
  addStock,
  getAllStocks,
  updateStock,
} from "../../../Services/InventoryService";
import { Toolbar } from "primereact/toolbar";
import InventoryCard from "./InventoryCard";
import {
  errorNotification,
  successNotification,
} from "../../../Utility/Notifications";
import { useMediaQuery } from "@mantine/hooks";

const Inventory = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("table");
    const matches = useMediaQuery("(max-width: 768px)");

  const form = useForm({
    initialValues: {
      id: null as number | null,
      medicineId: "" as string,
      batchNumber: "",
      quantity: 0 as number,
      expirationDate: null as Date | null,
    },
    validate: {
      medicineId: (value: any) => (!value ? "Medicine is required" : null),
      batchNumber: (value: any) =>
        !value?.trim() ? "Batch Number is required" : null,
      quantity: (value: any) =>
        !value || value <= 0 ? "Quantity must be greater than zero" : null,
      expirationDate: (value: any) =>
        !value ? "Expiration Date is required" : null,
    },
  });

  const [data, setData] = useState<any[]>([]);
  const [medicineData, setMedicineData] = useState<any[]>([]);
  const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});
  const [edit, setEdit] = useState<boolean>(false);

  const onEdit = (rowData: any) => {
    form.setValues({
      id: rowData.id,
      medicineId: String(rowData.medicineId),
      batchNumber: rowData.batchNumber,
      quantity: rowData.quantity,
      expirationDate: new Date(rowData.expirationDate),
    });
    setEdit(true);
  };

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);

    const payload = {
      id: values.id,
      medicineId: Number(values.medicineId),
      batchNumber: values.batchNumber,
      quantity: Number(values.quantity),
      expirationDate: values.expirationDate
        ? values.expirationDate instanceof Date
          ? values.expirationDate.toISOString().split("T")[0]
          : values.expirationDate
        : "",
    };

    const method = values.id ? updateStock : addStock;

    method(payload)
      .then(() => {
        successNotification(
          `Stock ${values.id ? "updated" : "added"} successfully`,
        );
        form.reset();
        setEdit(false);
        fetchData();
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage ||
            `Failed to ${values.id ? "update" : "add"} stock`,
        );
      })
      .finally(() => setLoading(false));
  };

  const fetchData = () => {
    getAllStocks()
      .then((res) => setData(res))
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to fetch stocks",
        );
      });
  };

  useEffect(() => {
    getAllMedicines()
      .then((res) => {
        setMedicineData(res);
        setMedicineMap(
          res.reduce((acc: any, med: any) => {
            acc[String(med.id)] = med;
            return acc;
          }, {} as Record<string, any>),
        );
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to fetch medicines",
        );
      });

    fetchData();
  }, []);

  const cancel = () => {
    form.reset();
    setEdit(false);
  };

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }: any) => (
    <Group gap="xs">
      <span style={{ fontWeight: 500 }}>{option.label}</span>

      {option.manufacturer && (
        <span style={{ fontSize: "0.8rem", color: "#fb7185" }}>
          ({option.manufacturer})
        </span>
      )}

      {checked && <IconCheck size={16} />}
    </Group>
  );

  const getStockStatus = (quantity: number, expirationDate: string) => {
    const isExpired = new Date(expirationDate) < new Date();

    if (isExpired) return { status: "EXPIRED", color: "bg-red-600" };
    if (quantity <= 0) return { status: "OUT OF STOCK", color: "bg-red-600" };
    if (quantity <= 10) return { status: "LOW STOCK", color: "bg-yellow-600" };
    return { status: "AVAILABLE", color: "bg-green-600" };
  };

  const statusBody = (rowData: any) => {
    const { status, color } = getStockStatus(
      rowData.quantity,
      rowData.expirationDate,
    );

    return (
      <span className={`px-2 py-1 rounded font-bold text-sm ${color} text-white`}>
        {status}
      </span>
    );
  };

  const actionBodyTemplate = (rowData: any) => (
    <ActionIcon onClick={() => onEdit(rowData)}>
      <IconEdit size={16} />
    </ActionIcon>
  );

  const header = (
    <div className="flex justify-between items-center">
      <Button onClick={() => setEdit(true)} variant="filled" disabled={edit}>
        Add Stock
      </Button>
    </div>
  );

  const startToolbar = () => (
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

  return (
    <div>
      <Toolbar start={header} end={startToolbar()} />

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
            globalFilterFields={["batchNumber"]}
            emptyMessage="No stocks found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column
              header="Medicine"
              style={{ minWidth: "14rem" }}
              body={(rowData) => {
                const med = medicineMap[String(rowData.medicineId)];
                return med ? `${med.name} (${med.manufacturer})` : "N/A";
              }}
            />

            <Column
              header="Batch Number"
              style={{ minWidth: "14rem" }}
              field="batchNumber"
            />

            <Column
              field="initialQuantity"
              header="Initial Quantity"
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="quantity"
              header="Remaining Quantity"
              style={{ minWidth: "14rem" }}
            />

            <Column
              field="expirationDate"
              header="Expiration Date"
              style={{ minWidth: "14rem" }}
            />

            <Column header="Status" style={{ minWidth: "14rem" }} body={statusBody} />
            <Column
              headerStyle={{ width: "5rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
              body={actionBodyTemplate}
            />
          </DataTable>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {data.map((stock) => (
              <InventoryCard
                key={stock.id}
                stock={stock}
                medicineMap={medicineMap}
                onEdit={onEdit}
              />
            ))}
          </div>
        )
      ) : (
        <div>
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-primary-500">
              {form.values.id ? "Update Stock" : "Add New Stock"}
            </h3>
          </div>

          <form className="grid gap-5" onSubmit={form.onSubmit(handleSubmit)}>
            <Fieldset
              className="grid gap-4 grid-cols-2"
              legend={
                <span className="text-lg font-medium text-primary-500">
                  Medicine Information
                </span>
              }
              variant="filled"
              radius="md"
            >
              <Select
                data={medicineData.map((med: any) => ({
                  value: String(med.id),
                  label: med.name || "Unknown Medicine",
                  manufacturer: med.manufacturer || "Unknown",
                }))}
                renderOption={renderSelectOption}
                label="Medicine"
                withAsterisk
                placeholder="Select Medicine"
                disabled={!!form.values.id}
                {...form.getInputProps("medicineId")}
              />

              <TextInput
                withAsterisk
                label="Batch Number"
                placeholder="Enter batch number"
                disabled={!!form.values.id}
                {...form.getInputProps("batchNumber")}
              />

              <NumberInput
                min={0}
                clampBehavior="strict"
                withAsterisk
                label="Quantity"
                placeholder="Enter quantity"
                {...form.getInputProps("quantity")}
              />

              <DateInput
                withAsterisk
                label="Expiration Date"
                minDate={new Date()}
                placeholder="Select expiration date"
                disabled={!!form.values.id}
                {...form.getInputProps("expirationDate")}
              />
            </Fieldset>

            <div className="flex justify-end gap-4">
              <Button loading={loading} onClick={cancel} variant="outline">
                Cancel
              </Button>
              <Button loading={loading} color="primary" type="submit">
                {form.values.id ? "Update Stock" : "Add Stock"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Inventory;
