import React, { useEffect, useState } from "react";
import { AreaChart } from "@mantine/charts";
import { data, doctorData, patientData } from "../../../Data/DashboardData";
import { ThemeIcon } from "@mantine/core";
import {
  IconFileReport,
  IconMedicalCross,
  IconPhoto,
  IconUsers,
} from "@tabler/icons-react";
import { getVisitCountByAdminId } from "../../../Services/AppointmentService";
import { userRegistrationCount } from "../../../Services/UserService";
import { addZeroMonth } from "../../../Utility/AddZeroMonth";

const TopCards = () => {
  const [apData, setApData] = useState<any[]>(data);
  const [ptData, setPtData] = useState<any[]>(patientData);
  const [drData, setDrData] = useState<any[]>(doctorData);

  useEffect(() => {
    getVisitCountByAdminId()
      .then((response) => {
        setApData(addZeroMonth(response, "month", "count"));
      })
      .catch((error) => {
        throw error;
      });

    userRegistrationCount()
      .then((response) => {
        setDrData(addZeroMonth(response.doctorCounts, "month", "count"));
        setPtData(addZeroMonth(response.patientCounts, "month", "count"));
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  const getSum = (data: any[], key: string) => {
    return data.reduce((sum, item) => {
      const value = Number(item?.[key]) || 0;
      return sum + value;
    }, 0);
  };

  const card = (
    name: string,
    id: string,
    color: string,
    bg: string,
    icon: React.ReactNode,
    data: any[],
  ) => {
    return (
      <div
        className={`${bg} rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden`}
      >
        <div className="flex items-center justify-between p-5 gap-5">
          <ThemeIcon
            variant="filled"
            size="xl"
            radius="md"
            color={color}
            className="shadow-lg"
          >
            {icon}
          </ThemeIcon>
          <div className="flex flex-col font-medium items-end">
            <div className="text-sm text-gray-600 mb-1">{name}</div>
            <div className="text-2xl font-bold">{getSum(data, id)}</div>
          </div>
        </div>
        <div className="px-2 pb-2">
          <AreaChart
            h={100}
            data={data}
            dataKey="month"
            series={[{ name: id, color: color }]}
            curveType="bump"
            tickLine="none"
            gridAxis="none"
            withXAxis={false}
            withYAxis={false}
            withGradient
            withDots={false}
            fillOpacity={0.7}
            strokeWidth={3}
          />
        </div>
      </div>
    );
  };

  const cards = [
    {
      name: "Appointments",
      id: "count",
      color: "violet",
      bg: "bg-violet-100",
      icon: <IconFileReport size={24} />,
      data: apData,
    },
    {
      name: "Patients",
      id: "count",
      color: "orange",
      bg: "bg-orange-100",
      icon: <IconUsers size={24} />,
      data: ptData,
    },
    {
      name: "Doctors",
      id: "count",
      color: "teal",
      bg: "bg-teal-100",
      icon: <IconMedicalCross size={24} />,
      data: drData,
    },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      {cards.map((item) =>
        card(item.name, item.id, item.color, item.bg, item.icon, item.data),
      )}
    </div>
  );
};

export default TopCards;
