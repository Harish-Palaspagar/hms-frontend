import React, { useEffect, useState } from 'react'
import { getAllDoctors } from '../../../Services/DoctorProfileService';
import DoctorCard from './DoctorCard';

const Doctor = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  
  useEffect(() => {
    getAllDoctors()
        .then((response) => {
            console.log(response);
            setDoctors(response);
            })
        .catch((error) => {
            console.error("There was an error fetching the doctors!", error);
        });
  }, []);
  
  return (
    <div>
      <div className="text-xl text-primary-500 font-bold pb-3">
        Doctors
      </div>
      <div>
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} {...doctor} />
        ))}
      </div>
    </div>
  )
}

export default Doctor