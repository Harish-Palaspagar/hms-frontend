import { AreaChart } from "@mantine/charts";
import { IconCalendar, IconTrendingUp } from "@tabler/icons-react";

const PatientMetrics = () => {
  const data = [
    { date: "January", patients: 10 },
    { date: "February", patients: 20 },
    { date: "March", patients: 30 },
    { date: "April", patients: 40 },
    { date: "May", patients: 50 },
    { date: "June", patients: 60 },
  ];

  const getSum = (data: any[], key: string) =>
    data.reduce((acc, cur) => acc + cur[key], 0);

  return (
    <div className="relative h-full rounded-3xl border border-cyan-200/60 bg-gradient-to-br from-cyan-50 to-teal-50 p-6 shadow-sm hover:shadow-md transition-all">
      {/* Decorative blobs */}
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-teal-300/20 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-cyan-100 p-2">
                <IconCalendar size={18} className="text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Patients
              </h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Year {new Date().getFullYear()}
            </p>
          </div>

          <IconTrendingUp className="text-cyan-600" />
        </div>

        {/* Metric */}
        <div className="text-4xl font-extrabold text-cyan-600">
          {getSum(data, "patients")}
        </div>

        {/* Chart */}
        <div className="flex flex-1 items-center rounded-2xl bg-white/90 p-3 shadow-inner">
          <AreaChart
            h={160}
            data={data}
            dataKey="date"
            series={[{ name: "patients", color: "cyan.6" }]}
            curveType="natural"
            tickLine="none"
            gridAxis="none"
            withXAxis={false}
            withYAxis={false}
            withGradient
            withDots={false}
            fillOpacity={0.45}
            strokeWidth={3}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientMetrics;
