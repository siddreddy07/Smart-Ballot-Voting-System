import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, Calendar, Sun, Moon } from 'lucide-react';
import { verificationCenters } from '../../../../verificationCenters';

// Main Component
export function VerificationStep({ onNext, stateId }) {
  // State Management
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShift, setSelectedShift] = useState('morning');
  const [effectiveStateId, setEffectiveStateId] = useState('');
  const [error, setError] = useState('');

  // Initialize effectiveStateId
  useEffect(() => {
    const getStateId = () => {
      if (stateId) return stateId;
      const storedStateId = localStorage.getItem('STATE_ID');
      if (storedStateId) return storedStateId;
      try {
        const formData = JSON.parse(localStorage.getItem('personalInfoFormData') || '{}');
        return formData.selectedState || '';
      } catch {
        return '';
      }
    };

    const newStateId = getStateId();
    setEffectiveStateId(newStateId);
  }, [stateId]);

  // Data Access
  const stateCenters = effectiveStateId && verificationCenters[effectiveStateId] ? verificationCenters[effectiveStateId] : { cities: [] };
  const cities = stateCenters.cities || [];

  // Filtered Centers
  const filteredCenters = selectedCity
    ? (cities
        .find((city) => city.city_id === selectedCity)
        ?.centers.filter((center) =>
            center.center_name.toLowerCase().includes(searchQuery.toLowerCase())
          ) || []): [];

  // Reset dependent states when effectiveStateId changes
  useEffect(() => {
    setSelectedCity('');
    setSelectedCenter(null);
    setSearchQuery('');
    setSelectedDate('');
    setSelectedShift('morning');
    setError('');
  }, [effectiveStateId]);

  // Handlers
  const handleCenterSelect = useCallback((center) => {
    setSelectedCenter(center);
    setError('');
  }, []);

  const handleShiftSelect = useCallback((shift) => {
    setSelectedShift(shift);
    setError('');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCenter) {
      setError('Please select a verification center.');
      return;
    }
    if (!selectedDate) {
      setError('Please select an appointment date.');
      return;
    }
    if (!selectedShift) {
      setError('Please select a time shift.');
      return;
    }

    const timeAndCenterData = {
      time: `${selectedDate}T${selectedShift === 'morning' ? '09:00:00' : '13:30:00'}`,
      center: selectedCenter.center_id,
    };
    localStorage.setItem('TIME_ND_CENTER', JSON.stringify(timeAndCenterData));

    onNext({ timeAndCenterData });
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-4 p-4 sm:p-6 bg-white rounded-lg min-h-screen">
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-saffron-900">Choose Verification Center</h2>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
        )}

        <div className="space-y-4">
          {/* City Selection */}
          {!effectiveStateId ? (
            <p className="text-saffron-700 text-sm sm:text-base">Please complete the personal information form to select a state.</p>
          ) : (
            <div>
              <label className="block text-sm font-medium text-saffron-900 mb-1" htmlFor="city-select">
                City
              </label>
              <select
                id="city-select"
                className="w-full rounded-md border-saffron-300 bg-white text-saffron-900 shadow-sm focus:border-saffron-600 focus:ring focus:ring-saffron-600 focus:ring-opacity-50 transition-colors text-sm sm:text-base"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedCenter(null);
                  setSearchQuery('');
                  setError('');
                }}
              >
                <option value="">Select City</option>
                {cities.length > 0 ? (
                  cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No cities available
                  </option>
                )}
              </select>
            </div>
          )}

          {/* Center Search and Selection */}
          {selectedCity && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute top-2.5 sm:top-3 left-3 h-4 sm:h-5 w-4 sm:w-5 text-saffron-600" />
                <input
                  type="text"
                  placeholder="Search centers by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 sm:pl-10 w-full rounded-md border-saffron-300 bg-white text-saffron-900 shadow-sm focus:border-saffron-600 focus:ring focus:ring-saffron-600 focus:ring-opacity-50 transition-colors text-sm sm:text-base"
                  aria-label="Search verification centers"
                />
              </div>

              <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                {filteredCenters.length > 0 ? (
                  filteredCenters.map((center) => (
                    <div
                      key={center.center_id}
                      className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedCenter?.center_id === center.center_id
                          ? 'border-blue-600 bg-blue-100' // Highlight selected center with a different color
                          : 'border-saffron-300 bg-white hover:border-saffron-600 hover:bg-saffron-100'
                      }`}
                      onClick={() => handleCenterSelect(center)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleCenterSelect(center)}
                      aria-label={`Select ${center.center_name}`}
                    >
                      <h3 className="font-semibold text-sm sm:text-base">{center.center_name}</h3>
                    </div>
                  ))
                ) : (
                  <p className="text-saffron-700 text-center text-sm sm:text-base">No centers found.</p>
                )}
              </div>
            </div>
          )}

          {/* Appointment Scheduling */}
          {selectedCenter && (
            <div className="space-y-4 bg-white p-3 sm:p-4 rounded-lg border border-saffron-300">
              <h3 className="font-medium text-saffron-900 text-base sm:text-lg">Schedule Appointment</h3>

              <div className="space-y-2 sm:space-y-4">
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-saffron-900">
                  Select Date
                </label>
                <input
                  type="date"
                  id="appointmentDate"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setError('');
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-md border-saffron-300 bg-white text-saffron-900 shadow-sm focus:border-saffron-600 focus:ring focus:ring-saffron-600 focus:ring-opacity-50 transition-colors text-sm sm:text-base"
                  aria-label="Select appointment date"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-saffron-900">
                  Select Time Shift
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleShiftSelect('morning')}
                    className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 border transition-all duration-200 ${
                      selectedShift === 'morning'
                        ? 'bg-blue-100 border-blue-600 text-blue-600' // Highlight morning shift on selection
                        : 'bg-white text-saffron-900 border-saffron-300 hover:bg-saffron-100 hover:border-saffron-400'
                    }`}
                    aria-label="Select morning shift"
                  >
                    <Sun className="h-4 sm:h-5 w-4 sm:w-5" />
                    <span className="font-medium text-sm sm:text-base">Morning</span>
                    <span className="text-xs sm:text-sm">(9:00 AM - 12:30 PM)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShiftSelect('afternoon')}
                    className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 border transition-all duration-200 ${
                      selectedShift === 'afternoon'
                        ? 'bg-blue-100 border-blue-600 text-blue-600' // Highlight afternoon shift on selection
                        : 'bg-white text-saffron-900 border-saffron-300 hover:bg-saffron-100 hover:border-saffron-400'
                    }`}
                    aria-label="Select afternoon shift"
                  >
                    <Moon className="h-4 sm:h-5 w-4 sm:w-5" />
                    <span className="font-medium text-sm sm:text-base">Afternoon</span>
                    <span className="text-xs sm:text-sm">(1:30 PM - 5:00 PM)</span>
                  </button>
                </div>
              </div>

              <button
  onClick={handleSubmit}
  disabled={!selectedDate || !selectedShift || !selectedCenter}
  className={`w-full px-3 sm:px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base ${
    selectedDate && selectedShift && selectedCenter
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-blue-300 text-blue-900 cursor-not-allowed opacity-50'
  }`}
  aria-label="Schedule appointment"
>
  <Calendar className="h-4 sm:h-5 w-4 sm:w-5" />
  Schedule Appointment
</button>


            </div>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="md:block mt-4 md:mt-0">
        <div className="bg-saffron-100 rounded-lg h-64 sm:h-80 md:h-[600px] relative">
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover rounded-lg"
            style={{
              backgroundImage: selectedCenter
                ? `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff6f00(${selectedCenter.longitude},${selectedCenter.latitude})/${selectedCenter.longitude},${selectedCenter.latitude},15/800x600@2x?access_token=YOUR_MAPBOX_TOKEN')`
                : 'none',
            }}
          >
            {!selectedCenter && (
              <div className="absolute inset-0 flex items-center justify-center bg-saffron-100 rounded-lg">
                <div className="bg-saffron-50 p-3 sm:p-4 rounded-lg shadow-md text-center">
                  <MapPin className="h-6 sm:h-8 w-6 sm:w-8 text-saffron-600 mx-auto mb-2" />
                  <p className="text-saffron-900 text-sm sm:text-base">Select a center to view on map</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
