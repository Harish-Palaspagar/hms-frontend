import { AreaChart } from "@mantine/charts";
import React, { useEffect, useState } from "react";
import { IconTrendingUp, IconCalendar } from "@tabler/icons-react";
import { getVisitCountByDoctorId } from "../../../Services/AppointmentService";
import { useSelector } from "react-redux";
import { addZeroMonth } from "../../../Utility/AddZeroMonth";

const Matrices = () => {
  const user = useSelector((state: any) => state.user);
  const [apData, setApData] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    getVisitCountByDoctorId(user.id)
      .then((response) => {
        console.log("API:", response);

        // ensure array + fill missing months
        const filled = addZeroMonth(
          Array.isArray(response) ? response : [response],
          "month",
          "count",
        );

        const chartData = filled.map((item: any) => ({
          month: item.month, // 👈 month used here
          appointments: Number(item.count) || 0,
        }));

        setApData(chartData);
      })
      .catch(console.error);
  }, [user?.id]);

  const getSum = (data: any[], key: string) =>
    data.reduce((acc, cur) => acc + (Number(cur[key]) || 0), 0);

  return (
    <div className="relative h-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-violet-100 blur-3xl opacity-60" />

      <div className="relative z-10 flex h-full flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-violet-100 p-2">
                <IconCalendar size={16} className="text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Appointments
              </h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {new Date().getFullYear()}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1">
            <IconTrendingUp size={14} className="text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-600">
              Active
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="text-4xl font-extrabold text-violet-600">
          {getSum(apData, "appointments")}
        </div>

        {/* Chart */}
        <div className="flex flex-1 items-center rounded-2xl bg-gray-50 p-3">
          <AreaChart
            h={150}
            data={apData}
            dataKey="month"
            series={[
              { name: "appointments", color: "violet.6" },
            ]}
            curveType="natural"
            tickLine="none"
            gridAxis="none"
            withXAxis={false}
            withYAxis={false}
            withGradient
            withDots={false}
            fillOpacity={0.5}
            strokeWidth={3}
          />
        </div>
      </div>
    </div>
  );
};

export default Matrices;
