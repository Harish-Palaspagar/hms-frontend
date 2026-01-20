import {
  Avatar,
  Button,
  Card,
  Modal,
  NumberInput,
  Select,
  Table,
  TagsInput,
  Text,
  Title,
  Group,
  Paper,
  Badge,
} from "@mantine/core";
import {
  IconEdit,
  IconUpload,
  IconUser,
  IconHeart,
  IconVaccine,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { bloodGroups } from "../../../Data/DropdownData";
import { useDisclosure } from "@mantine/hooks";
import { formatDate } from "../../../Utility/DateUtility";
import { useForm } from "@mantine/form";
import {
  errorNotification,
  successNotification,
} from "../../../Utility/Notifications";
import {
  getPatient,
  updatePatient,
} from "../../../Services/PatientProfileService";
import { DropzoneButton } from "../../Admin/Utility/Dropzone/DropzoneButton";
import useProtectedImage from "../../Admin/Utility/useProtectedImage";
const Profile = () => {
  const [editMode, setEditMode] = React.useState(false);
  const user = useSelector((state: any) => state.user);
  const [opened, { open, close }] = useDisclosure(false);
  const [profile, setProfile] = useState<any>({});
  const form = useForm({
    initialValues: {
      birthDate: "",
      profilePictureId: "",
      phoneNumber: "",
      address: "",
      idProof: "",
      bloodGroup: "",
      allergies: [],
      chronicDiseases: [],
    },
    validate: {
      birthDate: (value: any) => (value ? null : "Date of Birth is required"),
      phoneNumber: (value: any) =>
        /^\d{10}$/.test(value) ? null : "Phone Number must be 10 digits",
      address: (value: any) => (value ? null : "Address is required"),
      idProof: (value: any) =>
        /^\d{12}$/.test(value) ? null : "ID Proof must be 12 digits",
      bloodGroup: (value: any) => (value ? null : "Blood Group is required"),
    },
  });
  useEffect(() => {
    console.log(user);
    getPatient(user.profileId)
      .then((data) => {
        console.log(data);
        setProfile(data);
        const allergiesArray = data.allergies
          ? typeof data.allergies === "string"
            ? data.allergies.split(",").map((item: string) => item.trim())
            : data.allergies
          : [];
        const chronicDiseasesArray = data.chronicDiseases
          ? typeof data.chronicDiseases === "string"
            ? data.chronicDiseases.split(",").map((item: string) => item.trim())
            : data.chronicDiseases
          : [];
        form.setValues({
          birthDate: data.birthDate || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          idProof: data.idProof || "",
          bloodGroup: data.bloodGroup || "",
          allergies: allergiesArray,
          chronicDiseases: chronicDiseasesArray,
        });
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, [user?.profileId]);
  const handleSubmit = (values: any) => {
    const updatedPatient = {
      ...profile,
      ...values,
      allergies: Array.isArray(values.allergies)
        ? values.allergies.join(", ")
        : values.allergies,
      chronicDiseases: Array.isArray(values.chronicDiseases)
        ? values.chronicDiseases.join(", ")
        : values.chronicDiseases,
    };
    updatePatient(updatedPatient)
      .then((data) => {
        setProfile(data);
        const allergiesArray = data.allergies
          ? typeof data.allergies === "string"
            ? data.allergies.split(",").map((item: string) => item.trim())
            : data.allergies
          : [];
        const chronicDiseasesArray = data.chronicDiseases
          ? typeof data.chronicDiseases === "string"
            ? data.chronicDiseases.split(",").map((item: string) => item.trim())
            : data.chronicDiseases
          : [];
        form.setValues({
          birthDate: data.birthDate || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          idProof: data.idProof || "",
          bloodGroup: data.bloodGroup || "",
          allergies: allergiesArray,
          chronicDiseases: chronicDiseasesArray,
        });
        setEditMode(false);
        successNotification("Profile updated successfully!");
      })
      .catch((error) => {
        errorNotification(
          error.response?.data?.errorMessage || "Update failed",
        );
      });
  };

  const url = useProtectedImage(profile.profilePictureId);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 px-4 sm:px-6 lg:px-8 py-8 font-body">
        <Paper
          shadow="lg"
          radius="lg"
          p="xl"
          className="bg-white border-0 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-100 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  variant="filled"
                  size={120}
                  src={url}
                  alt="Patient Avatar"
                  className="border-4 border-white shadow-lg"
                />
                {editMode && (
                  <Button
                    size="sm"
                    onClick={open}
                    variant="filled"
                    color="red"
                    className="absolute -bottom-3 -right-1 shadow-md"
                    leftSection={<IconUpload size={18} />}
                  >
                    Upload
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-3xl font-bold font-heading text-neutral-900 flex items-center gap-3">
                  {user.name}
                  {profile.bloodGroup && (
                    <Badge
                      color="red"
                      variant="light"
                      size="lg"
                      leftSection={<IconHeart size={14} />}
                    >
                      {profile.bloodGroup}
                    </Badge>
                  )}
                </div>
                <div className="text-lg text-neutral-600 flex items-center gap-2">
                  <IconUser size={18} />
                  {user.email ?? "-"}
                </div>
                {profile.allergies && (
                  <div className="flex items-center gap-2 mt-1">
                    <IconVaccine size={16} className="text-orange-600" />
                    <Text className="text-orange-700 font-semibold text-sm">
                      {Array.isArray(profile.allergies)
                        ? profile.allergies.join(", ")
                        : profile.allergies}
                    </Text>
                  </div>
                )}
              </div>
            </div>
            <Group>
              {!editMode ? (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditMode(true);
                  }}
                  variant="filled"
                  color="red"
                  size="md"
                  leftSection={<IconEdit size={20} />}
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  Edit
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    color="gray"
                    onClick={() => setEditMode(false)}
                    className="border-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="filled"
                    color="green"
                    className="shadow-md hover:shadow-lg transition-shadow"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </Group>
          </div>
        </Paper>

        <Card
          shadow="md"
          radius="lg"
          p="xl"
          withBorder
          className="bg-white border border-neutral-200 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full"></div>
            <Title
              order={2}
              className="text-2xl font-bold font-heading text-neutral-800"
            >
              Personal & Medical Details
            </Title>
          </div>
          <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm">
            <Table
              highlightOnHover
              withRowBorders={true}
              verticalSpacing="lg"
              horizontalSpacing="xl"
              className="w-full"
            >
              <Table.Tbody>
                <Table.Tr className="hover:bg-primary-50/50 transition-colors">
                  <Table.Td className="py-4 px-6 w-1/3 border-b border-neutral-100">
                    <Text className="text-lg font-semibold text-neutral-700 flex items-center gap-2">
                      Date of Birth
                    </Text>
                  </Table.Td>
                  {editMode ? (
                    <Table.Td className="py-4 px-6 border-b border-neutral-100">
                      <DateInput
                        {...form.getInputProps("birthDate")}
                        placeholder="Select Date of Birth"
                        className="max-w-xs"
                        size="md"
                      />
                    </Table.Td>
                  ) : (
                    <Table.Td className="py-4 px-6 border-b border-neutral-100">
                      <Text className="text-lg text-neutral-900 font-medium">
                        {formatDate(profile.birthDate) || (
                          <span className="text-neutral-400">Not provided</span>
                        )}
                      </Text>
                    </Table.Td>
                  )}
                </Table.Tr>
                <Table.Tr className="hover:bg-primary-50/50 transition-colors">
                  <Table.Td className="py-4 px-6">
                    <Text className="text-lg font-semibold text-neutral-700 flex items-center gap-2">
                      Phone Number
                    </Text>
                  </Table.Td>
                  {editMode ? (
                    <Table.Td className="py-4 px-6">
                      <NumberInput
                        {...form.getInputProps("phoneNumber")}
                        hideControls
                        maxLength={10}
                        clampBehavior="strict"
                        placeholder="Enter Phone Number"
                        className="max-w-xs"
                        size="md"
                      />
                    </Table.Td>
                  ) : (
                    <Table.Td className="py-4 px-6">
                      <Text className="text-lg text-neutral-900 font-medium">
                        {profile.phoneNumber || (
                          <span className="text-neutral-400">Not provided</span>
                        )}
                      </Text>
                    </Table.Td>
                  )}
                </Table.Tr>
                <Table.Tr className="hover:bg-primary-50/50 transition-colors">
                  <Table.Td className="py-4 px-6">
                    <Text className="text-lg font-semibold text-neutral-700 flex items-center gap-2">
                      Address
                    </Text>
                  </Table.Td>
                  {editMode ? (
                    <Table.Td className="py-4 px-6">
                      <TextInput
                        {...form.getInputProps("address")}
                        placeholder="Enter Full Address"
                        size="md"
                        className="max-w-xs"
                      />
                    </Table.Td>
                  ) : (
                    <Table.Td className="py-4 px-6">
                      <Text className="text-lg text-neutral-900 font-medium">
                        {profile.address || (
                          <span className="text-neutral-400">Not provided</span>
                        )}
                      </Text>
                    </Table.Td>
                  )}
                </Table.Tr>
                <Table.Tr className="hover:bg-primary-50/50 transition-colors">
                  <Table.Td className="py-4 px-6">
                    <Text className="text-lg font-semibold text-neutral-700 flex items-center gap-2">
                      ID Proof (Aadhaar)
                    </Text>
                  </Table.Td>
                  {editMode ? (
                    <Table.Td className="py-4 px-6">
                      <NumberInput
                        {...form.getInputProps("idProof")}
                        hideControls
                        maxLength={12}
                        clampBehavior="strict"
                        placeholder="Enter Aadhaar Number"
                        className="max-w-xs"
                        size="md"
                      />
                    </Table.Td>
                  ) : (
                    <Table.Td className="py-4 px-6">
                      <Text className="text-lg text-neutral-900 font-medium">
                        {profile.idProof || (
                          <span className="text-neutral-400">Not provided</span>
                        )}
                      </Text>
                    </Table.Td>
                  )}
                </Table.Tr>
                <Table.Tr className="hover:bg-primary-50/50 transition-colors">
                  <Table.Td className="py-4 px-6">
                    <Text className="text-lg font-semibold text-neutral-700 flex items-center gap-2">
                      Blood Group
                    </Text>
                  </Table.Td>
                  {editMode ? (
                    <Table.Td className="py-4 px-6">
                      <Select
                        {...form.getInputProps("bloodGroup")}
                        placeholder="Select Blood Group"
                        data={bloodGroups}
                        size="md"
                        className="max-w-xs"
                      />
                    </Table.Td>
                  ) : (
                    <Table.Td className="py-4 px-6">
                      <Text className="text-lg text-neutral-900 font-medium">
                        {profile.bloodGroup || (
                          <span className="text-neutral-400">Not provided</span>
                        )}
                      </Text>
                    </Table.Td>
                  )}
                </Table.Tr>
                <Table.Tr className="hover:bg-primary-50/50 transition-colors">
                  <Table.Td className="py-4 px-6">
                    <Text className="text-lg font-semibold text-neutral-700 flex items-center gap-2">
                      Allergies
                    </Text>
                  </Table.Td>
                  {editMode ? (
                    <Table.Td className="py-4 px-6">
                      <TagsInput
                        {...form.getInputProps("allergies")}
                        placeholder="Enter allergy and press Enter"
                        size="md"
                        className="max-w-md"
                      />
                    </Table.Td>
                  ) : (
                    <Table.Td className="py-4 px-6">
                      <Text className="text-lg text-neutral-900 font-medium">
                        {profile.allergies ? (
                          Array.isArray(profile.allergies) ? (
                            profile.allergies.join(", ")
                          ) : (
                            profile.allergies
                          )
                        ) : (
                          <span className="text-neutral-400">Not provided</span>
                        )}
                      </Text>
                    </Table.Td>
                  )}
                </Table.Tr>
                <Table.Tr className="hover:bg-primary-50/50 transition-colors">
                  <Table.Td className="py-4 px-6">
                    <Text className="text-lg font-semibold text-neutral-700 flex items-center gap-2">
                      Chronic Diseases
                    </Text>
                  </Table.Td>
                  {editMode ? (
                    <Table.Td className="py-4 px-6">
                      <TagsInput
                        {...form.getInputProps("chronicDiseases")}
                        placeholder="Enter chronic disease and press Enter"
                        size="md"
                        className="max-w-md"
                      />
                    </Table.Td>
                  ) : (
                    <Table.Td className="py-4 px-6">
                      <Text className="text-lg text-neutral-900 font-medium">
                        {profile.chronicDiseases ? (
                          Array.isArray(profile.chronicDiseases) ? (
                            profile.chronicDiseases.join(", ")
                          ) : (
                            profile.chronicDiseases
                          )
                        ) : (
                          <span className="text-neutral-400">Not provided</span>
                        )}
                      </Text>
                    </Table.Td>
                  )}
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </Card>
        <Modal
         radius="lg"
          centered
          opened={opened}
          onClose={close}
          title={
            <span className="text-xl font-semibold font-heading text-neutral-800">
              Upload Profile Picture
            </span>
          }
          size="md"
        >
          <div className="text-center py-4">
            <DropzoneButton close={close} form={form} id="profile.profilePictureId" />
          </div>
        </Modal>
      </div>
    </form>
  );
};

export default Profile;
