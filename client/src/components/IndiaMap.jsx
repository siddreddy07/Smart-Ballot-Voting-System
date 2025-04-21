import { useState } from "react";

const stateData = {
  "Andhra Pradesh": { name: "Andhra Pradesh", seats: 25, status: "Upcoming" },
  "Arunachal Pradesh": { name: "Arunachal Pradesh", seats: 2, status: "Upcoming" },
  "Assam": { name: "Assam", seats: 14, status: "Upcoming" },
  "Bihar": { name: "Bihar", seats: 40, status: "Upcoming" },
  "Chhattisgarh": { name: "Chhattisgarh", seats: 11, status: "Upcoming" },
  "Goa": { name: "Goa", seats: 2, status: "Completed" },
  "Gujarat": { name: "Gujarat", seats: 26, status: "Upcoming" },
  "Haryana": { name: "Haryana", seats: 10, status: "In Progress" },
  "Himachal Pradesh": { name: "Himachal Pradesh", seats: 4, status: "Completed" },
  "Jharkhand": { name: "Jharkhand", seats: 14, status: "Upcoming" },
  "Karnataka": { name: "Karnataka", seats: 28, status: "In Progress" },
  "Kerala": { name: "Kerala", seats: 20, status: "Upcoming" },
  "Madhya Pradesh": { name: "Madhya Pradesh", seats: 29, status: "Upcoming" },
  "Maharashtra": { name: "Maharashtra", seats: 48, status: "Upcoming" },
  "Manipur": { name: "Manipur", seats: 2, status: "Completed" },
  "Meghalaya": { name: "Meghalaya", seats: 2, status: "Completed" },
  "Mizoram": { name: "Mizoram", seats: 1, status: "Completed" },
  "Nagaland": { name: "Nagaland", seats: 1, status: "Completed" },
  "Odisha": { name: "Odisha", seats: 21, status: "Upcoming" },
  "Punjab": { name: "Punjab", seats: 13, status: "In Progress" },
  "Rajasthan": { name: "Rajasthan", seats: 25, status: "Upcoming" },
  "Sikkim": { name: "Sikkim", seats: 1, status: "Completed" },
  "Tamil Nadu": { name: "Tamil Nadu", seats: 39, status: "Upcoming" },
  "Telangana": { name: "Telangana", seats: 17, status: "Upcoming" },
  "Tripura": { name: "Tripura", seats: 2, status: "Completed" },
  "Uttar Pradesh": { name: "Uttar Pradesh", seats: 80, status: "In Progress" },
  "Uttarakhand": { name: "Uttarakhand", seats: 5, status: "Completed" },
  "West Bengal": { name: "West Bengal", seats: 42, status: "Upcoming" },
  // Union Territories
  "Delhi": { name: "Delhi", seats: 7, status: "In Progress" },
  "Jammu and Kashmir": { name: "Jammu and Kashmir", seats: 5, status: "Upcoming" },
  "Ladakh": { name: "Ladakh", seats: 1, status: "Upcoming" },
  "Puducherry": { name: "Puducherry", seats: 1, status: "Upcoming" },
  "Andaman and Nicobar Islands": { name: "Andaman and Nicobar Islands", seats: 1, status: "Upcoming" },
  "Chandigarh": { name: "Chandigarh", seats: 1, status: "In Progress" },
  "Dadra and Nagar Haveli and Daman and Diu": { name: "Dadra and Nagar Haveli and Daman and Diu", seats: 2, status: "Upcoming" },
  "Lakshadweep": { name: "Lakshadweep", seats: 1, status: "Upcoming" },
};

export default function IndiaMap() {
  const [selectedState, setSelectedState] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleStateHover = (event, stateName) => {
    const state = stateData[stateName];
    if (state) {
      setSelectedState(state);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleStateLeave = () => {
    setSelectedState(null);
  };

  return (
    <div className="relative w-full">
      <div className="w-full">
        <img 
          src="/india-map.png" 
          alt="Electoral Map of India" 
          className="w-full h-auto rounded-lg"
          useMap="#india-map"
        />
        <map name="india-map">
          {Object.keys(stateData).map((state, index) => (
            <area 
              key={index}
              shape="poly" 
              coords="0,0,0,0,0,0" // These would be actual coordinates in a real implementation
              alt={state}
              onMouseEnter={(e) => handleStateHover(e, state)}
              onMouseLeave={handleStateLeave}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </map>
      </div>

      {selectedState && (
        <div
          className="absolute bg-white p-4 rounded-lg shadow-lg border z-10"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          <h3 className="font-bold text-lg">{selectedState.name}</h3>
          <p>Parliamentary Seats: {selectedState.seats}</p>
          <p>Status: <span className={`
            ${selectedState.status === "Completed" ? "text-green-600" :
              selectedState.status === "In Progress" ? "text-orange-600" :
              "text-blue-600"}
          `}>{selectedState.status}</span></p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-200 mr-2"></div>
          <span className="text-sm">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-200 mr-2"></div>
          <span className="text-sm">In Progress</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-200 mr-2"></div>
          <span className="text-sm">Upcoming</span>
        </div>
      </div>
    </div>
  );
}
