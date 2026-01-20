import {
  ActionIcon,
  Button,
  Fieldset,
  NumberInput,
  SegmentedControl,
  Select,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { medicineCategories, medicineTypes } from "../../../Data/DropdownData";
import {
  IconEdit,
  IconLayoutGrid,
  IconSearch,
  IconTable,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
  errorNotification,
  successNotification,
} from "../../../Utility/Notifications";
import { useNavigate } from "react-router-dom";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import {
  addMedicine,
  getAllMedicines,
  updateMedicine,
} from "../../../Services/MedicineService";
import { Toolbar } from "primereact/toolbar";
import MedicineCard from "./MedicineCard";
import { useMediaQuery } from "@mantine/hooks";

const Medicine = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("table");
  const form = useForm({
    initialValues: {
      id: null as number | null,
      name: "",
      dosage: "",
      category: "",
      type: "",
      manufacturer: "",
      unitPrice: 0,
    },
    validate: {
      name: (value: string) => (!value?.trim() ? "Name is required" : null),
      dosage: (value: string) => (!value?.trim() ? "Dosage is required" : null),
      category: (value: string) => (!value ? "Category is required" : null),
      type: (value: string) => (!value ? "Type is required" : null),
      manufacturer: (value: string) =>
        !value?.trim() ? "Manufacturer is required" : null,
      unitPrice: (value: number) =>
        !value || value <= 0 ? "Unit price must be greater than 0" : null,
    },
  });

  const onEdit = (rowData: any) => {
    form.setValues({
      id: rowData.id,
      name: rowData.name,
      dosage: rowData.dosage,
      category: rowData.category,
      type: rowData.type,
      manufacturer: rowData.manufacturer,
      unitPrice: rowData.unitPrice,
    });
    setEdit(true);
  };

  const handleSubmit = (values: typeof form.values) => {
    const isUpdate = !!values.id;
    const method = isUpdate ? updateMedicine : addMedicine;

    setLoading(true);
    method(values)
      .then((res) => {
        successNotification(
          `Medicine ${isUpdate ? "updated" : "added"} successfully`,
        );
        form.reset();
        setEdit(false);
        fetchData();
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage ||
            `Failed to ${isUpdate ? "update" : "add"} medicine`,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getAllMedicines()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to fetch medicines",
        );
      });
  };

  const [data, setData] = useState<any[]>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const navigate = useNavigate();
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const actionBodyTemplate = (rowData: any) => {
    return (
      <ActionIcon onClick={() => onEdit(rowData)}>
        <IconEdit size={16} />
      </ActionIcon>
    );
  };

const renderHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <Button
        onClick={() => setEdit(true)}
        variant="filled"
        disabled={edit}
      >
        Add Medicine
      </Button>
    </div>
  );
};

  const matches = useMediaQuery("(max-width: 768px)");



  const cancel = () => {
    form.reset();
    setEdit(false);
  };
  const startToolbar = () => {
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

  const header = renderHeader();
  return (
    <div>
      <Toolbar start={header} end={startToolbar}></Toolbar>
      {!edit ? (
        view === "table" && !matches ? (
          <DataTable
            stripedRows
            size="small"
            value={data}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="id"
            emptyMessage="No medicines found."
          >
            <Column field="name" header="Medicine Name" />
            <Column field="dosage" header="Dosage" />
            <Column field="category" header="Category" />
            <Column field="type" header="Type" />
            <Column field="unitPrice" header="Unit Price" />
            <Column field="manufacturer" header="Manufacturer" />
            <Column body={actionBodyTemplate} />
          </DataTable>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((med) => (
              <MedicineCard key={med.id} medicine={med} onEdit={onEdit} />
            ))}
          </div>
        )
      ) : (
        <div>
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-primary-500">
              {form.values.id ? "Update Medicine" : "Add New Medicine"}
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
              <TextInput
                withAsterisk
                label="Medicine Name"
                placeholder="Enter medicine name"
                {...form.getInputProps("name")}
              />
              <TextInput
                label="Dosage"
                withAsterisk
                {...form.getInputProps("dosage")}
                placeholder="Enter dosage (mg/ml/etc.)"
              />
              <Select
                data={medicineCategories}
                label="Category"
                withAsterisk
                {...form.getInputProps("category")}
                placeholder="Select category"
              />
              <Select
                data={medicineTypes}
                label="Medicine Type"
                withAsterisk
                {...form.getInputProps("type")}
                placeholder="Select medicine type"
              />
              <NumberInput
                min={0}
                clampBehavior="strict"
                withAsterisk
                label="Unit Price"
                placeholder="Enter unit price"
                {...form.getInputProps("unitPrice")}
              />
              <TextInput
                label="Manufacturer"
                withAsterisk
                {...form.getInputProps("manufacturer")}
                placeholder="Enter manufacturer"
              />
            </Fieldset>

            <div className="flex justify-end gap-4">
              <Button loading={loading} onClick={cancel} variant="outline">
                Cancel
              </Button>
              <Button loading={loading} color="primary" type="submit">
                {form.values.id ? "Update Medicine" : "Add Medicine"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Medicine;
