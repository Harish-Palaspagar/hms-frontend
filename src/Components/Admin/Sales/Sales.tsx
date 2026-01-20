import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  NumberInput,
  SegmentedControl,
  Select,
  SelectProps,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { frequencyMap } from "../../../Data/DropdownData";
import {
  IconCheck,
  IconEye,
  IconLayoutGrid,
  IconPill,
  IconPlus,
  IconReceipt,
  IconSearch,
  IconTable,
  IconTrash,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
  getAllMedicinesByPrescriptionId,
  getAllPrescriptions,
} from "../../../Services/AppointmentService";
import {
  errorNotification,
  successNotification,
} from "../../../Utility/Notifications";
import { useNavigate } from "react-router-dom";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { formatDate } from "../../../Utility/DateUtility";
import { getAllMedicines } from "../../../Services/MedicineService";
import {
  addSale,
  getAllSales,
  getSaleItem,
} from "../../../Services/SalesService";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { spotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";
import { Toolbar } from "primereact/toolbar";
import SalesCard from "./SalesCard";

interface SaleItem {
  medicineId: string;
  quantity: number;
}

interface SaleViewItem {
  medicineId: string;
  quantity: number;
  unitPrice: number;
  batchNo?: string;
}

const Sales = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("table");

  const [opened, { open, close }] = useDisclosure(false);
  const [saleItems, setSaleItems] = useState<SaleViewItem[]>([]);
  const [medicinesLoaded, setMedicinesLoaded] = useState(false);

  const form = useForm({
    initialValues: {
      buyerName: "",
      buyerContact: "",
      saleItems: [{ medicineId: "", quantity: 0 }] as SaleItem[],
    },
    validate: {
      buyerName: (value: string) =>
        !value?.trim() ? "Buyer name is required" : null,
      buyerContact: (value: any) =>
        !value ? "Buyer contact is required" : null,
      saleItems: {
        medicineId: (value: any) => (!value ? "Medicine is required" : null),
        quantity: (value: any) =>
          !value || value <= 0 ? "Quantity must be greater than zero" : null,
      },
    },
  });

  const handleSubmit = (values: any) => {
    setLoading(true);
    const saleItems = values.saleItems.map((x: any) => ({
      ...x,
      unitPrice: medicineMap[x.medicineId]?.unitPrice || 0,
    }));
    const totalAmount = saleItems.reduce(
      (acc: number, item: any) =>
        acc + item.quantity * (medicineMap[item.medicineId]?.unitPrice || 0),
      0,
    );
    addSale({ ...values, saleItems, totalAmount })
      .then((res) => {
        successNotification("Medicine sold successfully");
        form.reset();
        setEdit(false);
        fetchData();
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to sell medicine",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImportPrescription = (prescription: any) => {
    setLoading(true);

    if (!medicineDataRef.current || medicineDataRef.current.length === 0) {
      errorNotification(
        "Medicine inventory is still loading. Please wait a moment and try again.",
      );
      setLoading(false);
      spotlight.close();
      return;
    }

    getAllMedicinesByPrescriptionId(prescription.id)
      .then((res) => {
        const validItems: any[] = [];
        const missingMedicines: string[] = [];

        res.forEach((item: any) => {
          let medId = item.medicineId;
          if (!medId && item.name) {
            const foundMed = medicineDataRef.current.find((med: any) => {
              const medName = (med.name || "").toLowerCase().trim();
              const itemName = (item.name || "").toLowerCase().trim();
              return medName === itemName;
            });

            if (foundMed) {
              medId = foundMed.id;
            } else {
              missingMedicines.push(item.name);
              return;
            }
          }

          if (medId) {
            const medIdStr = String(medId);
            validItems.push({
              medicineId: medIdStr,
              quantity: calculateQuantity(item.frequency, item.duration),
            });
          }
        });
        if (missingMedicines.length > 0) {
          errorNotification(
            `The following medicines are not in inventory: ${missingMedicines.join(", ")}. Please add them to inventory first.`,
          );
        }
        if (validItems.length > 0) {
          form.setValues({
            buyerName: prescription.patientName,
            buyerContact: "",
            saleItems: validItems,
          });

          successNotification(
            `Imported ${validItems.length} medicine(s) successfully`,
          );
        } else if (missingMedicines.length > 0) {
          errorNotification(
            "None of the prescribed medicines are available in inventory",
          );
        }
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to fetch medicines",
        );
      })
      .finally(() => {
        setLoading(false);
        spotlight.close();
      });
  };

  const calculateQuantity = (freq: string, duration: number) => {
    const freqValue = frequencyMap[freq] || 1;
    return Math.ceil(freqValue * duration);
  };

  const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});
  const [actions, setActions] = useState<SpotlightActionData[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [medicineData, setMedicineData] = useState<any[]>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const navigate = useNavigate();
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const medicineDataRef = useRef<any[]>([]);
  const medicineMapRef = useRef<Record<string, any>>({});

  useEffect(() => {
    getAllMedicines()
      .then((res) => {
        setMedicineData(res);
        medicineDataRef.current = res;

        const medMap = res.reduce(
          (acc: any, med: any) => {
            acc[String(med.id)] = med;
            return acc;
          },
          {} as Record<string, any>,
        );

        setMedicineMap(medMap);
        medicineMapRef.current = medMap;
        setMedicinesLoaded(true);

        return getAllPrescriptions();
      })
      .then((res) => {
        setActions(
          res.map((prescription: any) => ({
            id: `${prescription.id}`,
            label: `${prescription.patientName}`,
            description: `Prescription by Dr. ${prescription.doctorName} on ${formatDate(prescription.prescriptionDate)}`,
            onClick: () => {
              handleImportPrescription(prescription);
            },
          })),
        );
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to fetch data",
        );
      });

    fetchData();
  }, []);

  const fetchData = () => {
    getAllSales()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to fetch sales",
        );
      });
  };

  const handleDetails = (rowData: any) => {
    open();
    setLoading(true);

    getSaleItem(rowData.id)
      .then((res) => {
        const mappedItems: SaleViewItem[] = res.map((item: any) => ({
          medicineId: String(item.medicineId),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          batchNo: item.batchNo,
        }));
        setSaleItems(mappedItems);
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to fetch sale items",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <ActionIcon onClick={() => handleDetails(rowData)}>
        <IconEye size={16} />
      </ActionIcon>
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <Button onClick={() => setEdit(true)} variant="filled">
          Sell Medicine
        </Button>
      </div>
    );
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const cancel = () => {
    form.reset();
    setEdit(false);
  };

  const addMode = () => {
    form.insertListItem("saleItems", { medicineId: "", quantity: 0 });
  };

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

  const statusBody = (rowData: any) => {
    const hasExpiredMedicine = rowData.saleItems?.some((item: any) => {
      const med = medicineMap[String(item.medicineId)];
      return med && new Date(med.expirationDate) < new Date();
    });

    return hasExpiredMedicine ? (
      <span className="px-2 py-1 rounded font-bold text-sm bg-red-600 text-white">
        EXPIRED
      </span>
    ) : (
      <span className="px-2 py-1 rounded font-bold text-sm bg-green-600 text-white">
        AVAILABLE
      </span>
    );
  };

  const handleSpotLight = () => {
    spotlight.open();
  };
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
  const header = renderHeader();
    const matches = useMediaQuery("(max-width: 768px)");
  
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
            globalFilterFields={["buyerName", "buyerContact"]}
            emptyMessage="No Sales found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column
              header="Buyer Name"
              style={{ minWidth: "14rem" }}
              field="buyerName"
            />
            <Column
              header="Contact"
              style={{ minWidth: "14rem" }}
              field="buyerContact"
            />
            <Column
              field="amount"
              sortable
              header="Total Amount"
              style={{ minWidth: "14rem" }}
              body={(rowData) => `₹${rowData.amount || 0}`}
            />

            <Column
              body={(rowData) => formatDate(rowData.saleDate)}
              sortable
              header="Sale Date"
              style={{ minWidth: "14rem" }}
            />

            <Column
              field="stockStatus"
              header="Status"
              style={{ minWidth: "14rem" }}
              body={statusBody}
            />
            <Column
              headerStyle={{ width: "5rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
              body={actionBodyTemplate}
            />
          </DataTable>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {data.map((sale) => (
              <SalesCard
                key={sale.id}
                sale={sale}
                medicineMap={medicineMap}
                onDetails={handleDetails}
              />
            ))}
          </div>
        )
      ) : (
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-primary-500">
              Sell Medicine
            </h3>
            <Button
              onClick={handleSpotLight}
              leftSection={<IconReceipt size={16} />}
            >
              Import Prescription
            </Button>
          </div>
          <form className="grid gap-4" onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={loading} />
            <Fieldset
              className="grid gap-5"
              legend={
                <span className="text-lg font-medium text-primary-500">
                  Buyer Information
                </span>
              }
              variant="filled"
              radius="md"
            >
              <div className="grid gap-4 grid-cols-2">
                <TextInput
                  withAsterisk
                  label="Buyer Name"
                  placeholder="Enter buyer name"
                  {...form.getInputProps("buyerName")}
                />
                <NumberInput
                  maxLength={10}
                  withAsterisk
                  label="Buyer Contact"
                  placeholder="Enter buyer contact"
                  {...form.getInputProps("buyerContact")}
                />
              </div>
            </Fieldset>
            <Fieldset
              className="grid gap-5"
              legend={
                <span className="text-lg font-medium text-primary-500">
                  Medicine Information
                </span>
              }
              variant="filled"
              radius="md"
            >
              <div className="grid gap-4">
                {form.values.saleItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4">
                    <div className="col-span-2">
                      <Select
                        data={medicineData
                          .filter(
                            (med: any) =>
                              !form.values.saleItems.some(
                                (saleItem, i) =>
                                  i !== index &&
                                  String(saleItem.medicineId) ===
                                    String(med.id),
                              ),
                          )
                          .map((med: any) => ({
                            value: String(med.id),
                            label: med.name || "Unknown Medicine",
                            manufacturer: med.manufacturer || "Unknown",
                            dosage: med.dosage || "N/A",
                          }))}
                        renderOption={renderSelectOption}
                        label="Medicine"
                        withAsterisk
                        placeholder="Select Medicine"
                        {...form.getInputProps(`saleItems.${index}.medicineId`)}
                      />
                    </div>
                    <div className="col-span-2">
                      <NumberInput
                        min={1}
                        max={medicineMap[item.medicineId]?.stock ?? 0}
                        clampBehavior="strict"
                        withAsterisk
                        label="Quantity"
                        placeholder="Enter quantity"
                        rightSection={
                          <span className="text-xs font-semibold text-primary-500">
                            Stock: {medicineMap[item.medicineId]?.stock ?? 0}
                          </span>
                        }
                        rightSectionWidth={90}
                        rightSectionPointerEvents="none"
                        {...form.getInputProps(`saleItems.${index}.quantity`)}
                      />
                    </div>
                    <div className="flex flex-col gap-2 items-end justify-end">
                      {item.quantity && item.medicineId ? (
                        <div className="text-sm font-semibold text-primary-600">
                          {item.quantity} × ₹
                          {medicineMap[item.medicineId]?.unitPrice || 0} = ₹
                          {item.quantity *
                            (medicineMap[item.medicineId]?.unitPrice || 0)}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">Total: ₹0</div>
                      )}
                      <ActionIcon
                        size="lg"
                        onClick={() => form.removeListItem("saleItems", index)}
                        variant="filled"
                        color="red"
                        disabled={form.values.saleItems.length === 1}
                      >
                        <IconTrash size={20} />
                      </ActionIcon>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <Button
                  onClick={addMode}
                  variant="outline"
                  leftSection={<IconPlus size={16} />}
                >
                  Add More Medicine
                </Button>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-primary-600">
                    ₹
                    {form.values.saleItems.reduce(
                      (sum, item) =>
                        sum +
                        (item.quantity || 0) *
                          (medicineMap[item.medicineId]?.unitPrice || 0),
                      0,
                    )}
                  </p>
                </div>
              </div>
            </Fieldset>

            <div className="flex justify-end items-center gap-4">
              <Button loading={loading} onClick={cancel} variant="outline">
                Cancel
              </Button>
              <Button loading={loading} color="primary" type="submit">
                Complete Sale
              </Button>
            </div>
          </form>
        </div>
      )}
      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        centered
        radius="lg"
        title={
          <div className="flex items-center gap-2">
            <IconReceipt size={20} className="text-primary-500" />
            <span className="font-semibold text-lg">Sale Details</span>
          </div>
        }
      >
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader size="lg" />
          </div>
        ) : saleItems.length > 0 ? (
          <div className="space-y-5">
            {saleItems.map((item, index) => {
              const med = medicineMap[String(item.medicineId)];

              return (
                <div
                  key={index}
                  className="rounded-xl border bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-base text-gray-800">
                      {med?.name ?? "Medicine"}
                    </h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold">
                      Batch : {item?.batchNo ?? "N/A"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                      Dosage : {med?.dosage ?? "N/A"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">
                      {med?.manufacturer ?? "Unknown"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Quantity</p>
                      <p className="font-semibold text-gray-800">
                        {item.quantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Unit Price</p>
                      <p className="font-semibold text-gray-800">
                        ₹{item.unitPrice}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-bold text-green-600 text-base">
                        ₹{item.quantity * item.unitPrice}
                      </p>
                    </div>

                    <div className="flex items-end justify-end">
                      <IconPill size={28} className="text-primary-400" />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end border-t pt-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Grand Total</p>
                <p className="text-xl font-bold text-primary-600">
                  ₹
                  {saleItems.reduce(
                    (sum, i) => sum + i.quantity * i.unitPrice,
                    0,
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No sale items available
          </p>
        )}
      </Modal>
      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        searchProps={{
          leftSection: <IconSearch size={20} stroke={1.5} />,
          placeholder: "Search prescriptions...",
        }}
      />
    </div>
  );
};

export default Sales;
