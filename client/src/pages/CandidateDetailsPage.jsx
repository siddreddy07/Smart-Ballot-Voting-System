import { useState, useRef } from "react";
import { useParams } from "react-router-dom";

export default function CandidateDetailsPage() {
  const { token } = useParams();
  const [details, setDetails] = useState({
    tokenId: token,
    name: "",
    fatherName: "",
    motherName: "",
    gender: "",
    dob: "",
    currentAddress: "",
    permanentAddress: "",
    aadhaar: "",
    pan: "",
    education: "",
    mobile: "",
    email: "",
  });
  const [showVirtualId, setShowVirtualId] = useState(false);
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const photo = canvas.toDataURL("image/jpeg");
      setDetails((prev) => ({ ...prev, photo }));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject).getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const generateVirtualId = () => {
    setShowVirtualId(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h1 className="text-2xl font-bold">Candidate Details</h1>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="tokenId" className="text-sm font-medium text-gray-700">Token ID</label>
                  <input 
                    id="tokenId" 
                    value={details.tokenId} 
                    disabled 
                    className="p-2 border border-gray-300 rounded bg-gray-50"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    id="name"
                    value={details.name}
                    onChange={(e) => setDetails((prev) => ({ ...prev, name: e.target.value }))}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="fatherName" className="text-sm font-medium text-gray-700">Father Name</label>
                  <input
                    id="fatherName"
                    value={details.fatherName}
                    onChange={(e) => setDetails((prev) => ({ ...prev, fatherName: e.target.value }))}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="motherName" className="text-sm font-medium text-gray-700">Mother Name</label>
                  <input
                    id="motherName"
                    value={details.motherName}
                    onChange={(e) => setDetails((prev) => ({ ...prev, motherName: e.target.value }))}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="dob" className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    id="dob"
                    type="date"
                    value={details.dob}
                    onChange={(e) => setDetails((prev) => ({ ...prev, dob: e.target.value }))}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="currentAddress" className="text-sm font-medium text-gray-700">Current Address</label>
                  <input
                    id="currentAddress"
                    value={details.currentAddress}
                    onChange={(e) => setDetails((prev) => ({ ...prev, currentAddress: e.target.value }))}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="permanentAddress" className="text-sm font-medium text-gray-700">Permanent Address</label>
                  <input
                    id="permanentAddress"
                    value={details.permanentAddress}
                    onChange={(e) => setDetails((prev) => ({ ...prev, permanentAddress: e.target.value }))}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Capture Image</label>
                  <div className="border rounded-lg p-4">
                    {isCameraActive ? (
                      <div className="space-y-4">
                        <video ref={videoRef} autoPlay className="w-full max-w-md mx-auto" />
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={capturePhoto}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Capture
                          </button>
                          <button 
                            onClick={stopCamera}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        {details.photo ? (
                          <img
                            src={details.photo || "/placeholder.svg"}
                            alt="Captured"
                            className="max-w-md rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        )}
                        <button 
                          onClick={startCamera}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          {details.photo ? "Retake Photo" : "Capture Photo"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Scan Fingerprint</label>
                  <div className="border rounded-lg p-4 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Scan Fingerprint
                    </button>
                  </div>
                </div>
              </div>

              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={generateVirtualId} 
                disabled={!details.name || !details.dob}
              >
                Generate Virtual Voter ID
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            {showVirtualId && (
              <div className="sticky top-4 bg-blue-500 text-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold mb-4">Election Commission of India</h2>
                <div className="space-y-2">
                  <p>Name: {details.name}</p>
                  <p>DOB: {details.dob}</p>
                  <p>Voter ID: {`IN${Math.random().toString(36).substr(2, 6).toUpperCase()}`}</p>
                </div>
                {details.photo && (
                  <img
                    src={details.photo || "/placeholder.svg"}
                    alt="Voter"
                    className="mt-4 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
