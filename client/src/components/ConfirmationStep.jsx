import React from 'react';
import { Calendar, MapPin, User, Mail, Phone, Home, Building, CheckCircle } from 'lucide-react';
import { stateData } from '../../../States';
import { useAuth } from '../context/AuthContext';

// Function to calculate age from DOB
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth();
  if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

function ConfirmationStep({ onConfirm }) {
  // Retrieving data from localStorage
  const personalInfoFormData = JSON.parse(localStorage.getItem('personalInfoFormData')) || {};
  const { AddDetails } = useAuth();

  // Check the structure of the object to ensure the fields exist
  console.log(personalInfoFormData);

  const personalInfo = {
    name: personalInfoFormData.fullName || '',
    email: personalInfoFormData.email || '',
    phone: personalInfoFormData.phone || '',
    dob: personalInfoFormData.dob || '',  // Retrieve DOB from localStorage
    presentAddress: personalInfoFormData.presentAddress || '',
    permanentAddress: personalInfoFormData.permanentAddress || '',
    state_id: personalInfoFormData.selectedState || '',
    district_id: personalInfoFormData.selectedDistrict || '',
    assembly_id: personalInfoFormData.selectedAssembly || '',
  };

  const timeAndCenterData = JSON.parse(localStorage.getItem('TIME_ND_CENTER') || '{}');

  const state = stateData.states[0];
  const district = state.districts.find(d => d.district_id === personalInfo.district_id);
  const assembly = district?.assemblies.find(a => a.assembly_id === personalInfo.assembly_id);

  const getShiftTiming = (shift) => {
    return shift === 'morning' ? '9 AM - 1 PM' : '2 PM - 6 PM';
  };

  // Calculate age using the DOB
  const age = personalInfo.dob ? calculateAge(personalInfo.dob) : '';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Confirm Your Registration</h2>
          <p className="mt-2 text-gray-600">Please review your information before confirming</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-gray-900">{personalInfo.name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{personalInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{personalInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-gray-900">{age} years</p> {/* Display age here */}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Home className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Present Address</p>
                  <p className="text-gray-900">{personalInfo.presentAddress}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Building className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Permanent Address</p>
                  <p className="text-gray-900">{personalInfo.permanentAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Constituency Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Constituency Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">State</p>
                <p className="text-gray-900">{state?.state_name}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">District</p>
                <p className="text-gray-900">{district?.district_name}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Assembly</p>
                <p className="text-gray-900">{assembly?.assembly_name}</p>
              </div>
            </div>
          </div>

          {/* Appointment Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Appointment</h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Verification Center</p>
                  <p className="text-gray-900">{timeAndCenterData?.center}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Appointment Date & Time</p>
                  <p className="text-gray-900">
                    {timeAndCenterData?.time}
                    <span className="mx-2">•</span>
                    {getShiftTiming(timeAndCenterData?.appointmentShift)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Please bring valid ID proof for verification</span>
            </div>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationStep;
