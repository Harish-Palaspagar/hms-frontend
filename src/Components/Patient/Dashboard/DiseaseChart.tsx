import { DonutChart } from '@mantine/charts'
import React, { useEffect, useState } from 'react'
import { data, diseaseData } from '../../../Data/DashboardData'
import { countReasonByPatientId, getCountReasonAdminId, getCountReasonDoctorId } from '../../../Services/AppointmentService'
import { convertToReasonChart } from '../../../Utility/AddZeroMonth'
import { useSelector } from 'react-redux'

const DiseaseChart = () => {

  const [data, setData] = useState<any[]>(diseaseData);
  const user = useSelector((state: any) => state.user);

   useEffect(() => {
    countReasonByPatientId(user.profileId)
      .then((response) => {
        setData(convertToReasonChart(response));
        console.log(response);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  return (
    <div className='p-5 border border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4'>
      <div>
        <div className='text-xl font-bold text-gray-800'>Reason Distribution</div>
        <div className='text-sm text-gray-500 mt-1'>Patient diagnosis overview</div>
      </div>
      
      <div className='flex justify-center items-center bg-white rounded-lg p-6 shadow-sm'> 
        <DonutChart
          withLabelsLine 
          thickness={30} 
          size={240} 
          paddingAngle={5} 
          chartLabel="Reasons" 
          labelsType="percent" 
          withLabels 
          data={data}
          tooltipDataSource="segment"
        />
      </div>
    </div>
  )
}

export default DiseaseChart