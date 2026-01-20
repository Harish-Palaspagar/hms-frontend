import {
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Card,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router";
import { getAppointmentDetails } from "../../../Services/AppointmentService";
import {
  IconCalendar,
  IconInfoCircle,
  IconMail,
  IconMedicineSyrup,
  IconNotes,
  IconPhone,
  IconReport,
  IconReportMedical,
  IconUser,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import AppointmentReport from "./AppointmentReport";
import Prescriptions from "./Prescriptions";

interface InfoItemProps {
  icon: typeof IconUser;
  label: string;
  value: string;
  isEmail?: boolean;
}

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = React.useState<any>(null);

  useEffect(() => {
    getAppointmentDetails(id)
      .then((data) => {
        setAppointment(data);
      })
      .catch((error) => {
        console.error("Error fetching appointment details:", error);
      });
  }, [id]);

  if (!appointment) {
    return (
      <Text size="sm" c="dimmed">
        Loading appointment details...
      </Text>
    );
  }

  const statusColors: Record<string, string> = {
    SCHEDULED: "blue",
    PENDING: "yellow",
    CANCELLED: "red",
    COMPLETED: "green",
  };

  const InfoItem: React.FC<InfoItemProps> = ({
    icon: Icon,
    label,
    value,
    isEmail = false,
  }) => (
    <Box>
      <Group gap={8} mb={6}>
        <Icon size={16} stroke={1.5} className="text-neutral-500" />
        <Text size="sm" c="dark.4" tt="uppercase" fw={600}>
          {label}
        </Text>
      </Group>
      <Text size="md" fw={600} c={isEmail ? "primary.6" : "dark.8"}>
        {value}
      </Text>
    </Box>
  );

  return (
    <Box>
      <Breadcrumbs mb="md" separator="›">
        <Link
          className="text-primary-500 hover:underline"
          to="/doctor/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className="text-primary-500 hover:underline"
          to="/doctor/appointments"
        >
          Appointments
        </Link>
        <Text size="sm" c="dark.5" fw={500}>
          Details
        </Text>
      </Breadcrumbs>

      <Card shadow="sm" radius="md" p="lg" withBorder>
        <Group justify="space-between" mb="lg">
          <Title order={3} fw={600} c="dark.9">
            Appointment Details
          </Title>
          <Badge
            size="lg"
            radius="sm"
            variant="light"
            color={statusColors[appointment.status] || "gray"}
            fw={500}
          >
            {appointment.status}
          </Badge>
        </Group>

        <Stack>
          {/* Date & Time - Compact */}
          <Paper p="sm" radius="md">
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm">
                <IconCalendar
                  size={18}
                  className="text-primary-600"
                  stroke={2}
                />
                <Text size="md" fw={500} c="dark.8">
                  {dayjs(appointment.appointmentTime).format("DD MMM YYYY")}
                </Text>
              </Group>
              <Badge
                variant="filled"
                color="primary"
                size="lg"
                radius="sm"
                fw={500}
              >
                {dayjs(appointment.appointmentTime).format("hh:mm A")}
              </Badge>
            </Group>
          </Paper>

          {/* Patient Information - Compact Grid */}
          <div>
            <Text size="md" fw={600} mb="sm" c="dark.8">
              Patient Information
            </Text>
            <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }} spacing="sm">
              <InfoItem
                icon={IconUser}
                label="Name"
                value={appointment.patientName}
              />
              <InfoItem
                icon={IconMail}
                label="Email"
                value={appointment.patientEmail}
                isEmail
              />
              <InfoItem
                icon={IconPhone}
                label="Phone"
                value={appointment.patientPhoneNumber}
              />
            </SimpleGrid>
          </div>

          <Divider my="xs" />

          {/* Reason for Visit - Compact */}
          <div>
            <Group gap={8} mb={8}>
              <IconNotes size={16} className="text-accent-600" stroke={2} />
              <Text size="md" c="dark.4" tt="uppercase" fw={500}>
                Reason for Visit
              </Text>
            </Group>
            <Text size="md" c="dark.8" fw={500}>
              {appointment.reason}
            </Text>
          </div>

          {appointment.notes && (
            <Paper p="md" radius="md" withBorder>
              <Group gap={8} mb={8}>
                <IconInfoCircle
                  size={16}
                  className="text-primary-700"
                  stroke={2}
                />
                <Text size="md" c="primary.8" tt="uppercase" fw={500}>
                  Additional Notes
                </Text>
              </Group>
              <Text size="md" c="dark.7" fw={500}>
                {appointment.notes}
              </Text>
            </Paper>
          )}
        </Stack>
      </Card>

      <Tabs defaultValue="prescriptions" mt="lg">
        <Tabs.List>
          <Tabs.Tab
            value="prescriptions"
            leftSection={
              <Box className="bg-red-500 rounded p-1">
                <IconReport size={16} stroke={2} className="text-white" />
              </Box>
            }
          >
            <Text size="sm" c="dark.9" fw={600}>
              Prescriptions
            </Text>
          </Tabs.Tab>

          <Tabs.Tab
            value="report"
            leftSection={
              <Box className="bg-red-500 rounded p-1">
                <IconReportMedical
                  size={16}
                  stroke={2}
                  className="text-white"
                />
              </Box>
            }
          >
            <Text size="sm" c="dark.9" fw={600}>
              Report
            </Text>
          </Tabs.Tab>
        </Tabs.List>

        <Box mt="sm">
          <Tabs.Panel value="prescriptions">
            <Prescriptions appointment={appointment} />
          </Tabs.Panel>

          <Tabs.Panel value="report">
            <AppointmentReport appointment={appointment} />
          </Tabs.Panel>
        </Box>
      </Tabs>
    </Box>
  );
};

export default AppointmentDetails;
