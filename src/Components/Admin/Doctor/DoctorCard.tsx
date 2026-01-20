import { Avatar } from "@mantine/core";
import React from "react";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconLicense,
  IconStethoscope,
  IconBuildingHospital,
  IconBriefcase,
} from "@tabler/icons-react";

const DoctorCard = ({
  name,
  email,
  birthDate,
  phoneNumber,
  address,
  licenseNumber,
  specialization,
  department,
  totalExperience,
}: any) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not Provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200 mb-4">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar name={name} size="lg" color="red" />
          <div>
            <h3 className="text-xl font-semibold font-heading text-neutral-900">
              {name || "Unknown Doctor"}
            </h3>
            <p className="text-sm text-neutral-500">
              License Number : {licenseNumber || "Not Provided"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full">
          <IconBriefcase className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">
            {totalExperience ? `${totalExperience} years` : "Not Provided"}
          </span>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <IconMail className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-700">
            {email || "Not Provided"}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <IconPhone className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-700">
            {phoneNumber || "Not Provided"}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <IconMapPin className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-700">
            {address || "Not Provided"}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <IconCalendar className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-700">
            {formatDate(birthDate)}
          </span>
        </div>
      </div>

      {/* Professional Information */}
      <div className="border-t border-neutral-200 pt-4">
        <h4 className="text-sm font-semibold font-heading text-neutral-700 mb-3">
          Professional Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start space-x-3 bg-primary-50 p-3 rounded-lg">
            <IconStethoscope className="w-4 h-4 text-primary-600 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-primary-800">
                Specialization
              </p>
              <p className="text-sm text-primary-900">
                {specialization || "Not Specified"}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-accent-50 p-3 rounded-lg">
            <IconBuildingHospital className="w-4 h-4 text-accent-600 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-accent-800">Department</p>
              <p className="text-sm text-accent-900">
                {department || "Not Assigned"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
