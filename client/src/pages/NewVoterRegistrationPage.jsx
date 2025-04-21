import React, { useState, useEffect } from 'react';
import { PersonalInfoForm } from '../components/registration/PersonalInfoFormProps';
import { VerificationStep } from '../components/registration/VerificationStep';
import ConfirmationStep from '../components/ConfirmationStep';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export function NewVoterRegistrationPage() {
  const [currentStep, setCurrentStep] = useState('personal');
  const [formData, setFormData] = useState({
    personalInfo: {},
    appointmentInfo: {}
  });

  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, AddDetails } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId) {
          const res = await axios.get(`/api/continue-register/${userId}`);
          const fetchedUser = res.data.user;

          if (fetchedUser) {
            const {
              NAME,
              EMAIL,
              PHN_NO,
              DOB,
              AADHAR_CARD,
              PRESENT_ADDRESS,
              PERMANENT_ADDRESS,
              PARENT_NAME,
              IMAGE,
              VOTE_STATE,
              TIME_ND_CENTER
            } = fetchedUser;

            const fullForm = {
              personalInfo: {
                fullName: NAME || '',
                email: EMAIL || '',
                phone: PHN_NO || '',
                dob: DOB || '',
                aadharNo: AADHAR_CARD || '',
                presentAddress: PRESENT_ADDRESS || '',
                permanentAddress: PERMANENT_ADDRESS || '',
                parentName: PARENT_NAME || '',
                selectedState: VOTE_STATE?.state_id || '',
                selectedDistrict: VOTE_STATE?.district_id || '',
                selectedAssembly: VOTE_STATE?.assembly_id || '',
                photoPreview: IMAGE || ''
              },
              appointmentInfo: {
                timeAndCenterData: {
                  time: TIME_ND_CENTER?.time || '',
                  center: TIME_ND_CENTER?.center || ''
                }
              }
            };

            setFormData(fullForm);
            if (IMAGE) localStorage.setItem('photoPreview', IMAGE);
            return;
          }
        }

        // fallback to localStorage if no userId
        const localPersonalInfo = JSON.parse(localStorage.getItem('personalInfoFormData'));
        const localTimeAndCenter = JSON.parse(localStorage.getItem('TIME_ND_CENTER'));

        if (localPersonalInfo || localTimeAndCenter) {
          setFormData({
            personalInfo: localPersonalInfo || {},
            appointmentInfo: {
              timeAndCenterData: localTimeAndCenter || {}
            }
          });
        }
      } catch (error) {
        console.error('Failed to fetch user registration data or parse local storage', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handlePersonalInfoSubmit = (data) => {
    localStorage.setItem('personalInfoFormData', JSON.stringify(data));
    setFormData((prev) => ({ ...prev, personalInfo: data }));
    setCurrentStep('verification');
  };

  const handleVerificationSubmit = (data) => {
    localStorage.setItem('TIME_ND_CENTER', JSON.stringify(data.timeAndCenterData));
    setFormData((prev) => ({ ...prev, appointmentInfo: data }));
    setCurrentStep('confirmation');
  };

  const handleConfirmation = () => {
    console.log('Current Form Data:', formData);

    const personal = formData?.personalInfo || {};
    const appointment = formData?.appointmentInfo?.timeAndCenterData || {};

    const finalData = {
      NAME: personal.fullName || '',
      PARENT_NAME: personal.parentName || '',
      EMAIL: personal.email || '',
      DOB: personal.dob || '',
      AADHAR_CARD: personal.aadharNo || '',
      PHN_NO: personal.phone || '',
      PRESENT_ADDRESS: personal.presentAddress || '',
      PERMANENT_ADDRESS: personal.permanentAddress || '',
      GENDER: personal.gender || '',
      IMAGE: personal.photoPreview || '',
      VOTE_STATE: {
        state_id: personal.selectedState || '',
        district_id: personal.selectedDistrict || '',
        assembly_id: personal.selectedAssembly || '',
        parliamentary_id: personal.selectedDistrict || ''
      },
      TIME_ND_CENTER: {
        time: appointment?.time || '',
        center: appointment?.center || ''
      }
    };

    console.log('Final data to send:', finalData);

    AddDetails(finalData, navigate);
  };

  const steps = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'verification', label: 'Identity Verification' },
    { id: 'confirmation', label: 'Confirmation' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
      <p className="text-2xl text-center">
        Hi 👋 <span className="font-bold">{user?.USERNAME}</span>
      </p>
      <p className="text-xl text-center mb-6">
        Enter your details to register for the Voting Process
      </p>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Steps UI */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === step.id
                        ? 'bg-blue-600 text-white'
                        : index < steps.findIndex((s) => s.id === currentStep)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white shadow-lg rounded-lg">
          {currentStep === 'personal' && (
            <PersonalInfoForm
              key={JSON.stringify(formData?.personalInfo)} // force re-render
              onNext={handlePersonalInfoSubmit}
              initialValues={formData?.personalInfo}
            />
          )}
          {currentStep === 'verification' && (
            <VerificationStep
              onNext={handleVerificationSubmit}
              stateId={formData?.personalInfo?.selectedState}
            />
          )}
          {currentStep === 'confirmation' && (
            <ConfirmationStep
              personalInfo={formData.personalInfo}
              appointmentInfo={formData.appointmentInfo}
              onConfirm={handleConfirmation}
            />
          )}

          {/* Navigation */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex justify-between">
              {currentStep !== 'personal' && (
                <button
                  onClick={() =>
                    setCurrentStep(
                      currentStep === 'confirmation' ? 'verification' : 'personal'
                    )
                  }
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>
              )}
              {currentStep === 'personal' && <div></div>}
              <div className="text-sm text-gray-500">
                Step {steps.findIndex((s) => s.id === currentStep) + 1} of {steps.length}
              </div>
              {currentStep !== 'confirmation' && (
                <button
                  onClick={() =>
                    setCurrentStep(
                      currentStep === 'personal' ? 'verification' : 'confirmation'
                    )
                  }
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
